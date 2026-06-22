'use client';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useCallback } from 'react';

export function useNextSearchParams() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const setSearchParams = useCallback(
    (newParams: URLSearchParams | Record<string, string>) => {
      const params =
        newParams instanceof URLSearchParams
          ? newParams
          : new URLSearchParams(newParams);
      router.push(pathname + '?' + params.toString());
    },
    [router, pathname]
  );

  return [searchParams, setSearchParams] as const;
}
