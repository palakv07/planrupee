import React from 'react';
import { ShieldCheck, Sparkles, AlertCircle, CheckCircle2 } from 'lucide-react';
import { VerificationStatus } from '../../types';

interface BadgeProps {
  status: VerificationStatus | 'verified_visit' | 'verified_consultation';
  size?: 'sm' | 'md';
}

export const VerificationBadge: React.FC<BadgeProps> = ({ status, size = 'sm' }) => {
  const isSmall = size === 'sm';
  const textClass = isSmall ? 'text-[11px] px-2 py-0.5' : 'text-xs px-2.5 py-1';
  const iconSize = isSmall ? 12 : 14;

  switch (status) {
    case 'verified':
    case 'verified_visit':
      return (
        <span className={`inline-flex items-center gap-1 rounded-full font-medium bg-emerald-50 text-emerald-800 border border-emerald-200 ${textClass}`}>
          <ShieldCheck size={iconSize} className="text-emerald-600 shrink-0" />
          <span>{status === 'verified_visit' ? '✓ Verified Visit' : '✓ Verified Place'}</span>
        </span>
      );
    case 'verified_consultation':
      return (
        <span className={`inline-flex items-center gap-1 rounded-full font-medium bg-emerald-50 text-emerald-800 border border-emerald-200 ${textClass}`}>
          <CheckCircle2 size={iconSize} className="text-emerald-600 shrink-0" />
          <span>✓ Verified Consultation</span>
        </span>
      );
    case 'demo':
      return (
        <span className={`inline-flex items-center gap-1 rounded-full font-semibold bg-amber-50 text-amber-900 border border-amber-300 tracking-wider ${textClass}`}>
          <AlertCircle size={iconSize} className="text-amber-600 shrink-0" />
          <span>DEMO</span>
        </span>
      );
    case 'user_generated':
      return (
        <span className={`inline-flex items-center gap-1 rounded-full font-medium bg-neutral-100 text-neutral-800 border border-neutral-200 ${textClass}`}>
          <Sparkles size={iconSize} className="text-neutral-500 shrink-0" />
          <span>Community Added</span>
        </span>
      );
    case 'unverified':
    default:
      return (
        <span className={`inline-flex items-center gap-1 rounded-full font-medium bg-neutral-50 text-neutral-600 border border-neutral-200 ${textClass}`}>
          <span>Pending Verification</span>
        </span>
      );
  }
};
