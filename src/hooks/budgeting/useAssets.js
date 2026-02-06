import AssetService from "@/api/asset";
import { formatDate, getPaginationData } from "@/lib/utils";
import { useCallback, useEffect, useState } from "react";

export default function useAssets() {
  const [loadingAssets, setLoadingAssets] = useState(false);
  const [assets, setAssets] = useState([]);
  const [paginationData, setPaginationData] = useState({});

  const fetchAssets = useCallback(async () => {

    const formatResponse = (data) => {
      return data.map((item) => ({
        ...item.asset,
        updatedAt: formatDate(item.asset.updatedAt),
      }));
    }

    setLoadingAssets(true);
    try {
      const response = await AssetService.fetch()
      setAssets(formatResponse(response.data.data) || []);
      setPaginationData(getPaginationData(response.data.data));
    } catch (error) {
      console.error('Error fetching assets:', error);
    } finally {
      setLoadingAssets(false);
    }
  }, [])
  

  useEffect(() => {
    fetchAssets()
  }, [fetchAssets])

  return { 
    paginationData, 
    assets, 
    loadingAssets,
    fetchAssets,
  }; 
}