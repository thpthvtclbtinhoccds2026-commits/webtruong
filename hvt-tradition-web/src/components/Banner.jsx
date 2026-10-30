import { formatGoogleDriveUrl } from '../data.js';

export default function Banner({ bannerImage }) {
  return (
    <section className="relative text-white py-14 px-4 text-center bg-primary overflow-hidden min-h-[300px] flex flex-col justify-start">
      <div className="absolute inset-0 z-0">
        <img
          src={formatGoogleDriveUrl(bannerImage)}
          alt="Trường THPT Hoàng Văn Thụ"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/30"></div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto pt-2">
        <span className="bg-accent/90 text-white text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider shadow">
          Không Gian Số Hóa
        </span>
        <h2 className="text-3xl md:text-5xl font-bold mt-2 mb-2 drop-shadow-lg">
          Phòng Truyền Thống Online
        </h2>
        <p className="text-slate-100 text-sm md:text-base max-w-2xl mx-auto drop-shadow-md">
          Lưu giữ ngọn lửa truyền thống hiếu học, sáng tạo và tự hào của các thế hệ thầy và trò
          trường THPT Hoàng Văn Thụ, Vàng Danh, Quảng Ninh.
        </p>
      </div>
    </section>
  );
}
