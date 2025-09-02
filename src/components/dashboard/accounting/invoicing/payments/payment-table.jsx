import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { FilterIcon, MoreHorizontalIcon, SearchIcon } from 'lucide-react';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import emptyTableImg from '@/assets/icons/empty-table.svg';

const paymentData = [
  {
    id: 'P-35476',
    customer: 'ABC Corporation',
    invoice: '#INV-001',
    method: 'Bank Transfer',
    amount: '$15,400.00',
    date: 'Jul 20, 2024',
    status: 'Overdue',
  },
  {
    id: 'P-35477',
    customer: 'Tech Solutions Ltd',
    invoice: '#INV-002',
    method: 'Credit Card',
    amount: '$8,750.00',
    date: 'Aug 15, 2024',
    status: 'Completed',
  },
  {
    id: 'P-35478',
    customer: 'Global Enterprises',
    invoice: '#INV-003',
    method: 'Bank Transfer',
    amount: '$25,000.00',
    date: 'Aug 10, 2024',
    status: 'Pending',
  },
  {
    id: 'P-35479',
    customer: 'Creative Agency Inc',
    invoice: '#INV-004',
    method: 'PayPal',
    amount: '$12,300.00',
    date: 'Jul 30, 2024',
    status: 'Failed',
  },
];

const paymentListData = {
  pagination: {
    page: 1,
    totalPages: 10,
    pageSize: 10,
    totalCount: 100,
  },
};

export default function PaymentTable() {
  const [selectedPayments, setSelectedPayments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedPayments(paymentData.map((payment) => payment.id));
    } else {
      setSelectedPayments([]);
    }
  };

  const handleSelectPayment = (paymentId, checked) => {
    if (checked) {
      setSelectedPayments([...selectedPayments, paymentId]);
    } else {
      setSelectedPayments(selectedPayments.filter((id) => id !== paymentId));
    }
  };

  const getStatusBadge = (status) => {
    const statusStyles = {
      Completed: 'bg-green-100 text-green-800 hover:bg-green-100',
      Pending: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100',
      Overdue: 'bg-red-100 text-red-800 hover:bg-red-100',
      Failed: 'bg-red-100 text-red-800 hover:bg-red-100',
    };

    return (
      <Badge className={statusStyles[status] || 'bg-gray-100 text-gray-800'}>
        {status}
      </Badge>
    );
  };

  const filteredPayments = paymentData.filter(
    (payment) =>
      payment.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.invoice.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Helper to render pagination items
  const { page, totalPages } = paymentListData.pagination;
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
    <div className="w-full rounded-2xl bg-white p-6">
      {/* Header */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-6">
        <h2 className="text-xl font-bold">Recent Payments</h2>

        <div className="flex items-center gap-3">
          <div className="relative">
            <SearchIcon className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
            <Input
              placeholder="Search payment......"
              className="w-full max-w-80 pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline" size="icon">
            <FilterIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow className="bg-zinc-50">
              <TableHead className="w-12">
                <Checkbox
                  checked={selectedPayments.length === paymentData.length}
                  onCheckedChange={handleSelectAll}
                />
              </TableHead>
              <TableHead className="font-semibold text-gray-600">
                Payment ID
              </TableHead>
              <TableHead className="font-semibold text-gray-600">
                Customer
              </TableHead>
              <TableHead className="font-semibold text-gray-600">
                Invoice
              </TableHead>
              <TableHead className="font-semibold text-gray-600">
                Method
              </TableHead>
              <TableHead className="font-semibold text-gray-600">
                Amount
              </TableHead>
              <TableHead className="font-semibold text-gray-600">
                Date
              </TableHead>
              <TableHead className="font-semibold text-gray-600">
                Status
              </TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPayments.length > 0 ? (
              filteredPayments.map((payment, index) => (
                <TableRow key={index} className="hover:bg-zinc-50">
                  <TableCell>
                    <Checkbox
                      checked={selectedPayments.includes(payment.id)}
                      onCheckedChange={(checked) =>
                        handleSelectPayment(payment.id, checked)
                      }
                    />
                  </TableCell>
                  <TableCell className="font-medium">{payment.id}</TableCell>
                  <TableCell>{payment.customer}</TableCell>
                  <TableCell>{payment.invoice}</TableCell>
                  <TableCell>{payment.method}</TableCell>
                  <TableCell>{payment.amount}</TableCell>
                  <TableCell>{payment.date}</TableCell>
                  <TableCell>{getStatusBadge(payment.status)}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontalIcon className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Export</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={9}
                  className="h-24 text-center text-gray-500"
                >
                  <img
                    src={emptyTableImg}
                    alt="Empty Table"
                    className="mx-auto my-4 block w-[220px]"
                  />
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <Pagination className={'mt-6'}>
        <PaginationContent className={'w-full justify-between'}>
          <PaginationItem>
            <PaginationPrevious
              className={
                'bg-background hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 h-8 border text-sm text-[#414651] shadow-xs'
              }
            />
          </PaginationItem>
          <span className="flex items-center md:gap-1">
            {renderPaginationItems()}
          </span>
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
  );
}
