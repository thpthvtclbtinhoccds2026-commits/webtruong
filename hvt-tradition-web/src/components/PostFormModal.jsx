import { useState } from 'react';
import { CATEGORIES, formatGoogleDriveUrl } from '../data.js';

// MODAL FORM THÊM / SỬA BÀI VIẾT
export default function PostFormModal({ initial, onClose, onSave }) {
  const editing = Boolean(initial);
  const [category, setCategory] = useState(initial?.category ?? CATEGORIES[0]);
  const [year, setYear] = useState(initial?.year ?? '2025 - 2026');
  const [title, setTitle] = useState(initial?.title ?? '');
  const [content, setContent] = useState(initial?.content ?? '');
  const [images, setImages] = useState(initial?.images?.length ? [...initial.images] : ['']);
  const [videos, setVideos] = useState(initial?.videos ? [...initial.videos] : []);
  const [error, setError] = useState('');

  const setImageAt = (i, val) =>
    setImages((arr) => arr.map((v, idx) => (idx === i ? val : v)));
  const setVideoAt = (i, val) =>
    setVideos((arr) => arr.map((v, idx) => (idx === i ? val : v)));

  const handleSubmit = (e) => {
    e.preventDefault();
    const cleanImages = images.map((s) => s.trim()).filter(Boolean);
    const cleanVideos = videos.map((s) => s.trim()).filter(Boolean);

    if (cleanImages.length === 0 && cleanVideos.length === 0) {
      setError('Vui lòng nhập ít nhất 1 link ảnh hoặc 1 link video!');
      return;
    }

    onSave({
      category,
      year: year.trim(),
      title,
      content,
      images: cleanImages,
      videos: cleanVideos,
    });
  };

  // Xem thử ảnh khi dán link Drive
  const previewImages = images.map(formatGoogleDriveUrl).filter(Boolean);

  return (
    <div className="fixed inset-0 bg-black/80 z-[60] flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 relative my-8">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 font-bold text-xl"
          aria-label="Đóng"
        >
          &times;
        </button>

        <h3 className="text-xl font-bold text-primary mb-4">
          {editing ? 'Sửa Bài Viết / Tư Liệu' : 'Thêm Mục Mới'}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">
                Trang Con:
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full border rounded-lg px-3 py-2 text-sm outline-none"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">
                Năm học / Mốc năm:
              </label>
              <input
                type="text"
                required
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="w-full border rounded-lg px-3 py-2 text-sm outline-none font-medium text-primary"
                placeholder="VD: 2025 - 2026 hoặc 1984"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">
                Tiêu đề / Mốc thời gian:
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full border rounded-lg px-3 py-2 text-sm outline-none"
                placeholder="Tiêu đề..."
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">
              Nội dung chi tiết:
            </label>
            <textarea
              rows="3"
              required
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 text-sm outline-none"
              placeholder="Nhập nội dung..."
            />
          </div>

          {/* KHU VỰC QUẢN LÝ ẢNH */}
          <div className="border rounded-xl p-3 bg-slate-50">
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-bold uppercase text-slate-700">
                Danh Sách Link Ảnh (Dán trực tiếp link Google Drive vào đây):
              </label>
              <button
                type="button"
                onClick={() => setImages((arr) => [...arr, ''])}
                className="bg-primary text-white px-3 py-1 rounded-lg text-xs font-semibold hover:bg-blue-900 transition"
              >
                ➕ Thêm link ảnh
              </button>
            </div>
            <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
              {images.map((url, i) => (
                <div key={i} className="flex gap-2 items-center">
                  <input
                    type="url"
                    value={url}
                    onChange={(e) => setImageAt(i, e.target.value)}
                    placeholder="Dán nguyên link Google Drive vào đây..."
                    className="flex-1 border rounded-lg px-3 py-1.5 text-sm bg-white outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setImages((arr) => arr.filter((_, idx) => idx !== i))}
                    className="bg-red-100 hover:bg-red-200 text-red-600 px-3 py-1.5 rounded-lg text-xs font-semibold transition"
                  >
                    Xóa
                  </button>
                </div>
              ))}
            </div>
            {previewImages.length > 0 && (
              <div className="flex gap-2 mt-3 flex-wrap">
                {previewImages.slice(0, 6).map((src, i) => (
                  <img
                    key={i}
                    src={src}
                    alt=""
                    className="h-14 w-20 object-cover rounded border"
                    onError={(e) => {
                      e.currentTarget.style.opacity = '0.25';
                    }}
                  />
                ))}
              </div>
            )}
          </div>

          {/* KHU VỰC QUẢN LÝ VIDEO */}
          <div className="border rounded-xl p-3 bg-blue-50/50">
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-bold uppercase text-primary">
                Danh Sách Link Video (YouTube hoặc Google Drive):
              </label>
              <button
                type="button"
                onClick={() => setVideos((arr) => [...arr, ''])}
                className="bg-accent text-white px-3 py-1 rounded-lg text-xs font-semibold hover:bg-amber-600 transition"
              >
                ➕ Thêm link video
              </button>
            </div>
            <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
              {videos.map((url, i) => (
                <div key={i} className="flex gap-2 items-center">
                  <input
                    type="url"
                    value={url}
                    onChange={(e) => setVideoAt(i, e.target.value)}
                    placeholder="Dán link YouTube hoặc Google Drive công khai..."
                    className="flex-1 border rounded-lg px-3 py-1.5 text-sm bg-white outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setVideos((arr) => arr.filter((_, idx) => idx !== i))}
                    className="bg-red-100 hover:bg-red-200 text-red-600 px-3 py-1.5 rounded-lg text-xs font-semibold transition"
                  >
                    Xóa
                  </button>
                </div>
              ))}
            </div>
          </div>

          {error && <p className="text-red-600 text-sm font-medium">⚠️ {error}</p>}

          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-lg text-sm text-slate-600"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="bg-primary text-white px-5 py-2 rounded-lg text-sm font-semibold"
            >
              Lưu Lại
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
