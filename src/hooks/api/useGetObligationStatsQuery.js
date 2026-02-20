import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/lib/axios';
import { useUserStore } from '@/stores/user-store';

export const PAYROLL_OBLIGATIONS_STATS_QUERY_KEY = 'payroll-obligations-stats';

export const useGetObligationStatsQuery = (options = {}) => {
  const { enabled = true, accountId: overrideAccountId } = options;

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
    queryKey: [PAYROLL_OBLIGATIONS_STATS_QUERY_KEY, accountId],
    enabled: queryEnabled,
    queryFn: async () => {
      const response = await axiosInstance.post(
        '/payroll/obligations/stats',
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

  const stats = useMemo(() => queryResult.data ?? null, [queryResult.data]);

  return {
    ...queryResult,
    stats,
  };
};