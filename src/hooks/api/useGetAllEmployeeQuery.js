import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/lib/axios';
import { useUserStore } from '@/stores/user-store';
import {
  buildQueryUrl,
  normalizeApiCollection,
  extractPaginationMeta,
} from '@/lib/utils';

export const EMPLOYEES_QUERY_KEY = 'employees';

export const useGetAllEmployeeQuery = (options = {}) => {
  const {
    search = '',
    page = 1,
    perPage = 10,
    enabled = true,
    accountId: overrideAccountId,
  } = options;

  const accessToken = useUserStore((state) => state.data?.accessToken);
  const accountData = useUserStore((state) => state.data?.account);
  const fallbackAccountId = useUserStore((state) => state.data?.accountId);
  const activeBusinessAccountId = useUserStore(
    (state) => state.activeBusiness?.accountId || state.activeBusiness?._id
  );

  const accountId =
    overrideAccountId ??
    accountData?._id ??
    fallbackAccountId ??
    activeBusinessAccountId ??
    null;

  const queryEnabled = enabled && Boolean(accessToken && accountId);

  const queryResult = useQuery({
    queryKey: [EMPLOYEES_QUERY_KEY, accountId, search || '', page, perPage],
    enabled: queryEnabled,
    keepPreviousData: true,
    queryFn: async () => {
      const response = await axiosInstance.post(
        buildQueryUrl('/employee/fetch', { search, page, perPage }),
        { accountId },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      return response.data;
    },
  });

  const employees = useMemo(
    () =>
      normalizeApiCollection(queryResult.data, [
        'employees',
        'items',
        'data',
        'docs',
      ]),
    [queryResult.data]
  );

  const pagination = useMemo(
    () =>
      extractPaginationMeta(queryResult.data, {
        page,
        perPage,
        totalDocs: employees.length,
      }),
    [queryResult.data, page, perPage, employees.length]
  );

  return {
    ...queryResult,
    employees,
    pagination,
  };
};
