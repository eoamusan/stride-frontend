import { useState } from 'react';
import AddProductForm from '@/components/dashboard/accounting/inventory/add-product-form';
import EmptyInventory from '@/components/dashboard/accounting/inventory/empty-inventory';
import InventoryCategoryForm from '@/components/dashboard/accounting/inventory/inventory-category-form';
import SuccessModal from '@/components/dashboard/accounting/success-modal';
import Metrics from '@/components/dashboard/accounting/invoicing/plain-metrics';
import AccountingTable from '@/components/dashboard/accounting/table';
import ActivityCard from '@/components/dashboard/activity-card';
import { Button } from '@/components/ui/button';
import {
  DownloadIcon,
  PlusCircleIcon,
  SettingsIcon,
  ShapesIcon,
} from 'lucide-react';
import adContainerPlaceholder from '@/assets/images/ad-container-product.png';
import cameraIcon from '@/assets/icons/camera.svg';
import ProductCard from '@/components/dashboard/accounting/inventory/product-card';
import ViewProductModal from '@/components/dashboard/accounting/inventory/view-product-modal';

const products = [''];
const productMetrics = [
  { title: 'Total Products', value: '214215' },
  { title: 'Total Value', value: '$15,400.00' },
  { title: 'Low Stock Items', value: '$64' },
  { title: 'Out of Stock', value: '264' },
];
const recentActivities = ['1', '2', '3'];

// Product catalog data based on the image
const productData = [
  {
    id: 1,
    img: 'https://placehold.co/100',
    sku: 'BILL-2001',
    itemName: 'Office Supplies Co',
    category: 'Office Supplies',
    currentStock: 25,
    unitCost: 1200.0,
    purchasePrice: 30000.0,
    status: 'In stock',
  },
  {
    id: 2,
    img: 'https://placehold.co/100',
    sku: 'BILL-2001',
    itemName: 'Office Supplies Co',
    category: 'Office Supplies',
    currentStock: 25,
    unitCost: 1200.0,
    purchasePrice: 30000.0,
    status: 'In stock',
  },
  {
    id: 3,
    img: 'https://placehold.co/100',
    sku: 'BILL-2001',
    itemName: 'Office Supplies Co',
    category: 'Office Supplies',
    currentStock: 25,
    unitCost: 1200.0,
    purchasePrice: 30000.0,
    status: 'In stock',
  },
  {
    id: 4,
    img: 'https://placehold.co/100',
    sku: 'BILL-2001',
    itemName: 'Office Supplies Co',
    category: 'Office Supplies',
    currentStock: 25,
    unitCost: 1200.0,
    purchasePrice: 30000.0,
    status: 'In stock',
  },
  {
    id: 5,
    img: 'https://placehold.co/100',
    sku: 'BILL-2001',
    itemName: 'Office Supplies Co',
    category: 'Office Supplies',
    currentStock: 25,
    unitCost: 1200.0,
    purchasePrice: 30000.0,
    status: 'In stock',
  },
  {
    id: 6,
    img: 'https://placehold.co/100',
    sku: 'BILL-2001',
    itemName: 'Office Supplies Co',
    category: 'Office Supplies',
    currentStock: 25,
    unitCost: 1200.0,
    purchasePrice: 30000.0,
    status: 'In stock',
  },
  {
    id: 7,
    img: 'https://placehold.co/100',
    sku: 'BILL-2001',
    itemName: 'Office Supplies Co',
    category: 'Office Supplies',
    currentStock: 25,
    unitCost: 1200.0,
    purchasePrice: 30000.0,
    status: 'In stock',
  },
];

export default function InventoryManagement() {
  const [openCategoryForm, setOpenCategoryForm] = useState(false);
  const [openAddProductForm, setOpenAddProductForm] = useState(false);
  const [openSuccessModal, setOpenSuccessModal] = useState(false);
  const [openViewProduct, setOpenViewProduct] = useState(false);

  // State for table selection
  const [selectedItems, setSelectedItems] = useState([]);

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
      setSelectedItems(productData.map((item) => item.id));
    } else {
      setSelectedItems([]);
    }
  };

  const handleProductAdded = () => {
    setOpenAddProductForm(false);
    setOpenSuccessModal(true);
  };

  const handleBackFromSuccess = () => {
    setOpenSuccessModal(false);
  };

  // Table columns configuration
  const tableColumns = [
    {
      key: 'img',
      label: 'IMG',
      render: (value) => (
        <div className="bg-muted-foreground flex h-10 w-10 items-center justify-center rounded">
          <img
            src={value}
            alt="Product"
            className="h-8 w-8 rounded object-cover"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'block';
            }}
          />
          <div className="hidden h-8 w-8 rounded bg-amber-100"></div>
        </div>
      ),
    },
    {
      key: 'sku',
      label: 'SKU',
      className: 'font-medium',
    },
    {
      key: 'itemName',
      label: 'Item Name',
    },
    {
      key: 'category',
      label: 'Category',
    },
    {
      key: 'currentStock',
      label: 'Current Stock',
    },
    {
      key: 'unitCost',
      label: 'Unit Cost',
      render: (value) => `$${value.toLocaleString()}`,
    },
    {
      key: 'purchasePrice',
      label: 'Purchase Price',
      render: (value) => `$${value.toLocaleString()}`,
    },
    {
      key: 'status',
      label: 'Status',
    },
  ];

  // Dropdown actions for each row
  const dropdownActions = [
    { key: 'edit', label: 'Edit' },
    { key: 'view', label: 'View' },
    { key: 'delete', label: 'Delete' },
  ];

  // Pagination data
  const paginationData = {
    page: 1,
    totalPages: 6,
    pageSize: 12,
    totalCount: 64,
  };

  const handleRowAction = (action, item) => {
    console.log(`Action ${action} on item:`, item);
    
    // Implement row action logic here
    switch (action) {
      case 'view':
        setOpenViewProduct(true);
        break;
    }
  };

  return (
    <div className="my-4 min-h-screen">
      <div className="flex flex-wrap items-center justify-between gap-6">
        <hgroup>
          <h1 className="text-2xl font-bold">Product Catalog</h1>
          <p className="text-sm text-[#7D7D7D]">
            Track stock levels and inventory movements
          </p>
        </hgroup>

        {products && products.length > 0 && (
          <div className="flex space-x-4">
            <Button
              onClick={() => setOpenAddProductForm(true)}
              className={'h-10 rounded-2xl text-sm'}
            >
              <PlusCircleIcon className="size-4" />
              Add Product
            </Button>
            <Button size={'icon'} className={'size-10'} variant={'outline'}>
              <DownloadIcon size={16} />
            </Button>
            <Button
              size={'icon'}
              className={'size-10'}
              variant={'outline'}
              onClick={() => setOpenCategoryForm(true)}
            >
              <ShapesIcon size={16} />
            </Button>
            <Button size={'icon'} className={'size-10'} variant={'outline'}>
              <SettingsIcon size={16} />
            </Button>
          </div>
        )}
      </div>

      <div>
        {products && products.length === 0 ? (
          <EmptyInventory onClick={() => setOpenCategoryForm(true)} />
        ) : (
          <div className="mt-10">
            <Metrics metrics={productMetrics} />
            <div className="mt-10">
              <h3 className="mb-4 text-base font-medium">Recent Activites</h3>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {recentActivities.map((_activity, index) => (
                  <ActivityCard key={index} />
                ))}
              </div>

              <div className="mt-10 w-full">
                <img src={adContainerPlaceholder} alt="add placeholder" />
              </div>

              <div className="relative mt-10">
                <AccountingTable
                  title="Product Catalog"
                  data={productData}
                  columns={tableColumns}
                  searchFields={['sku', 'itemName', 'category']}
                  searchPlaceholder="Search by SKU or name......"
                  statusStyles={{
                    'In stock':
                      'bg-green-100 text-green-800 hover:bg-green-100',
                    'Low stock':
                      'bg-yellow-100 text-yellow-800 hover:bg-yellow-100',
                    'Out of stock': 'bg-red-100 text-red-800 hover:bg-red-100',
                  }}
                  dropdownActions={dropdownActions}
                  paginationData={paginationData}
                  selectedItems={selectedItems}
                  handleSelectItem={handleSelectItem}
                  handleSelectAll={handleSelectAll}
                  onRowAction={handleRowAction}
                  isProductTable
                  showDataSize
                  itemComponent={ProductCard}
                />
                <button className="bg-primary/10 absolute -top-10 right-0 cursor-pointer rounded-full p-5">
                  <img src={cameraIcon} alt="add product" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <AddProductForm
        open={openAddProductForm}
        onOpenChange={setOpenAddProductForm}
        onProductAdded={handleProductAdded}
      />
      <InventoryCategoryForm
        open={openCategoryForm}
        onOpenChange={setOpenCategoryForm}
      />
      <SuccessModal
        title={'Product Added'}
        description={"You've successfully added a product"}
        backText={'Back'}
        open={openSuccessModal}
        onOpenChange={setOpenSuccessModal}
        handleBack={handleBackFromSuccess}
      />
      <ViewProductModal
        open={openViewProduct}
        onOpenChange={setOpenViewProduct}
      />
    </div>
  );
}
