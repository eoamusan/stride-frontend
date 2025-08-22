import { Card } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';

export default function ActiveProjectsTable({ className, tableData }) {
  const headers = [
    { key: 'projectName', label: 'Project Name' },
    { key: 'category', label: 'Category' },
    { key: 'dueDate', label: 'Due Date' },
    { key: 'priority', label: 'Priorities' },
    { key: 'status', label: 'Status' },
  ];

  return (
    <Card className={cn('w-full p-6', className)}>
      <h3 className="text-lg font-semibold">Active Projects</h3>
      <Table>
        <TableHeader className={'bg-[#EFE6FD]'}>
          <TableRow>
            {headers.map((header) => (
              <TableHead key={header.key}>{header.label}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {tableData.map((row) => (
            <TableRow className={'text-sm'} key={row.id}>
              <TableCell className={'py-5'}>{row.projectName}</TableCell>
              <TableCell>{row.category}</TableCell>
              <TableCell>{row.dueDate}</TableCell>
              <TableCell>{row.priority}</TableCell>
              <TableCell>
                <span
                  className={`${
                    row.status === 'Completed'
                      ? 'text-green-700'
                      : row.status === 'In Progress'
                        ? 'text-blue-700'
                        : row.status === 'Active'
                          ? 'text-purple-700'
                          : 'text-gray-700'
                  }`}
                >
                  {row.status}
                </span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}
