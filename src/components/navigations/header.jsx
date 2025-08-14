import { Button } from '../ui/button';
import { Link } from 'react-router';
import { useState, useEffect } from 'react';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 flex items-center justify-between gap-4 bg-white px-[5%] py-5 transition-all duration-300 ease-in-out ${
        isScrolled
          ? 'bg-white/95 py-3 shadow-lg backdrop-blur-md'
          : 'py-5 shadow-none'
      }`}
    >
      <img
        src="./src/assets/stride-icon.svg"
        alt="Stride"
        className={`transition-all duration-300 ease-in-out ${
          isScrolled ? 'w-32' : 'w-[131px]'
        }`}
      />

      {/* CTAs */}
      <div className="flex items-center gap-4 transition-all duration-300 ease-in-out">
        <Button
          asChild
          size={isScrolled ? 'default' : 'lg'}
          className="transition-all duration-300 ease-in-out"
        >
          <Link to="/register">Get Started</Link>
        </Button>
        <Button
          variant={'outline'}
          size={isScrolled ? 'default' : 'lg'}
          className="transition-all duration-300 ease-in-out"
        >
          <Link to="/login">Login</Link>
        </Button>
      </div>
    </header>
  );
}
