import { Link, Outlet, useLocation } from 'react-router-dom';
import { BookOpen, Home, Search, Sparkles, User, MessageSquare, LogIn, LogOut } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export function Layout() {
  const location = useLocation();
  const { user, logout, isAuthenticated } = useAuth();

  const navItems = [
    { path: '/', icon: Home, label: 'Главная' },
    { path: '/catalog', icon: Search, label: 'Каталог' },
    { path: '/ai-match', icon: Sparkles, label: 'AI-подбор' },
    { path: '/profile', icon: User, label: 'Профиль' },
    { path: '/exchange', icon: MessageSquare, label: 'Обмены' },
  ];

  return (
    <div className="min-h-screen bg-[#FDFCFA] flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2">
              <BookOpen className="w-8 h-8 text-[#006D77]" />
              <span className="text-xl font-serif font-semibold text-gray-900">BookSwap</span>
            </Link>

            <nav className="hidden md:flex items-center gap-6">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-[#006D77] text-white'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}

              {isAuthenticated ? (
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg">
                    <div className="w-8 h-8 bg-gradient-to-br from-[#006D77] to-[#83C5BE] rounded-full flex items-center justify-center text-white text-sm font-semibold">
                      {user?.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-sm font-medium text-gray-900">{user?.name}</span>
                  </div>
                  <button
                    onClick={logout}
                    className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <LogOut className="w-5 h-5" />
                    <span>Выйти</span>
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="flex items-center gap-2 px-4 py-2 bg-[#006D77] text-white rounded-lg hover:bg-[#005962] transition-colors font-medium"
                >
                  <LogIn className="w-5 h-5" />
                  <span>Войти</span>
                </Link>
              )}
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Mobile Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
        <div className="flex items-center justify-around py-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg ${
                  isActive ? 'text-[#006D77]' : 'text-gray-600'
                }`}
              >
                <Icon className="w-6 h-6" />
                <span className="text-xs">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
