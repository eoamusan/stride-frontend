import { Button } from "@/components/ui/button";
import youtubeIcon from '@/assets/icons/youtube-red.png';

export default function YoutubeVideoGuideButton({ url }) {
  return (
    <Button variant={'outline'} className={'h-10 rounded-2xl text-sm'} onClick={() => window.open(url, '_blank', 'noopener,noreferrer')}>
      <img src={youtubeIcon} alt="YouTube Icon" className="mr-1 h-4" />
      See video guide
    </Button>
  );
}