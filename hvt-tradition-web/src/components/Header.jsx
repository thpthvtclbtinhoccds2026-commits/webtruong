import { useState } from 'react';
import { CATEGORIES } from '../data.js';

export default function Header({ onOpenAdmin }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="bg-primary text-white shadow-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center gap-4">
        <div className="flex items-center space-x-3 shrink-0">
          <div className="bg-accent text-white font-bold p-2 rounded-lg text-lg">HVT</div>
          <div>
            <h1 className="font-bold text-sm md:text-base tracking-tight whitespace-nowrap leading-tight">
              THPT HOÀNG VĂN THỤ
            </h1>
            <p className="text-[11px] text-slate-200 whitespace-nowrap">
              Phường Vàng Danh, Quảng Ninh
            </p>
          </div>
        </div>

        {/* MENU TRANG CON (desktop) */}
        <nav className="hidden xl:flex space-x-2 text-xs font-medium">
          {CATEGORIES.map((cat) => (
            <a
              key={cat}
              href="#"
              onClick={(e) => {
                e.preventDefault();
                window.dispatchEvent(new CustomEvent('hvt:filter-tab', { detail: cat }));
              }}
              className="whitespace-nowrap px-2 py-1 rounded hover:text-accent transition"
            >
              {cat}
            </a>
          ))}
        </nav>

        <div className="shrink-0 flex items-center gap-2">
          <button
            onClick={() => setMobileOpen((v) => !v)}
            className="xl:hidden bg-blue-900 border border-white/20 p-2 rounded-lg text-white hover:bg-blue-800 transition"
            aria-label="Mở menu"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
          <button
            onClick={onOpenAdmin}
            className="bg-accent hover:bg-amber-600 text-white px-3.5 py-2 rounded-lg text-xs md:text-sm font-semibold shadow transition flex items-center gap-1.5 whitespace-nowrap"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
            Quản Trị Admin
          </button>
        </div>
      </div>

      {/* MENU MOBILE */}
      {mobileOpen && (
        <div className="xl:hidden border-t border-white/10 bg-blue-950 px-4 py-3 flex flex-col text-sm">
          {CATEGORIES.map((cat) => (
            <a
              key={cat}
              href="#"
              onClick={(e) => {
                e.preventDefault();
                window.dispatchEvent(new CustomEvent('hvt:filter-tab', { detail: cat }));
                setMobileOpen(false);
              }}
              className="py-1.5 px-2 rounded hover:bg-blue-900 transition text-white"
            >
              {cat}
            </a>
          ))}
        </div>
      )}
    </header>
  );
}
