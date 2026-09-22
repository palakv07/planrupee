import base64
import hashlib
import hmac
import logging
import uuid
from typing import Any, Dict, Optional

import httpx

from app.core.config import settings
from app.models import Booking
from app.services.booking_service import BookingError

logger = logging.getLogger(__name__)


class PaymentError(Exception):
    def __init__(self, code: str, message: str, cause: Optional[BaseException] = None) -> None:
        super().__init__(message)
        self.code = code
        self.message = message
        self.cause = cause


class PaymentService:
    """Razorpay-ready order creation + server-side signature verification.

    When real Razorpay credentials are configured, orders are created against
    the Razorpay Orders API. Otherwise a deterministic mock order is produced
    so development flows still exercise the same code path. The webhook/signature
    verification always uses HMAC-SHA256 so it stays safe in every environment.
    """

    ORDERS_URL = "https://api.razorpay.com/v1/orders"
    MAX_AMOUNT = 100_000_00  # INR in paise (1,00,000 INR)

    @property
    def mock_mode(self) -> bool:
        return not self._has_credentials()

    def _has_credentials(self) -> bool:
        key = settings.RAZORPAY_KEY_SECRET
        key_id = settings.RAZORPAY_KEY_ID
        return bool(
            key
            and key != "demo_secret_key_mock"
            and key_id
            and key_id != "rzp_test_placeholder_key"
        )

    def create_order(self, booking: Booking, amount: Optional[int] = None) -> Dict[str, Any]:
        if booking.payment_status == "PAID":
            raise PaymentError("ALREADY_PAID", "This booking is already paid.")
        if booking.booking_status == "CANCELLED":
            raise PaymentError("BOOKING_CANCELLED", "Cannot pay for a cancelled booking.")

        fee = amount if amount else int(booking.fee or 0)
        if fee <= 0:
            raise PaymentError("INVALID_AMOUNT", "Booking fee must be greater than zero.")
        amount_paise = int(fee * 100)
        if amount_paise > self.MAX_AMOUNT:
            raise PaymentError("AMOUNT_TOO_LARGE", "Amount exceeds the supported maximum.")

        if self.mock_mode:
            order = {
                "id": f"order_{uuid.uuid4().hex[:16]}",
                "amount": amount_paise,
                "currency": "INR",
                "status": "created",
                "receipt": f"booking_{booking.id}",
                "notes": {"booking_id": booking.id},
            }
            logger.info("Created mock Razorpay order %s for booking %s", order["id"], booking.id)
            return order

        try:
            response = httpx.post(
                self.ORDERS_URL,
                auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET),
                json={
                    "amount": amount_paise,
                    "currency": "INR",
                    "receipt": f"booking_{booking.id}",
                    "notes": {"booking_id": booking.id},
                },
                timeout=30,
            )
            response.raise_for_status()
            return response.json()
        except httpx.HTTPError as exc:
            logger.error("Razorpay order creation failed: %s", exc)
            raise PaymentError("ORDER_CREATION_FAILED", "Could not create payment order.", cause=exc) from exc

    @staticmethod
    def verify_signature(order_id: str, payment_id: str, signature: str) -> bool:
        """Verify the client-side Razorpay signature."""
        message = f"{order_id}|{payment_id}"
        expected = hmac.new(
            settings.RAZORPAY_WEBHOOK_SECRET.encode("utf-8"),
            message.encode("utf-8"),
            hashlib.sha256,
        ).hexdigest()
        return hmac.compare_digest(expected, signature)

    @staticmethod
    def verify_webhook(raw_body: bytes, signature: Optional[str]) -> bool:
        """Verify the Razorpay webhook header (X-Razorpay-Signature)."""
        if not signature:
            return False
        expected = hmac.new(
            settings.RAZORPAY_WEBHOOK_SECRET.encode("utf-8"),
            raw_body,
            hashlib.sha256,
        ).hexdigest()
        return hmac.compare_digest(expected, signature)


payment_service = PaymentService()