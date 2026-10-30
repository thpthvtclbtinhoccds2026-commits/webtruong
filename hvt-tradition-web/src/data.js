// ===== Dữ liệu & hằng số của Phòng Truyền Thống Online - THPT Hoàng Văn Thụ =====

export const CATEGORIES = [
  'Trang Chủ',
  'Lịch Sử Hình Thành',
  'Thầy Cô Tiêu Biểu',
  'Thành Tích & Khen Thưởng',
  'Hoạt Động & CLB',
  'Video & Tư Liệu',
  'Ký ước trường xưa',
];

export const SCHOOL_YEARS = [
  'Tất cả',
  '2026 - 2027',
  '2025 - 2026',
  '2024 - 2025',
  '2023 - 2024',
];

export const DEFAULT_BANNER =
  'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=1600&q=80';

export const DEFAULT_POSTS = [
  {
    id: 1,
    category: 'Trang Chủ',
    year: '2026 - 2027',
    title: 'Giới thiệu chung về trường THPT Hoàng Văn Thụ',
    content:
      'Trường THPT Hoàng Văn Thụ tọa lạc tại phường Vàng Danh, tỉnh Quảng Ninh, là nơi nuôi dưỡng ước mơ, hoài bão của các thế hệ học sinh.',
    images: [
      'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=800&q=80',
    ],
    videos: [],
  },
  {
    id: 2,
    category: 'Lịch Sử Hình Thành',
    year: '1984',
    title: 'Thành lập trường',
    content:
      'Những ngày đầu thành lập nhà trường với nhiều khó khăn, thử thách nhưng đầy lòng nhiệt huyết của các thế hệ thầy cô.',
    images: [
      'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=800&q=80',
    ],
    videos: [],
  },
  {
    id: 3,
    category: 'Ký ước trường xưa',
    year: 'Khóa K12',
    title: 'Tâm sự tuổi hồng - Mãi nhớ Hoàng Văn Thụ',
    content:
      'Ba năm cấp ba trôi qua nhanh như một giấc mơ. Chúc cho mái trường luôn ngập tràn thành công và các bạn luôn giữ mãi ngọn lửa nhiệt huyết!',
    images: [
      'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80',
    ],
    videos: [],
  },
];

// Keys lưu localStorage (giống bản index37 để giữ dữ liệu cũ nếu có)
export const LS_POSTS_KEY = 'hvt_v37_posts';
export const LS_BANNER_KEY = 'hvt_banner_img';

// ===== Tiện ích =====

// Chuyển link Google Drive sang link xem ảnh trực tiếp
export function formatGoogleDriveUrl(url) {
  if (!url) return '';
  url = url.trim();
  const match = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (match && match[1]) {
    return `https://lh3.googleusercontent.com/d/${match[1]}`;
  }
  return url;
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
  return 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80';
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
    return saved ?? DEFAULT_POSTS;
  } catch {
    return DEFAULT_POSTS;
  }
}

export function savePosts(posts) {
  localStorage.setItem(LS_POSTS_KEY, JSON.stringify(posts));
}

export function loadBanner() {
  return localStorage.getItem(LS_BANNER_KEY) || DEFAULT_BANNER;
}

export function saveBanner(url) {
  localStorage.setItem(LS_BANNER_KEY, url);
}

export function clearBanner() {
  localStorage.removeItem(LS_BANNER_KEY);
}
