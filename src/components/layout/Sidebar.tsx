'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useSidebarStore } from '@/stores/sidebarStore';
import { useAuthStore } from '@/stores/authStore';
import { useTheme } from '@/components/ThemeProvider';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  LayoutDashboard,
  User,
  Settings,
  Users,
  ShoppingCart,
  Shield,
  Search,
  ChevronRight,
  ChevronDown,
  Mail,
  FileText,
  PanelLeftClose,
  PanelLeft,
  Globe,
  Moon,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';

interface MenuItem {
  id: string;
  label: string;
  icon: React.ElementType;
  href?: string;
  children?: {
    id: string;
    label: string;
    href: string;
  }[];
}

const menuItems: MenuItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
    href: '/',
  },
  {
    id: 'templates',
    label: 'Templates',
    icon: Mail,
    href: '/templates',
  },
  {
    id: 'profile',
    label: 'Public Profile',
    icon: User,
    children: [
      { id: 'overview', label: 'Overview', href: '/profile' },
      { id: 'settings', label: 'Settings', href: '/profile/settings' },
    ],
  },
  {
    id: 'account',
    label: 'My Account',
    icon: Settings,
    children: [
      { id: 'general', label: 'General', href: '/account' },
      { id: 'security', label: 'Security', href: '/account/security' },
    ],
  },
  {
    id: 'network',
    label: 'Network',
    icon: Users,
    children: [
      { id: 'get-started', label: 'Get Started', href: '/network' },
      { id: 'user-cards', label: 'User Cards', href: '/network/cards' },
      { id: 'user-table', label: 'User Table', href: '/network/table' },
    ],
  },
  {
    id: 'store',
    label: 'Store - Client',
    icon: ShoppingCart,
    children: [
      { id: 'products', label: 'Products', href: '/store/products' },
      { id: 'orders', label: 'Orders', href: '/store/orders' },
    ],
  },
  {
    id: 'auth',
    label: 'Authentication',
    icon: Shield,
    children: [
      { id: 'login', label: 'Login', href: '/login' },
      { id: 'register', label: 'Register', href: '/register' },
    ],
  },
];

function SidebarMenuItem({ item, isCollapsed }: { item: MenuItem; isCollapsed: boolean }) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const hasChildren = item.children && item.children.length > 0;
  const isActive = item.href ? pathname === item.href : false;
  const Icon = item.icon;

  const toggleOpen = () => {
    if (!isCollapsed && hasChildren) {
      setIsOpen(!isOpen);
    }
  };

  if (hasChildren) {
    return (
      <div className="mb-1">
        <button
          onClick={toggleOpen}
          className={cn(
            'w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors group',
            'hover:bg-gray-100 dark:hover:bg-gray-800',
            isCollapsed && 'justify-center px-3'
          )}
          title={isCollapsed ? item.label : undefined}
        >
          <Icon className="w-5 h-5 text-gray-500 dark:text-gray-400 flex-shrink-0" />
          {!isCollapsed && (
            <>
              <span className="flex-1 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
                {item.label}
              </span>
              {isOpen ? (
                <ChevronDown className="w-4 h-4 text-gray-500" />
              ) : (
                <ChevronRight className="w-4 h-4 text-gray-500" />
              )}
            </>
          )}
        </button>
        {!isCollapsed && isOpen && item.children && (
          <div className="ml-8 mt-1 space-y-1">
            {item.children.map((child) => (
              <Link
                key={child.id}
                href={child.href}
                className={cn(
                  'block px-4 py-2 rounded-lg text-sm transition-colors',
                  pathname === child.href
                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-medium'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                )}
              >
                {child.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <Link
      href={item.href || '#'}
      className={cn(
        'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors mb-1 group',
        isActive
          ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800',
        isCollapsed && 'justify-center px-3'
      )}
      title={isCollapsed ? item.label : undefined}
    >
      <Icon className={cn(
        'w-5 h-5 flex-shrink-0',
        isActive ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'
      )} />
      {!isCollapsed && (
        <span className="text-sm font-medium">{item.label}</span>
      )}
    </Link>
  );
}

export function Sidebar() {
  const { isCollapsed, toggleSidebar } = useSidebarStore();
  const { user, logout } = useAuthStore();
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [language, setLanguage] = useState('en');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const avatarRef = useRef<HTMLButtonElement>(null);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    router.push('/login');
    setShowUserMenu(false);
  };

  const toggleDarkMode = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        avatarRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        !avatarRef.current.contains(event.target as Node)
      ) {
        setShowUserMenu(false);
      }
    };

    if (showUserMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showUserMenu]);

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 h-screen bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transition-all duration-300 z-50',
        isCollapsed ? 'w-20' : 'w-64'
      )}
    >
      <div className="flex flex-col h-full">
        {/* Header with Avatar and Toggle */}
        <div className={cn(
          'flex items-center gap-3 p-4 border-b border-gray-200 dark:border-gray-800 relative',
          isCollapsed && 'justify-center'
        )}>
          {!isCollapsed && user && (
            <button
              ref={avatarRef}
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-3 flex-1 hover:opacity-80 transition-opacity"
            >
              <Avatar className="h-10 w-10 cursor-pointer">
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold">
                  {getInitials(user.name)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0 text-left">
                <h1 className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                  {user.name}
                </h1>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {user.email}
                </p>
              </div>
            </button>
          )}
          {isCollapsed && user && (
            <button
              ref={avatarRef}
              onClick={() => setShowUserMenu(!showUserMenu)}
            >
              <Avatar className="h-10 w-10 cursor-pointer">
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold">
                  {getInitials(user.name)}
                </AvatarFallback>
              </Avatar>
            </button>
          )}
          {!isCollapsed && (
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              title="Collapse sidebar"
            >
              <PanelLeftClose className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            </button>
          )}

          {/* User Menu Dropdown */}
          {showUserMenu && (
            <div
              ref={dropdownRef}
              className={cn(
                'absolute top-full mt-2 bg-gray-950 border border-gray-800 rounded-lg shadow-xl z-[100] w-80',
                isCollapsed ? 'left-20 ml-2' : 'left-4'
              )}
            >
              {/* Header */}
              <div className="border-b border-gray-800 p-4">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-gradient-to-br from-green-500 to-green-600 text-white font-semibold text-lg">
                      {user && getInitials(user.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 text-left">
                    <h3 className="text-base font-semibold text-white">
                      {user?.name || 'User'}
                    </h3>
                    <p className="text-sm text-gray-400">{user?.email || 'demo@kt.com'}</p>
                  </div>
                </div>
              </div>

              {/* Menu Items */}
              <div className="p-2">
                {/* My Profile */}
                <Link
                  href="/profile"
                  onClick={() => setShowUserMenu(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-800 transition-colors"
                >
                  <User className="w-5 h-5 text-gray-400" />
                  <span className="text-sm text-gray-200">My Profile</span>
                </Link>

                {/* My Template */}
                <Link
                  href="/templates"
                  onClick={() => setShowUserMenu(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-800 transition-colors"
                >
                  <Mail className="w-5 h-5 text-gray-400" />
                  <span className="text-sm text-gray-200">My Template</span>
                </Link>

                {/* Language */}
                <div className="flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-gray-800 transition-colors">
                  <div className="flex items-center gap-3">
                    <Globe className="w-5 h-5 text-gray-400" />
                    <span className="text-sm text-gray-200">Language</span>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => setLanguage('en')}
                      className={cn(
                        'px-3 py-1 rounded-md text-xs font-medium transition-colors',
                        language === 'en'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                      )}
                    >
                      EN
                    </button>
                    <button
                      onClick={() => setLanguage('id')}
                      className={cn(
                        'px-3 py-1 rounded-md text-xs font-medium transition-colors',
                        language === 'id'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                      )}
                    >
                      ID
                    </button>
                  </div>
                </div>

                {/* Dark Mode */}
                <div className="flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-gray-800 transition-colors">
                  <div className="flex items-center gap-3">
                    <Moon className="w-5 h-5 text-gray-400" />
                    <span className="text-sm text-gray-200">Dark Mode</span>
                  </div>
                  <button
                    onClick={toggleDarkMode}
                    className={cn(
                      'relative w-11 h-6 rounded-full transition-colors',
                      theme === 'dark' ? 'bg-blue-600' : 'bg-gray-700'
                    )}
                  >
                    <span
                      className={cn(
                        'absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform',
                        theme === 'dark' && 'translate-x-5'
                      )}
                    />
                  </button>
                </div>
              </div>

              {/* Logout Button */}
              <div className="border-t border-gray-800 p-3">
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  className="w-full justify-center h-11 text-sm font-medium text-gray-200 border-gray-700 hover:bg-gray-800 hover:text-white hover:border-gray-600"
                >
                  Logout
                </Button>
              </div>
            </div>
          )}
        </div>

        {isCollapsed && (
          <div className="p-2 border-b border-gray-200 dark:border-gray-800">
            <button
              onClick={toggleSidebar}
              className="w-full p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              title="Expand sidebar"
            >
              <PanelLeft className="w-5 h-5 text-gray-500 dark:text-gray-400 mx-auto" />
            </button>
          </div>
        )}

        {/* Search Input */}
        {!isCollapsed && (
          <div className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-10 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
              />
            </div>
          </div>
        )}

        {isCollapsed && (
          <div className="p-4 flex justify-center">
            <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
              <Search className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            </button>
          </div>
        )}

        {/* Menu Items */}
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <div className="space-y-1">
            {menuItems.map((item) => (
              <SidebarMenuItem key={item.id} item={item} isCollapsed={isCollapsed} />
            ))}
          </div>
        </nav>

        {/* Footer Info */}
        {!isCollapsed && (
          <div className="p-4 border-t border-gray-200 dark:border-gray-800">
            <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
              <div className="font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">
                Info
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <span>System Online</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
