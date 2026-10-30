// ---------------------------------------------------------------------------
// src/assets/images.js  –  Bản đồ ảnh của website
// ---------------------------------------------------------------------------
// Cách dùng (khuyên dùng): thả file ảnh thật vào thư mục `src/assets/img/`
// rồi khai báo ở IMG dưới dạng:  tenKey: new URL('./img/ten-file.jpg', import.meta.url)
// Vite sẽ tự đóng gói (bundle) + đặt tên file có hash khi build.
//
// Nếu repo chưa có file ảnh, web vẫn chạy tốt: mọi chỗ thiếu ảnh sẽ rơi vào
// fallback placeholder (xem resolveImage() cuối file này).
// ---------------------------------------------------------------------------

/** Danh sách ảnh "thật" của trường đã có trong repo (bundle qua Vite). */
export const IMG = {
  // Ví dụ — bỏ comment sau khi copy file ảnh vào src/assets/img/:
  // bannerDinhLy: new URL('./img/banner-dinh-ly-tu-dong.jpg', import.meta.url).href,
  // logoHvt: new URL('./img/logo-hvt.png', import.meta.url).href,
};

/** Ảnh tĩnh đặt trong thư mục `public/` (vd: public/img/...) — giữ nguyên đường dẫn. */
export const PUBLIC_IMG = {
  // vd: anhHoatDong: '/img/hoat-dong-2019.jpg',
};

const PLACEHOLDER =
  'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80';

/**
 * Chọn nguồn ảnh theo thứ tự ưu tiên:
 * 1) key khớp với IMG (ảnh bundle trong src/assets/img)
 * 2) key khớp với PUBLIC_IMG (ảnh trong public/)
 * 3) link http(s)/relative/data/blob mà người dùng dán (Google Drive, YouTube, ...)
 * 4) placeholder — luôn trả về chuỗi hợp lệ, không bao giờ rỗng
 */
export function resolveImage(keyOrUrl) {
  if (!keyOrUrl || typeof keyOrUrl !== 'string') return PLACEHOLDER;
  if (IMG[keyOrUrl]) return IMG[keyOrUrl];
  if (PUBLIC_IMG[keyOrUrl]) return PUBLIC_IMG[keyOrUrl];
  if (/^(https?:|\/|data:|blob:)/i.test(keyOrUrl)) return keyOrUrl;
  return PLACEHOLDER;
}

export function hasLocalImages() {
  return Object.keys(IMG).length > 0 || Object.keys(PUBLIC_IMG).length > 0;
}

export { PLACEHOLDER };
