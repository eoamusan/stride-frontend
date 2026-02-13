import AssetService from "@/api/asset";
import VendorService from "@/api/vendor";
import { formatDate, getPaginationData } from "@/lib/utils";
import { useCallback, useEffect, useState } from "react";

export default function useAssets() {
  const [loadingAssets, setLoadingAssets] = useState(false);
  const [assets, setAssets] = useState([]);
  const [paginationData, setPaginationData] = useState({});
  const [loadingVendors, setLoadingVendors] = useState(false);
  const [loadingAssetDetails, setLoadingAssetDetails] = useState(false);
  const [vendors, setVendors] = useState([]);

  const fetchAssets = useCallback(async () => {

    const formatResponse = (data) => {
      return data.map((item) => ({
        ...item.asset,
        value: item.purchaseDetails?.purchasePrice || 'N/A',
        department: item?.location?.department || 'N/A',
        depreciationMethod: item.asset?.category?.depreciationMethod || 'N/A',
        categoryName: item.asset.category?.categoryName || 'N/A',
        updatedAt: formatDate(item.asset.updatedAt),
      }));
    }

    setLoadingAssets(true);
    try {
      const response = await AssetService.fetch()
      setAssets(formatResponse(response.data.data.assets) || []);
      setPaginationData(getPaginationData(response.data.data));
    } catch (error) {
      console.error('Error fetching assets:', error);
    } finally {
      setLoadingAssets(false);
    }
  }, [])

  const fetchAssetById = async (id) => {
    setLoadingAssetDetails(true);
    try {
      const response = await AssetService.get({id})
      return response.data.data;
    } catch (error) {
      console.error('Error fetching asset by ID:', error);
      return null;
    } finally {
      setLoadingAssetDetails(false);
    }
  }

  const fetchVendors = async () => {
    setLoadingVendors(true);
    try {
      const res = await VendorService.fetch();
      const vendorsData = res.data?.data?.vendors || [];
      setVendors(vendorsData);
    } catch (error) {
      console.error('Error fetching vendors:', error);
      setVendors([]);
    } finally {
      setLoadingVendors(false);
    }
  };

  useEffect(() => {
    fetchAssets();
  }, [fetchAssets])

  return { 
    paginationData, 
    assets, 
    loadingAssets,
    loadingVendors,
    vendors,
    loadingAssetDetails,
    fetchAssetById,
    fetchVendors,
    fetchAssets,
  }; 
}