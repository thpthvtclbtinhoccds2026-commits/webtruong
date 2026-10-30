import { useEffect, useMemo, useState } from 'react';
import Header from './components/Header.jsx';
import Banner from './components/Banner.jsx';
import Filters from './components/Filters.jsx';
import { TimelineView, MemoryGrid, PostCard } from './components/PostViews.jsx';
import LoginModal from './components/LoginModal.jsx';
import AdminDashboard from './components/AdminDashboard.jsx';
import {
  DEFAULT_POSTS,
  DEFAULT_BANNER,
  normalizeYear,
  loadPosts,
  savePosts,
  loadBanner,
  saveBanner,
  clearBanner,
} from './data.js';

const NO_YEAR_FILTER_TABS = ['Lịch Sử Hình Thành', 'Ký ước trường xưa'];

export default function App() {
  const [posts, setPosts] = useState(loadPosts);
  const [bannerImage, setBannerImage] = useState(loadBanner);
  const [currentTab, setCurrentTab] = useState('Trang Chủ');
  const [currentYearFilter, setCurrentYearFilter] = useState('Tất cả');
  const [showLogin, setShowLogin] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);

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

  // ===== Admin actions =====
  const openAdminPortal = () => {
    if (sessionStorage.getItem('hvt_logged') === 'true') {
      setShowDashboard(true);
    } else {
      setShowLogin(true);
    }
  };

  const handleUpdateBanner = (url) => {
    setBannerImage(url);
    saveBanner(url);
  };

  const handleAddPost = (post) => {
    const next = [post, ...posts];
    setPosts(next);
    savePosts(next);
  };

  const handleUpdatePost = (idx, data) => {
    const next = posts.map((p, i) => (i === idx ? { ...p, ...data } : p));
    setPosts(next);
    savePosts(next);
  };

  const handleDeletePost = (id) => {
    if (confirm('Hành động này sẽ xóa mục này. Bạn có chắc chắn không?')) {
      const next = posts.filter((p) => p.id !== id);
      setPosts(next);
      savePosts(next);
    }
  };

  const handleResetData = () => {
    if (confirm('Hành động này sẽ khôi phục lại dữ liệu mẫu ban đầu. Bạn có chắc chắn không?')) {
      setPosts(DEFAULT_POSTS);
      setBannerImage(DEFAULT_BANNER);
      savePosts(DEFAULT_POSTS);
      clearBanner();
      setShowDashboard(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header onOpenAdmin={openAdminPortal} />

      <Banner bannerImage={bannerImage} />

      {/* KHU VỰC HIỂN THỊ NỘI DUNG */}
      <main className="max-w-7xl mx-auto px-4 py-10 w-full flex-1">
        <Filters
          currentTab={currentTab}
          currentYear={currentYearFilter}
          onSelectTab={setCurrentTab}
          onChangeYear={setCurrentYearFilter}
        />

        {filteredPosts.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl border border-dashed">
            <p className="text-slate-400">Chưa có nội dung nào cho mục này.</p>
          </div>
        ) : currentTab === 'Lịch Sử Hình Thành' ? (
          <TimelineView posts={filteredPosts} />
        ) : currentTab === 'Ký ước trường xưa' ? (
          <MemoryGrid posts={filteredPosts} />
        ) : (
          <div className="space-y-10">
            {filteredPosts.map((post) => (
              <PostCard key={post.id} post={post} currentTab={currentTab} />
            ))}
          </div>
        )}
      </main>

      {/* FOOTER */}
      <footer className="bg-slate-900 text-white py-8 px-4 mt-16 text-center text-sm">
        <p className="font-semibold">
          Trường THPT Hoàng Văn Thụ - Phường Vàng Danh, Tỉnh Quảng Ninh
        </p>
        <p className="text-slate-400 mt-1">
          Phòng truyền thống online quản trị bởi Admin nhà trường. |{' '}
          <span className="text-accent font-medium">SĐT/Zalo liên hệ Admin: 0988.xxx.xxx</span>
        </p>
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
          posts={posts}
          bannerImage={bannerImage}
          onClose={() => setShowDashboard(false)}
          onUpdateBanner={handleUpdateBanner}
          onAddPost={handleAddPost}
          onUpdatePost={handleUpdatePost}
          onDeletePost={handleDeletePost}
          onResetData={handleResetData}
        />
      )}
    </div>
  );
}
