import { Card } from "@/components/common/Card";
import { ContentWrapper } from "@/components/layout/ContentWrapper";
import { Receipt, Clock } from "lucide-react";

/**
 * Transactions Page - Placeholder
 * Will be implemented when transaction data structure is confirmed
 */
export default function TransactionsPage() {
    return (
        <ContentWrapper>
            {/* Page Header */}
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-[var(--color-text-primary)]">
                    Transactions
                </h1>
                <p className="text-[var(--color-text-secondary)] mt-2">
                    View and manage all financial transactions
                </p>
            </div>

            {/* Placeholder Content */}
            <Card className="text-center py-16">
                <div className="flex flex-col items-center gap-4 max-w-md mx-auto">
                    <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                        <Receipt className="w-10 h-10 text-green-600 dark:text-green-400" />
                    </div>

                    <div>
                        <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mb-2">
                            Coming Soon
                        </h2>
                        <p className="text-[var(--color-text-secondary)] mb-4">
                            Transaction management features are under development and will be
                            available soon.
                        </p>
                        <div className="flex items-center justify-center gap-2 text-sm text-[var(--color-text-secondary)]">
                            <Clock className="w-4 h-4" />
                            <span>Awaiting data structure confirmation</span>
                        </div>
                    </div>

                    {/* Future Features Preview */}
                    <div className="mt-6 text-left w-full">
                        <p className="text-sm font-semibold text-[var(--color-text-primary)] mb-3">
                            Planned Features:
                        </p>
                        <ul className="text-sm text-[var(--color-text-secondary)] space-y-2">
                            <li className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-green-600"></span>
                                View all transactions
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-green-600"></span>
                                Filter by date, status, and amount
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-green-600"></span>
                                Transaction details view
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-green-600"></span>
                                Export transaction reports
                            </li>
                        </ul>
                    </div>
                </div>
            </Card>
        </ContentWrapper>
    );
}
