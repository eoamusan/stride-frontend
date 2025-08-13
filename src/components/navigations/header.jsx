import { Button } from '../ui/button';

export default function Header() {
  return (
    <header className="flex items-center justify-between gap-4 bg-white px-[5%] py-5">
      <img src="./src/assets/stride-icon.svg" alt="Stride" className="w-32" />

      {/* CTAs */}
      <div>
        <Button>Get Started</Button>
        <Button>Login</Button>
      </div>
    </header>
  );
}
