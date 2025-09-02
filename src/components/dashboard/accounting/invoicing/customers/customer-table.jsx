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

const customerData = [
  {
    id: 'CUST-1001',
    name: 'John Smith',
    companyName: 'ABC Corporation',
    creditLimit: '$50,000.00',
    balance: '$15,400.00',
    dueDate: 'Jul 20, 2024',
    status: 'Active',
  },
  {
    id: 'CUST-1002',
    name: 'Sarah Johnson',
    companyName: 'Tech Solutions Ltd',
    creditLimit: '$25,000.00',
    balance: '$8,750.00',
    dueDate: 'Aug 15, 2024',
    status: 'Active',
  },
  {
    id: 'CUST-1003',
    name: 'Michael Brown',
    companyName: 'Global Enterprises',
    creditLimit: '$100,000.00',
    balance: '$0.00',
    dueDate: '-',
    status: 'Inactive',
  },
  {
    id: 'CUST-1004',
    name: 'Emily Davis',
    companyName: 'Creative Agency Inc',
    creditLimit: '$30,000.00',
    balance: '$22,500.00',
    dueDate: 'Jun 30, 2024',
    status: 'Overdue',
  },
];

const customerListData = {
  pagination: {
    page: 1,
    totalPages: 10,
    pageSize: 10,
    totalCount: 100,
  },
};

export default function CustomerTable() {
  const [selectedCustomers, setSelectedCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedCustomers(customerData.map((customer) => customer.id));
    } else {
      setSelectedCustomers([]);
    }
  };

  const handleSelectCustomer = (customerId, checked) => {
    if (checked) {
      setSelectedCustomers([...selectedCustomers, customerId]);
    } else {
      setSelectedCustomers(selectedCustomers.filter((id) => id !== customerId));
    }
  };

  const getStatusBadge = (status) => {
    const statusStyles = {
      Active: 'bg-green-100 text-green-800 hover:bg-green-100',
      Inactive: 'bg-gray-100 text-gray-800 hover:bg-gray-100',
      Overdue: 'bg-red-100 text-red-800 hover:bg-red-100',
    };

    return (
      <Badge className={statusStyles[status] || 'bg-gray-100 text-gray-800'}>
        {status}
      </Badge>
    );
  };

  const filteredCustomers = customerData.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Helper to render pagination items
  const { page, totalPages } = customerListData.pagination;
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
        <h2 className="text-xl font-bold">Customer Management</h2>

        <div className="flex items-center gap-3">
          <div className="relative">
            <SearchIcon className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
            <Input
              placeholder="Search customers......"
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
                  checked={selectedCustomers.length === customerData.length}
                  onCheckedChange={handleSelectAll}
                />
              </TableHead>
              <TableHead className="font-semibold text-gray-600">
                Name
              </TableHead>
              <TableHead className="font-semibold text-gray-600">
                Company Name
              </TableHead>
              <TableHead className="font-semibold text-gray-600">
                Credit Limit
              </TableHead>
              <TableHead className="font-semibold text-gray-600">
                Balance
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
            {filteredCustomers.length > 0 ? (
              filteredCustomers.map((customer, index) => (
                <TableRow key={index} className="hover:bg-zinc-50">
                  <TableCell>
                    <Checkbox
                      checked={selectedCustomers.includes(customer.id)}
                      onCheckedChange={(checked) =>
                        handleSelectCustomer(customer.id, checked)
                      }
                    />
                  </TableCell>
                  <TableCell className="font-medium">{customer.name}</TableCell>
                  <TableCell>{customer.companyName}</TableCell>
                  <TableCell>{customer.creditLimit}</TableCell>
                  <TableCell>{customer.balance}</TableCell>
                  <TableCell>{customer.dueDate}</TableCell>
                  <TableCell>{getStatusBadge(customer.status)}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontalIcon className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>View</DropdownMenuItem>
                        <DropdownMenuItem>Create Invoice</DropdownMenuItem>
                        <DropdownMenuItem>Create Charge</DropdownMenuItem>
                        <DropdownMenuItem>Make inactive</DropdownMenuItem>
                        <DropdownMenuItem>Create Statement</DropdownMenuItem>
                        <DropdownMenuItem>Create Task</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={8}
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
