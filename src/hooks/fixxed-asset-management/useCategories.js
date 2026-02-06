import AssetCategoryService from "@/api/category";
import { getPaginationData } from "@/lib/utils";
import { useCallback, useState } from "react";

export default function useCategories() {
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [categories, setCategories] = useState([]);
  const [paginationData, setPaginationData] = useState({});

  const fetchCategories = useCallback(async () => {
    const formatResponse = (data) => {
      return data.map((item) => ({
        ...item,
        salvageValue: new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(Number(item.salvageValue) || 0),
        
      }));
    }
    setLoadingCategories(true);
    try {
      const response = await AssetCategoryService.fetch()
      console.log('Fetched categories:', formatResponse(response.data.data.categories));
      setCategories(formatResponse(response.data.data.categories || []));
      setPaginationData(getPaginationData(response.data.data));
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoadingCategories(false);
    }
  }, [])

  return { 
    paginationData, 
    categories, 
    loadingCategories,
    fetchCategories,
  }; 
}