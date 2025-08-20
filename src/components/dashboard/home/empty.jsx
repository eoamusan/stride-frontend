import welcomeImg from '@/assets/images/welcome.svg';
import { Button } from '@/components/ui/button';

export default function EmptyDashboard({ onGetStarted }) {
  return (
    <div className="mt-10 flex w-full flex-col items-center justify-center gap-4 p-8 text-center">
      <img src={welcomeImg} alt="Welcome" />
      <div>
        <h1 className="text-3xl font-bold">Welcome To Stride</h1>
        <p className="text-[#7D7D7D]">
          Lorem ipsum dolor sit amet consectetur. Auctor aliquet sem vulputate
          diam.
        </p>
        <Button
          onClick={onGetStarted}
          className={'mt-4 h-10 w-full max-w-[298px]'}
        >
          Get Started
        </Button>
      </div>
    </div>
  );
}
