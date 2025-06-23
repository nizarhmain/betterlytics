'use client';

import { useEffect, useState } from 'react';
import { getUserBillingData } from '@/actions/billing';
import type { UserBillingData } from '@/entities/billing';

interface UseBillingDataReturn {
  billingData: UserBillingData | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useBillingData(): UseBillingDataReturn {
  const [billingData, setBillingData] = useState<UserBillingData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBillingData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getUserBillingData();
      setBillingData(data);
    } catch (err) {
      setError('Failed to fetch billing data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBillingData();
  }, []);

  return {
    billingData,
    isLoading,
    error,
    refetch: fetchBillingData,
  };
}
