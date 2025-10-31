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
} from "lucide-react";

export const navigation = [
    {
        name: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard,
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
];

