import { useState, useEffect } from "react";

import { Plan } from "@/components/v1/Pricing/PlanCard";
import { FIXED_CURRENCY } from "@/constants/fixed-currency";
import { HAS_FREE_TRIAL } from "@/constants/has-free-trial";

import { useI18n } from "./useI18n";

export const useFetchPlans = (
  hasFreeplan: boolean,
  setIsLoading: (isLoading: boolean) => void
) => {
  const { translate } = useI18n("components.pricing.plans");
  const SUBSCRIPTION_PLANS_BASE: Plan[] = [
    {
      id: "free",
      name: translate("free.title"),
      description: translate("free.description"),
      priceMonthly: translate("prices.monthly").replace("{value}", "0"),
      priceAnnual: translate("prices.annual").replace("{value}", "0"),
      features: [
        translate("free.features.first"),
        translate("free.features.second"),
        translate("free.features.third"),
      ],
      extraFeatures: translate("free.extra"),
    },
  ];

  const basePlan =
    hasFreeplan && !HAS_FREE_TRIAL ? SUBSCRIPTION_PLANS_BASE : [];
  const [plans, setPlans] = useState<Plan[]>(basePlan);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        setIsLoading(true);
        const url = new URL(`/api/v1/payments/plans`, window.location.origin);
        url.searchParams.set('currency', FIXED_CURRENCY);

        const response = await fetch(
          url.toString(), {
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              'Cache-Control': 'no-cache',
            }
          }
        );

        if (!response.ok) {
          console.error('Failed to fetch plans:', response.status);
          setPlans([]);
          return;
        }

        const data: Plan[] = await response.json();
        setPlans((prev: Plan[]) => {
          if (!prev) return data;
          return prev.length >= 4 ? [...prev] : [...prev, ...data];
        });
      } catch (error) {
        console.error("Error fetching plans:", error);
        setPlans([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPlans();
  }, [setIsLoading]);

  return { plans, setIsLoading };
};