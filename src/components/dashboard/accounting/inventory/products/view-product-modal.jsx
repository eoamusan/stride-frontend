import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Copy, ShoppingBasket } from 'lucide-react';
import geishaImage from '@/assets/images/geisha.png';

export default function ViewProductModal({
  open,
  onOpenChange,
  productData = {
    name: 'Geisha',
    sku: '#002',
    supplier: 'Nestle',
    availability: 'In Stock',
    category: 'Electronic',
    stockLevel: 'Good',
    totalValue: 40,
    currentQuantity: 20,
    minimumStockLevel: 20,
    purchasePrice: 20,
    sellingPrice: 20,
    storageArea: 'Cold storage C1',
    expiryDate: '2025/23/09',
  },
}) {
  const [selectedImage, setSelectedImage] = useState(0);

  const images = [geishaImage, geishaImage, geishaImage, geishaImage];

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
  };

  const handleAdjustStock = () => {
    console.log('Adjust stock for:', productData.name);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExport = () => {
    console.log('Export product data for:', productData.name);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] w-[95%] overflow-y-auto sm:max-w-7xl">
        <DialogHeader className="flex flex-row items-center gap-3 space-y-0">
          <div className="flex items-center justify-center rounded-full bg-[#254C00] p-2">
            <ShoppingBasket color="#fff" size={16} />
          </div>
          <DialogTitle className="font-semibold">Product Details</DialogTitle>
        </DialogHeader>

        <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-2">
          {/* Left Column - Product Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="aspect-square overflow-hidden rounded-lg border bg-white p-8">
              <img
                src={images[selectedImage]}
                alt={productData.name}
                className="h-full w-full object-contain"
              />
            </div>

            {/* Thumbnail Images */}
            <div className="flex gap-2">
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square w-24 overflow-hidden rounded-lg border-2 p-2 ${
                    selectedImage === index ? 'border-[#254C00]' : ''
                  }`}
                >
                  <img
                    src={image}
                    alt={`${productData.name} ${index + 1}`}
                    className="h-full w-full object-contain"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Right Column - Product Information */}
          <div className="space-y-2">
            {/* Product Header */}
            <div>
              <h1 className="text-xl font-semibold">{productData.name}</h1>
              <div className="mt-6 grid grid-cols-2 gap-1.5 text-sm">
                <div>
                  <span className="text-[#5F6C72]">Sku: {productData.sku}</span>
                </div>
                <div>
                  <span className="text-[#5F6C72]">Availability: </span>
                  <span className="font-medium text-[#24A959]">
                    {productData.availability}
                  </span>
                </div>
                <div>
                  <span className="text-[#5F6C72]">Supplier: </span>
                  <span className="font-medium">{productData.supplier}</span>
                </div>
                <div>
                  <span className="text-[#5F6C72]">Category: </span>
                  <span className="font-medium">{productData.category}</span>
                </div>
                <div>
                  <span className="text-[#5F6C72]">Stock Level: </span>
                  <span className="font-medium text-[#24A959]">
                    {productData.stockLevel}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600"></span>
                  <span className="font-medium text-[#24A959]">Perishable</span>
                </div>
              </div>
            </div>

            {/* Total Value */}
            <div className="border-b py-4 text-2xl font-semibold text-[#292D32]">
              <span className="pr-1.5">Total Value:</span>
              <span className="text-[#24A959]">${productData.totalValue}</span>
            </div>

            {/* Stock Information */}
            <div>
              <h3 className="mb-3 text-sm font-semibold">Stock Information</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="space-y-2">
                  <div className="">Current Quantity</div>
                  <div className="font-medium text-[#475156]">
                    {productData.currentQuantity}
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="">Minimum Stock Level</div>
                  <div className="font-medium text-[#475156]">
                    {productData.minimumStockLevel}
                  </div>
                </div>
              </div>
            </div>

            {/* Pricing */}
            <div>
              <h3 className="mt-4 mb-3 text-sm font-semibold">Pricing</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="space-y-2">
                  <div className="">Purchase Price</div>
                  <div className="font-medium text-[#475156]">
                    ${productData.purchasePrice}
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="">Selling Price</div>
                  <div className="font-medium text-[#475156]">
                    ${productData.sellingPrice}
                  </div>
                </div>
              </div>
            </div>

            {/* Storage */}
            <div>
              <h3 className="mt-4 mb-3 text-sm font-semibold">Storage</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="space-y-2">
                  <div className="">Storage Area</div>
                  <div className="font-medium text-[#475156]">
                    {productData.storageArea}
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="">Expiry Date</div>
                  <div className="font-medium text-[#EF4444]">
                    {productData.expiryDate}
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-14 flex gap-3">
              <Button
                onClick={handleAdjustStock}
                className="h-10 flex-1 rounded-2xl text-sm"
              >
                Adjust Stock
              </Button>
              <Button
                variant="outline"
                onClick={handlePrint}
                className="h-10 flex-1 rounded-2xl text-sm"
              >
                Print
              </Button>
              <Button
                variant="outline"
                onClick={handleExport}
                className="h-10 flex-1 rounded-2xl text-sm"
              >
                Export
              </Button>
            </div>

            {/* Share Product */}
            <div className="mt-4 flex items-center gap-2">
              <div className="text-sm font-medium">Share product:</div>
              <div className="flex items-center gap-3">
                <button
                  onClick={handleCopyLink}
                  className="hover:bg-accent flex h-8 w-8 cursor-pointer items-center justify-center rounded-full"
                >
                  <Copy className="h-4 w-4" />
                </button>
                <button className="flex h-4 w-4 cursor-pointer items-center justify-center rounded-full">
                  <svg
                    role="img"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                    color="#FA8232"
                  >
                    <title>Facebook</title>
                    <path d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-.707 0-1.259.096-1.675.309a1.686 1.686 0 0 0-.679.622c-.258.42-.374.995-.374 1.752v1.297h3.919l-.386 2.103-.287 1.564h-3.246v8.245C19.396 23.238 24 18.179 24 12.044c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.628 3.874 10.35 9.101 11.647Z" />
                  </svg>
                </button>
                <button className="flex h-4 w-4 cursor-pointer items-center justify-center rounded-full">
                  <svg
                    role="img"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <title>X</title>
                    <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
