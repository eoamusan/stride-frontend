import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/lib/axios';
import { useUserStore } from '@/stores/user-store';
import {
  buildQueryUrl,
  normalizeApiCollection,
  extractPaginationMeta,
} from '@/lib/utils';

export const PAYROLL_RUNS_QUERY_KEY = 'payroll-runs';

export const useGetAllPayrollQuery = (options = {}) => {
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
    queryKey: [PAYROLL_RUNS_QUERY_KEY, accountId, search || '', page, perPage],
    enabled: queryEnabled,
    keepPreviousData: true,
    queryFn: async () => {
      const response = await axiosInstance.post(
        buildQueryUrl('/payroll/records/fetch', { search, page, perPage }),
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

  const payrollRuns = useMemo(
    () =>
      normalizeApiCollection(queryResult.data, [
        'runPayrolls',
        'payrolls',
        'runs',
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
        totalDocs: payrollRuns.length,
      }),
    [queryResult.data, page, perPage, payrollRuns.length]
  );

  return {
    ...queryResult,
    payrollRuns,
    pagination,
  };
};
