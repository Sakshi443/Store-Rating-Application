import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    LogOut,
    Menu,
    Shield,
    Store,
    User,
    X
} from 'lucide-react';
import { Button } from '../components/Button';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export default function Layout() {
    const { user, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navItems = [
        {
            label: 'Dashboard',
            path: '/dashboard',
            icon: LayoutDashboard,
            roles: ['Normal User', 'System Administrator', 'Store Owner']
        },
        {
            label: 'Admin Panel',
            path: '/admin',
            icon: Shield,
            roles: ['System Administrator']
        },
        {
            label: 'Store Manager',
            path: '/owner/manage',
            icon: Store,
            roles: ['Store Owner', 'System Administrator']
        },
    ];

    const filteredNavItems = navItems.filter(item =>
        user && item.roles.includes(user.role)
    );

    return (
        <div className="min-h-screen bg-white text-black selection:bg-[#FFDA1A] selection:text-black overflow-hidden font-sans">
            {/* Background - Clean White/Gray, no gradients */}
            <div className="fixed inset-0 z-0 bg-gray-50/50 pointer-events-none" />

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm lg:hidden"
                        onClick={() => setIsMobileMenuOpen(false)}
                    />
                )}
            </AnimatePresence>

            {/* Sidebar - Desktop & Mobile */}
            <motion.aside
                className={cn(
                    "fixed top-0 left-0 z-50 h-full w-72 border-r border-gray-200 bg-white transition-transform duration-300 lg:translate-x-0 ease-in-out font-medium",
                    isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
                )}
            >
                <div className="flex h-full flex-col">
                    {/* Logo */}
                    <div className="flex h-20 items-center justify-between border-b border-gray-100 px-8">
                        <Link to="/dashboard" className="flex items-center gap-3 font-black text-xl tracking-tighter text-black hover:opacity-80 transition-opacity">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#111]">
                                <span className="text-[#FFDA1A] font-bold">S</span>
                            </div>
                            <span>
                                StoreRate.
                            </span>
                        </Link>
                        <button
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="lg:hidden text-gray-400 hover:text-black transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* User Info */}
                    <div className="p-6">
                        <div className="rounded-xl border border-gray-100 bg-gray-50/50 p-4 flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white border border-gray-200 text-black shadow-sm">
                                <User size={18} strokeWidth={2.5} />
                            </div>
                            <div className="overflow-hidden">
                                <p className="truncate font-bold text-sm text-[#111]">{user?.email?.split('@')[0]}</p>
                                <p className="truncate text-[10px] uppercase tracking-wider font-bold text-gray-400">{user?.role}</p>
                            </div>
                        </div>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 space-y-1 px-4 py-2">
                        {filteredNavItems.map((item) => {
                            const isActive = location.pathname === item.path;
                            const Icon = item.icon;

                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={cn(
                                        "group flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-bold transition-all duration-200",
                                        isActive
                                            ? "bg-[#FFDA1A] text-black shadow-md shadow-[#FFDA1A]/20"
                                            : "text-gray-500 hover:bg-gray-100 hover:text-black"
                                    )}
                                >
                                    <Icon size={18} strokeWidth={2.5} className={cn("transition-colors", isActive ? "text-black" : "text-gray-400 group-hover:text-black")} />
                                    {item.label}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Logout */}
                    <div className="border-t border-gray-100 p-4">
                        <Button
                            variant="ghost"
                            className="w-full justify-start gap-3 text-red-600 hover:bg-red-50 hover:text-red-700 font-bold"
                            onClick={handleLogout}
                        >
                            <LogOut size={18} strokeWidth={2.5} />
                            Sign Out
                        </Button>
                    </div>
                </div>
            </motion.aside>

            {/* Main Content */}
            <div className="lg:pl-72 relative z-10">
                {/* Topbar - Mobile Only */}
                <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-gray-200 bg-white/80 px-4 backdrop-blur-xl lg:hidden">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setIsMobileMenuOpen(true)}
                            className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-black transition-colors"
                        >
                            <Menu size={24} />
                        </button>
                        <span className="font-black text-lg tracking-tight text-[#111]">StoreRate.</span>
                    </div>
                </header>

                {/* Page Content */}
                <main className="p-4 lg:p-8 min-h-[calc(100vh-4rem)]">
                    <div className="mx-auto max-w-7xl animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
}
