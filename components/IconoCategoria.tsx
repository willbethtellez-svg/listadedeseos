import React from 'react';
import { Gift } from 'lucide-react';

const IconoCategoria = ({ tipo, className }: { tipo: string; className?: string }) => {
  const baseStyle = className || "w-12 h-12 stroke-[#8C6239]";
  switch (tipo) {
    case 'ropa':
      return (
        <div className="p-3 bg-pink-100 rounded-full">
          <svg className={baseStyle} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.38 3.46L16 6l-4.38-2.54a1 1 0 00-1.24.11L3.11 11.23a1 1 0 00-.11 1.24L6 16.85V21a1 1 0 001 1h10a1 1 0 001-1v-4.15l2.89-4.38a1 1 0 00-.11-1.24L16.38 6l-1-1.63a1 1 0 00-1.24-.11" />
          </svg>
        </div>
      );
    case 'decoracion':
      return (
        <div className="p-3 bg-amber-50 rounded-full">
          <svg className={baseStyle} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
          </svg>
        </div>
      );
    case 'lactancia':
      return (
        <div className="p-3 bg-rose-100 rounded-full">
          <svg className={baseStyle} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2a4 4 0 00-4 4c0 3 4 8 4 8s4-5 4-8a4 4 0 00-4-4z" />
            <path d="M6 15h12a2 2 0 012 2v3a2 2 0 01-2 2H6a2 2 0 01-2-2v-3a2 2 0 012-2z" />
          </svg>
        </div>
      );
    case 'juguetes':
      return (
        <div className="p-3 bg-emerald-50 rounded-full">
          <svg className={baseStyle} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <path d="M8 12h8M12 8v8" />
          </svg>
        </div>
      );
    case 'higiene':
      return (
        <div className="p-3 bg-teal-50 rounded-full">
          <svg className={baseStyle} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 19h16a2 2 0 002-2V7a2 2 0 00-2-2H4a2 2 0 00-2 2v10a2 2 0 002 2z" />
            <path d="M12 5v14" />
          </svg>
        </div>
      );
    default:
      return (
        <div className="p-3 bg-pink-100 rounded-full">
          <Gift className={baseStyle} />
        </div>
      );
  }
};

export default IconoCategoria;
