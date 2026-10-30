import { useState } from 'react';
import { formatGoogleDriveUrl, SCHOOL } from '../data.js';
import { resolveImage, PLACEHOLDER } from '../assets/images.js';
import Icon from './Icons.jsx';

/** Banner trang chủ: ảnh tư liệu lớn + lớp phủ trầm + dòng chữ serif. */
export default function Banner({ bannerImage }) {
  const [failed, setFailed] = useState(false);
  const src = failed ? PLACEHOLDER : resolveImage(formatGoogleDriveUrl(bannerImage));
  return (
    <section className="relative isolate flex min-h-[340px] flex-col justify-end overflow-hidden bg-primary text-white sm:min-h-[420px]">
      <div className="absolute inset-0 -z-10">
        <img
          src={src}
          alt={`Quang cảnh ${SCHOOL.name}`}
          fetchPriority="high"
          onError={() => setFailed(true)}
          className="h-full w-full object-cover"
        />
        {/* Lớp phủ chuyển sắc để chữ luôn đủ tương phản trên mọi ảnh */}
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950/85 via-stone-950/45 to-stone-950/25" />
        <div className="absolute inset-x-0 bottom-0 h-1.5 bg-accent" />
      </div>

      <div className="mx-auto w-full max-w-7xl px-4 pb-10 pt-16">
        <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] backdrop-blur-sm">
          <Icon name="timeline" size={14} />
          Không gian số hóa
        </p>
        <h1 className="max-w-3xl font-serif text-3xl font-bold leading-tight drop-shadow-md sm:text-5xl">
          Phòng Truyền Thống Online
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-blue-50/95 drop-shadow sm:text-base">
          Lưu giữ ngọn lửa truyền thống hiếu học, sáng tạo và tự hào của các thế hệ thầy và trò{' '}
          {SCHOOL.name}, {SCHOOL.location}.
        </p>
        <a href="#noi-dung" className="no-print mt-6 inline-flex items-center gap-2 text-sm font-semibold text-white underline-offset-4 hover:underline">
          Bắt đầu khám phá
          <Icon name="arrowDown" size={16} />
        </a>
      </div>
    </section>
  );
}
