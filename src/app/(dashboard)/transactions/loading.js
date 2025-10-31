import { Skeleton } from "@/components/common/Skeleton";
import { ContentWrapper } from "@/components/layout/ContentWrapper";

export default function TransactionsLoading() {
    return (
        <ContentWrapper>
            <div className="mb-6">
                <Skeleton variant="text" className="h-8 w-64 mb-2" />
                <Skeleton variant="text" className="h-4 w-96" />
            </div>
            <Skeleton variant="card" className="h-96" />
        </ContentWrapper>
    );
}
