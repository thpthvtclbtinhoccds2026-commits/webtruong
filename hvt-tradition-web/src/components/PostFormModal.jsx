import { useState } from 'react';
import Modal, { ModalCloseButton } from './Modal.jsx';
import Icon from './Icons.jsx';
import { CATEGORY_NAMES, formatGoogleDriveUrl } from '../data.js';
import { AVAILABLE_IMAGE_KEYS, IMAGE_ALT, imageSrc } from '../assets/images.js';

const emptyDraft = {
  category: CATEGORY_NAMES[1],
  year: '',
  title: '',
  content: '',
  images: [''],
  videos: [],
};

export default function PostFormModal({ initial, onClose, onSave }) {
  const editing = Boolean(initial);
  const [draft, setDraft] = useState(() =>
    initial
      ? {
          ...initial,
          images: initial.images?.length ? [...initial.images] : [''],
          videos: initial.videos ? [...initial.videos] : [],
        }
      : emptyDraft,
  );
  const [error, setError] = useState('');

  const set = (key, value) => setDraft((d) => ({ ...d, [key]: value }));
  const setImageAt = (i, val) =>
    set('images', draft.images.map((v, idx) => (idx === i ? val : v)));
  const setVideoAt = (i, val) =>
    set('videos', draft.videos.map((v, idx) => (idx === i ? val : v)));

  const handleSubmit = (e) => {
    e.preventDefault();
    const images = draft.images.map((s) => s.trim()).filter(Boolean);
    const videos = draft.videos.map((s) => s.trim()).filter(Boolean);

    if (!draft.title.trim()) return setError('Tiêu đề không được để trống.');
    if (!draft.year.trim()) return setError('Vui lòng nhập năm học hoặc mốc năm (VD: 2025 - 2026, 1984, Khóa K12).');
    if (!draft.content.trim()) return setError('Vui lòng viết nội dung cho mục này.');
    if (images.length === 0 && videos.length === 0)
      return setError('Cần ít nhất 1 link ảnh hoặc 1 link video minh họa.');

    onSave({
      ...draft,
      title: draft.title.trim(),
      year: draft.year.trim(),
      content: draft.content.trim(),
      images,
      videos,
    });
  };

  const previews = draft.images.map(formatGoogleDriveUrl).filter(Boolean);

  // Ảnh có sẵn trong repo (bỏ các cỡ phụ -full/-thumb và banner)
  const libraryItems = AVAILABLE_IMAGE_KEYS.filter(
    (k) => k !== 'banner' && k !== 'bannerA4' && k !== 'logo',
  ).map((key) => ({
    key,
    src: imageSrc(key, 'card'),
    thumb: imageSrc(key, 'thumb'),
    alt: IMAGE_ALT[key] || `Ảnh tư liệu ${key}`,
  }));

  /** Thêm ảnh từ thư viện: lưu bằng KEY ngắn (a1..a7) để tự nối cỡ thumb/card/full.
   *  Ô trống đầu tiên sẽ được điền; nếu đã có ảnh này thì bỏ qua (chống trùng). */
  const addFromLibrary = (key) => {
    if (draft.images.some((v) => v.trim() === key)) return;
    const idx = draft.images.findIndex((v) => !v.trim());
    if (idx >= 0) return setImageAt(idx, key);
    set('images', [...draft.images, key]);
  };

  return (
    <Modal labelledBy="post-form-title" onClose={onClose} panelClassName="max-w-3xl p-6 sm:p-8">
      <ModalCloseButton onClick={onClose} />

      <h2 id="post-form-title" className="font-serif text-xl font-bold text-primary">
        {editing ? 'Sửa bài viết / tư liệu' : 'Thêm mục mới'}
      </h2>
      <p className="mt-1 text-xs text-stone-500">
        Chọn nhanh một ảnh có sẵn trong thư viện nhà trường, hoặc dán link Google Drive
        (dạng xem/chia sẻ) — hệ thống tự chuyển sang link ảnh trực tiếp.
      </p>

      <form onSubmit={handleSubmit} className="mt-5 space-y-5">
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label htmlFor="f-cat" className="field-label">Chuyên mục</label>
            <select
              id="f-cat"
              value={draft.category}
              onChange={(e) => set('category', e.target.value)}
              className="field-input"
            >
              {CATEGORY_NAMES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="f-year" className="field-label">Năm học / Mốc năm</label>
            <input
              id="f-year"
              type="text"
              required
              value={draft.year}
              onChange={(e) => { set('year', e.target.value); setError(''); }}
              className="field-input font-semibold text-primary"
              placeholder="VD: 2025 - 2026 hoặc 1984"
            />
          </div>
          <div>
            <label htmlFor="f-title" className="field-label">Tiêu đề</label>
            <input
              id="f-title"
              type="text"
              required
              value={draft.title}
              onChange={(e) => { set('title', e.target.value); setError(''); }}
              className="field-input"
              placeholder="VD: Lễ kỷ niệm 40 năm thành lập"
            />
          </div>
        </div>

        <div>
          <label htmlFor="f-content" className="field-label">Nội dung chi tiết</label>
          <textarea
            id="f-content"
            rows="4"
            required
            value={draft.content}
            onChange={(e) => { set('content', e.target.value); setError(''); }}
            className="field-input resize-y leading-relaxed"
            placeholder="Ghi lại sự kiện, câu chuyện, thành tích…"
          />
        </div>

        {/* ẢNH */}
        <fieldset className="rounded-xl border border-stone-200 bg-paper p-4">
          <legend className="px-1 text-xs font-bold uppercase tracking-wide text-stone-700">Ảnh tư liệu</legend>
          <div className="mb-2 flex justify-end">
            <button
              type="button"
              onClick={() => set('images', [...draft.images, ''])}
              className="btn-primary focus-ring px-3 py-1.5 text-xs"
            >
              <Icon name="plus" size={14} /> Thêm link ảnh
            </button>
          </div>
          <ul className="space-y-2">
            {draft.images.map((url, i) => (
              <li key={i} className="flex items-center gap-2">
                <label htmlFor={`img-${i}`} className="sr-only">Link ảnh {i + 1}</label>
                <input
                  id={`img-${i}`}
                  type="text"
                  list="anh-co-san"
                  value={url}
                  onChange={(e) => setImageAt(i, e.target.value)}
                  className="field-input"
                  placeholder="Chọn ảnh bên dưới, hoặc dán link Google Drive…"
                />
                <button
                  type="button"
                  onClick={() => set('images', draft.images.filter((_, idx) => idx !== i))}
                  disabled={draft.images.length === 1}
                  className="grid h-11 w-11 shrink-0 place-items-center rounded-lg border border-stone-300 bg-white text-red-700 transition hover:bg-red-50 disabled:opacity-40 focus-ring"
                >
                  <Icon name="trash" size={16} />
                  <span className="sr-only">Xóa link ảnh {i + 1}</span>
                </button>
              </li>
            ))}
          </ul>
          {/* THƯ VIỆN ẢNH CÓ SẴN trong repo — bấm để thêm vào bài viết */}
          <div className="mt-3">
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-stone-600">
              Thư viện ảnh của trường ({libraryItems.length} ảnh) — bấm để thêm
            </p>
            <ul className="grid grid-cols-4 gap-2 sm:grid-cols-7">
              {libraryItems.map((it) => (
                <li key={it.key}>
                  <button
                    type="button"
                    onClick={() => addFromLibrary(it.key)}
                    title={`Thêm ảnh ${it.key}`}
                    aria-label={`Thêm ảnh ${it.key}: ${it.alt}`}
                    className="group block w-full overflow-hidden rounded-lg border border-stone-300 bg-white p-1 transition hover:border-accent focus-ring"
                  >
                    <img src={it.thumb} alt="" loading="lazy" decoding="async"
                      className="aspect-square w-full rounded object-cover" />
                    <span className="mt-1 block truncate text-center text-[10px] font-semibold text-stone-600 group-hover:text-accent">
                      {it.key}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
            <datalist id="anh-co-san">
              {libraryItems.map((it) => (
                <option key={it.key} value={it.key} label={`${it.alt} (${it.src})`} />
              ))}
            </datalist>
          </div>

          {previews.length > 0 && (
            <ul className="mt-3 flex flex-wrap gap-2">
              {previews.slice(0, 8).map((src, i) => (
                <li key={i} className="archive-frame h-16 w-24 overflow-hidden p-1">
                  <img src={src} alt="" loading="lazy" className="h-full w-full object-cover"
                    onError={(e) => { e.currentTarget.style.opacity = '0.25'; }} />
                </li>
              ))}
            </ul>
          )}
        </fieldset>

        {/* VIDEO */}
        <fieldset className="rounded-xl border border-primary/15 bg-primary/[0.04] p-4">
          <legend className="px-1 text-xs font-bold uppercase tracking-wide text-primary">Video (YouTube / Drive)</legend>
          <div className="mb-2 flex justify-end">
            <button
              type="button"
              onClick={() => set('videos', [...draft.videos, ''])}
              className="btn-accent focus-ring px-3 py-1.5 text-xs"
            >
              <Icon name="plus" size={14} /> Thêm link video
            </button>
          </div>
          {draft.videos.length === 0 && (
            <p className="text-xs text-stone-500">Chưa có video cho mục này.</p>
          )}
          <ul className="space-y-2">
            {draft.videos.map((url, i) => (
              <li key={i} className="flex items-center gap-2">
                <label htmlFor={`vid-${i}`} className="sr-only">Link video {i + 1}</label>
                <input
                  id={`vid-${i}`}
                  type="url"
                  value={url}
                  onChange={(e) => setVideoAt(i, e.target.value)}
                  className="field-input"
                  placeholder="https://www.youtube.com/watch?v=..."
                />
                <button
                  type="button"
                  onClick={() => set('videos', draft.videos.filter((_, idx) => idx !== i))}
                  className="grid h-11 w-11 shrink-0 place-items-center rounded-lg border border-stone-300 bg-white text-red-700 transition hover:bg-red-50 focus-ring"
                >
                  <Icon name="trash" size={16} />
                  <span className="sr-only">Xóa link video {i + 1}</span>
                </button>
              </li>
            ))}
          </ul>
        </fieldset>

        {error && (
          <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-800 ring-1 ring-inset ring-red-200">
            {error}
          </p>
        )}

        <div className="flex flex-col-reverse gap-3 border-t border-stone-200 pt-4 sm:flex-row sm:justify-end">
          <button type="button" onClick={onClose} className="btn-ghost focus-ring">
            Hủy
          </button>
          <button type="submit" className="btn-primary focus-ring">
            <Icon name="check" size={16} /> {editing ? 'Lưu thay đổi' : 'Thêm vào phòng truyền thống'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
