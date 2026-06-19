import React from 'react';

export const IlustracionAbeja = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 100 100" className={className}>
    <g fill="none" stroke="#78350f" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <ellipse cx="40" cy="30" rx="10" ry="18" fill="#FCE7F3" transform="rotate(-15 40 30)" opacity="0.8"/>
      <ellipse cx="58" cy="28" rx="9" ry="16" fill="#FCE7F3" transform="rotate(15 58 28)" opacity="0.8"/>
      <rect x="30" y="40" width="40" height="28" rx="14" fill="#FCD34D" strokeWidth="3"/>
      <path d="M42 41 v26" stroke="#78350f" strokeWidth="4"/>
      <path d="M50 40 v28" stroke="#78350f" strokeWidth="4"/>
      <path d="M58 41 v26" stroke="#78350f" strokeWidth="4"/>
      <circle cx="36" cy="50" r="2.5" fill="#78350f"/>
      <path d="M34 58 q3 3 6 0" />
      <path d="M32 40 q-5 -8 -3 -12" />
      <circle cx="29" cy="27" r="2" fill="#78350f"/>
      <path d="M70 54 l6 -2 l-6 -4 z" fill="#78350f" />
    </g>
  </svg>
);

export const IlustracionTarroMiel = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 100 100" className={className}>
    <path d="M25 40 Q25 30 35 30 L65 30 Q75 30 75 40 L70 80 Q70 88 60 88 L40 88 Q30 88 30 80 Z" fill="#FFFBEB" stroke="#78350f" strokeWidth="3.5" />
    <path d="M22 30 Q50 24 78 30 L73 18 Q50 15 27 18 Z" fill="#FBCFE8" stroke="#78350f" strokeWidth="3.5" />
    <path d="M24 28 Q50 31 76 28" stroke="#D01C53" strokeWidth="2.5" fill="none" />
    <path d="M26 28 q-4 6 -2 10" stroke="#D01C53" strokeWidth="2" fill="none" />
    <path d="M74 28 q4 6 2 10" stroke="#D01C53" strokeWidth="2" fill="none" />
    <path d="M35 30 Q50 48 55 42 Q60 35 65 30" fill="#F59E0B" stroke="#78350f" strokeWidth="2" />
    <circle cx="53" cy="46" r="3.5" fill="#F59E0B" />
    <rect x="33" y="48" width="34" height="24" rx="4" fill="#FEF3C7" stroke="#78350f" strokeWidth="2" />
    <text x="50" y="64" fontFamily="serif" fontSize="11" fontWeight="bold" fill="#B45309" textAnchor="middle">HUNNY</text>
  </svg>
);

export const IlustracionRama = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 100 50" className={className} fill="none">
    <path d="M5 25 Q45 5 95 30" stroke="#8C6239" strokeWidth="3" strokeLinecap="round" />
    <path d="M25 18 Q15 10 20 5 Q32 10 25 18 Z" fill="#FBCFE8" stroke="#8C6239" strokeWidth="1.5" />
    <path d="M45 14 Q40 3 48 1 Q54 8 45 14 Z" fill="#F9A8D4" stroke="#8C6239" strokeWidth="1.5" />
    <path d="M65 16 Q68 5 76 8 Q75 18 65 16 Z" fill="#D1FAE5" stroke="#8C6239" strokeWidth="1.5" />
    <path d="M80 22 Q88 15 94 20 Q90 28 80 22 Z" fill="#FBCFE8" stroke="#8C6239" strokeWidth="1.5" />
    <path d="M12 21 Q5 15 10 10 Q18 15 12 21 Z" fill="#A7F3D0" stroke="#8C6239" strokeWidth="1.5" />
  </svg>
);

export default {
  IlustracionAbeja,
  IlustracionTarroMiel,
  IlustracionRama
};
