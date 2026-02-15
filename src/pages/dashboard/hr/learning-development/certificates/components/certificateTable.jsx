import { useMemo, useState } from 'react';
import { useModalStore } from '@/stores/modal-store';
import CustomModal from '@/components/customs/modal';
import RenewCertificateModalContent from './renewCertificateModalContent';
import CertificatePreview from './certificatePreview';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

import { CardContent } from '@/components/ui/card';
import { useTableStore } from '@/stores/table-store';

import FilterIcon from '@/assets/icons/filter.svg';
import { CustomButton, CustomTable, SearchInput } from '@/components/customs';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { TableCell, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { MoreHorizontalIcon } from 'lucide-react';

import EyeIcon from '@/assets/icons/eye.svg';
import DownloadIcon from '@/assets/icons/download.svg';
import RefreshIcon from '@/assets/icons/refresh-circle.svg';
import DeleteIcon from '@/assets/icons/gray-delete.svg';
import DocumentIcon from '@/assets/icons/document-text.svg';

import RenewIcon from '@/assets/icons/refresh.svg';

const statusBadgeStyles = {
  'expiring soon': 'bg-amber-50 text-amber-400',
  verified: 'bg-green-100 text-green-500',
  expired: 'bg-red-50 text-red-500',
};

const CertificateTable = () => {
  const [statusFilter, setStatusFilter] = useState('all');
  const [rows, _setRows] = useState(tableData);
  const [searchTerm, setSearchTerm] = useState('');
  const [previewId, setPreviewId] = useState(null);
  const { openModal, closeModal, modals } = useModalStore();
  const [renewId, setRenewId] = useState(null);

  const currentPage = useTableStore((s) => s.currentPage);
  const setCurrentPage = useTableStore((state) => state.setCurrentPage);

  const pageSize = 5;

  const filteredRows = useMemo(() => {
    return rows.filter((r) => {
      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'verified' &&
          r.status.toLowerCase() === 'verified') ||
        (statusFilter === 'expiring-soon' &&
          new Date(r.expiryDate) > new Date() &&
          new Date(r.expiryDate) <
            new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)) ||
        (statusFilter === 'expired' && new Date(r.expiryDate) < new Date());

      if (!matchesStatus) return false;

      if (!searchTerm) return true;

      const term = searchTerm.toLowerCase();
      return (
        r.employeeName.toLowerCase().includes(term) ||
        r.certificateName.toLowerCase().includes(term) ||
        r.course.toLowerCase().includes(term)
      );
    });
  }, [rows, searchTerm, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredRows.length / pageSize));
  const startIndex = (currentPage - 1) * pageSize;
  const currentPageRows = filteredRows.slice(startIndex, startIndex + pageSize);

  const handleStatusFilterChange = (status) => {
    setStatusFilter(status);
    setCurrentPage(1);
  };

  const renderBadge = (text) => {
    const key = (text || '').toLowerCase();
    const styles = statusBadgeStyles[key] ?? 'bg-gray-100 text-gray-700';
    return (
      <span
        className={`inline-flex w-[125px] items-center justify-center rounded-full px-4 py-2 text-sm font-medium ${styles}`}
      >
        {text}
      </span>
    );
  };

  const handlePreview = (id) => {
    setPreviewId(id);
    openModal('certificatePreview');
  };

  const handleClosePreview = () => {
    setPreviewId(null);
    closeModal('certificatePreview');
  };

  // Download PDF logic
  const handleDownloadPDF = async () => {
    const element = document.getElementById('certificate-preview-content');
    if (!element) return;
    const canvas = await html2canvas(element, { scale: 2 });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'pt',
      format: 'a4',
    });
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pageWidth;
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    pdf.addImage(
      imgData,
      'PNG',
      0,
      0,
      pdfWidth,
      pdfHeight > pageHeight ? pageHeight : pdfHeight
    );
    pdf.save('certificate.pdf');
  };

  const handleRenew = (id) => {
    setRenewId(id);
    openModal('renewCertificate');
  };

  const handleCloseRenew = () => {
    setRenewId(null);
    closeModal('renewCertificate');
  };

  // Renew modal submit handler
  const handleRenewSubmit = (data) => {
    // Here you would call your API to update the expiry date
    // e.g. api.renewCertificate(renewId, data.newExpiryDate)
    handleCloseRenew();
  };

  const handleDelete = () => {
    // TODO: Implement delete logic
  };

  return (
    <>
      <CardContent>
        <div className="mb-4 flex flex-col justify-between gap-3 md:flex-row md:items-center">
          <h2 className="text-lg font-semibold">Certificates</h2>

          <div className="flex items-center gap-3">
            <SearchInput
              placeholder="Search certificate..."
              value={searchTerm}
              onValueChange={setSearchTerm}
              resetPageOnChange
              onResetPage={() => setCurrentPage(1)}
            />

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className={
                    statusFilter !== 'all' ? 'border-blue-200 bg-blue-50' : ''
                  }
                  title="Filter by Status"
                >
                  <img src={FilterIcon} alt="Filter by Status" />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="text-sm">
                {statusFilterData.map((filter) => (
                  <DropdownMenuItem
                    key={filter.key}
                    onClick={() => handleStatusFilterChange(filter.key)}
                    className={statusFilter === filter.key ? 'bg-blue-50' : ''}
                  >
                    {filter.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <CustomTable
          tableHeaders={tableHeaders}
          totalPages={totalPages}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          statusFilter={statusFilter}
        >
          {currentPageRows.map((row) => (
            <TableRow key={row.id} className="rounded-2xl">
              <TableCell className="py-6">{row.employeeName}</TableCell>
              <TableCell className="py-6 text-sm font-medium">
                {row.certificateName}
              </TableCell>
              <TableCell className="py-6 text-sm font-medium">
                {row.course}
              </TableCell>
              <TableCell className="py-6">{row.issueDate}</TableCell>
              <TableCell className="py-6">{row.expiryDate}</TableCell>
              <TableCell className="py-6">{renderBadge(row.status)}</TableCell>
              <TableCell className="py-6 text-right md:w-5">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="size-8">
                      <MoreHorizontalIcon />
                      <span className="sr-only">Open menu</span>
                    </Button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent align="end" className="text-sm">
                    <DropdownMenuItem onClick={() => handlePreview(row.id)}>
                      <span className="flex items-center gap-2">
                        <img src={EyeIcon} alt="Preview" className="h-4 w-4" />
                        Preview
                      </span>
                    </DropdownMenuItem>

                    <DropdownMenuItem onClick={() => handleDownload(row.id)}>
                      <span className="flex items-center gap-2">
                        <img
                          src={DownloadIcon}
                          alt="Download"
                          className="h-4 w-4"
                        />
                        Download
                      </span>
                    </DropdownMenuItem>

                    <DropdownMenuItem onClick={() => handleRenew(row.id)}>
                      <span className="flex items-center gap-2">
                        <img
                          src={RefreshIcon}
                          alt="Renew"
                          className="h-4 w-4"
                        />
                        Renew
                      </span>
                    </DropdownMenuItem>

                    <DropdownMenuItem
                      onClick={() => handleDelete(row.id)}
                      className="text-red-500"
                    >
                      <span className="flex items-center gap-2">
                        <img
                          src={DeleteIcon}
                          alt="Delete"
                          className="h-4 w-4"
                        />
                        Delete
                      </span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </CustomTable>
      </CardContent>

      <CustomModal
        open={!!modals['renewCertificate']?.open}
        handleClose={handleCloseRenew}
        title="Renew Certificate"
        description="Renew certificate to maintain compliance"
        className="max-w-md"
        icon={RenewIcon}
      >
        <RenewCertificateModalContent
          onSubmit={handleRenewSubmit}
          onCancel={handleCloseRenew}
        />
      </CustomModal>

      <CustomModal
        open={!!modals['certificatePreview']?.open}
        handleClose={handleClosePreview}
        title="Certificate Preview"
        className="sm:max-w-3xl"
        icon={DocumentIcon}
      >
        <div id="certificate-preview-content">
          <CertificatePreview id={previewId} />
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <CustomButton variant="outline" onClick={handleClosePreview}>
            Back
          </CustomButton>
          <CustomButton onClick={handleDownloadPDF}>Download PDF</CustomButton>
        </div>
      </CustomModal>
    </>
  );
};

export default CertificateTable;

const statusFilterData = [
  { key: 'all', label: 'All Status' },
  { key: 'verified', label: 'Verified' },
  { key: 'expiring-soon', label: 'Expiring Soon' },
  { key: 'expired', label: 'Expired' },
];

const tableHeaders = [
  { key: 'employeeName', label: 'Employee', className: '' },
  { key: 'certificateName', label: 'Certificate Name', className: '' },
  { key: 'course', label: 'Course', className: '' },
  { key: 'issueDate', label: 'Issue Date', className: '' },
  { key: 'expiryDate', label: 'Expiry Date', className: '' },
  { key: 'status', label: 'Status', className: '' },
  { key: 'actions', label: '', className: 'w-10 text-right' },
];

const tableData = [
  {
    id: '1',
    employeeName: 'Sarah Jenkins',
    certificateName: 'Advanced React Patterns',
    course: 'React Development',
    issueDate: '2026-02-05',
    expiryDate: '2027-02-05',
    status: 'Verified',
  },
  {
    id: '2',
    employeeName: 'Michael Chen',
    certificateName: 'Data Privacy Compliance',
    course: 'Data Privacy',
    issueDate: '2026-02-08',
    expiryDate: '2027-02-08',
    status: 'Verified',
  },
  {
    id: '3',
    employeeName: 'Emily Rodriguez',
    certificateName: 'Leadership Skills Development',
    course: 'Leadership',
    issueDate: '2026-02-10',
    expiryDate: '2027-02-10',
    status: 'Expiring Soon',
  },
  {
    id: '4',
    employeeName: 'James Wilson',
    certificateName: 'Cloud Computing Basics',
    course: 'Cloud Computing',
    issueDate: '2026-02-11',
    expiryDate: '2027-02-11',
    status: 'Expired',
  },
  {
    id: '5',
    employeeName: 'Jessica Lee',
    certificateName: 'Business Communication',
    course: 'Business Management',
    issueDate: '2026-02-09',
    expiryDate: '2027-02-09',
    status: 'Expiring Soon',
  },
  {
    id: '6',
    employeeName: 'David Kumar',
    certificateName: 'Python for Data Science',
    course: 'Data Science',
    issueDate: '2026-02-12',
    expiryDate: '2027-02-12',
    status: 'Expired',
  },
  {
    id: '7',
    employeeName: 'Jessica Lee',
    certificateName: 'Business Communication',
    course: 'Business Management',
    issueDate: '2026-02-09',
    expiryDate: '2027-02-09',
    status: 'Expiring Soon',
  },
  {
    id: '8',
    employeeName: 'David Kumar',
    certificateName: 'Python for Data Science',
    course: 'Data Science',
    issueDate: '2026-02-12',
    expiryDate: '2027-02-12',
    status: 'Verified',
  },
];
