import { useState } from 'react';
import { verifyAdminPassword } from '../data.js';

// MODAL ĐĂNG NHẬP ADMIN
export default function LoginModal({ onClose, onSuccess }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (verifyAdminPassword(password)) {
      sessionStorage.setItem('hvt_logged', 'true');
      setPassword('');
      setError('');
      onSuccess();
    } else {
      setError('Sai mật khẩu đăng nhập!');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 font-bold text-xl"
          aria-label="Đóng"
        >
          &times;
        </button>
        <div className="text-center mb-6">
          <div className="bg-primary text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 font-bold text-lg">
            🔒
          </div>
          <h3 className="text-xl font-bold text-primary">Đăng Nhập Quản Trị Admin</h3>
          <p className="text-xs text-slate-500 mt-1">Hệ thống quản trị viên nhà trường</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">
              Mật khẩu Admin:
            </label>
            <input
              type="password"
              required
              autoFocus
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError('');
              }}
              className="w-full border rounded-lg px-3 py-2 text-sm outline-none"
              placeholder="Nhập mật khẩu..."
            />
            {error && <p className="text-red-600 text-xs mt-2 font-medium">⚠️ {error}</p>}
          </div>
          <button
            type="submit"
            className="w-full bg-primary hover:bg-blue-900 text-white py-2.5 rounded-lg font-semibold text-sm shadow transition"
          >
            Xác Nhận Đăng Nhập
          </button>
        </form>
      </div>
    </div>
  );
}
