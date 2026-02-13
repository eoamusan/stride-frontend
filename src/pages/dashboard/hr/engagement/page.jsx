import PlusIcon from '@/assets/icons/plus.svg';
import Header from '@/components/customs/header';
import { CustomButton } from '@/components/customs';

export default function Engagement() {
  return (
    <div className="my-5 flex flex-col gap-4">
      <Header
        title="Payslip Management"
        description="Generate and distribute payslips to employees"
        hasYoutubeButton
      >
        <CustomButton
          className="w-full rounded-xl py-6 text-sm md:w-auto"
        >
          <img src={PlusIcon} alt="create new course" className="mr-1" />
          Create New Course
        </CustomButton>
      </Header>
    </div>
  );
}
