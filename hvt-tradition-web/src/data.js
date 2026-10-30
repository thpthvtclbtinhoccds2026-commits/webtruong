// ===== Dữ liệu & hằng số của Phòng Truyền Thống Online - THPT Hoàng Văn Thụ =====

export const SCHOOL = {
  name: 'Trường THPT Hoàng Văn Thụ',
  shortName: 'THPT Hoàng Văn Thụ',
  location: 'Phường Vàng Danh, Tỉnh Quảng Ninh',
  foundedYear: 1984,
};

/** Icon SVG (tên) cho từng chuyên mục — thay cho emoji. */
export const CATEGORIES = [
  { id: 'Trang Chủ', icon: 'home' },
  { id: 'Lịch Sử Hình Thành', icon: 'timeline' },
  { id: 'Thầy Cô Tiêu Biểu', icon: 'teacher' },
  { id: 'Thành Tích & Khen Thưởng', icon: 'award' },
  { id: 'Hoạt Động & CLB', icon: 'club' },
  { id: 'Video & Tư Liệu', icon: 'video' },
  { id: 'Ký ước trường xưa', icon: 'letter' },
];

/** Tên chuyên mục thuần (dùng cho form admin & bộ lọc). */
export const CATEGORY_NAMES = CATEGORIES.map((c) => c.id);

/** Các tab không áp dụng bộ lọc năm học. */
export const NO_YEAR_FILTER_TABS = ['Lịch Sử Hình Thành', 'Ký ước trường xưa'];

export const SCHOOL_YEARS = [
  'Tất cả',
  '2026 - 2027',
  '2025 - 2026',
  '2024 - 2025',
  '2023 - 2024',
];

// Banner mặc định: ẢNH THẬT của trường (public/img/banner-a1.jpg — crop 16:9).
export const DEFAULT_BANNER = '/img/banner-a1.jpg';

export const DEFAULT_POSTS = [
  {
    id: 1,
    category: 'Trang Chủ',
    year: '2026 - 2027',
    title: 'Giới thiệu chung về trường THPT Hoàng Văn Thụ',
    content:
      'Trường THPT Hoàng Văn Thụ tọa lạc tại phường Vàng Danh, tỉnh Quảng Ninh, là nơi nuôi dưỡng ước mơ, hoài bão của các thế hệ học sinh.',
    images: ['a1', 'a2'], // key ảnh thật -> tự nối cỡ thumb/card/full
    videos: [],
  },
  {
    id: 2,
    category: 'Lịch Sử Hình Thành',
    year: '1984',
    title: 'Thành lập trường',
    content:
      'Những ngày đầu thành lập nhà trường với nhiều khó khăn, thử thách nhưng đầy lòng nhiệt huyết của các thế hệ thầy cô.',
    images: ['a4'], // ảnh thật trong public/img/
    videos: [],
  },
  {
    id: 3,
    category: 'Ký ước trường xưa',
    year: 'Khóa K12',
    title: 'Tâm sự tuổi hồng - Mãi nhớ Hoàng Văn Thụ',
    content:
      'Ba năm cấp ba trôi qua nhanh như một giấc mơ. Chúc cho mái trường luôn ngập tràn thành công và các bạn luôn giữ mãi ngọn lửa nhiệt huyết!',
    images: ['a7'], // ảnh thật trong public/img/
    videos: [],
  },
];

// Keys lưu localStorage (giống bản index37 để giữ dữ liệu cũ nếu có)
export const APP_VERSION = '2';

export const LS_POSTS_KEY = 'hvt_v37_posts';
export const LS_BANNER_KEY = 'hvt_banner_img';

// ===== Tiện ích =====

// Chuyển link Google Drive sang link xem ảnh trực tiếp.
// Đồng thời cho phép dùng key ảnh cục bộ đã khai báo trong src/assets/images.js
// (vd: "bannerDinhLy") hoặc đường dẫn tĩnh trong public/ (vd: "/img/...").
import { resolveImage } from './assets/images.js';

export function formatGoogleDriveUrl(url) {
  if (!url) return '';
  url = String(url).trim();
  const match = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (match && match[1]) {
    return `https://lh3.googleusercontent.com/d/${match[1]}`;
  }
  // key ảnh local / ảnh trong public/ -> đường dẫn thật sau khi build
  return resolveImage(url);
}

export function normalizeYear(str) {
  if (!str) return '';
  return str.replace(/\s+/g, '').replace(/-/g, '-');
}

// Lấy ảnh đại diện (thumbnail) từ link YouTube
export function getYouTubeThumbnail(url) {
  if (!url) return '';
  const ytRegExp =
    /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const ytMatch = url.match(ytRegExp);
  if (ytMatch && ytMatch[2].length === 11) {
    return `https://img.youtube.com/vi/${ytMatch[2]}/hqdefault.jpg`;
  }
  return '/img/a2-900.jpg'; // ảnh thật của trường thay ảnh minh họa
}

// Kiểm tra mật khẩu admin (mã hóa nhị phân như bản gốc: "hvt admin")
export function verifyAdminPassword(inputStr) {
  const binaryMatrix = [
    '1101000',
    '1110110',
    '1110100',
    '0110010',
    '0110000',
    '0110010',
    '0110110',
    '1000000',
    '1100001',
    '1100100',
    '1101101',
    '1101001',
    '1101110',
  ];
  if (inputStr.length !== binaryMatrix.length) return false;
  for (let i = 0; i < inputStr.length; i++) {
    if (inputStr.charCodeAt(i).toString(2).padStart(7, '0') !== binaryMatrix[i]) {
      return false;
    }
  }
  return true;
}

// Load / save dữ liệu bài viết
export function loadPosts() {
  try {
    const saved =
      JSON.parse(localStorage.getItem(LS_POSTS_KEY)) ||
      JSON.parse(localStorage.getItem('hvt_v34_posts'));
    return Array.isArray(saved) && saved.length ? saved : DEFAULT_POSTS;
  } catch {
    return DEFAULT_POSTS;
  }
}

/** Đếm số mốc / bài viết trong một chuyên mục (dùng cho trang chủ & tab). */
export function countByCategory(posts, category) {
  return posts.filter((p) => p.category === category).length;
}

/** Suy ra khóa gần nhất từ năm học hiện tại và năm thành lập. */
export function estimateCurrentKhoa(yearsSinceFounding = null) {
  const base = yearsSinceFounding ?? new Date().getFullYear() - SCHOOL.foundedYear + 1;
  return `Khóa K${Math.max(1, base)}`;
}

export function savePosts(posts) {
  localStorage.setItem(LS_POSTS_KEY, JSON.stringify(posts));
}

export function loadBanner() {
  const saved = localStorage.getItem(LS_BANNER_KEY);
  // Ảnh người dùng lưu có thể là link Drive cũ đã hỏng -> giữ nguyên;
  // nếu chưa từng lưu thì dùng banner mặc định kèm cache-buster theo version.
  return saved || `${DEFAULT_BANNER}?v=${APP_VERSION}`;
}

export function saveBanner(url) {
  localStorage.setItem(LS_BANNER_KEY, url);
}

export function clearBanner() {
  localStorage.removeItem(LS_BANNER_KEY);
}
