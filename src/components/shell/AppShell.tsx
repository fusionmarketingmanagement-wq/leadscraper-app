import { useState, useEffect, type ReactNode } from 'react';
import { getBrowserClient } from '../../lib/supabase';
import {
  MAIN_NAV,
  INSIGHTS_NAV,
  BOTTOM_NAV,
  getPageTitle,
  isNavItemActive,
  isLeadScraperActive,
  type NavItem,
} from '../../lib/dashboard-nav';
import NavIcon from './NavIcon';

const STORAGE_KEY = 'leadscraper-sidebar-collapsed';

interface Props {
  pathname: string;
  userName: string;
  userEmail?: string;
  supabaseUrl?: string;
  supabaseKey?: string;
  pageTitle?: string;
  children: ReactNode;
}

function userInitials(name: string, email?: string): string {
  const source = name.trim() || email?.split('@')[0] || 'U';
  const parts = source.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return source.slice(0, 2).toUpperCase();
}

function LogoMark({ size = 28 }: { size?: number }) {
  return (
    <div
      className="rounded-lg flex items-center justify-center shrink-0"
      style={{
        width: size,
        height: size,
        background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 60%, #a855f7 100%)',
      }}
    >
      <svg width={size * 0.46} height={size * 0.46} viewBox="0 0 24 24" fill="none">
        <path
          d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z"
          fill="white"
          fillOpacity="0.95"
        />
        <circle cx="12" cy="10" r="3" fill="white" fillOpacity="0.45" />
      </svg>
    </div>
  );
}

function SidebarLink({
  item,
  pathname,
  collapsed,
  expanded,
  onToggleExpand,
  onExpandSidebar,
}: {
  item: NavItem;
  pathname: string;
  collapsed: boolean;
  expanded?: boolean;
  onToggleExpand?: () => void;
  onExpandSidebar?: () => void;
}) {
  const hasChildren = Boolean(item.children?.length);
  const active = hasChildren ? isLeadScraperActive(pathname) : isNavItemActive(pathname, item.href);

  if (hasChildren) {
    return (
      <div>
        <button
          type="button"
          onClick={() => {
            if (collapsed) onExpandSidebar?.();
            else onToggleExpand?.();
          }}
          title={collapsed ? item.label : undefined}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all cursor-pointer border-l-2 ${
            active
              ? 'bg-white/10 text-white border-cyan-400'
              : 'text-gray-400 hover:text-white hover:bg-white/5 border-transparent'
          } ${collapsed ? 'justify-center px-2' : ''}`}
        >
          <NavIcon name={item.icon} className="w-5 h-5 shrink-0" />
          {!collapsed && (
            <>
              <span className="flex-1 text-left font-medium">{item.label}</span>
              <NavIcon
                name="chevron-down"
                className={`w-4 h-4 shrink-0 transition-transform ${expanded ? 'rotate-180' : ''}`}
              />
            </>
          )}
        </button>
        {!collapsed && expanded && item.children && (
          <div className="mt-1 ml-4 pl-3 border-l border-white/10 space-y-0.5">
            {item.children.map((child) => {
              const childActive = isNavItemActive(pathname, child.href);
              return (
                <a
                  key={child.href}
                  href={child.href}
                  className={`block px-3 py-2 rounded-md text-sm transition-all no-underline ${
                    childActive
                      ? 'text-cyan-400 bg-cyan-400/10 font-medium'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {child.label}
                </a>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  return (
    <a
      href={item.href}
      title={collapsed ? item.label : undefined}
      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all no-underline border-l-2 ${
        active
          ? 'bg-white/10 text-white border-cyan-400'
          : 'text-gray-400 hover:text-white hover:bg-white/5 border-transparent'
      } ${collapsed ? 'justify-center px-2' : ''}`}
    >
      <NavIcon name={item.icon} className="w-5 h-5 shrink-0" />
      {!collapsed && <span className="font-medium">{item.label}</span>}
    </a>
  );
}

export default function AppShell({
  pathname,
  userName,
  userEmail,
  supabaseUrl,
  supabaseKey,
  pageTitle,
  children,
}: Props) {
  const [collapsed, setCollapsed] = useState(false);
  const [leadsExpanded, setLeadsExpanded] = useState(true);
  const [mounted, setMounted] = useState(false);

  const title = pageTitle ?? getPageTitle(pathname);
  const initials = userInitials(userName, userEmail);
  const sidebarWidth = collapsed ? 64 : 240;

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'true') setCollapsed(true);
    if (isLeadScraperActive(pathname)) setLeadsExpanded(true);
    setMounted(true);
  }, [pathname]);

  useEffect(() => {
    if (!mounted) return;
    localStorage.setItem(STORAGE_KEY, String(collapsed));
  }, [collapsed, mounted]);

  async function handleSignOut() {
    if (!supabaseUrl || !supabaseKey) {
      window.location.assign('/');
      return;
    }
    const supabase = getBrowserClient(supabaseUrl, supabaseKey);
    await supabase.auth.signOut();
    window.location.assign('/');
  }

  return (
    <div className="min-h-screen bg-[#f9fafb]">
      {/* Sidebar */}
      <aside
        className="fixed inset-y-0 left-0 z-40 flex flex-col bg-[#0f0f0f] transition-all duration-300 ease-in-out"
        style={{ width: sidebarWidth }}
      >
        {/* Logo + collapse */}
        <div
          className={`flex items-center h-14 shrink-0 border-b border-white/10 ${
            collapsed ? 'justify-center px-2' : 'justify-between px-4'
          }`}
        >
          <a href="/dashboard" className="flex items-center gap-2.5 no-underline min-w-0">
            <LogoMark />
            {!collapsed && (
              <span className="font-semibold text-white text-sm tracking-tight truncate">
                LeadScraper
              </span>
            )}
          </a>
          {!collapsed && (
            <button
              type="button"
              onClick={() => setCollapsed(true)}
              className="p-1.5 rounded-md text-gray-500 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              aria-label="Collapse sidebar"
            >
              <NavIcon name="chevron-left" className="w-4 h-4" />
            </button>
          )}
        </div>

        {collapsed && (
          <button
            type="button"
            onClick={() => setCollapsed(false)}
            className="mx-auto mt-2 p-1.5 rounded-md text-gray-500 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Expand sidebar"
          >
            <NavIcon name="chevron-right" className="w-4 h-4" />
          </button>
        )}

        {/* Main nav */}
        <nav className="flex-1 overflow-y-auto overflow-x-hidden py-4 px-2 space-y-6">
          {MAIN_NAV.map((section, i) => (
            <div key={i}>
              {!collapsed && (
                <p className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-wider text-gray-500">
                  Main
                </p>
              )}
              <div className="space-y-0.5">
                {section.items.map((item) => (
                  <SidebarLink
                    key={item.href}
                    item={item}
                    pathname={pathname}
                    collapsed={collapsed}
                    expanded={leadsExpanded}
                    onToggleExpand={() => setLeadsExpanded((v) => !v)}
                    onExpandSidebar={() => {
                      setCollapsed(false);
                      setLeadsExpanded(true);
                    }}
                  />
                ))}
              </div>
            </div>
          ))}

          {INSIGHTS_NAV.map((section, i) => (
            <div key={i}>
              {!collapsed && section.title && (
                <p className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-wider text-gray-500">
                  {section.title}
                </p>
              )}
              <div className="space-y-0.5">
                {section.items.map((item) => (
                  <SidebarLink key={item.href} item={item} pathname={pathname} collapsed={collapsed} />
                ))}
              </div>
            </div>
          ))}
        </nav>

        {/* Bottom nav + user */}
        <div className="shrink-0 border-t border-white/10 p-2 space-y-0.5">
          {BOTTOM_NAV.map((item) => (
            <SidebarLink key={item.href} item={item} pathname={pathname} collapsed={collapsed} />
          ))}

          <div
            className={`mt-2 pt-2 border-t border-white/10 ${
              collapsed ? 'flex flex-col items-center gap-2 px-1' : 'px-1'
            }`}
          >
            <div
              className={`flex items-center gap-2.5 ${collapsed ? 'flex-col' : 'px-2 py-2'}`}
            >
              <div
                className="w-8 h-8 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center text-xs font-semibold shrink-0"
                title={userEmail ?? userName}
              >
                {initials}
              </div>
              {!collapsed && (
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-white truncate">{userName}</p>
                  {userEmail && (
                    <p className="text-xs text-gray-500 truncate">{userEmail}</p>
                  )}
                </div>
              )}
            </div>
            {!collapsed ? (
              <button
                type="button"
                onClick={() => void handleSignOut()}
                className="w-full mt-1 px-3 py-2 text-xs font-medium text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors cursor-pointer text-left"
              >
                Sign out
              </button>
            ) : (
              <button
                type="button"
                onClick={() => void handleSignOut()}
                title="Sign out"
                className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* Main column */}
      <div
        className="min-h-screen flex flex-col transition-[margin-left] duration-300 ease-in-out"
        style={{ marginLeft: sidebarWidth }}
      >
        {/* Topbar */}
        <header className="sticky top-0 z-30 h-14 bg-white border-b border-gray-200 shadow-sm flex items-center justify-between px-6 shrink-0">
          <h1 className="text-base font-semibold text-gray-900 tracking-tight">{title}</h1>
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="relative p-2 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors cursor-pointer"
              aria-label="Notifications"
            >
              <NavIcon name="bell" className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-cyan-500 rounded-full" />
            </button>
            <div
              className="w-8 h-8 rounded-full bg-cyan-500/15 text-cyan-600 flex items-center justify-center text-xs font-semibold"
              title={userEmail ?? userName}
            >
              {initials}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
