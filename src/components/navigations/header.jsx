import { Button } from '../ui/button';
import { Link } from 'react-router';
import { useState, useEffect } from 'react';
import strideLogo from '@/assets/icons/stride.svg';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      <header
        className={`sticky top-0 z-50 flex items-center justify-between gap-4 bg-white px-[5%] py-5 transition-all duration-300 ease-in-out ${
          isScrolled
            ? 'bg-white/95 py-3 shadow-lg backdrop-blur-md'
            : 'py-5 shadow-none'
        }`}
      >
        <Link to="/" className="transition-all duration-300 ease-in-out">
          <img
            src={strideLogo}
            alt="Oneda"
            className={`transition-all duration-300 ease-in-out ${
              isScrolled ? 'w-32' : 'w-[131px]'
            }`}
          />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-10 lg:flex">
          <div className="flex items-center gap-5">
            <Link to="/faqs" className="text-base font-medium">
              FAQs
            </Link>
            <Link to="/pricing" className="text-base font-medium">
              Pricing
            </Link>
          </div>
          <div
            className={`${isScrolled ? 'h-8' : 'h-9'} w-0.5 bg-zinc-200`}
          ></div>

          {/* CTAs */}
          <div className="flex items-center gap-4 transition-all duration-300 ease-in-out">
            <Button
              asChild
              variant={'outline'}
              size={isScrolled ? 'default' : 'lg'}
              className="transition-all duration-300 ease-in-out"
            >
              <Link to="/login">Login</Link>
            </Button>
            <Button
              asChild
              size={isScrolled ? 'default' : 'lg'}
              className="transition-all duration-300 ease-in-out"
            >
              <Link to="/register">Get Started</Link>
            </Button>
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={toggleMobileMenu}
          className="flex h-8 w-8 flex-col items-center justify-center space-y-1 lg:hidden"
          aria-label="Toggle mobile menu"
        >
          <span
            className={`block h-0.5 w-6 bg-black transition-all duration-300 ${
              isMobileMenuOpen ? 'translate-y-1.5 rotate-45' : ''
            }`}
          ></span>
          <span
            className={`block h-0.5 w-6 bg-black transition-all duration-300 ${
              isMobileMenuOpen ? 'opacity-0' : ''
            }`}
          ></span>
          <span
            className={`block h-0.5 w-6 bg-black transition-all duration-300 ${
              isMobileMenuOpen ? '-translate-y-1.5 -rotate-45' : ''
            }`}
          ></span>
        </button>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-x-0 z-40 bg-white lg:hidden">
          {/* Mobile Menu Content */}
          <div className="flex h-full flex-col px-[5%] pt-4 pb-2">
            {/* Navigation Links */}
            <nav className="mb-auto flex flex-col space-y-4">
              <Link
                to="/faqs"
                className="text-base font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                FAQs
              </Link>
              <Link
                to="/pricing"
                className="text-base font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Pricing
              </Link>
            </nav>

            {/* Mobile CTAs */}
            <div className="mt-8 mb-10 space-y-4">
              <Button asChild variant="outline" size="lg" className="w-full">
                <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                  Login
                </Link>
              </Button>
              <Button asChild size="lg" className="w-full">
                <Link to="/register" onClick={() => setIsMobileMenuOpen(false)}>
                  Sign up
                </Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
