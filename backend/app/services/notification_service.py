import logging
import smtplib
from abc import ABC, abstractmethod
from dataclasses import dataclass, field
from email.message import EmailMessage
from typing import List, Optional

from app.core.config import settings

logger = logging.getLogger(__name__)


@dataclass
class EmailMessageDraft:
    to: str
    subject: str
    text: str = ""
    html: Optional[str] = None
    context: dict = field(default_factory=dict)


class NotificationProvider(ABC):
    @abstractmethod
    def send(self, message: EmailMessageDraft) -> bool:
        """Deliver a message; return True on success."""


class NoopNotifier(NotificationProvider):
    """Development provider that logs the message instead of sending email."""

    name = "noop"

    def send(self, message: EmailMessageDraft) -> bool:
        logger.info("NOTIFICATION (noop) to=%s subject=%r", message.to, message.subject)
        return True


class SmtpNotifier(NotificationProvider):
    """SMTP provider for sending real e-mail. Configure via SMTP_* env vars.

    Never used unless SMTP_HOST is set — keeps local development free of
    external dependencies while the architecture stays email-ready.
    """

    name = "smtp"

    def __init__(self) -> None:
        self.host = settings.SMTP_HOST
        self.port = settings.SMTP_PORT
        self.username = settings.SMTP_USERNAME
        self.password = settings.SMTP_PASSWORD
        self.from_email = settings.SMTP_FROM
        self._tls = settings.SMTP_TLS

    def available(self) -> bool:
        return bool(self.host and self.from_email)

    def send(self, message: EmailMessageDraft) -> bool:
        if not self.available():
            logger.warning("SMTP not configured; dropping notification to %s", message.to)
            return False
        msg = EmailMessage()
        msg["From"] = self.from_email
        msg["To"] = message.to
        msg["Subject"] = message.subject
        msg.set_content(message.text or message.subject)
        try:
            with smtplib.SMTP(self.host, self.port, timeout=15) as server:
                if self._tls:
                    server.starttls()
                if self.username:
                    server.login(self.username, self.password)
                server.send_message(msg)
            return True
        except smtplib.SMTPException as exc:
            logger.error("SMTP send failed: %s", exc)
            return False


class NotificationService:
    """Friendly facade over notification providers.

    Templates are registered here so the whole app agrees on terminology.
    """

    def __init__(self, provider: Optional[NotificationProvider] = None) -> None:
        self.provider = provider or self._build_provider()

    @staticmethod
    def _build_provider() -> NotificationProvider:
        smtp = SmtpNotifier()
        if smtp.available():
            return smtp
        return NoopNotifier()

    def _deliver(self, to: str, template: str, subject: str, context: Optional[dict] = None) -> bool:
        text = template
        if context:
            for key, value in (context or {}).items():
                text = text.replace("{{" + key + "}}", str(value))
        return self.provider.send(EmailMessageDraft(to=to, subject=subject, text=text, context=context or {}))

    def booking_confirmed(self, email: str, local_name: str, date: str, time: str) -> bool:
        return self._deliver(
            email,
            "Your consultation with {{local_name}} on {{date}} at {{time}} is confirmed. Enjoy!",
            "PlanRupee — Consultation Confirmed",
            {"local_name": local_name, "date": date, "time": time},
        )

    def booking_cancelled(self, email: str, local_name: str) -> bool:
        return self._deliver(email, "Your consultation request with {{local_name}} was cancelled. We are here if you need help.", "PlanRupee — Booking Update", {"local_name": local_name})

    def concierge_update(self, email: str, status: str, request_summary: str) -> bool:
        return self._deliver(email, "Concierge update: {{status}} — {{request_summary}}", "PlanRupee — Concierge Update", {"status": status, "request_summary": request_summary})

    def review_reminder(self, email: str, local_or_place: str) -> bool:
        return self._deliver(email, "How was your experience with {{target}}? A short review helps fellow travelers.", "PlanRupee — Review Reminder", {"target": local_or_place})

    def local_verification(self, email: str, status: str) -> bool:
        return self._deliver(email, "Your PlanRupee local profile was {{status}}.", "PlanRupee — Profile Status", {"status": status})

    def payment_confirmed(self, email: str, booking_id: str) -> bool:
        return self._deliver(email, "Payment received for booking {{booking_id}}.", "PlanRupee — Payment Confirmed", {"booking_id": booking_id})