const SimplePagination = ({ currentPage, totalPages, onPrevious, onNext }) => {
  const resolvedTotalPages = totalPages || 1;

  if (resolvedTotalPages <= 1) {
    return null;
  }

  return (
    <div className="flex items-center justify-between rounded-xl border border-gray-100 bg-white px-4 py-2 text-sm text-gray-600">
      <button
        type="button"
        className="font-medium text-blue-600 disabled:cursor-not-allowed disabled:text-gray-300"
        onClick={onPrevious}
        disabled={currentPage <= 1}
      >
        Previous
      </button>
      <span>
        Page {currentPage} of {resolvedTotalPages}
      </span>
      <button
        type="button"
        className="font-medium text-blue-600 disabled:cursor-not-allowed disabled:text-gray-300"
        onClick={onNext}
        disabled={currentPage >= resolvedTotalPages}
      >
        Next
      </button>
    </div>
  );
};

export default SimplePagination;
