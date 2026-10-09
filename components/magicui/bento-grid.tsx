import { cn } from '@/lib/utils';
import { ArrowRight } from 'lucide-react';
import { ReactNode } from 'react';

const BentoGrid = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        'grid w-full auto-rows-[22rem] grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 grid-flow-dense',
        className
      )}
    >
      {children}
    </div>
  );
};

const BentoCard = ({
  name,
  className,
  background,
  description,
  href,
  cta,
}: {
  name: string;
  className: string;
  background: ReactNode;
  description: string;
  href: string;
  cta: string;
}) => (
  <div
    key={name}
    className={cn(
      "group relative col-span-3 flex flex-col justify-end overflow-hidden",
      "rounded-md border border-[#E5E7EB] bg-[#F6F6F6]",
      className,
    )}
  >
    <div className="[&>img]:h-full [&>img]:w-full [&>img]:object-cover">{background}</div>

    {/* Quiet bottom label bar */}
    <div className="absolute inset-x-0 bottom-0 border-t border-[#E5E7EB] bg-white p-4">
      <p className="text-start text-black">
        <span className="text-base font-semibold leading-tight">{name}</span>
        <span className="mt-1 block text-sm font-normal leading-snug text-[#6B6B6B]">
          {description}
        </span>
      </p>
      <a
        href={href}
        className="mt-2 inline-flex items-center gap-1 p-0 text-sm font-normal text-black transition-opacity hover:opacity-60"
      >
        {cta}
        <ArrowRight className="h-4 w-4" />
      </a>
    </div>

    {/* Quiet hover: thin black outline instead of blur/glow */}
    <div className="pointer-events-none absolute inset-0 rounded-md border border-transparent transition-colors duration-200 group-hover:border-black" />
  </div>
);

export { BentoCard, BentoGrid };
