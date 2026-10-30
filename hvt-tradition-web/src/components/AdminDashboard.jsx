import { useState } from 'react';
import PostFormModal from './PostFormModal.jsx';

// MODAL BẢNG ĐIỀU KHIỂN ADMIN
export default function AdminDashboard({
  posts,
  bannerImage,
  onClose,
  onUpdateBanner,
  onAddPost,
  onUpdatePost,
  onDeletePost,
  onResetData,
}) {
  const [bannerUrl, setBannerUrl] = useState(bannerImage);
  const [formOpen, setFormOpen] = useState(false);
  const [editIdx, setEditIdx] = useState(-1); // -1 = thêm mới

  const handleUpdateBanner = () => {
    const url = bannerUrl.trim();
    if (url) {
      onUpdateBanner(url);
      alert('Đã cập nhật ảnh banner thành công!');
    }
  };

  const openAddForm = () => {
    setEditIdx(-1);
    setFormOpen(true);
  };

  const openEditForm = (idx) => {
    setEditIdx(idx);
    setFormOpen(true);
  };

  const handleSave = (data) => {
    if (editIdx === -1) {
      onAddPost({ id: Date.now(), ...data });
    } else {
      onUpdatePost(editIdx, data);
    }
    setFormOpen(false);
    alert('Lưu thông tin thành công!');
  };

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6 relative my-8">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 font-bold text-xl"
          aria-label="Đóng"
        >
          &times;
        </button>

        {/* Cài đặt banner */}
        <div className="mb-6 p-4 bg-slate-100 rounded-xl border">
          <h4 className="font-bold text-primary text-sm mb-2">🖼️ Cài Đặt Ảnh Banner Trang Chủ</h4>
          <div className="flex gap-2">
            <input
              type="url"
              value={bannerUrl}
              onChange={(e) => setBannerUrl(e.target.value)}
              placeholder="Dán link ảnh hoặc link Drive..."
              className="flex-1 border rounded-lg px-3 py-2 text-sm bg-white outline-none"
            />
            <button
              onClick={handleUpdateBanner}
              className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-900"
            >
              Đổi Ảnh Banner
            </button>
          </div>
        </div>

        <div className="flex justify-between items-center mb-4 border-b pb-3">
          <h3 className="text-lg font-bold text-primary">📋 Quản Lý Danh Sách Bài Viết & Tư Liệu</h3>
          <button
            onClick={openAddForm}
            className="bg-accent hover:bg-amber-600 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow transition"
          >
            ➕ Thêm Mục Mới
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-slate-100 text-slate-700 text-xs uppercase">
                <th className="p-3 border">Tiêu đề / Mốc thời gian</th>
                <th className="p-3 border">Trang con</th>
                <th className="p-3 border text-center">Năm học / Mốc năm</th>
                <th className="p-3 border text-center">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((p, idx) => (
                <tr key={p.id} className="border-b hover:bg-slate-50">
                  <td className="p-3 font-medium">{p.title}</td>
                  <td className="p-3">
                    <span className="bg-blue-50 text-primary px-2 py-1 rounded text-xs font-semibold">
                      {p.category}
                    </span>
                  </td>
                  <td className="p-3 text-center">
                    <span className="bg-amber-50 text-accent font-bold px-2 py-0.5 rounded text-xs">
                      {p.year}
                    </span>
                  </td>
                  <td className="p-3 text-center space-x-2 whitespace-nowrap">
                    <button
                      onClick={() => openEditForm(idx)}
                      className="bg-blue-500 text-white px-3 py-1 rounded text-xs"
                    >
                      Sửa
                    </button>
                    <button
                      onClick={() => onDeletePost(p.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded text-xs"
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))}
              {posts.length === 0 && (
                <tr>
                  <td colSpan="4" className="p-6 text-center text-slate-400">
                    Chưa có bài viết nào. Bấm "Thêm Mục Mới" để bắt đầu.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-6 flex justify-between items-center pt-4 border-t">
          <button
            onClick={onResetData}
            className="text-xs text-amber-600 hover:underline font-medium"
          >
            🔄 Đặt lại về mẫu ban đầu
          </button>
          <button
            onClick={onClose}
            className="bg-slate-200 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium"
          >
            Đóng
          </button>
        </div>
      </div>

      {formOpen && (
        <PostFormModal
          initial={editIdx === -1 ? null : posts[editIdx]}
          onClose={() => setFormOpen(false)}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
