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
  Icon,
  description,
  href,
  cta,
}: {
  name: string;
  className: string;
  background: ReactNode;
  Icon: React.ComponentType<{ className?: string }>;
  description: string;
  href: string;
  cta: string;
}) => (
  <div
  key={name}
  className={cn(
    'rounded-md group relative col-span-3 flex flex-col justify-end overflow-hidden',
    'bg-white [box-shadow:0_0_0_1px_rgba(0,0,0,.03),0_2px_4px_rgba(0,0,0,.05),0_12px_24px_rgba(0,0,0,.05)]',
    'transform-gpu dark:bg-black dark:[border:1px_solid_rgba(255,255,255,.1)] dark:[box-shadow:0_-20px_80px_-20px_#ffffff1f_inset]',
    className,
  )}
>
  <div>{background}</div>

  {/* ✅ BLUR LAYER */}
  <div className="absolute inset-0 group-hover:backdrop-blur-3xl transition-all duration-300 backdrop-blur-none pointer-events-none" />

  {/* Content */}
  <div className="w-full h-full pointer-events-none z-10 flex transform-gpu flex-col gap-1 p-6 transition-all duration-300 group-hover:-translate-y-0 opacity-0 group-hover:opacity-100 group-hover:bg-black/50 justify-center items-center">
    <Icon className="h-12 w-12 origin-left transform-gpu text-neutral-300 transition-all duration-300 ease-in-out group-hover:scale-75" />
    <h3 className="text-center text-xl font-semibold text-neutral-300 dark:text-neutral-300 w-fit">
      {name}
    </h3>
    <p className="text-center max-w-lg text-neutral-400">{description}</p>
    <a href={href} className="mt-3 pointer-events-auto text-sm font-medium text-white text-center hover:text-white/50 transition-all flex">
      {cta}
      <ArrowRight className='w-5 h-5 group-hover:translate-x-1 transition-transform' />
    </a>
  </div>

  {/* Hover tint */}
  <div className="pointer-events-none absolute inset-0 transform-gpu transition-all duration-300 group-hover:bg-black/[.03] group-hover:dark:bg-neutral-800/10" />
</div>

);

export { BentoCard, BentoGrid };
