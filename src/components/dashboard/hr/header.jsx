import youtubeIcon from '@/assets/icons/youtube-red.png';
import { Button } from '@/components/ui/button';

const Header = ({ title, description, children }) => {
  return (
    <div className="flex flex-wrap items-center justify-between gap-6">
      <hgroup className="flex flex-col gap-1">
        <h1 className="text-[24px] font-semibold">{title}</h1>
        <p className="text-xs text-[#7D7D7D]">{description}</p>
      </hgroup>

      <div className="flex flex-col md:flex-row items-center gap-3">
        <Button variant={'outline'} className={'h-10 rounded-2xl text-sm'}>
          <img src={youtubeIcon} alt="YouTube Icon" className="mr-1 h-4" />
          See video guide
        </Button>

        {children}
      </div>
    </div>
  );
};

export default Header;
