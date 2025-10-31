import { MainLayout } from "@/components/layout/MainLayout";
import { ContentWrapper } from "@/components/layout/ContentWrapper";
import { Card } from "@/components/common/Card";
import { Button } from "@/components/common/Button";
import { Badge } from "@/components/common/Badge";
import { Palette, Smartphone, Database, Layers, Zap, Rocket, ExternalLink } from "lucide-react";
import Link from "next/link";

export default function Home() {
    const features = [
        {
            title: "Dark Mode",
            description:
                "Seamlessly toggle between light and dark themes with a single click. Full theme system with CSS variables.",
            icon: Palette,
            gradient: "from-purple-500 to-pink-500",
        },
        {
            title: "Responsive Design",
            description:
                "Fully responsive sidebar that adapts to any screen size. Collapsible on desktop, drawer on mobile.",
            icon: Smartphone,
            gradient: "from-blue-500 to-cyan-500",
        },
        {
            title: "Redux Toolkit",
            description:
                "Enterprise-grade state management with Redux DevTools. Time-travel debugging and predictable updates.",
            icon: Database,
            gradient: "from-green-500 to-emerald-500",
        },
        {
            title: "7 Admin Sections",
            description:
                "Complete admin functionality: Users, Companies, Transactions, Packages, Payments, and Promotions.",
            icon: Layers,
            gradient: "from-orange-500 to-red-500",
        },
        {
            title: "Modern Tech Stack",
            description:
                "Next.js 16, React 19, Tailwind CSS v4, SASS, Formik, Yup, and Axios. Cutting-edge technologies.",
            icon: Zap,
            gradient: "from-yellow-500 to-orange-500",
        },
        {
            title: "Production Ready",
            description:
                "Complete with dark mode, Redux, SASS theming, and responsive layout. Ready to build features!",
            icon: Rocket,
            gradient: "from-indigo-500 to-purple-500",
        },
    ];

    return (
        <MainLayout>
            <ContentWrapper>
                <div className="py-8 lg:py-12">
                    {/* Hero section */}
                    <div className="mb-12">
                        <Badge variant="primary" size="md" dot>
                            Phase 3.3 Complete - UI Components
                        </Badge>

                        <h1
                            className="text-4xl lg:text-5xl font-bold mb-4 tracking-tight"
                            style={{ color: "var(--color-text-primary)" }}
                        >
                            Welcome to BeFix Admin Panel
                        </h1>
                        <p
                            className="text-lg lg:text-xl max-w-3xl"
                            style={{ color: "var(--color-text-secondary)" }}
                        >
                            Your modern, responsive admin dashboard is ready. Complete with dark
                            mode, Redux state management, and a beautiful UI. 🎉
                        </p>
                    </div>

                    {/* Feature cards grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {features.map((feature, index) => {
                            const Icon = feature.icon;
                            return (
                                <Card key={index} hoverable className="group cursor-default">
                                    {/* Icon */}
                                    <div className="mb-4">
                                        <div
                                            className={`w-12 h-12 rounded-lg bg-gradient-to-br ${feature.gradient} flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300`}
                                        >
                                            <Icon className="w-6 h-6 text-white" />
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <h3
                                        className="text-lg font-bold mb-2"
                                        style={{
                                            color: "var(--color-text-primary)",
                                        }}
                                    >
                                        {feature.title}
                                    </h3>
                                    <p
                                        className="text-sm leading-relaxed"
                                        style={{
                                            color: "var(--color-text-secondary)",
                                        }}
                                    >
                                        {feature.description}
                                    </p>
                                </Card>
                            );
                        })}
                    </div>

                    {/* Call to action */}
                    <Card className="mt-12 text-center">
                        <div className="space-y-6">
                            <div>
                                <h2
                                    className="text-2xl font-bold mb-3"
                                    style={{ color: "var(--color-text-primary)" }}
                                >
                                    UI Components Ready! 🎨
                                </h2>
                                <p
                                    className="text-base mb-6 max-w-2xl mx-auto"
                                    style={{ color: "var(--color-text-secondary)" }}
                                >
                                    All reusable UI components are complete: Buttons, Cards, Badges,
                                    Modals, Tabs, and Pagination. Check out the demo page to see
                                    them in action!
                                </p>
                            </div>

                            <div className="flex flex-wrap items-center justify-center gap-3">
                                <Link href="/components-demo">
                                    <Button variant="primary">
                                        <ExternalLink size={16} />
                                        View Components Demo
                                    </Button>
                                </Link>
                                <Link href="/register-admin">
                                    <Button variant="secondary">
                                        <Rocket size={16} />
                                        Try Register Admin
                                    </Button>
                                </Link>
                            </div>

                            <div className="pt-4">
                                <Badge variant="info" size="lg">
                                    <Rocket size={14} />
                                    Next: Phase 3.4 - Data Display Components
                                </Badge>
                            </div>
                        </div>
                    </Card>
                </div>
            </ContentWrapper>
        </MainLayout>
    );
}
