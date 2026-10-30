/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#1e3a8a', // Xanh dương đậm truyền thống (đồng phục / cờ)
        accent: '#b45309', // Vàng đồng (giấy cũ, huy hiệu) — đạt tương phản trên nền trắng
        paper: '#faf7f2', // Nền "giấy lưu trữ"
        ink: '#1c1917', // Màu chữ chính
      },
      fontFamily: {
        sans: ['"Be Vietnam Pro"', 'Inter', 'system-ui', 'sans-serif'],
        serif: ['"Playfair Display"', 'Georgia', '"Times New Roman"', 'serif'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(28,25,23,0.06), 0 12px 32px -18px rgba(28,25,23,0.35)',
        lift: '0 2px 4px rgba(28,25,23,0.08), 0 24px 48px -24px rgba(28,25,23,0.45)',
      },
    },
  },
  plugins: [],
};
