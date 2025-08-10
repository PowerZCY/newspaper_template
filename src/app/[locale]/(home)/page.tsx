import React from "react";
import { Usage, Features, FAQ, SeoContent, PricePlan } from '@windrun-huaiin/third-ui/main/server';
import { Hero } from "@/components/hero";
import { pricePlanConfig } from "@/lib/price-config";

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return (
    <>
      {/* Current Now Hero is a RSC */}
      <Hero/>
      <Usage locale={locale} />
      <Features locale={locale} />
      <SeoContent locale={locale} />
      <PricePlan locale={locale} pricePlanConfig={pricePlanConfig} />
      <FAQ locale={locale} />
    </>
  );
}

