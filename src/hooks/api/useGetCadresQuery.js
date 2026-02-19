import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/lib/axios';
import { useUserStore } from '@/stores/user-store';
import { normalizeApiCollection } from '@/lib/utils';

export const CADRES_QUERY_KEY = 'cadres';

export const useGetCadresQuery = (options = {}) => {
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
    queryKey: [CADRES_QUERY_KEY, accountId],
    enabled: queryEnabled,
    queryFn: async () => {
      const response = await axiosInstance.post(
        '/payroll/cadres',
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

  const cadres = useMemo(
    () =>
      normalizeApiCollection(queryResult.data, [
        'cadres',
        'cadreList',
        'results',
      ]),
    [queryResult.data]
  );

  return {
    ...queryResult,
    cadres,
  };
};