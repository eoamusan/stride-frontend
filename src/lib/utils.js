import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function getPaginationData(data) {
  const { page, totalPages, limit: pageSize, totalDocs: totalCount } = data;
  return {
    page,
    totalPages,
    pageSize,
    totalCount,
  };
}

export const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  const month = date.toLocaleString("en-US", { month: "short" });
  const day = date.getUTCDate();
  const year = date.getUTCFullYear();

  return `${month} ${day}-${year}`;
};

export const formatTime = (dateStr) => {
  const date = new Date(dateStr);

  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true
  });
};

export const capitalizeText = (text) => {
  if (!text) return '';
  return text
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};