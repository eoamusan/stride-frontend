import { Progress } from "@/components/ui/progress";

export default function ProgressBar({ variant, value, className }) {
  let cls = ''
  switch(variant) {
    case 'success':
      cls = 'bg-[#24A959]'
      break;
    case 'danger':
      cls = 'bg-[#CF0505]'
      break;
    default:
  }
  return (
    <Progress value={value} className={`bg-[#D3D3D3] ${className}`} indicatorClassName={cls} />
  );
}