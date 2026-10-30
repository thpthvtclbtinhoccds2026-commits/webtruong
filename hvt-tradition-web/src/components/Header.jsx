import { useEffect, useState } from 'react';
import Icon, { SchoolSeal } from './Icons.jsx';
import { IMG } from '../assets/images.js';
import { CATEGORIES, SCHOOL } from '../data.js';

export default function Header({ currentTab, onNavigate, onOpenAdmin }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  // Đóng menu mobile khi bấm Esc
  useEffect(() => {
    if (!mobileOpen) return undefined;
    const onKey = (e) => e.key === 'Escape' && setMobileOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [mobileOpen]);

  const go = (cat) => {
    onNavigate(cat);
    setMobileOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 border-b-4 border-accent bg-primary text-white shadow-md">
      {/* Dòng trên: tên trường đầy đủ — kiểu bảng hiệu phòng truyền thống */}
      <div className="bg-blue-950/60 text-center px-4 py-1.5 text-[11px] sm:text-xs font-medium tracking-wide text-blue-100">
        {SCHOOL.name.toUpperCase()} — {SCHOOL.location.toUpperCase()}
      </div>

      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3">
        <button
          type="button"
          onClick={() => go('Trang Chủ')}
          className="flex shrink-0 items-center gap-3 rounded-lg px-1 py-1 text-left transition hover:bg-white/10"
        >
          {IMG.logoHvt ? (
            <img
              src={IMG.logoHvt}
              alt="Logo trường THPT Hoàng Văn Thụ"
              width={44}
              height={44}
              className="h-11 w-11 shrink-0 rounded-full bg-white/95 object-contain p-1 shadow-sm"
            />
          ) : (
            <SchoolSeal className="h-11 w-11 text-[13px]" />
          )}
          <span className="leading-tight">
            <span className="block font-serif text-sm font-bold md:text-lg">
              Phòng Truyền Thống Online
            </span>
            <span className="block text-[11px] text-blue-200">Không gian số hóa truyền thống nhà trường</span>
          </span>
        </button>

        {/* MENU CHUYÊN MỤC (desktop) */}
        <nav aria-label="Chuyên mục chính" className="hidden 2xl:flex items-center gap-1 text-[13px]">
          {CATEGORIES.map((cat) => (
            <a
              key={cat.id}
              href={`#${cat.id}`}
              aria-current={currentTab === cat.id ? 'page' : undefined}
              onClick={(e) => {
                e.preventDefault();
                go(cat.id);
              }}
              className={`flex items-center gap-1.5 whitespace-nowrap rounded-lg px-2.5 py-2 transition ${
                currentTab === cat.id
                  ? 'bg-accent font-semibold text-white'
                  : 'text-blue-100 hover:bg-white/10 hover:text-white'
              }`}
            >
              <Icon name={cat.icon} size={16} />
              {cat.id}
            </a>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav"
            className="grid h-11 w-11 place-items-center rounded-lg border border-white/25 bg-blue-900 transition hover:bg-blue-800 2xl:hidden"
          >
            <Icon name={mobileOpen ? 'close' : 'menu'} size={22} />
            <span className="sr-only">{mobileOpen ? 'Đóng menu' : 'Mở menu'}</span>
          </button>
          <button
            type="button"
            onClick={onOpenAdmin}
            className="hidden btn-accent focus-ring sm:inline-flex px-3.5 py-2.5 text-xs md:text-sm"
          >
            <Icon name="lock" size={16} />
            Quản Trị Admin
          </button>
        </div>
      </div>

      {/* MENU MOBILE */}
      {mobileOpen && (
        <nav
          id="mobile-nav"
          aria-label="Chuyên mục chính (mobile)"
          className="border-t border-white/10 bg-blue-950 px-4 py-3 2xl:hidden"
        >
          <ul className="flex flex-col text-sm">
            {CATEGORIES.map((cat) => (
              <li key={cat.id}>
                <a
                  href={`#${cat.id}`}
                  aria-current={currentTab === cat.id ? 'page' : undefined}
                  onClick={(e) => {
                    e.preventDefault();
                    go(cat.id);
                  }}
                  className={`flex min-h-[44px] items-center gap-2.5 rounded-lg px-3 py-2.5 transition ${
                    currentTab === cat.id ? 'bg-accent font-semibold text-white' : 'text-blue-100 hover:bg-blue-900'
                  }`}
                >
                  <Icon name={cat.icon} size={18} />
                  {cat.id}
                </a>
              </li>
            ))}
            <li className="mt-2 sm:hidden">
              <button type="button" onClick={() => { setMobileOpen(false); onOpenAdmin(); }} className="w-full btn-accent focus-ring">
                <Icon name="lock" size={16} />
                Quản Trị Admin
              </button>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
