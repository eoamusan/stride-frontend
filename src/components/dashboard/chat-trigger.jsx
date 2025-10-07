import chatImg from '@/assets/icons/message.png';
import { Badge } from '../ui/badge';

export default function ChatButton() {
  return (
    <div className="fixed right-8 bottom-8">
      <button className="bg-primary/10 drop-shadow-primary/30 hover:bg-primary/20 relative flex h-16 w-16 cursor-pointer items-center justify-center gap-2 rounded-full drop-shadow backdrop-blur-sm transition">
        <img src={chatImg} alt="chat" className="h-8 w-8" />
        <Badge
          variant={'destructive'}
          className="absolute top-[25%] right-[25%] h-4 min-w-4 rounded-full px-1 font-mono tabular-nums"
        >
          8
        </Badge>
      </button>
    </div>
  );
}
