import AssetCard from "./asset-card";
import { ArrowLeft, ArrowLeftIcon, ArrowRightIcon, DownloadIcon, HousePlus } from "lucide-react";
import ProgressBar from "@/components/dashboard/accounting/shared/progress-bar";
import {Badge} from "@/components/ui/badge";
import pdfIcon from '@/assets/icons/pdf-icon.svg';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import ImageCarousel from "../../shared/image-carousel";

function MaintenanceHistory() {
  return <div>
    {/* Table */}
      <div className="overflow-x-auto mt-4">
        <Table>
          <TableHeader>
            <TableRow className="bg-purple-50">
              <TableHead className="text-sm font-medium text-gray-600">
                Vendor
              </TableHead>
              <TableHead className="text-sm font-medium text-gray-600">
                Amount
              </TableHead>
              <TableHead className="text-sm font-medium text-gray-600">
                Due Date
              </TableHead>
              <TableHead className="text-sm font-medium text-gray-600">
                Invoice ID
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {
              Array.from({ length: 5 }).map((_, index) => (
                <TableRow key={index}>
                  <TableCell className="text-sm font-medium text-[#434343]">
                    JJ Solutions
                  </TableCell>
                  <TableCell className="text-sm text-[#434343]">
                    $2,334
                  </TableCell>
                  <TableCell className="text-sm text-[#434343]">
                    Feb -12-2025
                  </TableCell>
                  <TableCell>
                    <a
                      href="#"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white p-3 transition-colors hover:bg-gray-50"
                    >
                      <img src={pdfIcon} alt="PDF Icon" className="h-4 w-4" />
                      <span className="text-xs font-medium text-gray-700">
                        file.pdf
                      </span>
                      <DownloadIcon className="ml-2 h-4 w-4 text-green-600" />
                    </a>
                  </TableCell>
                </TableRow>
              ))
            }
          </TableBody>
        </Table>
      </div>

      {/* Add Proper Pagination Here! */}
      <div className="mt-6 flex items-center justify-between">
        <Button variant="outline" size="sm" className="px-3">
          <ArrowLeftIcon className="h-4 w-4" />
        </Button>

        <div className="flex items-center gap-1">
          <Button variant="default" size="sm" className="h-8 w-8 p-0">
            1
          </Button>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            2
          </Button>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            3
          </Button>
          <span className="px-2 text-sm text-gray-500">...</span>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            8
          </Button>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            9
          </Button>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            10
          </Button>
        </div>

        <Button variant="outline" size="sm" className="px-3">
          <ArrowRightIcon className="h-4 w-4" />
        </Button>
      </div>
  </div>
}

function AssignedImages() {
  return <>

  <div className="mt-4">
    <ImageCarousel images={[
      'https://placehold.co/600x400',
      'https://placehold.co/600x400',
      'https://placehold.co/600x400',
    ]} />
  </div>
  
  </>
}

function InsuranceDetails() {
  return <>
    <Accordion
      type="single"
      collapsible
      className="w-full"
      defaultValue="item-1"
    >
      {
        Array.from({ length: 3 }).map((_, index) => (
          <AccordionItem value={`item-${index + 1}`} key={index} className="border-b">
            <AccordionTrigger>
              <h3 className="font-semibold text-base">
                202{ 5 - index}
              </h3>
            </AccordionTrigger>
            <AccordionContent className="flex flex-col gap-4 text-balance">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <h3 className="font-semibold">Insurance Company</h3>
                  <span className="text-sm">ABC Insurance Co.</span>
                </div>
                <div className="flex flex-col">
                  <h3 className="font-semibold">Plan</h3>
                  <span className="text-sm">4 Years</span>
                </div>
                <div className="flex flex-col">
                  <h3 className="font-semibold">Expiration Date</h3>
                  <span className="text-sm">Feb -12-2025</span>
                </div>
                <div className="flex flex-col">
                  <h3 className="font-semibold">Start Date</h3>
                  <span className="text-sm">Feb -12-2021</span>
                </div>
                <div className="flex flex-col">
                  <h3 className="font-semibold">Sum Insured</h3>
                  <span className="text-sm">$2,300</span>
                </div>
                <div className="flex flex-col">
                  <h3 className="font-semibold">Claim</h3>
                  <span className="text-sm">22-2-2025</span>
                </div>
                <div className="flex flex-col">
                  <h3 className="font-semibold">Risks Covered</h3>
                  <span className="text-sm">Theft</span>
                </div>
                <div className="flex flex-col">
                  <h3 className="font-semibold">Exclusions</h3>
                  <span className="text-sm">-</span>
                </div>
            </div>
            </AccordionContent>
          </AccordionItem>
        ))
      }
    </Accordion>
  </>
}

export default function AssetDetails({ data, setShowDetails }) {

  const assetData = [
    {
      label: 'Asset Name',
      value: 'Office Van'
    },
    {
      label: 'Category',
      value: 'Office Van'
    },
    {
      label: 'Sub Category',
      value: 'Office Van'
    },
    {
      label: 'Serial Number',
      value: 'MBP2024001'
    },
    {
      label: 'Description',
      value: 'Keep this for over 3 years'
    },
    {
      label: 'Depreciation Status',
      type: 'component',
      value: () => {
        return (
          <div className="grid grid-cols-1 items-center">
            <ProgressBar variant="danger" value={30} />
            <span className="text-[7pt]">The depreciation value of your asset is almost depleted. 
              <span className="font-semibold">You might want to put it up for sale on </span> <a href="#" className="text-primary underline">Shobu</a>
            </span>
          </div>
        )
      }
    },
  ]

  const purchaseData = [
    {
      label: 'Purchase Price',
      value: 'Office Van'
    },
    {
      label: 'Supplier',
      value: 'JJ Solutions'
    },
    {
      label: 'Purchase No',
      value: 'PO123456'
    },
    {
      label: 'Warranty Start Date',
      value: '01-01-2024'
    },
    {
      label: 'Serial Number',
      value: 'MBP2024001'
    },
    {
      label: 'Warranty End Date',
      value: '22-08-2026'
    },
    {
      label: 'Status',
      type: 'component',
      value: () => {
        return (
          <Badge variant="success">In Use</Badge>
        )
      }
    },
  ]

  const locationData = [
    {
      label: 'Building',
      value: 'Head Office'
    },
    {
      label: 'Floor',
      value: '3rd Floor'
    },
    {
      label: 'Room',
      value: 'Logistics Room'
    },
    {
      label: 'Assigned To',
      value: 'John Doe'
    },
    {
      label: 'Assigned Date',
      value: '2024-01-15'
    },
    {
      label: 'Department',
      value: 'Logistics'
    },
    {
      label: 'Documents',
      type: 'component',
      value: () => {
        return (
          <a
            href="#"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white p-3 transition-colors hover:bg-gray-50"
          >
            <img src={pdfIcon} alt="PDF Icon" className="h-4 w-4" />
            <span className="text-xs font-medium text-gray-700">
              file.pdf
            </span>
            <DownloadIcon className="ml-2 h-4 w-4 text-green-600" />
          </a>
        )
      }
    }
  ]


  return (
    <>
      <div className="w-full rounded-2xl bg-white p-6"> 
        <div className="flex gap-2 items-center">
          <button className="cursor-pointer" onClick={() => setShowDetails(false)}>
            <ArrowLeft />
          </button>
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#254C00] text-white">
            <HousePlus />
          </div>
          <h1 className="text-2xl font-bold">
            Asset Details
          </h1>
        </div>
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AssetCard title="Asset Information" data={assetData} />
          <AssetCard title="Attached Images" data={ { component: AssignedImages } } />
          <AssetCard title="Purchase Information" data={purchaseData} />
          <AssetCard title="Location" data={locationData} />
          <AssetCard title="Maintenance History" data={ { component: MaintenanceHistory } } />
          <AssetCard title="Insurance details" data={ { component: InsuranceDetails}} />
        </div>
      </div>
    </>
  )
}