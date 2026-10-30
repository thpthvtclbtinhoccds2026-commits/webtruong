import { CATEGORIES, SCHOOL_YEARS } from '../data.js';

const HIDE_YEAR_TABS = ['Lịch Sử Hình Thành', 'Ký ước trường xưa'];

export default function Filters({ currentTab, currentYear, onSelectTab, onChangeYear }) {
  const showYearFilter = !HIDE_YEAR_TABS.includes(currentTab);

  return (
    <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 mb-8 border-b pb-4">
      <div className="flex flex-wrap gap-1.5 md:gap-2">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => onSelectTab(cat)}
            className={`px-3 py-1.5 rounded-lg text-xs md:text-sm font-medium transition ${
              currentTab === cat
                ? 'bg-primary text-white shadow'
                : 'bg-white text-slate-600 hover:bg-slate-100 border'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {showYearFilter && (
        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold text-slate-600 uppercase">Năm học:</label>
          <select
            value={currentYear}
            onChange={(e) => onChangeYear(e.target.value)}
            className="border rounded-lg px-3 py-1.5 text-sm bg-white font-medium text-primary outline-none shadow-sm"
          >
            {SCHOOL_YEARS.map((y) => (
              <option key={y} value={y}>
                {y === 'Tất cả' ? 'Tất cả các năm' : y}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
}
