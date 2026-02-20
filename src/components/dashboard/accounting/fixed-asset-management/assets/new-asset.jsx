import { useCallback, useState } from 'react';
import { Button } from '@/components/ui/button';
import { HousePlus, PlusCircleIcon } from 'lucide-react';
import AssetForm from '@/components/dashboard/accounting/fixed-asset-management/assets/asset-form';
import { AppDialog } from '@/components/core/app-dialog';
import SuccessModal from '@/components/dashboard/accounting/success-modal';

export default function NewAsset({ className = 'h-10 rounded-2xl text-sm', label = "Add Asset", showIcon = true }) {
  const [ openAssetForm, setOpenAssetForm ] = useState(false)
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false)

  const handleOnCreateAsset = useCallback(() => {
    setOpenAssetForm(false)
    setIsSuccessModalOpen(true);
  }, [])

  return (
    <>
      <Button
        onClick={() => setOpenAssetForm(true)}
        className={`${className}`}
      >
        {showIcon && <PlusCircleIcon className="size-4" />}
        { label }
      </Button>
      <AppDialog 
        title="Add New Asset"
        description="Create a new asset entry with comprehensive information and documentation"
        headerIcon={<HousePlus />}
        open={openAssetForm} 
        onOpenChange={setOpenAssetForm}
        className='sm:max-w-163'
      >
        <AssetForm onCreateAsset={handleOnCreateAsset} />
      </AppDialog>
      <SuccessModal
        title={'Asset Saved'}
        description={"You've successfully created an Asset."}
        open={isSuccessModalOpen}
        onOpenChange={setIsSuccessModalOpen}
        backText={'Back'}
        handleBack={() => {
          setIsSuccessModalOpen(false);
        }} 
      />
    </>
  );
}
