import { useEffect, useState } from 'react';
import { formatGoogleDriveUrl, getYouTubeThumbnail } from '../data.js';

const FALLBACK_IMG =
  'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=800&q=80';

// Slider ảnh tự động chuyển (dùng cho card bài viết ở các tab thường)
export function ImageSlider({ images }) {
  const [index, setIndex] = useState(0);
  const count = images.length;

  useEffect(() => {
    if (count <= 1) return undefined;
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % count);
    }, 3000);
    return () => clearInterval(timer);
  }, [count]);

  return (
    <div className="relative overflow-hidden group bg-white">
      <div
        className="flex transition-transform duration-500 ease-out w-full"
        style={{ transform: `translateX(-${index * 100}%)` }}
      >
        {images.map((img, i) => (
          <div
            key={i}
            className="w-full flex-shrink-0 bg-white flex items-center justify-center min-h-[280px] md:min-h-[350px] p-4"
            style={{ flex: '0 0 100%' }}
          >
            <img
              src={img}
              onError={(e) => {
                e.currentTarget.src = FALLBACK_IMG;
              }}
              alt=""
              className="max-w-full max-h-[480px] object-contain rounded-lg border-2 border-blue-300 shadow-md"
            />
          </div>
        ))}
      </div>

      {count > 1 && (
        <>
          <button
            onClick={() => setIndex((i) => (i - 1 + count) % count)}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/80 text-white p-2 rounded-full transition z-10"
            aria-label="Ảnh trước"
          >
            ❮
          </button>
          <button
            onClick={() => setIndex((i) => (i + 1) % count)}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/80 text-white p-2 rounded-full transition z-10"
            aria-label="Ảnh tiếp theo"
          >
            ❯
          </button>
          <div className="absolute bottom-3 right-3 bg-black/60 text-white text-[11px] px-2 py-0.5 rounded-full z-10">
            {index + 1}/{count}
          </div>
        </>
      )}
    </div>
  );
}

export function MediaContent({ post }) {
  const images = (post.images || []).map(formatGoogleDriveUrl);
  const videos = post.videos || [];

  return (
    <>
      {images.length > 0 && <ImageSlider images={images} />}

      {videos.map((v, i) => (
        <VideoCard key={`${v}-${i}`} url={v} />
      ))}

      {images.length === 0 && videos.length === 0 && (
        <div className="h-64 md:h-80 bg-slate-200">
          <img src={FALLBACK_IMG} alt="" className="w-full h-full object-cover" />
        </div>
      )}
    </>
  );
}

function VideoCard({ url }) {
  const thumb = getYouTubeThumbnail(url);
  return (
    <div className="w-full bg-slate-900 flex flex-col group relative overflow-hidden">
      <div className="w-full h-64 md:h-80 relative cursor-pointer" onClick={() => window.open(url, '_blank')}>
        <img
          src={thumb}
          alt=""
          className="w-full h-full object-cover group-hover:scale-105 transition duration-300 opacity-90"
        />
        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition flex flex-col items-center justify-center p-4">
          <div className="w-16 h-16 bg-accent text-white rounded-full flex items-center justify-center shadow-xl mb-3 group-hover:scale-110 transition">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 ml-1"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
          <span className="bg-black/70 text-white text-xs font-semibold px-4 py-1.5 rounded-full shadow border border-white/20">
            ▶ Bấm để xem video chất lượng cao
          </span>
        </div>
      </div>
      <div className="bg-blue-950 px-4 py-2.5 flex justify-between items-center text-xs">
        <span className="text-slate-300 font-medium">🎬 Tư liệu video chính thức nhà trường</span>
        <a
          href={url}
          target="_blank"
          rel="noreferrer"
          className="bg-accent hover:bg-amber-600 text-white px-3.5 py-1.5 rounded-lg font-semibold transition flex items-center gap-1 shadow"
        >
          Mở xem toàn màn hình ↗
        </a>
      </div>
    </div>
  );
}
