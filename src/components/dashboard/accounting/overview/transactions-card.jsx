import { Card } from '@/components/ui/card';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import emptyStateImg from '@/assets/images/empty-chart-state.png';
import { ArrowDownLeftIcon, ArrowUpRightIcon, DotIcon } from 'lucide-react';

const tnx = {
  transactions: [
    {
      title: 'Client payment - invoice #INV-001',
      description: 'Business Checking',
      date_created: '2025-01-13',
      type: 'credit',
      amount: '$2500',
      tag: 'Revenue',
    },
    {
      title: 'Office Supplies Purchase',
      description: 'Business Checking',
      date_created: '2025-01-14',
      type: 'debit',
      amount: '$150',
      tag: 'Expenses',
    },
    {
      title: 'Software Subscription',
      description: 'Business Checking',
      date_created: '2025-01-15',
      type: 'credit',
      amount: '$50',
      tag: 'Expenses',
    },
    {
      title: 'Client payment - invoice #INV-002',
      description: 'Business Checking',
      date_created: '2025-01-16',
      type: 'debit',
      amount: '$3000',
      tag: 'Revenue',
    },
    {
      title: 'Office Rent',
      description: 'Business Checking',
      date_created: '2025-01-17',
      type: 'credit',
      amount: '$1200',
      tag: 'Expenses',
    },
  ],
  pagination: {
    count: 50,
    page: 1,
    pageSize: 5,
    totalPages: 10,
  },
};

export default function RecentTransactionCard({
  className,
  recentTnx = tnx,
  title,
  description,
}) {
  // Helper to render pagination items
  const { page, totalPages } = recentTnx.pagination;
  const renderPaginationItems = () => {
    const items = [];
    if (totalPages <= 6) {
      for (let i = 1; i <= totalPages; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink className={'size-7 text-sm'} isActive={i === page}>
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }
    } else {
      // First three
      for (let i = 1; i <= 3; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink className={'size-7 text-sm'} isActive={i === page}>
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }
      // Ellipsis
      items.push(
        <PaginationItem key="ellipsis">
          <PaginationEllipsis className={'size-7 text-sm'} />
        </PaginationItem>
      );
      // Last three
      for (let i = totalPages - 2; i <= totalPages; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink className={'size-7 text-sm'} isActive={i === page}>
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }
    }
    return items;
  };

  return (
    <Card className={`p-6 ${className}`}>
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">
            {title || 'Recent Transactions'}
          </h3>
          <p className="text-xs text-[#434343]">
            {description || 'Latest financial activity'}
          </p>
        </div>
      </div>
      <div className="">
        <div className="space-y-4">
          {recentTnx.pagination.count > 0 ? (
            recentTnx.transactions.map((tnx, i) => (
              <div
                key={i}
                className="flex w-full items-center justify-between gap-4 rounded-2xl border border-[#F0EEFF] p-4 py-3.5"
              >
                <div className="flex items-center gap-2">
                  <div
                    className={`flex size-10 items-center justify-center rounded-full ${tnx.type === 'credit' ? 'bg-[#6FD195]/10' : 'bg-[#EF4444]/10'}`}
                  >
                    {tnx.type === 'credit' ? (
                      <ArrowUpRightIcon size={24} color="#6FD195" />
                    ) : (
                      <ArrowDownLeftIcon size={24} color="#EF4444" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold">{tnx.title}</h3>
                    <p className="flex items-center text-xs text-[#7D7D7D]">
                      <span>{tnx.description}</span>
                      <DotIcon size={16} />
                      <span>{tnx.date_created}</span>
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-center justify-center">
                  <h3
                    className={`text-sm font-medium ${tnx.type === 'credit' ? 'text-[#6FD195]' : 'text-[#EF4444]'}`}
                  >
                    {tnx.type === 'credit' ? '+' : '-'}
                    {tnx.amount}
                  </h3>
                  <p className="mt-1 flex h-6 items-center justify-center rounded-full border border-[#F0EEFF] p-2 text-xs">
                    {tnx.tag}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="flex h-40 w-full items-center justify-center bg-white">
              <img src={emptyStateImg} alt="Empty State" />
            </div>
          )}
        </div>
        <Pagination className={'mt-6'}>
          <PaginationContent className={'w-full justify-between'}>
            <PaginationItem>
              <PaginationPrevious
                className={
                  'bg-background hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 h-8 border text-sm text-[#414651] shadow-xs'
                }
              />
            </PaginationItem>
            <li className="flex items-center md:gap-1">
              {renderPaginationItems()}
            </li>
            <PaginationItem>
              <PaginationNext
                className={
                  'bg-background hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 h-8 border text-sm text-[#414651] shadow-xs'
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </Card>
  );
}
