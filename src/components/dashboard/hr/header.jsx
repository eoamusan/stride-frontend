import youtubeIcon from '@/assets/icons/youtube-red.png';
import { Button } from '@/components/ui/button';

const Header = ({ title, description, children }) => {
  return (
    <div className="flex flex-wrap items-center justify-between gap-6">
      <hgroup>
        <h1 className="text-[24px] font-bold">{title}</h1>
        <p className="text-sm text-[#7D7D7D]">{description}</p>
      </hgroup>

      <div className="flex items-center gap-3">
        <Button variant={'outline'} className={'h-10 rounded-lg text-sm'}>
          <img src={youtubeIcon} alt="YouTube Icon" className="mr-1 h-4" />
          See video guide
        </Button>

        {children}
      </div>
    </div>
  );
};

export default Header;
