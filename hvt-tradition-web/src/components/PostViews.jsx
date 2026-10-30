import { useRef } from 'react';
import { formatGoogleDriveUrl } from '../data.js';
import { MediaContent } from './Media.jsx';

const KY_UOC_FALLBACK_IMG =
  'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80';

// 1. TIMELINE NGANG CHO MỤC "Lịch Sử Hình Thành"
export function TimelineView({ posts }) {
  const scrollRef = useRef(null);

  const scrollTimeline = (direction) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: direction * 380, behavior: 'smooth' });
    }
  };

  return (
    <div className="bg-blue-50/40 p-6 rounded-2xl border border-blue-100 shadow-inner">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-primary text-lg">
          ⏳ Dòng Thời Gian Lịch Sử Phát Triển Nhà Trường
        </h3>
        <div className="flex gap-2">
          <button
            onClick={() => scrollTimeline(-1)}
            className="bg-primary text-white w-9 h-9 rounded-full flex items-center justify-center shadow hover:bg-blue-900 transition"
            aria-label="Cuộn trái"
          >
            ❮
          </button>
          <button
            onClick={() => scrollTimeline(1)}
            className="bg-primary text-white w-9 h-9 rounded-full flex items-center justify-center shadow hover:bg-blue-900 transition"
            aria-label="Cuộn phải"
          >
            ❯
          </button>
        </div>
      </div>
      <div ref={scrollRef} className="flex gap-6 overflow-x-auto no-scrollbar pb-4 pt-2 px-2 scroll-smooth">
        {posts.map((post, idx) => {
          const validImages = (post.images || []).map(formatGoogleDriveUrl);
          const imgTag =
            validImages.length > 0 ? (
              <div className="mt-3 h-40 overflow-hidden rounded-lg border-2 border-blue-300 shadow-sm">
                <img src={validImages[0]} alt="" className="w-full h-full object-cover" />
              </div>
            ) : null;

          return (
            <div
              key={post.id}
              className="min-w-[300px] md:min-w-[360px] max-w-[360px] flex-shrink-0 flex flex-col relative"
            >
              <div className="flex items-center my-6">
                <div className="flex-1 border-t-2 border-primary"></div>
                <div className="w-8 h-8 rounded-full bg-accent text-white font-bold flex items-center justify-center text-xs shadow-md z-10 mx-2">
                  {idx + 1}
                </div>
                <div className="flex-1 border-t-2 border-primary"></div>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-md border border-slate-200/80 flex-1 flex flex-col justify-between hover:shadow-xl transition">
                <div>
                  <span className="bg-accent/10 text-accent font-bold px-3 py-1 rounded-full text-xs uppercase inline-block mb-3">
                    📅 Năm: {post.year}
                  </span>
                  <h3 className="text-lg font-bold text-primary mb-2">{post.title}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line">
                    {post.content}
                  </p>
                </div>
                {imgTag}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// 2. LƯỚI CARD CHO MỤC "Ký ước trường xưa" (ảnh lớn phía trên, chữ phía dưới)
export function MemoryGrid({ posts }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {posts.map((post) => {
        const validImages = (post.images || []).map(formatGoogleDriveUrl);
        const mainImg = validImages.length > 0 ? validImages[0] : KY_UOC_FALLBACK_IMG;

        return (
          <div
            key={post.id}
            className="bg-white rounded-2xl shadow-md border border-slate-200/80 overflow-hidden flex flex-col justify-between hover:shadow-xl transition duration-300"
          >
            <div>
              <div className="h-56 overflow-hidden relative">
                <img
                  src={mainImg}
                  alt=""
                  className="w-full h-full object-cover hover:scale-105 transition duration-500"
                />
                <span className="absolute top-3 left-3 bg-accent text-white text-[11px] font-bold px-3 py-1 rounded-full shadow">
                  {post.year}
                </span>
              </div>
              <div className="p-5">
                <h4 className="text-lg font-bold text-primary mb-2">{post.title}</h4>
                <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line">
                  {post.content}
                </p>
              </div>
            </div>
            <div className="px-5 pb-5 pt-3 border-t bg-slate-50 flex justify-between items-center text-xs text-slate-500 font-medium">
              <span>💌 Góc kỷ niệm</span>
              <span className="text-primary font-bold">THPT Hoàng Văn Thụ</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// 3. CARD DỌC CHO CÁC TAB CÒN LẠI (bố cục đổi theo tab)
export function PostCard({ post, currentTab }) {
  const media = <MediaContent post={post} />;

  const badges = (extraClass = '') => (
    <div className={`flex items-center gap-2 mb-2 flex-wrap ${extraClass}`}>
      <span className="bg-accent/10 text-accent border border-accent/20 text-[11px] font-semibold px-2.5 py-0.5 rounded uppercase">
        {post.category}
      </span>
      <span className="bg-blue-50 text-primary border border-blue-100 text-[11px] font-bold px-2 py-0.5 rounded">
        Năm học: {post.year}
      </span>
    </div>
  );

  if (currentTab === 'Thành Tích & Khen Thưởng') {
    // Chữ trái, ảnh phải
    return (
      <div className="bg-white rounded-xl shadow-md overflow-hidden border border-slate-200/80 grid grid-cols-1 lg:grid-cols-12 gap-0">
        <div className="lg:col-span-5 p-6 md:p-8 flex flex-col justify-between border-r border-slate-100">
          <div>
            {badges()}
            <h4 className="text-xl md:text-2xl font-bold text-primary mt-2 mb-3">{post.title}</h4>
            <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line">{post.content}</p>
          </div>
          <div className="mt-6 pt-4 border-t text-xs text-slate-400 flex justify-between">
            <span>THPT Hoàng Văn Thụ</span>
            <span className="font-medium text-slate-500">Bảng vàng thành tích</span>
          </div>
        </div>
        <div className="lg:col-span-7 bg-slate-50">{media}</div>
      </div>
    );
  }

  if (currentTab === 'Hoạt Động & CLB') {
    // Phong cách card nghệ thuật
    return (
      <div className="bg-gradient-to-br from-white to-blue-50/30 rounded-2xl shadow-lg overflow-hidden border-2 border-blue-100/80 grid grid-cols-1 lg:grid-cols-12 gap-0">
        <div className="lg:col-span-6 border-r border-blue-100">{media}</div>
        <div className="lg:col-span-6 p-6 md:p-8 flex flex-col justify-between bg-white/80 backdrop-blur">
          <div>
            <div className="flex items-center gap-2 mb-3 flex-wrap">
              <span className="bg-primary text-white text-[11px] font-bold px-3 py-1 rounded-full uppercase shadow-sm">
                ⭐ {post.category}
              </span>
              <span className="bg-accent/10 text-accent font-bold px-3 py-1 rounded-full text-xs">
                Năm học: {post.year}
              </span>
            </div>
            <h4 className="text-xl md:text-2xl font-bold text-primary mt-2 mb-3">{post.title}</h4>
            <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line">{post.content}</p>
          </div>
          <div className="mt-6 pt-4 border-t text-xs text-slate-400 flex justify-between items-center">
            <span className="font-semibold text-primary">Đội ngũ CLB Nhà trường</span>
            <span className="bg-blue-100 text-primary px-3 py-1 rounded-full font-bold">
              Sáng tạo & Năng động
            </span>
          </div>
        </div>
      </div>
    );
  }

  // Mặc định: Ảnh trái, chữ phải
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden border border-slate-200/80 grid grid-cols-1 lg:grid-cols-12 gap-0">
      <div className="lg:col-span-7 border-r border-slate-100">{media}</div>
      <div className="lg:col-span-5 p-6 md:p-8 flex flex-col justify-between">
        <div>
          {badges()}
          <h4 className="text-xl md:text-2xl font-bold text-primary mt-2 mb-3">{post.title}</h4>
          <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line">{post.content}</p>
        </div>
        <div className="mt-6 pt-4 border-t text-xs text-slate-400 flex justify-between">
          <span>THPT Hoàng Văn Thụ</span>
          <span className="font-medium text-slate-500">Quản trị viên</span>
        </div>
      </div>
    </div>
  );
}
