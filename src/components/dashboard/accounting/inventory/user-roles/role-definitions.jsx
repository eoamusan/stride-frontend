import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SearchIcon, Trash2Icon, BanIcon, UploadIcon } from 'lucide-react';
import RoleCard from './role-card';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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

// Role definitions data based on the image
const allRolesData = [
  {
    id: 1,
    name: 'Admin',
    description: 'Full access including settings and report',
    userCount: 1,
    permissions: [
      'Full System Access',
      'User Management',
      'Settings Management',
      'System Configuration',
      'All Reports',
    ],
  },
  {
    id: 2,
    name: 'Inventory Manager',
    description: 'Can view stock and products, adjustments, and basic reports',
    userCount: 1,
    permissions: [
      'Stock Management',
      'User Management',
      'Settings Management',
      'System Configuration',
      'All Reports',
    ],
  },
  {
    id: 3,
    name: 'Admin',
    description: 'Full access including settings and report',
    userCount: 3,
    permissions: [
      'Full System Access',
      'User Management',
      'Settings Management',
      'System Configuration',
      'All Reports',
    ],
  },
  {
    id: 4,
    name: 'Admin',
    description: 'Full access including settings and report',
    userCount: 1,
    permissions: [
      'Full System Access',
      'User Management',
      'Settings Management',
      'System Configuration',
      'All Reports',
    ],
  },
  {
    id: 5,
    name: 'Admin',
    description: 'Full access including settings and report',
    userCount: 1,
    permissions: [
      'Full System Access',
      'User Management',
      'Settings Management',
      'System Configuration',
      'All Reports',
    ],
  },
  {
    id: 6,
    name: 'Admin',
    description: 'Full access including settings and report',
    userCount: 3,
    permissions: [
      'Full System Access',
      'User Management',
      'Settings Management',
      'System Configuration',
      'All Reports',
    ],
  },
  {
    id: 7,
    name: 'Admin',
    description: 'Full access including settings and report',
    userCount: 1,
    permissions: [
      'Full System Access',
      'User Management',
      'Settings Management',
      'System Configuration',
      'All Reports',
    ],
  },
  {
    id: 8,
    name: 'Admin',
    description: 'Full access including settings and report',
    userCount: 1,
    permissions: [
      'Full System Access',
      'User Management',
      'Settings Management',
      'System Configuration',
      'All Reports',
    ],
  },
  {
    id: 9,
    name: 'Admin',
    description: 'Full access including settings and report',
    userCount: 3,
    permissions: [
      'Full System Access',
      'User Management',
      'Settings Management',
      'System Configuration',
      'All Reports',
    ],
  },
];

export default function RoleDefinitions({
  className,
  rolesData = allRolesData,
  onRoleEdit,
  onRoleDelete,
  onRoleView,
  paginationData = { page: 1, totalPages: 10 },
  onPageChange,
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItems, setSelectedItems] = useState([]);

  // Filter roles based on search term
  const filteredRoles = rolesData.filter(
    (role) =>
      role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      role.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      role.permissions.some((permission) =>
        permission.toLowerCase().includes(searchTerm.toLowerCase())
      )
  );

  // Handle role actions
  const handleEditRole = (role) => {
    console.log('Edit role:', role);
    onRoleEdit?.(role);
  };

  const handleDeleteRole = (role) => {
    console.log('Delete role:', role);
    onRoleDelete?.(role);
  };

  const handleViewRole = (role) => {
    console.log('View role:', role);
    onRoleView?.(role);
  };

  // Handle bulk actions
  const handleBulkDelete = () => {
    console.log('Bulk delete roles:', selectedItems);
  };

  const handleBulkBan = () => {
    console.log('Bulk ban roles:', selectedItems);
  };

  const handleBulkExport = () => {
    console.log('Bulk export roles:', selectedItems);
  };

  const roles = filteredRoles;

  const { page, totalPages } = paginationData;
  const renderPaginationItems = () => {
    const items = [];
    const delta = 1; // Number of pages to show on each side of current page

    if (totalPages <= 7) {
      // Show all pages if total is 7 or less
      for (let i = 1; i <= totalPages; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink
              className={'size-7 cursor-pointer text-sm'}
              isActive={i === page}
              onClick={() => onPageChange?.(i)}
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }
    } else {
      // Always show first page
      items.push(
        <PaginationItem key={1}>
          <PaginationLink
            className={'size-7 cursor-pointer text-sm'}
            isActive={1 === page}
            onClick={() => onPageChange?.(1)}
          >
            1
          </PaginationLink>
        </PaginationItem>
      );

      // Calculate the range around current page
      let startPage = Math.max(2, page - delta);
      let endPage = Math.min(totalPages - 1, page + delta);

      // Add left ellipsis if needed
      if (startPage > 2) {
        items.push(
          <PaginationItem key="ellipsis-left">
            <PaginationEllipsis className={'size-7 text-sm'} />
          </PaginationItem>
        );
      }

      // Add pages around current page
      for (let i = startPage; i <= endPage; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink
              className={'size-7 cursor-pointer text-sm'}
              isActive={i === page}
              onClick={() => onPageChange?.(i)}
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }

      // Add right ellipsis if needed
      if (endPage < totalPages - 1) {
        items.push(
          <PaginationItem key="ellipsis-right">
            <PaginationEllipsis className={'size-7 text-sm'} />
          </PaginationItem>
        );
      }

      // Always show last page (if it's not page 1)
      if (totalPages > 1) {
        items.push(
          <PaginationItem key={totalPages}>
            <PaginationLink
              className={'size-7 cursor-pointer text-sm'}
              isActive={totalPages === page}
              onClick={() => onPageChange?.(totalPages)}
            >
              {totalPages}
            </PaginationLink>
          </PaginationItem>
        );
      }
    }
    return items;
  };

  return (
    <div className={`w-full rounded-2xl bg-white p-6 ${className}`}>
      {/* Header */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-6">
        {selectedItems.length > 0 ? (
          <>
            <div />
            <div className="flex items-center gap-2">
              <Button
                size={'icon'}
                variant={'outline'}
                onClick={handleBulkDelete}
                title="Delete selected roles"
              >
                <Trash2Icon className="h-4 w-4" />
              </Button>
              <Button
                size={'icon'}
                variant={'outline'}
                onClick={handleBulkBan}
                title="Ban selected roles"
              >
                <BanIcon className="h-4 w-4" />
              </Button>
              <Button
                size={'icon'}
                variant={'outline'}
                onClick={handleBulkExport}
                title="Export selected roles"
              >
                <UploadIcon className="h-4 w-4" />
              </Button>
            </div>
          </>
        ) : (
          <div className={`grid w-full gap-6 md:grid-cols-3`}>
            <div className="w-full flex items-center">
              <h3 className="text-lg font-semibold">Roles</h3>
            </div>
            <div className="w-full space-y-2">
              <Label>Search roles</Label>
              <div className="relative">
                <SearchIcon className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                <Input
                  placeholder={'Search by name...'}
                  className="h-10 w-full pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="w-full space-y-2">
              <Label>Users</Label>
              <Select onValueChange={() => {}} value={''}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Users" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-users">All Users</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}
      </div>

      {/* Role Cards Grid */}
      <div className={`grid grid-cols-1 gap-6 sm:grid-cols-3`}>
        {roles.length > 0 ? (
          roles.map((role) => (
            <RoleCard
              key={role.id}
              role={role}
              selected={selectedItems.includes(role.id)}
              onSelect={(roleId, checked) => {
                setSelectedItems((prev) => {
                  if (checked) {
                    return [...prev, roleId];
                  } else {
                    return prev.filter((itemId) => itemId !== roleId);
                  }
                });
              }}
              onViewDetails={handleViewRole}
              onEdit={handleEditRole}
              onDelete={handleDeleteRole}
            />
          ))
        ) : (
          <div className="mx-auto w-full py-12 text-center sm:col-start-2">
            <img
              src={emptyTableImg}
              alt="Empty Table"
              className="mx-auto my-4 block w-[220px]"
            />
            <div className="text-sm text-gray-400">
              {searchTerm
                ? 'Try adjusting your search criteria'
                : 'Add your first role to get started'}
            </div>
          </div>
        )}
      </div>
      <div className="mt-6 flex items-center justify-between">
        {/* Pagination */}
        <Pagination className={`w-full`}>
          <PaginationContent className={'w-full justify-between'}>
            <PaginationItem>
              <PaginationPrevious
                className={
                  'bg-background hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 h-8 cursor-pointer border text-sm text-[#414651] shadow-xs'
                }
                onClick={() => page > 1 && onPageChange?.(page - 1)}
              />
            </PaginationItem>
            <span className="flex items-center md:gap-1">
              {renderPaginationItems()}
            </span>
            <PaginationItem>
              <PaginationNext
                className={
                  'bg-background hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 h-8 cursor-pointer border text-sm text-[#414651] shadow-xs'
                }
                onClick={() => page < totalPages && onPageChange?.(page + 1)}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}
