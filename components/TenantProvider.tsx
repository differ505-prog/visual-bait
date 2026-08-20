"use client";

import { createContext, useContext, ReactNode } from "react";
import { TenantConfig } from "@/lib/redis";
import { brandConfig, designDials as staticDesignDials, acquisitionConfig as staticAcquisitionConfig } from "@/config/site";
import { agencyConfig } from "@/config/agency";

type TenantType = "brand" | "agency";

interface TenantContextValue {
  tenant: TenantConfig | null;
  isLoading: boolean;
  error: string | null;
  isDemo: boolean;
  tenantType: TenantType;
}

const TenantContext = createContext<TenantContextValue>({
  tenant: null,
  isLoading: true,
  error: null,
  isDemo: false,
  tenantType: "brand",
});

export function TenantProvider({
  tenant,
  children,
  isDemo = false,
  tenantType = "brand",
}: {
  tenant: TenantConfig | null;
  children: ReactNode;
  isDemo?: boolean;
  tenantType?: TenantType;
}) {
  return (
    <TenantContext.Provider value={{ tenant, isLoading: false, error: null, isDemo, tenantType }}>
      {children}
    </TenantContext.Provider>
  );
}

export function useTenant(): TenantContextValue {
  return useContext(TenantContext);
}

export function useTenantType(): TenantType {
  const { tenantType } = useTenant();
  return tenantType;
}

export function useBrandConfig() {
  const { tenant, isDemo, tenantType } = useTenant();

  if (tenantType === "agency") {
    return {
      brandName: agencyConfig.brandName,
      heroImageUrl: agencyConfig.heroImageUrl,
      primaryColor: agencyConfig.primaryColor,
      slogan: agencyConfig.slogan,
      phone: agencyConfig.phone,
      email: agencyConfig.email,
      line: agencyConfig.line,
      address: "",
      rooms: [],
      facilities: [],
      story: agencyConfig.story,
      pricing: { eyebrow: "", headline: "", plans: [] },
    };
  }

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
  const { tenant, isDemo, tenantType } = useTenant();

  if (tenantType === "agency") return staticDesignDials;
  if (tenant) return tenant.designDials;
  if (isDemo) return staticDesignDials;
  return null;
}

export function useAcquisitionConfig() {
  const { tenant, isDemo, tenantType } = useTenant();

  if (tenantType === "agency") return staticAcquisitionConfig;
  if (tenant) return tenant.acquisitionConfig;
  if (isDemo) return staticAcquisitionConfig;
  return null;
}
