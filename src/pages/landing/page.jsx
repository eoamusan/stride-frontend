import Header from '@/components/navigations/header';
import Footer from '@/components/navigations/footer';
import { Button } from '@/components/ui/button';
import landingHero from '@/assets/images/landing-hero.png';
import landingBg from '@/assets/images/landing-bg.svg';
import samplePartner from '@/assets/icons/sample-partner.svg';
import containerPlaceholder from '@/assets/images/container-placeholder.svg';
import samplePartner2 from '@/assets/icons/sample-partner2.svg';
import playButtonIcon from '@/assets/icons/youtube.svg';
import { PieChartIcon } from 'lucide-react';

// Partners data array for easy management
const partners = [
  {
    id: 1,
    name: 'Partner 1',
    logo: samplePartner,
    alt: 'Partner 1 Logo',
  },
  {
    id: 2,
    name: 'Partner 2',
    logo: samplePartner2,
    alt: 'Partner 2 Logo',
  },
  {
    id: 3,
    name: 'Partner 3',
    logo: samplePartner,
    alt: 'Partner 3 Logo',
  },
  {
    id: 4,
    name: 'Partner 4',
    logo: samplePartner2,
    alt: 'Partner 4 Logo',
  },
  {
    id: 5,
    name: 'Partner 5',
    logo: samplePartner,
    alt: 'Partner 5 Logo',
  },
];

// Features data array
const features = [
  {
    id: 1,
    icon: <PieChartIcon />,
    title: 'Organize Work, Collaborate Seamlessly',
    description:
      'Transform chaos into clarity with our project management tools. Create projects, assign tasks, set deadlines, and track progress - all while keeping your team aligned and clients informed.',
  },
  {
    id: 2,
    icon: <PieChartIcon />,
    title: 'Time Tracking That Actually Works',
    description:
      "Stop losing billable hours to manual time tracking. Our intuitive timer makes it easy to track time across projects, clients, and tasks. With real-time sync across all devices, you'll never lose track of your time again.",
  },
  {
    id: 3,
    icon: <PieChartIcon />,
    title: 'Streamline Your HR Operations',
    description:
      'Manage your most important asset - your people. From recruitment to performance management, our HR tools help you build and maintain a strong team.',
  },
];

export default function Landing() {
  return (
    <div className="relative max-w-7xl">
      <Header />
      <div className="min-h-screen">
        {/* Hero Section */}
        <section
          className="relative flex items-center justify-between bg-cover bg-center bg-no-repeat px-[5%] py-6 max-md:flex-col-reverse max-md:gap-10"
          style={{ backgroundImage: `url(${landingBg})` }}
        >
          <div className="max-w-md">
            <h1 className="mb-6 text-3xl font-bold md:text-4xl lg:text-5xl">
              Transform Your Business Operations with{' '}
              <span className="text-primary">Stride</span>
            </h1>
            <p className="mb-6 text-sm md:text-base">
              Stride combines project management, invoicing, asset management,
              accounting, and HR functionalities in one intuitive platform
              designed for modern businesses. Stop juggling multiple tools and
              start focusing on what matters the most.
            </p>
            <Button className={'h-12 px-8 text-lg'}>
              Get Started for Free
            </Button>
          </div>
          <div className="md:max-w-md lg:max-w-lg xl:max-w-xl">
            <img
              src={landingHero}
              alt="Landing Hero"
              className="h-auto w-full object-contain"
            />
          </div>
        </section>

        {/* Partners */}
        <section className="py-12 md:py-16">
          <div className="mx-auto px-[5%]">
            <div className="text-center">
              <p className="mb-4 text-base font-bold text-black/50">
                Trusted by growing businesses worldwide
              </p>
              <div className="flex flex-wrap items-center justify-center space-y-4 space-x-10">
                {partners.map((partner) => (
                  <div
                    key={partner.id}
                    className="flex items-center justify-center"
                  >
                    <img
                      src={partner.logo}
                      alt={partner.alt}
                      className="h-8 w-auto md:h-10"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Watch demo */}
        <section className="pt-4">
          <div className="mx-auto px-[5%]">
            <div
              className="relative flex h-[527px] items-center justify-center rounded-lg bg-center bg-no-repeat"
              style={{ backgroundImage: `url(${containerPlaceholder})` }}
            >
              {/* Play Button */}
              <Button
                className="flex h-12 items-center gap-3 rounded-2xl bg-red-600 text-white hover:bg-red-700"
                size="lg"
              >
                Watch Demo
                <img src={playButtonIcon} alt="Play Button Icon" />
              </Button>
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section className="py-16 md:py-18">
          <div className="mx-auto px-[5%]">
            <div className="max-w-2xl">
              <h2 className="mb-8 text-3xl font-bold text-gray-900 md:text-4xl">
                Everything You Need to Run Your Business{' '}
                <span className="text-primary">Smoothly</span>
              </h2>
            </div>

            {/* Features Grid */}
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {features.map((feature) => (
                <div
                  key={feature.id}
                  className="transition-border hover:border-primary rounded-2xl bg-[#F9F8FD] p-4 hover:border hover:p-[15px]"
                >
                  {/* Icon */}
                  <div className="bg-primary mb-3 flex size-11 items-center justify-center rounded-full text-white">
                    {feature.icon}
                  </div>

                  {/* Title */}
                  <h3 className="mb-2 text-xl font-semibold">
                    {feature.title}
                  </h3>

                  {/* Description */}
                  <p className="text-xs">{feature.description}</p>
                </div>
              ))}
            </div>

            {/* Duplicate row for the second set */}
            <div className="mt-8 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {features.map((feature) => (
                <div
                  key={'duplicate' + feature.id}
                  className="transition-border hover:border-primary rounded-2xl bg-[#F9F8FD] p-4 hover:border hover:p-[15px]"
                >
                  {/* Icon */}
                  <div className="bg-primary mb-3 flex size-11 items-center justify-center rounded-full text-white">
                    {feature.icon}
                  </div>

                  {/* Title */}
                  <h3 className="mb-2 text-xl font-semibold">
                    {feature.title}
                  </h3>

                  {/* Description */}
                  <p className="text-xs">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
}
