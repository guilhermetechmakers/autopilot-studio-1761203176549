import { type ReactNode } from 'react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { cn } from '@/lib/utils';

interface ScrollAnimationProps {
  children: ReactNode;
  className?: string;
  animation?: 'fade-in' | 'fade-in-up' | 'fade-in-down' | 'fade-in-left' | 'fade-in-right' | 'scale-in';
  delay?: number;
  duration?: number;
  threshold?: number;
  triggerOnce?: boolean;
}

export function ScrollAnimation({
  children,
  className,
  animation = 'fade-in-up',
  delay = 0,
  duration = 0.6,
  threshold = 0.1,
  triggerOnce = true,
}: ScrollAnimationProps) {
  const { ref, isVisible } = useScrollAnimation({ threshold, triggerOnce });

  const animationClasses = {
    'fade-in': 'opacity-0',
    'fade-in-up': 'opacity-0 translate-y-8',
    'fade-in-down': 'opacity-0 -translate-y-8',
    'fade-in-left': 'opacity-0 -translate-x-8',
    'fade-in-right': 'opacity-0 translate-x-8',
    'scale-in': 'opacity-0 scale-95',
  };

  const visibleClasses = {
    'fade-in': 'opacity-100',
    'fade-in-up': 'opacity-100 translate-y-0',
    'fade-in-down': 'opacity-100 translate-y-0',
    'fade-in-left': 'opacity-100 translate-x-0',
    'fade-in-right': 'opacity-100 translate-x-0',
    'scale-in': 'opacity-100 scale-100',
  };

  return (
    <div
      ref={ref as React.RefObject<HTMLDivElement>}
      className={cn(
        'transition-all ease-out',
        isVisible ? visibleClasses[animation] : animationClasses[animation],
        className
      )}
      style={{
        transitionDuration: `${duration}s`,
        transitionDelay: `${delay}s`,
      }}
    >
      {children}
    </div>
  );
}