import AccountingTable from '../../table';
import { useState } from 'react';

// User management data based on the image
const usersData = [
  {
    id: 1,
    avatar: '👨‍💼',
    user: 'John Oye',
    role: 'Manager',
    lastLogin: '2024-01-15 09:30',
    status: 'Active',
    permissions: ['View product', 'User management', '+2 More'],
  },
  {
    id: 2,
    avatar: '👨‍💼',
    user: 'John Oye',
    role: 'Manager',
    lastLogin: '2024-01-15 09:30',
    status: 'Active',
    permissions: ['View product', 'User management', '+2 More'],
  },
  {
    id: 3,
    avatar: '👨‍💻',
    user: 'John Oye',
    role: 'Manager',
    lastLogin: '2024-01-15 09:30',
    status: 'Inactive',
    permissions: ['View product', 'User management', '+2 More'],
  },
  {
    id: 4,
    avatar: '👩‍💼',
    user: 'John Oye',
    role: 'Manager',
    lastLogin: '2024-01-15 09:30',
    status: 'Active',
    permissions: ['View product', 'User management', '+2 More'],
  },
];

// Activity tracking data based on the image
const activityData = [
  {
    id: 1,
    avatar: '👨‍💼',
    user: 'John Oye',
    actions: 'Create',
    resources: 'Product Entry',
    timestamp: '2024-01-15 09:30',
    details: 'Adjusted office paper quatity (50) units',
  },
  {
    id: 2,
    avatar: '👨‍💻',
    user: 'John Oye',
    actions: 'Update',
    resources: 'Stock Adjustment',
    timestamp: '2024-01-15 09:30',
    details: 'Adjusted office paper quatity (50) units',
  },
  {
    id: 3,
    avatar: '👨‍🦲',
    user: 'John Oye',
    actions: 'View',
    resources: 'Inventory',
    timestamp: '2024-01-15 09:30',
    details: 'Adjusted office paper quatity (50) units',
  },
  {
    id: 4,
    avatar: '👩‍💼',
    user: 'John Oye',
    actions: 'View',
    resources: 'Stock Movement',
    timestamp: '2024-01-15 09:30',
    details: 'Generated stock summary report',
  },
];

export default function UsersTracking() {
  // State for table selection
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectedActivityItems, setSelectedActivityItems] = useState([]);

  // Handle table item selection
  const handleSelectItem = (itemId, checked) => {
    setSelectedItems((prevItems) => {
      if (checked) {
        return [...prevItems, itemId];
      } else {
        return prevItems.filter((id) => id !== itemId);
      }
    });
  };

  // Handle select all functionality
  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedItems(usersData.map((item) => item.id));
    } else {
      setSelectedItems([]);
    }
  };

  // Handle activity table item selection
  const handleSelectActivityItem = (itemId, checked) => {
    setSelectedActivityItems((prevItems) => {
      if (checked) {
        return [...prevItems, itemId];
      } else {
        return prevItems.filter((id) => id !== itemId);
      }
    });
  };

  // Handle select all functionality for activity table
  const handleSelectAllActivity = (checked) => {
    if (checked) {
      setSelectedActivityItems(activityData.map((item) => item.id));
    } else {
      setSelectedActivityItems([]);
    }
  };

  // Table columns configuration for User Management
  const userColumns = [
    {
      key: 'avatar',
      label: 'IMG',
      render: (value) => (
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
          <span className="text-lg">{value}</span>
        </div>
      ),
    },
    {
      key: 'user',
      label: 'User',
      className: 'font-medium',
    },
    {
      key: 'role',
      label: 'Role',
    },
    {
      key: 'lastLogin',
      label: 'Last Login',
    },
    {
      key: 'status',
      label: 'Status',
    },
    {
      key: 'permissions',
      label: 'Permissions',
      render: (permissions) => (
        <div className="flex flex-wrap gap-2">
          {permissions.map((permission, index) => (
            <span
              key={index}
              className="rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-[#7d7d7d]"
            >
              {permission}
            </span>
          ))}
        </div>
      ),
    },
  ];

  // Table columns configuration for Activity Tracking
  const activityColumns = [
    {
      key: 'avatar',
      label: 'IMG',
      render: (value) => (
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
          <span className="text-lg">{value}</span>
        </div>
      ),
    },
    {
      key: 'user',
      label: 'User',
      className: 'font-medium',
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (value) => (
        <span className="rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-[#7d7d7d]">
          {value}
        </span>
      ),
    },
    {
      key: 'resources',
      label: 'Resources',
      className: 'font-medium',
    },
    {
      key: 'timestamp',
      label: 'Timestamp',
    },
    {
      key: 'details',
      label: 'Details',
    },
  ];

  // Dropdown actions for each row
  const dropdownActions = [{ key: 'export', label: 'Export' }];

  // Pagination data
  const paginationData = {
    page: 1,
    totalPages: 3,
    pageSize: 12,
    totalCount: 64,
  };

  const handleRowAction = (action, item) => {
    console.log(`Action ${action} on user:`, item);
  };

  const handleActivityRowAction = (action, item) => {
    console.log(`Action ${action} on activity:`, item);
  };

  return (
    <div className="space-y-10">
      <AccountingTable
        title="User Management"
        data={usersData}
        columns={userColumns}
        searchFields={['user', 'role']}
        searchPlaceholder="Search by users....."
        dropdownActions={dropdownActions}
        paginationData={paginationData}
        selectedItems={selectedItems}
        handleSelectItem={handleSelectItem}
        handleSelectAll={handleSelectAll}
        onRowAction={handleRowAction}
        showDataSize
      />

      <AccountingTable
        title="Activity Tracking"
        data={activityData}
        columns={activityColumns}
        searchFields={['user', 'actions', 'resources']}
        searchPlaceholder="Search activities....."
        dropdownActions={dropdownActions}
        paginationData={paginationData}
        selectedItems={selectedActivityItems}
        handleSelectItem={handleSelectActivityItem}
        handleSelectAll={handleSelectAllActivity}
        onRowAction={handleActivityRowAction}
        showDataSize
      />
    </div>
  );
}
