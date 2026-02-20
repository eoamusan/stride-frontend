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
import testimonialDP from '@/assets/images/testimonial-dp.png';
import ctaBg from '@/assets/images/cta-bg.png';
import { Link } from 'react-router';
import Marquee from 'react-fast-marquee';

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
  {
    id: 6,
    name: 'Partner 6',
    logo: samplePartner2,
    alt: 'Partner 6 Logo',
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

// Alternating features data
const alternatingFeatures = [
  {
    id: 1,
    badge: 'Time sync',
    title: 'Time Tracking & Project Management',
    description:
      'Never lose another billable hour. Track time effortlessly with our one-click timer, organize projects with intuitive boards, and collaborate with your team in real-time. Built mobile-first for professionals who work everywhere',
    features: [
      'Kanban-style project boards',
      'File sharing and collaboration',
      'Real-time team updates',
    ],
    image: containerPlaceholder,
    imageAlt: 'Time tracking dashboard',
  },
  {
    id: 2,
    badge: 'Time sync',
    title: 'Time Tracking & Project Management',
    description:
      'Never lose another billable hour. Track time effortlessly with our one-click timer, organize projects with intuitive boards, and collaborate with your team in real-time. Built mobile-first for professionals who work everywhere',
    features: [
      'Kanban-style project boards',
      'File sharing and collaboration',
      'Real-time team updates',
    ],
    image: containerPlaceholder,
    imageAlt: 'Project management interface',
  },
  {
    id: 3,
    badge: 'Time sync',
    title: 'Time Tracking & Project Management',
    description:
      'Never lose another billable hour. Track time effortlessly with our one-click timer, organize projects with intuitive boards, and collaborate with your team in real-time. Built mobile-first for professionals who work everywhere',
    features: [
      'Kanban-style project boards',
      'File sharing and collaboration',
      'Real-time team updates',
    ],
    image: containerPlaceholder,
    imageAlt: 'Project management interface',
  },
  {
    id: 4,
    badge: 'Time sync',
    title: 'Time Tracking & Project Management',
    description:
      'Never lose another billable hour. Track time effortlessly with our one-click timer, organize projects with intuitive boards, and collaborate with your team in real-time. Built mobile-first for professionals who work everywhere',
    features: [
      'Kanban-style project boards',
      'File sharing and collaboration',
      'Real-time team updates',
    ],
    image: containerPlaceholder,
    imageAlt: 'Project management interface',
  },
  {
    id: 5,
    badge: 'Time sync',
    title: 'Time Tracking & Project Management',
    description:
      'Never lose another billable hour. Track time effortlessly with our one-click timer, organize projects with intuitive boards, and collaborate with your team in real-time. Built mobile-first for professionals who work everywhere',
    features: [
      'Kanban-style project boards',
      'File sharing and collaboration',
      'Real-time team updates',
    ],
    image: containerPlaceholder,
    imageAlt: 'Project management interface',
  },
];

// Testimonials data
const testimonials = [
  {
    id: 1,
    name: 'Esther Howard',
    role: 'Freelance Marketing Consultant',
    avatar: containerPlaceholder, // Using placeholder for now
    testimonial:
      "Before Oneda, I was drowning in spreadsheets and juggling five different apps just to track my time and send invoices. Now everything flows seamlessly from project planning to getting paid. My client relationships have never been stronger, and I've reduced my admin time by 60%. The mobile app is a game changer when I'm meeting clients on-site",
  },
  {
    id: 2,
    name: 'Esther Howard',
    role: 'Freelance Marketing Consultant',
    avatar: containerPlaceholder, // Using placeholder for now
    testimonial:
      "Before Oneda, I was drowning in spreadsheets and juggling five different apps just to track my time and send invoices. Now everything flows seamlessly from project planning to getting paid. My client relationships have never been stronger, and I've reduced my admin time by 60%. The mobile app is a game changer when I'm meeting clients on-site",
  },
  {
    id: 3,
    name: 'Esther Howard',
    role: 'Freelance Marketing Consultant',
    avatar: containerPlaceholder, // Using placeholder for now
    testimonial:
      "Before Oneda, I was drowning in spreadsheets and juggling five different apps just to track my time and send invoices. Now everything flows seamlessly from project planning to getting paid. My client relationships have never been stronger, and I've reduced my admin time by 60%. The mobile app is a game changer when I'm meeting clients on-site",
  },
  {
    id: 4,
    name: 'Esther Howard',
    role: 'Freelance Marketing Consultant',
    avatar: containerPlaceholder, // Using placeholder for now
    testimonial:
      "Before Oneda, I was drowning in spreadsheets and juggling five different apps just to track my time and send invoices. Now everything flows seamlessly from project planning to getting paid. My client relationships have never been stronger, and I've reduced my admin time by 60%. The mobile app is a game changer when I'm meeting clients on-site",
  },
];

export default function Landing() {
  return (
    <div className="relative">
      <Header />
      <div className="mx-auto min-h-screen max-w-[1800px]">
        {/* Hero Section */}
        <section
          className="relative flex items-center justify-between bg-cover bg-center bg-no-repeat px-[5%] py-6 max-md:flex-col-reverse max-md:gap-10"
          style={{ backgroundImage: `url(${landingBg})` }}
        >
          <div className="w-full max-w-2xl">
            <h1 className="mb-6 text-3xl font-bold md:text-4xl lg:text-5xl">
              Transform Your Business Operations with{' '}
              <span className="text-primary">Oneda</span>
            </h1>
            <p className="mb-6 text-sm md:text-base">
              Oneda combines project management, invoicing, asset management,
              accounting, and HR functionalities in one intuitive platform
              designed for modern businesses. Stop juggling multiple tools and
              start focusing on what matters the most.
            </p>
            <Button className={'h-12 px-8 text-lg'}>
              Get Started for Free
            </Button>
          </div>
          <div className="w-full md:max-w-xl lg:max-w-4xl xl:max-w-5xl">
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
              <Marquee
                pauseOnHover
                speed={35}
                className="flex items-center justify-center"
              >
                {partners.map((partner) => (
                  <div
                    key={partner.id}
                    className="mr-10 flex items-center justify-center"
                  >
                    <img
                      src={partner.logo}
                      alt={partner.alt}
                      className="h-8 w-auto md:h-10"
                    />
                  </div>
                ))}
              </Marquee>
            </div>
          </div>
        </section>

        {/* Watch demo */}
        <section className="pt-4">
          <div className="mx-auto px-[5%]">
            <div
              className="relative flex aspect-video w-full items-center justify-center rounded-2xl bg-cover bg-no-repeat"
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
                  className="transition-outline outline-primary rounded-2xl bg-[#F9F8FD] p-4 hover:outline"
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

        {/* Features Section */}
        <section className="">
          <div className="mx-auto px-[5%]">
            {/* Section Header */}
            <div className="mb-10 text-center">
              <div className="mx-auto mb-6 flex w-full max-w-32 items-center">
                <div className="grow border-t border-gray-300"></div>
                <span className="mx-1 text-xs font-medium text-[#292D32]">
                  Features
                </span>
                <div className="grow border-t border-gray-300"></div>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">
                Packed With Power. Built for{' '}
                <span className="text-primary">Simplicity</span>
              </h2>
              <p className="mx-auto mt-4 max-w-3xl text-sm text-gray-600">
                All the essential tools: time tracking, task management, client
                handling, and invoicing without the clutter. Just what you need,
                exactly when you need it.
              </p>
            </div>

            {/* Alternating Features */}
            <div className="space-y-24">
              {alternatingFeatures.map((feature, index) => (
                <div
                  key={feature.id}
                  className={`flex flex-col items-center gap-12 lg:flex-row ${
                    index % 2 === 1 ? 'lg:flex-row-reverse' : ''
                  }`}
                >
                  {/* Content */}
                  <div className="flex-1 space-y-6">
                    {/* Badge */}
                    <div className="inline-flex rounded-full bg-[#D3FFB6] px-4 py-2 text-sm font-medium">
                      {feature.badge}
                    </div>

                    {/* Title */}
                    <h3 className="max-w-xs text-2xl font-bold text-gray-900 md:text-3xl">
                      {feature.title}
                    </h3>

                    {/* Description */}
                    <p className="leading-relaxed text-gray-600">
                      {feature.description}
                    </p>

                    {/* Feature List */}
                    <ul className="space-y-3">
                      {feature.features.map((item, itemIndex) => (
                        <li key={itemIndex} className="flex items-center gap-3">
                          <div className="bg-primary flex size-8 items-center justify-center rounded-full">
                            <PieChartIcon size={16} color="white" />
                          </div>
                          <span className="text-gray-700">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Image */}
                  <div className="flex-1">
                    <div
                      className="aspect-4/3 rounded-lg bg-gray-100 bg-cover bg-center"
                      style={{ backgroundImage: `url(${feature.image})` }}
                    >
                      <img
                        src={feature.image}
                        alt={feature.imageAlt}
                        className="h-full w-full rounded-lg object-cover opacity-0"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonial Section */}
        <section className="pt-16 pb-10">
          <div className="mx-auto px-[5%]">
            {/* Section Header */}
            <div className="mb-16 text-center">
              <div className="mx-auto mb-6 flex w-full max-w-32 items-center">
                <div className="grow border-t border-gray-300"></div>
                <span className="mx-1 text-xs font-medium text-[#292D32]">
                  Testimonials
                </span>
                <div className="grow border-t border-gray-300"></div>
              </div>
              <h2 className="mx-auto max-w-xl text-2xl font-bold text-gray-900 md:text-4xl">
                What our clients think about{' '}
                <span className="text-primary">Oneda</span>
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-sm text-gray-600">
                See how freelancers, agencies, and startups use Oneda to
                streamline their workflow, stay organized, and get paid faster
              </p>
            </div>

            {/* Testimonials Grid */}
            <Marquee speed={30} pauseOnHover className="py-1">
              {testimonials.map((testimonial) => (
                <div
                  key={testimonial.id}
                  className="outline-primary mr-6 w-[90vw] max-w-[420px] rounded-2xl bg-[#F9F8FD] p-6 shadow-sm transition-shadow hover:shadow-md hover:outline"
                >
                  {/* User Info */}
                  <div className="mb-4 flex items-center gap-4">
                    <div className="h-12 w-12 overflow-hidden rounded-full">
                      <img
                        src={testimonialDP}
                        alt={testimonial.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">
                        {testimonial.name}
                      </h4>
                      <p className="text-xs text-gray-600">
                        {testimonial.role}
                      </p>
                    </div>
                  </div>

                  {/* Testimonial Text */}
                  <blockquote className="leading-relaxed font-semibold text-[#17191C]">
                    "{testimonial.testimonial}"
                  </blockquote>
                </div>
              ))}
            </Marquee>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-20">
          <div className="mx-auto px-[5%]">
            <div
              className="relative overflow-hidden rounded-2xl bg-cover bg-center bg-no-repeat px-8 py-14 text-center md:px-16 md:py-20"
              style={{ backgroundImage: `url(${ctaBg})` }}
            >
              {/* Overlay for better text readability */}
              <div className="absolute inset-0 rounded-2xl bg-black/20"></div>

              {/* Content */}
              <div className="relative z-10 mx-auto max-w-3xl">
                <h2 className="mb-6 text-3xl font-bold text-white md:text-4xl">
                  Ready to Transform Your Business?
                </h2>
                <p className="mb-8 text-base text-white/90">
                  Join thousands of professionals who've streamlined their
                  workflow and boosted productivity with Oneda. Start your free
                  trial today and see the difference.
                </p>

                <Button
                  size="lg"
                  variant={'outline'}
                  className="h-12 w-[193px]"
                  asChild
                >
                  <Link to="/register">Start Free Trial</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
}
