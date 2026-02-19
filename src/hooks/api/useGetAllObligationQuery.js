import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/lib/axios';
import { useUserStore } from '@/stores/user-store';
import {
  buildQueryUrl,
  normalizeApiCollection,
  extractPaginationMeta,
} from '@/lib/utils';

export const PAYROLL_OBLIGATIONS_QUERY_KEY = 'payroll-obligations';

export const useGetAllObligationQuery = (options = {}) => {
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
    queryKey: [
      PAYROLL_OBLIGATIONS_QUERY_KEY,
      accountId,
      search || '',
      page,
      perPage,
    ],
    enabled: queryEnabled,
    keepPreviousData: true,
    queryFn: async () => {
      const response = await axiosInstance.post(
        buildQueryUrl('/payroll/obligations/fetch', { search, page, perPage }),
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

  const obligations = useMemo(
    () =>
      normalizeApiCollection(queryResult.data, [
        'obligations',
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
        totalDocs: obligations.length,
      }),
    [queryResult.data, page, perPage, obligations.length]
  );

  return {
    ...queryResult,
    obligations,
    pagination,
  };
};