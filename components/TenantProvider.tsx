"use client";

import { createContext, useContext, ReactNode } from "react";
import { TenantConfig } from "@/lib/redis";
import { brandConfig, designDials as staticDesignDials } from "@/config/site";

interface TenantContextValue {
  tenant: TenantConfig | null;
  isLoading: boolean;
  error: string | null;
  isDemo: boolean;
}

const TenantContext = createContext<TenantContextValue>({
  tenant: null,
  isLoading: true,
  error: null,
  isDemo: false,
});

export function TenantProvider({
  tenant,
  children,
  isDemo = false,
}: {
  tenant: TenantConfig | null;
  children: ReactNode;
  isDemo?: boolean;
}) {
  return (
    <TenantContext.Provider value={{ tenant, isLoading: false, error: null, isDemo }}>
      {children}
    </TenantContext.Provider>
  );
}

export function useTenant(): TenantContextValue {
  return useContext(TenantContext);
}

export function useBrandConfig() {
  const { tenant, isDemo } = useTenant();

  if (tenant) {
    return {
      brandName: tenant.brandName,
      heroImageUrl: tenant.heroImageUrl,
      primaryColor: tenant.primaryColor,
      slogan: tenant.slogan,
      phone: tenant.phone,
      email: tenant.email,
      line: tenant.line,
      address: tenant.address,
      rooms: tenant.rooms,
      facilities: tenant.facilities,
      story: tenant.story,
      pricing: tenant.pricing,
    };
  }

  if (isDemo) {
    return {
      brandName: brandConfig.brandName,
      heroImageUrl: brandConfig.heroImageUrl,
      primaryColor: brandConfig.primaryColor,
      slogan: brandConfig.slogan,
      phone: brandConfig.phone,
      email: brandConfig.email,
      line: brandConfig.line,
      address: brandConfig.address,
      rooms: brandConfig.rooms,
      facilities: brandConfig.facilities,
      story: brandConfig.story,
      pricing: brandConfig.pricing,
    };
  }

  return null;
}

export function useDesignDials() {
  const { tenant, isDemo } = useTenant();

  if (tenant) return tenant.designDials;
  if (isDemo) return staticDesignDials;
  return null;
}
