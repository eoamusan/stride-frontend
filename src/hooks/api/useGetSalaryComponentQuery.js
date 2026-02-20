import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/lib/axios';
import { useUserStore } from '@/stores/user-store';

export const SALARY_COMPONENT_QUERY_KEY = 'salary-component';

export const useGetSalaryComponentQuery = (options = {}) => {
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
      SALARY_COMPONENT_QUERY_KEY,
      accountId,
      search || '',
      page,
      perPage,
    ],
    enabled: queryEnabled,
    keepPreviousData: true,
    queryFn: async () => {
      const response = await axiosInstance.post(
        buildFetchUrl({ search, page, perPage }),
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

  const salaryComponents = useMemo(
    () => normalizeSalaryComponents(queryResult.data),
    [queryResult.data]
  );

  const pagination = useMemo(
    () =>
      extractPagination(
        queryResult.data,
        { page, perPage },
        {
          totalDocs: salaryComponents.length,
        }
      ),
    [queryResult.data, page, perPage, salaryComponents.length]
  );

  return {
    ...queryResult,
    salaryComponents,
    pagination,
  };
};

const buildFetchUrl = ({ search, page, perPage }) => {
  const params = new URLSearchParams();
  if (search) params.append('search', search);
  if (page) params.append('page', page);
  if (perPage) params.append('perPage', perPage);

  const queryString = params.toString();
  return queryString
    ? `/salary-component/fetch?${queryString}`
    : '/salary-component/fetch';
};

const normalizeSalaryComponents = (payload) => {
  if (!payload) return [];

  const layers = [payload?.data, payload];

  for (const layer of layers) {
    if (!layer) continue;

    if (Array.isArray(layer.components)) return layer.components;
    if (Array.isArray(layer.salaryComponents)) return layer.salaryComponents;
    if (Array.isArray(layer.items)) return layer.items;
    if (Array.isArray(layer.data)) return layer.data;
    if (Array.isArray(layer.docs)) return layer.docs;
  }

  if (Array.isArray(payload)) return payload;
  return [];
};

const extractPagination = (payload, fallback = {}, defaults = {}) => {
  const dataLayer = payload?.data ?? payload ?? {};
  const paginationSource =
    dataLayer?.meta ||
    dataLayer?.pagination ||
    dataLayer?.pageData ||
    dataLayer;

  const parsedPerPage =
    toPositiveNumber(
      paginationSource?.perPage ??
        paginationSource?.limit ??
        paginationSource?.pageSize ??
        fallback.perPage
    ) ?? 10;

  const totalDocs =
    toNumber(
      paginationSource?.totalDocs ??
        paginationSource?.total ??
        paginationSource?.count
    ) ??
    defaults.totalDocs ??
    0;

  const totalPagesFromDocs =
    parsedPerPage > 0
      ? Math.max(1, Math.ceil(totalDocs / parsedPerPage))
      : (fallback.totalPages ?? 1);

  return {
    page:
      toPositiveNumber(
        paginationSource?.page ?? paginationSource?.currentPage
      ) ??
      fallback.page ??
      1,
    perPage: parsedPerPage,
    totalPages:
      toPositiveNumber(paginationSource?.totalPages) ??
      fallback.totalPages ??
      totalPagesFromDocs,
    totalDocs,
  };
};

const toPositiveNumber = (value) => {
  const num = Number(value);
  return Number.isFinite(num) && num > 0 ? num : undefined;
};

const toNumber = (value) => {
  const num = Number(value);
  return Number.isFinite(num) ? num : undefined;
};
