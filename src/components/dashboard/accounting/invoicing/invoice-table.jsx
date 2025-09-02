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

const invoiceData = [
  {
    id: 'INV-1001',
    customer: 'ABC Corporation',
    currency: 'NGN',
    amount: '$15,400.00',
    issueDate: '$15,400.00',
    dueDate: 'Jul 20, 2024',
    status: 'Overdue',
  },
  {
    id: 'INV-1002',
    customer: 'ABC Corporation',
    currency: 'EUR',
    amount: '$15,400.00',
    issueDate: '$15,400.00',
    dueDate: 'Jul 20, 2024',
    status: 'Paid',
  },
  {
    id: 'INV-1003',
    customer: 'ABC Corporation',
    currency: 'USD',
    amount: '$15,400.00',
    issueDate: '$15,400.00',
    dueDate: 'Jul 20, 2024',
    status: 'Pending',
  },
  {
    id: 'INV-1004',
    customer: 'ABC Corporation',
    currency: 'GBP',
    amount: '$15,400.00',
    issueDate: '$15,400.00',
    dueDate: 'Jul 20, 2024',
    status: 'Overdue',
  },
];

const invoiceListData = {
  pagination: {
    page: 1,
    totalPages: 10,
    pageSize: 10,
    totalCount: 100,
  },
};

export default function InvoiceTable() {
  const [selectedInvoices, setSelectedInvoices] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedInvoices(invoiceData.map((invoice) => invoice.id));
    } else {
      setSelectedInvoices([]);
    }
  };

  const handleSelectInvoice = (invoiceId, checked) => {
    if (checked) {
      setSelectedInvoices([...selectedInvoices, invoiceId]);
    } else {
      setSelectedInvoices(selectedInvoices.filter((id) => id !== invoiceId));
    }
  };

  const getStatusBadge = (status) => {
    const statusStyles = {
      Paid: 'bg-green-100 text-green-800 hover:bg-green-100',
      Pending: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100',
      Overdue: 'bg-red-100 text-red-800 hover:bg-red-100',
    };

    return (
      <Badge className={statusStyles[status] || 'bg-gray-100 text-gray-800'}>
        {status}
      </Badge>
    );
  };

  const filteredInvoices = invoiceData.filter(
    (invoice) =>
      invoice.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Helper to render pagination items
  const { page, totalPages } = invoiceListData.pagination;
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
        <h2 className="text-xl font-bold">Invoice Management</h2>

        <div className="flex items-center gap-3">
          <div className="relative">
            <SearchIcon className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
            <Input
              placeholder="Search invoices......"
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
                  checked={selectedInvoices.length === invoiceData.length}
                  onCheckedChange={handleSelectAll}
                />
              </TableHead>
              <TableHead className="font-semibold text-gray-600">
                Invoice #
              </TableHead>
              <TableHead className="font-semibold text-gray-600">
                Customer
              </TableHead>
              <TableHead className="font-semibold text-gray-600">
                Currency
              </TableHead>
              <TableHead className="font-semibold text-gray-600">
                Amount
              </TableHead>
              <TableHead className="font-semibold text-gray-600">
                Issue Date
              </TableHead>
              <TableHead className="font-semibold text-gray-600">
                Due Date
              </TableHead>
              <TableHead className="font-semibold text-gray-600">
                Status
              </TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredInvoices.length > 0 ? (
              filteredInvoices.map((invoice, index) => (
                <TableRow key={index} className="hover:bg-zinc-50">
                  <TableCell>
                    <Checkbox
                      checked={selectedInvoices.includes(invoice.id)}
                      onCheckedChange={(checked) =>
                        handleSelectInvoice(invoice.id, checked)
                      }
                    />
                  </TableCell>
                  <TableCell className="font-medium">{invoice.id}</TableCell>
                  <TableCell>{invoice.customer}</TableCell>
                  <TableCell>{invoice.currency}</TableCell>
                  <TableCell>{invoice.amount}</TableCell>
                  <TableCell>{invoice.issueDate}</TableCell>
                  <TableCell>{invoice.dueDate}</TableCell>
                  <TableCell>{getStatusBadge(invoice.status)}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontalIcon className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        <DropdownMenuItem>View</DropdownMenuItem>
                        <DropdownMenuItem>Generate receipt</DropdownMenuItem>
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
                  No invoices found.
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
  );
}
