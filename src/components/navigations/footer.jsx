import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Link } from 'react-router';
import strideLogo from '@/assets/icons/stride-white.svg';
import linkedinLogo from '@/assets/icons/linkedin.svg';
import xLogo from '@/assets/icons/twitter.svg';
import facebookLogo from '@/assets/icons/facebook.svg';
import instagramLogo from '@/assets/icons/instagram.svg';

export default function Footer() {
  return (
    <footer className="bg-[#060212] text-white w-full">
      <div className="mx-auto px-[5%] py-8">
        <div className="grid grid-cols-2 gap-12 lg:grid-cols-7">
          {/* Logo and Newsletter Section */}
          <div className="col-span-2">
            <div className="mb-8">
              <img src={strideLogo} alt="Stride" className="mb-6 h-10 w-auto" />
              <h3 className="text-xl font-semibold">
                Subscribe to our Newsletter!
              </h3>
              <p className="mb-4 text-sm">
                Stay informed with our latest updates
              </p>

              {/* Newsletter Form */}
              <div className="flex flex-col gap-3 sm:flex-row">
                <Input
                  type="email"
                  placeholder="Email address"
                  className="focus:border-primary h-10 min-w-[260px] flex-1 bg-[#5B5656] text-white placeholder:text-gray-400 max-w-sm"
                />
                <Button className="h-10 max-w-sm">Subscribe</Button>
              </div>
            </div>

            {/* Social Media Links */}
            <div className="flex gap-4">
              <Link to="https://twitter.com/stride">
                <img src={facebookLogo} alt="Facebook" />
              </Link>
              <Link to={'https://www.linkedin.com/company/stride'}>
                <img src={linkedinLogo} alt="LinkedIn" />
              </Link>
              <Link to={'https://www.instagram.com/stride'}>
                <img src={instagramLogo} alt="Instagram" />
              </Link>
              <Link to={'https://www.x.com/stride'}>
                <img src={xLogo} alt="X" />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div className='hidden lg:block'/>
          <div>
            <h4 className="mb-6 text-lg font-semibold">Quick Links</h4>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/features"
                  className="text-gray-300 transition-colors hover:text-white"
                >
                  Features
                </Link>
              </li>
              <li>
                <Link
                  to="/pricing"
                  className="text-gray-300 transition-colors hover:text-white"
                >
                  Pricing
                </Link>
              </li>
              <li>
                <Link
                  to="/help"
                  className="text-gray-300 transition-colors hover:text-white"
                >
                  Help Center
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="mb-6 text-lg font-semibold">Resources</h4>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/blog"
                  className="text-gray-300 transition-colors hover:text-white"
                >
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & Contact */}
          <div>
            <h4 className="mb-6 text-lg font-semibold">Legal</h4>
            <ul className="mb-6 space-y-3">
              <li>
                <Link
                  to="/privacy"
                  className="text-gray-300 transition-colors hover:text-white"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/terms"
                  className="text-gray-300 transition-colors hover:text-white"
                >
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="mb-6 text-lg font-semibold">Contact</h4>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/support"
                  className="text-gray-300 transition-colors hover:text-white"
                >
                  Support
                </Link>
              </li>
              <li>
                <Link
                  to="/sales"
                  className="text-gray-300 transition-colors hover:text-white"
                >
                  Sales
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div>
        <div className="mx-auto px-[5%] py-6">
          <p className="text-center text-gray-400">
            Copyright © Stride All Right Reserved
          </p>
        </div>
      </div>
    </footer>
  );
}
