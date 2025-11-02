import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Checkbox } from '@/components/ui/checkbox';
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  Search,
  XIcon,
  Check,
} from 'lucide-react';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

// Sample contacts data
const contactsData = [
  {
    id: 1,
    company: 'JJ Solutions',
    avatar: 'J&J',
    isOnline: true,
    avatarBg: 'bg-red-500',
  },
  {
    id: 2,
    company: 'Adefe Foods',
    avatar: '',
    isOnline: true,
    avatarBg: 'bg-purple-500',
  },
  {
    id: 3,
    company: 'Hema Ventures',
    avatar: 'H',
    isOnline: true,
    avatarBg: 'bg-yellow-500',
  },
  {
    id: 4,
    company: 'Fresh Foods',
    avatar: 'FF',
    isOnline: true,
    avatarBg: 'bg-gray-400',
  },
  {
    id: 5,
    company: 'Ace Limited',
    avatar: 'A',
    isOnline: true,
    avatarBg: 'bg-blue-600',
  },
  {
    id: 6,
    company: 'Obade Groceries',
    avatar: 'OG',
    isOnline: true,
    avatarBg: 'bg-blue-500',
  },
  {
    id: 7,
    company: 'Dan Ventures',
    avatar: '',
    isOnline: true,
    avatarBg: 'bg-teal-500',
  },
  {
    id: 8,
    company: 'Esther Howard',
    avatar: 'EH',
    isOnline: true,
    avatarBg: 'bg-gray-600',
  },
  {
    id: 9,
    company: 'TechCorp Solutions',
    avatar: 'TC',
    isOnline: false,
    avatarBg: 'bg-indigo-500',
  },
  {
    id: 10,
    company: 'Green Valley Farms',
    avatar: 'GV',
    isOnline: true,
    avatarBg: 'bg-green-500',
  },
  {
    id: 11,
    company: 'Digital Marketing Pro',
    avatar: 'DM',
    isOnline: true,
    avatarBg: 'bg-pink-500',
  },
  {
    id: 12,
    company: 'Alpha Industries',
    avatar: 'AI',
    isOnline: false,
    avatarBg: 'bg-orange-500',
  },
  {
    id: 13,
    company: 'Beta Consulting',
    avatar: 'BC',
    isOnline: true,
    avatarBg: 'bg-cyan-500',
  },
  {
    id: 14,
    company: 'Gamma Enterprises',
    avatar: '',
    isOnline: true,
    avatarBg: 'bg-lime-500',
  },
  {
    id: 15,
    company: 'Delta Corp',
    avatar: 'DC',
    isOnline: false,
    avatarBg: 'bg-amber-500',
  },
  {
    id: 16,
    company: 'Omega Technologies',
    avatar: 'OT',
    isOnline: true,
    avatarBg: 'bg-emerald-500',
  },
  {
    id: 17,
    company: 'Sigma Logistics',
    avatar: 'SL',
    isOnline: true,
    avatarBg: 'bg-rose-500',
  },
  {
    id: 18,
    company: 'Theta Innovations',
    avatar: 'TI',
    isOnline: false,
    avatarBg: 'bg-violet-500',
  },
  {
    id: 19,
    company: 'Zeta Marketing',
    avatar: 'ZM',
    isOnline: true,
    avatarBg: 'bg-sky-500',
  },
  {
    id: 20,
    company: 'Kappa Designs',
    avatar: 'KD',
    isOnline: true,
    avatarBg: 'bg-red-600',
  },
  {
    id: 21,
    company: 'Lambda Services',
    avatar: 'LS',
    isOnline: false,
    avatarBg: 'bg-blue-700',
  },
  {
    id: 22,
    company: 'Mu Manufacturing',
    avatar: 'MM',
    isOnline: true,
    avatarBg: 'bg-purple-600',
  },
  {
    id: 23,
    company: 'Nu Networks',
    avatar: 'NN',
    isOnline: true,
    avatarBg: 'bg-green-600',
  },
  {
    id: 24,
    company: 'Xi Xpress',
    avatar: 'XX',
    isOnline: false,
    avatarBg: 'bg-yellow-600',
  },
  {
    id: 25,
    company: 'Phi Financial',
    avatar: 'PF',
    isOnline: true,
    avatarBg: 'bg-gray-700',
  },
];

export default function ContactList({
  onClose,
  onContactSelect,
  multiSelect = true,
  onSelectionChange,
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedContacts, setSelectedContacts] = useState([]);
  const itemsPerPage = 10;

  // Filter contacts based on search query
  const filteredContacts = contactsData.filter((contact) =>
    contact.company.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate pagination
  const totalPages = Math.ceil(filteredContacts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedContacts = filteredContacts.slice(startIndex, endIndex);

  // Reset to first page when search changes
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  // Handle contact selection
  const handleContactSelect = (contact) => {
    if (multiSelect) {
      const isSelected = selectedContacts.find((c) => c.id === contact.id);
      let newSelection;

      if (isSelected) {
        newSelection = selectedContacts.filter((c) => c.id !== contact.id);
      } else {
        newSelection = [...selectedContacts, contact];
      }

      setSelectedContacts(newSelection);

      if (onSelectionChange) {
        onSelectionChange(newSelection);
      }
    } else {
      if (onContactSelect) {
        onContactSelect(contact);
      }
    }
  };

  // Check if contact is selected
  const isContactSelected = (contactId) => {
    return selectedContacts.some((c) => c.id === contactId);
  };

  // Clear selections
  // const clearSelections = () => {
  //   setSelectedContacts([]);
  //   if (onSelectionChange) {
  //     onSelectionChange([]);
  //   }
  // };

  // Handle close
  const handleClose = () => {
    if (onClose) {
      onClose();
    }
  };
  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-white lg:relative lg:inset-auto lg:z-auto lg:min-w-[341px] lg:rounded-lg lg:border lg:border-gray-200 lg:shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold">
            {multiSelect ? 'Select Contacts' : 'New Message'}
          </h2>
          {multiSelect && selectedContacts.length > 0 && (
            <span className="text-sm text-gray-500">
              ({selectedContacts.length} selected)
            </span>
          )}
        </div>
        <Button variant="ghost" size="icon" onClick={handleClose}>
          <XIcon className="h-4 w-4 text-gray-500" />
        </Button>
      </div>

      {/* Search */}
      <div className="px-4 py-4 pt-2">
        <div className="relative">
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
          <Input
            placeholder="Search Messages"
            value={searchQuery}
            onChange={handleSearchChange}
            className="rounded-xl pl-10"
          />
        </div>
      </div>

      <div className="mb-4 flex justify-end px-4">
        <Button variant={'outline'} className={'text-sm'}>
          Message
        </Button>
      </div>

      {/* Contact Lists */}

      <div className="min-h-[40vh] flex-1 overflow-y-auto lg:max-h-[50vh] lg:flex-none">
        {paginatedContacts.length > 0 ? (
          paginatedContacts.map((contact) => {
            const isSelected = isContactSelected(contact.id);
            return (
              <div
                key={contact.id}
                onClick={() => handleContactSelect(contact)}
                className={`flex cursor-pointer items-start gap-3 border-b border-gray-100 p-4 transition-colors hover:bg-gray-50 ${
                  isSelected ? 'border-blue-200 bg-blue-50' : ''
                }`}
              >
                {/* Checkbox for multi-select */}
                {multiSelect && (
                  <div className="flex items-center pt-1">
                    <div
                      className={`flex size-4 items-center justify-center rounded border-2 transition-colors ${
                        isSelected
                          ? 'bg-primary border-primary'
                          : 'hover:border-primary/70 border-gray-300'
                      }`}
                    >
                      {isSelected && <Check className="h-3 w-3 text-white" />}
                    </div>
                  </div>
                )}

                {/* Avatar */}
                <div className="relative">
                  <Avatar className={`size-6 ${contact.avatarBg} text-white`}>
                    <AvatarFallback
                      className={`${contact.avatarBg} text-xs font-medium text-white`}
                    >
                      {contact.avatar || contact.company.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  {contact.isOnline && (
                    <div className="absolute -right-0.5 -bottom-0.5 h-2 w-2 rounded-full border-2 border-white bg-green-500"></div>
                  )}
                </div>

                {/* Message Content */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="truncate text-sm font-semibold">
                      {contact.company}
                    </h3>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="flex h-48 items-center justify-center">
            <p className="text-sm text-gray-500">No Contacts</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="border-t px-4 py-2 lg:border-t-0">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationLink
                  aria-label="Go to previous page"
                  size="default"
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(1, prev - 1))
                  }
                  className={
                    currentPage === 1
                      ? 'pointer-events-none opacity-50'
                      : 'cursor-pointer'
                  }
                >
                  <ArrowLeftIcon />
                </PaginationLink>
              </PaginationItem>

              {[...Array(totalPages)].map((_, index) => {
                const pageNum = index + 1;
                return (
                  <PaginationItem key={pageNum}>
                    <PaginationLink
                      onClick={() => setCurrentPage(pageNum)}
                      isActive={currentPage === pageNum}
                      className="cursor-pointer"
                    >
                      {pageNum}
                    </PaginationLink>
                  </PaginationItem>
                );
              })}

              <PaginationItem>
                <PaginationLink
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                  }
                  className={
                    currentPage === totalPages
                      ? 'pointer-events-none opacity-50'
                      : 'cursor-pointer'
                  }
                >
                  <ArrowRightIcon />
                </PaginationLink>
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}
