import { useState } from 'react';
import Modal, { ModalCloseButton } from './Modal.jsx';
import Icon from './Icons.jsx';
import { CATEGORIES, SCHOOL_YEARS, formatGoogleDriveUrl } from '../data.js';
import { AVAILABLE_BANNERS, imageSrc } from '../assets/images.js';

export default function AdminDashboard({ posts, onClose, onLogout, onAddPost, onUpdatePost, onDeletePost, bannerImage, onChangeBanner }) {
  const [editingId, setEditingId] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [bannerInput, setBannerInput] = useState(bannerImage || '');
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');

  const editingPost = posts.find((p) => p.id === editingId);

  const filtered = posts.filter((p) => {
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return (
      p.title.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      String(p.year).toLowerCase().includes(q)
    );
  });

  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!editingPost) return;
    onUpdatePost(editingPost);
    setEditingId(null);
    setStatus('Đã lưu thay đổi.');
  };

  const handleDelete = () => {
    if (confirmDelete == null) return;
    onDeletePost(confirmDelete);
    setConfirmDelete(null);
    setStatus('Đã xóa mục khỏi phòng truyền thống.');
  };

  const applyBanner = () => {
    onChangeBanner(bannerInput.trim());
    setStatus('Đã cập nhật ảnh bìa trang chủ.');
  };

  return (
    <Modal labelledBy="admin-title" onClose={onClose} panelClassName="max-w-4xl bg-stone-100 p-6 sm:p-8">
      <ModalCloseButton onClick={onClose} />

      <div className="mb-5 flex flex-wrap items-center justify-between gap-3 border-b border-stone-300 pb-4">
        <div>
          <h2 id="admin-title" className="flex items-center gap-2 font-serif text-xl font-bold text-primary">
            <Icon name="lock" size={20} className="text-accent" /> Bàn Điều Khiển Quản Trị
          </h2>
          <p className="mt-1 text-xs text-stone-600">
            <span className="font-semibold">{posts.length}</span> mục đang lưu · dữ liệu giữ trong trình duyệt này
          </p>
        </div>
        <button type="button" onClick={onLogout} className="btn-ghost focus-ring">
          Đăng xuất
        </button>
      </div>

      <p role="status" aria-live="polite" className="sr-only">{status}</p>

      {/* BANNER */}
      <section aria-labelledby="banner-heading" className="mb-5 rounded-xl border border-stone-300 bg-white p-4">
        <h3 id="banner-heading" className="mb-2 text-sm font-bold text-primary">Ảnh bìa trang chủ</h3>
        <div className="flex flex-col gap-2 sm:flex-row">
          <label htmlFor="banner-input" className="sr-only">Link ảnh bìa</label>
          <input
            id="banner-input"
            type="text"
            value={bannerInput}
            onChange={(e) => setBannerInput(e.target.value)}
            className="field-input flex-1"
            placeholder="Chọn 1 ảnh bên dưới, hoặc dán link Google Drive…"
          />
          <button type="button" onClick={applyBanner} className="btn-primary focus-ring shrink-0">
            Cập nhật ảnh bìa
          </button>
        </div>
        {bannerInput && (
          <img
            src={imageSrc(formatGoogleDriveUrl(bannerInput), 'full')}
            alt="Xem trước ảnh bìa"
            loading="lazy"
            decoding="async"
            className="mt-3 h-24 w-full rounded-lg object-cover ring-1 ring-stone-200"
          />
        )}
        {/* Ảnh bìa THẬT có sẵn trong repo — bấm để chọn, bấm "Cập nhật" để lưu */}
        <ul className="mt-3 flex flex-wrap gap-2">
          {AVAILABLE_BANNERS.map((b) => (
            <li key={b.key}>
              <button
                type="button"
                onClick={() => setBannerInput(b.key)}
                aria-label={`Dùng ảnh bìa ${b.label}`}
                aria-pressed={bannerInput === b.key}
                className={`overflow-hidden rounded-lg border-2 bg-white p-1 transition focus-ring ${
                  bannerInput === b.key ? 'border-accent' : 'border-stone-300 hover:border-accent'
                }`}
              >
                <img src={b.src} alt="" loading="lazy" decoding="async" className="h-14 w-24 rounded object-cover" />
                <span className="mt-0.5 block text-center text-[10px] font-semibold text-stone-600">{b.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </section>

      {/* SEARCH + ADD */}
      <section aria-label="Thêm và tìm kiếm bài viết" className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1">
          <label htmlFor="admin-search" className="sr-only">Tìm kiếm bài viết</label>
          <Icon name="search" size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            id="admin-search"
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="field-input pl-9"
            placeholder="Tìm theo tiêu đề, chuyên mục, năm…"
          />
        </div>
        <button type="button" onClick={onAddPost} className="btn-accent focus-ring shrink-0">
          <Icon name="plus" size={16} /> Thêm bài viết mới
        </button>
      </section>

      {/* EDIT FORM */}
      {editingPost && (
        <form onSubmit={handleSaveEdit} className="mb-5 space-y-3 rounded-xl border-2 border-accent bg-white p-4 shadow-card">
          <h3 className="flex items-center gap-2 text-sm font-bold text-primary">
            <Icon name="edit" size={16} /> Đang sửa: {editingPost.title}
          </h3>
          <div className="grid gap-3 sm:grid-cols-3">
            <div>
              <label htmlFor="ed-cat" className="field-label">Chuyên mục</label>
              <select id="ed-cat" value={editingPost.category}
                onChange={(e) => setEditingId(editingPost.id) /* keep focus */, onUpdatePost({ ...editingPost, category: e.target.value })}
                className="field-input">
                {CATEGORIES.map((c) => <option key={c.id} value={c.id}>{c.id}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="ed-year" className="field-label">Năm học</label>
              <input id="ed-year" list="year-options" value={editingPost.year}
                onChange={(e) => onUpdatePost({ ...editingPost, year: e.target.value })}
                className="field-input font-semibold text-primary" />
              <datalist id="year-options">
                {SCHOOL_YEARS.filter((y) => y !== 'Tất cả').map((y) => <option key={y} value={y} />)}
              </datalist>
            </div>
            <div>
              <label htmlFor="ed-title" className="field-label">Tiêu đề</label>
              <input id="ed-title" value={editingPost.title}
                onChange={(e) => onUpdatePost({ ...editingPost, title: e.target.value })}
                className="field-input" />
            </div>
          </div>
          <div>
            <label htmlFor="ed-content" className="field-label">Nội dung</label>
            <textarea id="ed-content" rows="3" value={editingPost.content}
              onChange={(e) => onUpdatePost({ ...editingPost, content: e.target.value })}
              className="field-input resize-y" />
          </div>
          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => setEditingId(null)} className="btn-ghost focus-ring">Đóng form</button>
            <button type="submit" className="btn-primary focus-ring"><Icon name="check" size={16} /> Lưu thay đổi</button>
          </div>
        </form>
      )}

      {/* DANH SÁCH */}
      <ul className="space-y-3">
        {filtered.length === 0 && (
          <li className="rounded-xl border border-dashed border-stone-300 bg-white p-6 text-center text-sm text-stone-500">
            Không tìm thấy bài viết khớp với “{search}”.
          </li>
        )}
        {filtered.map((post) => (
          <li key={post.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-stone-300 bg-white px-4 py-3 transition hover:border-primary/40">
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded bg-accent/10 px-2 py-0.5 text-[11px] font-semibold uppercase text-accent">{post.category}</span>
                <span className="rounded bg-primary/5 px-2 py-0.5 text-[11px] font-bold text-primary">{post.year}</span>
              </div>
              <p className="mt-1 truncate text-sm font-semibold text-ink">{post.title}</p>
            </div>
            <div className="flex shrink-0 gap-2">
              <button type="button" onClick={() => setEditingId(post.id)}
                className="btn-ghost focus-ring px-3 py-2 text-xs">
                <Icon name="edit" size={15} /> Sửa
              </button>
              <button type="button" onClick={() => setConfirmDelete(post.id)}
                className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-white px-3 py-2 text-xs font-medium text-red-700 transition hover:bg-red-50 focus-ring">
                <Icon name="trash" size={15} /> Xóa
              </button>
            </div>
          </li>
        ))}
      </ul>

      {/* CONFIRM DELETE */}
      {confirmDelete != null && (
        <div className="fixed inset-0 z-[80] grid place-items-center bg-stone-950/70 p-4" role="alertdialog" aria-modal="true" aria-labelledby="del-title">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-lift animate-rise">
            <h3 id="del-title" className="font-serif text-lg font-bold text-primary">Xóa mục này?</h3>
            <p className="mt-2 text-sm text-stone-600">
              Hành động không thể hoàn tác. Tư liệu sẽ bị gỡ khỏi phòng truyền thống trên trình duyệt này.
            </p>
            <div className="mt-5 flex justify-end gap-2">
              <button type="button" onClick={() => setConfirmDelete(null)} className="btn-ghost focus-ring">Giữ lại</button>
              <button type="button" onClick={handleDelete} autoFocus className="focus-ring inline-flex items-center gap-2 rounded-lg bg-red-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-800">
                <Icon name="trash" size={16} /> Đồng ý xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
}
