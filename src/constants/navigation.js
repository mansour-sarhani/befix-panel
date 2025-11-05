import {
    LayoutDashboard,
    Users,
    Building2,
    ArrowLeftRight,
    Package,
    CreditCard,
    Tag,
    Blocks,
    UserPlus,
    Database,
    Network,
    Bell,
    Send,
} from "lucide-react";

export const navigation = [
    {
        name: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard,
    },
    {
        name: "Notifications",
        href: "/notifications",
        icon: Bell,
    },
    {
        name: "User Management",
        href: "/users",
        icon: Users,
    },
    {
        name: "Company Management",
        href: "/companies",
        icon: Building2,
    },
    {
        name: "Transactions",
        href: "/transactions",
        icon: ArrowLeftRight,
    },
    {
        name: "Package Management",
        href: "/packages",
        icon: Package,
    },
    {
        name: "Payments",
        href: "/payments",
        icon: CreditCard,
    },
    {
        name: "Promotion Codes",
        href: "/promotions",
        icon: Tag,
    },
];

// Admin-only navigation items
export const adminNavigation = [
    {
        name: "Send Notification",
        href: "/notifications/send",
        icon: Send,
        roles: ['admin', 'manager'], // Only visible to admin and manager
    },
];

// Development/Testing pages (optional, can be hidden in production)
export const devNavigation = [
    {
        name: "Components Demo",
        href: "/components-demo",
        icon: Blocks,
    },
    {
        name: "Register Admin",
        href: "/register-admin",
        icon: UserPlus,
    },
    {
        name: "Test DB Connection",
        href: "/test-connection",
        icon: Database,
    },
    {
        name: "Test Axios",
        href: "/test-axios",
        icon: Network,
    },
    {
        name: "Firebase FCM Test",
        href: "/firebase-test",
        icon: Bell,
    },
    {
        name: "Backend Notification Test",
        href: "/backend-notification-test",
        icon: Send,
    },
    {
        name: "🔍 Debug Auth",
        href: "/debug-auth",
        icon: Database,
    },
];

