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
        <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-blue-100 selection:text-blue-900 overflow-hidden">
            {/* Background Gradients */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-indigo-200/40 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-rose-200/40 rounded-full blur-[120px]" />
                <div className="absolute top-[40%] left-[40%] w-[400px] h-[400px] bg-amber-100/40 rounded-full blur-[100px]" />
            </div>
            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm lg:hidden"
                        onClick={() => setIsMobileMenuOpen(false)}
                    />
                )}
            </AnimatePresence>

            {/* Sidebar - Desktop & Mobile */}
            <motion.aside
                className={cn(
                    "fixed top-0 left-0 z-50 h-full w-72 border-r border-slate-200 bg-white/95 backdrop-blur-xl transition-transform duration-300 lg:translate-x-0",
                    isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
                )}
            >
                <div className="flex h-full flex-col">
                    {/* Logo */}
                    <div className="flex h-16 items-center justify-between border-b border-slate-200 px-6">
                        <Link to="/dashboard" className="flex items-center gap-2 font-bold text-xl tracking-tight">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 shadow-lg shadow-blue-200">
                                <span className="text-white">R</span>
                            </div>
                            <span className="bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent">
                                Roxiler
                            </span>
                        </Link>
                        <button
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="lg:hidden text-slate-500 hover:text-slate-900"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* User Info */}
                    <div className="p-6">
                        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                                    <User size={20} />
                                </div>
                                <div className="overflow-hidden">
                                    <p className="truncate font-medium text-slate-900">{user?.email}</p>
                                    <p className="truncate text-xs text-slate-500">{user?.role}</p>
                                </div>
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
                                        "group flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all duration-200",
                                        isActive
                                            ? "bg-blue-600 text-white shadow-lg shadow-blue-200"
                                            : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                                    )}
                                >
                                    <Icon size={18} className={cn("transition-colors", isActive ? "text-white" : "text-slate-400 group-hover:text-slate-600")} />
                                    {item.label}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Logout */}
                    <div className="border-t border-slate-200 p-4">
                        <Button
                            variant="ghost"
                            className="w-full justify-start gap-3 text-red-600 hover:bg-red-50 hover:text-red-700"
                            onClick={handleLogout}
                        >
                            <LogOut size={18} />
                            Sign Out
                        </Button>
                    </div>
                </div>
            </motion.aside>

            {/* Main Content */}
            <div className="lg:pl-72 relative z-10">
                {/* Topbar - Mobile Only */}
                <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-slate-200 bg-white/80 px-4 backdrop-blur-xl lg:hidden">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setIsMobileMenuOpen(true)}
                            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                        >
                            <Menu size={20} />
                        </button>
                        <span className="font-semibold text-slate-900">Roxiler Systems</span>
                    </div>
                </header>

                {/* Page Content */}
                <main className="p-4 lg:p-8">
                    <div className="mx-auto max-w-7xl animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
}
