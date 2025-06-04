'use client';

import Link, { LinkProps } from 'next/link';
import { useNavigateWithFilters } from '@/hooks/use-navigate-with-filters';
import { ReactNode, forwardRef } from 'react';

interface FilterPreservingLinkProps extends Omit<LinkProps, 'href'> {
  href: string;
  children: ReactNode;
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}

/**
 * A Link component that automatically preserves current search parameters (filters)
 * when navigating to dashboard routes
 */
export const FilterPreservingLink = forwardRef<HTMLAnchorElement, FilterPreservingLinkProps>(
  ({ href, children, className, onClick, ...linkProps }, ref) => {
    const { getHrefWithFilters } = useNavigateWithFilters();

    const hrefWithFilters = getHrefWithFilters(href);

    return (
      <Link ref={ref} href={hrefWithFilters} className={className} onClick={onClick} {...linkProps}>
        {children}
      </Link>
    );
  },
);

FilterPreservingLink.displayName = 'FilterPreservingLink';
