"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Menu, Bell, User, ChevronDown, LogOut, Settings } from "lucide-react";
import { ThemeToggle } from "@/components/common/ThemeToggle";
import { useAuth } from "@/contexts/AuthContext";

export const Header = ({ onMenuClick, sidebarCollapsed }) => {
    const { user, logout } = useAuth();
    const router = useRouter();
    const [showUserMenu, setShowUserMenu] = useState(false);

    const handleLogout = async () => {
        setShowUserMenu(false);
        await logout();
    };

    return (
        <header
            className="sticky top-0 z-30 h-16 backdrop-blur-sm bg-white/80 dark:bg-gray-900/80"
            style={{
                borderBottom: "1px solid var(--color-border)",
            }}
        >
            <div className="flex items-center justify-between h-full px-4 lg:px-6">
                {/* Left section */}
                <div className="flex items-center gap-4">
                    {/* Mobile menu button */}
                    <button
                        onClick={onMenuClick}
                        className="lg:hidden p-2 rounded-lg transition-all hover:scale-105"
                        style={{
                            color: "var(--color-text-secondary)",
                            backgroundColor:
                                "var(--color-background-secondary)",
                        }}
                        aria-label="Toggle menu"
                    >
                        <Menu className="w-5 h-5" />
                    </button>

                    {/* Page title */}
                    <div>
                        <h2
                            className="text-xl font-bold hidden sm:block"
                            style={{ color: "var(--color-text-primary)" }}
                        >
                            Dashboard
                        </h2>
                    </div>
                </div>

                {/* Right section */}
                <div className="flex items-center gap-2">
                    {/* Theme toggle */}
                    <ThemeToggle />

                    {/* Notifications */}
                    <button
                        className="relative p-2.5 rounded-lg transition-all hover:scale-105"
                        style={{
                            color: "var(--color-text-secondary)",
                            backgroundColor:
                                "var(--color-background-secondary)",
                        }}
                        aria-label="Notifications"
                    >
                        <Bell className="w-5 h-5" />
                        {/* Notification badge */}
                        <span className="absolute top-1.5 right-1.5 min-w-[8px] h-2 px-1 bg-red-500 rounded-full flex items-center justify-center">
                            <span className="text-[8px] text-white font-bold">
                                3
                            </span>
                        </span>
                    </button>

                    {/* User menu */}
                    <div className="relative">
                        <button
                            onClick={() => setShowUserMenu(!showUserMenu)}
                            className="flex items-center gap-2 px-3 py-2 rounded-lg transition-all hover:scale-[1.02]"
                            style={{
                                backgroundColor:
                                    "var(--color-background-secondary)",
                            }}
                            aria-label="User menu"
                        >
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center ring-2 ring-white/20">
                                <User className="w-4 h-4 text-white" />
                            </div>
                            <div className="hidden md:flex items-center gap-1">
                                <span
                                    className="text-sm font-semibold"
                                    style={{
                                        color: "var(--color-text-primary)",
                                    }}
                                >
                                    {user?.name || user?.email || "Admin"}
                                </span>
                                <ChevronDown
                                    className="w-4 h-4"
                                    style={{
                                        color: "var(--color-text-tertiary)",
                                    }}
                                />
                            </div>
                        </button>

                        {/* Dropdown Menu */}
                        {showUserMenu && (
                            <>
                                {/* Backdrop to close menu */}
                                <div
                                    className="fixed inset-0 z-40"
                                    onClick={() => setShowUserMenu(false)}
                                />
                                
                                {/* Menu */}
                                <div
                                    className="absolute right-0 mt-2 w-56 rounded-lg shadow-lg z-50"
                                    style={{
                                        backgroundColor: "var(--color-card-bg)",
                                        border: "1px solid var(--color-border)",
                                    }}
                                >
                                    <div className="p-3 border-b" style={{ borderColor: "var(--color-border)" }}>
                                        <p
                                            className="text-sm font-semibold"
                                            style={{ color: "var(--color-text-primary)" }}
                                        >
                                            {user?.name || "Admin User"}
                                        </p>
                                        <p
                                            className="text-xs"
                                            style={{ color: "var(--color-text-secondary)" }}
                                        >
                                            {user?.email || "admin@befix.com"}
                                        </p>
                                    </div>

                                    <div className="p-2">
                                        <button
                                            onClick={() => {
                                                setShowUserMenu(false);
                                                router.push('/settings');
                                            }}
                                            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
                                            style={{ color: "var(--color-text-primary)" }}
                                        >
                                            <Settings size={16} />
                                            <span className="text-sm">Settings</span>
                                        </button>

                                        <button
                                            onClick={handleLogout}
                                            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-colors"
                                            style={{ color: "var(--color-error)" }}
                                        >
                                            <LogOut size={16} />
                                            <span className="text-sm">Logout</span>
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

