import { useEffect, useMemo, useState } from 'react';
import Header from './components/Header.jsx';
import Banner from './components/Banner.jsx';
import Filters from './components/Filters.jsx';
import { TimelineView, MemoryGrid, PostCard, HomeIntro } from './components/PostViews.jsx';
import LoginModal from './components/LoginModal.jsx';
import AdminDashboard from './components/AdminDashboard.jsx';
import PostFormModal from './components/PostFormModal.jsx';
import { normalizeYear, SCHOOL } from './data.js';
import {
  SEED_DATA,
  loadSiteData,
  saveSiteData,
  replaceSiteData,
} from './storage.js';

const NO_YEAR_FILTER_TABS = ['Lịch Sử Hình Thành', 'Ký ức trường xưa'];

/** Khối hiển thị khi một chuyên mục chưa có bài viết. */
function EmptyState({ tab }) {
  return (
    <div
      role="status"
      className="rounded-xl border border-dashed border-stone-300 bg-white/70 px-6 py-16 text-center"
    >
      <p className="font-serif text-lg font-bold text-primary">
        Chuyên mục “{tab}” chưa có bài viết
      </p>
      <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-stone-500">
        Đây là chỗ trống dành cho tư liệu thật của nhà trường: ảnh chụp các thế hệ thầy trò,
        giấy khen, video hoạt động… Bạn có thể thêm nội dung ở chế độ Quản Trị, hoặc thả file
        ảnh vào thư mục <code className="rounded bg-stone-100 px-1">src/assets/img/</code> của repo.
      </p>
    </div>
  );
}

export default function App() {
  const [site, setSite] = useState(loadSiteData);
  const posts = site.posts;
  const bannerImage = site.banner;
  const [currentTab, setCurrentTab] = useState('Trang Chủ');
  const [currentYearFilter, setCurrentYearFilter] = useState('Tất cả');
  const [showLogin, setShowLogin] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  const [addingPost, setAddingPost] = useState(false);

  // Nút menu trên header (dispatch event) -> đổi tab
  useEffect(() => {
    const handler = (e) => setCurrentTab(e.detail);
    window.addEventListener('hvt:filter-tab', handler);
    return () => window.removeEventListener('hvt:filter-tab', handler);
  }, []);

  // Lọc & sắp xếp bài viết theo tab + năm học
  const filteredPosts = useMemo(() => {
    let filtered = posts.filter((p) => {
      const matchCat = p.category === currentTab;
      const matchYear =
        currentYearFilter === 'Tất cả' ||
        normalizeYear(p.year) === normalizeYear(currentYearFilter);
      return (
        matchCat &&
        (NO_YEAR_FILTER_TABS.includes(currentTab) || matchYear)
      );
    });

    if (currentTab === 'Lịch Sử Hình Thành') {
      filtered = [...filtered].sort((a, b) =>
        String(a.year).localeCompare(String(b.year), undefined, { numeric: true }),
      );
    } else {
      filtered = [...filtered].sort(
        (a, b) => String(b.year).localeCompare(String(a.year)) || b.id - a.id,
      );
    }
    return filtered;
  }, [posts, currentTab, currentYearFilter]);

  // ===== Admin actions (mọi thay đổi đều lưu tập trung qua storage.js) =====
  const commit = (next) => {
    const saved = saveSiteData(next);
    setSite(saved);
    return saved;
  };

  const openAdminPortal = () => {
    if (sessionStorage.getItem('hvt_logged') === 'true') setShowDashboard(true);
    else setShowLogin(true);
  };

  const handleUpdateBanner = (url) => commit({ ...site, banner: url });

  const handleAddPost = () => {
    setShowDashboard(false);
    setAddingPost(true);
  };

  const handleSaveNewPost = (post) => {
    commit({ ...site, posts: [post, ...site.posts] });
    setAddingPost(false);
    setShowDashboard(true);
  };

  const handleUpdatePost = (updated) =>
    commit({ ...site, posts: site.posts.map((p) => (p.id === updated.id ? updated : p)) });

  const handleDeletePost = (id) =>
    commit({ ...site, posts: site.posts.filter((p) => p.id !== id) });

  const handleUpdateSchool = (school) => commit({ ...site, school });

  /** Khôi phục nội dung mẫu ban đầu (không đụng tới mật khẩu quản trị). */
  const handleResetData = () =>
    replaceSiteData({ ...structuredClone(SEED_DATA), password: localStorage.getItem('hvt_admin_password_v1') });

  /** Import file JSON dự phòng -> reload để mọi ảnh/link được đọc lại từ đầu. */
  const handleReplaceAll = (data) => {
    replaceSiteData(data);
    window.location.reload();
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header logoRef={site.logo} currentTab={currentTab} onNavigate={setCurrentTab} onOpenAdmin={openAdminPortal} />

      <Banner bannerImage={bannerImage} />

      {/* KHU VỰC HIỂN THỊ NỘI DUNG */}
      <main className="max-w-7xl mx-auto px-4 py-10 w-full flex-1">
        <Filters
          currentTab={currentTab}
          currentYear={currentYearFilter}
          onSelectTab={setCurrentTab}
          onChangeYear={setCurrentYearFilter}
        />

        <div id="panel-noi-dung" role="tabpanel" aria-labelledby={`tab-${currentTab}`} tabIndex={-1}>
          {filteredPosts.length === 0 ? (
            <EmptyState tab={currentTab} />
          ) : currentTab === 'Lịch Sử Hình Thành' ? (
            <TimelineView posts={filteredPosts} />
          ) : currentTab === 'Ký ức trường xưa' ? (
            <MemoryGrid posts={filteredPosts} />
          ) : (
            <div className="space-y-10">
              {currentTab === 'Trang Chủ' && (
                <HomeIntro posts={posts} onSelectTab={setCurrentTab} />
              )}
              {filteredPosts.map((post) => (
                <PostCard key={post.id} post={post} currentTab={currentTab} />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* FOOTER */}
      <footer className="no-print mt-16 border-t-4 border-accent bg-primary text-blue-50">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <p className="font-serif text-lg font-bold text-white">{SCHOOL.name}</p>
            <p className="mt-2 text-sm leading-relaxed text-blue-100/80">
              {SCHOOL.location} — nơi nuôi dưỡng ước mơ của nhiều thế hệ học sinh.{' '}
              {`Thành lập năm ${SCHOOL.foundedYear}.`}
            </p>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-accent">Liên hệ</p>
            <p className="mt-3 text-sm text-blue-100/80">
              Phòng truyền thống online do Ban Giám hiệu quản trị.
            </p>
            <p className="mt-1 text-sm">
              <span className="font-semibold text-white">SĐT/Zalo:</span>{' '}
              <a className="underline underline-offset-4 hover:text-white" href={`tel:${String(SCHOOL.contactPhone || '').replace(/\s+/g, '')}`}>
                {SCHOOL.contactPhone}
              </a>
            </p>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-accent">Bản quyền</p>
            <p className="mt-3 text-sm leading-relaxed text-blue-100/80">
              {SCHOOL.credit}
              Toàn bộ tư liệu, hình ảnh thuộc quyền quản lý của {SCHOOL.shortName}.
            </p>
          </div>
        </div>
        <div className="border-t border-white/10 px-4 py-4 text-center text-xs text-blue-100/60">
          © {new Date().getFullYear()} {SCHOOL.shortName}. Lưu giữ truyền thống hiếu học, sáng tạo và tự hào.
        </div>
      </footer>

      {showLogin && (
        <LoginModal
          onClose={() => setShowLogin(false)}
          onSuccess={() => {
            setShowLogin(false);
            setShowDashboard(true);
          }}
        />
      )}

      {showDashboard && (
        <AdminDashboard
          site={site}
          onClose={() => setShowDashboard(false)}
          onLogout={() => {
            sessionStorage.removeItem('hvt_logged');
            setShowDashboard(false);
          }}
          onChangeBanner={handleUpdateBanner}
          onAddPost={handleAddPost}
          onUpdatePost={handleUpdatePost}
          onDeletePost={handleDeletePost}
          onChangeSchool={handleUpdateSchool}
          onReplaceAll={handleReplaceAll}
          onResetSeed={handleResetData}
        />
      )}
    </div>
  );
}
