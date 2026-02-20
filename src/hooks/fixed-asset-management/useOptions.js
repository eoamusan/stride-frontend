import OptionService from "@/api/option";
import { useCallback, useState } from "react";

export default function useOptions() {
  const [loadingOptions, setLoadingOptions] = useState(false);
  const [buildingOptions, setBuildingOptions] = useState([]);
  const [floorOptions, setFloorOptions] = useState([]);
  const [departmentOptions, setDepartmentOptions] = useState([]);
  const [subCategoryOptions, setSubCategoryOptions] = useState([]);
  const [openOptionsForm, setOpenOptionsForm] = useState({ open: false, type: '' });

  // Fetch options and filter based on type (e.g. if type is building, fetch building options)
  const fetchOptions = useCallback(async (type) => {
    setLoadingOptions(true);
    try {
      const response = await OptionService.fetch({ section: type });
      const optionsData = response.data?.data || [];
      if (type === 'building') {
        setBuildingOptions(optionsData);
      } else if (type === 'floor') {
        setFloorOptions(optionsData);
      } else if (type === 'department') {
        setDepartmentOptions(optionsData);
      } else if (type === 'sub-category') {
        setSubCategoryOptions(optionsData);
      }
    } catch (error) {
      console.error(`Error fetching ${type} options:`, error);
      if (type === 'building') {
        setBuildingOptions([]);
      } else if (type === 'floor') {
        setFloorOptions([]);
      } else if (type === 'department') {
        setDepartmentOptions([]);
      } else if (type === 'sub-category') {
        setSubCategoryOptions([]);
      }
    } finally {
      setLoadingOptions(false);
    }
  }, []);

  return { 
    loadingOptions,
    buildingOptions,
    floorOptions,
    departmentOptions,
    subCategoryOptions,
    openOptionsForm,
    setOpenOptionsForm,
    fetchOptions
  }; 
}