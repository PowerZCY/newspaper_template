"use client";
import React from "react";
import { Usage, Features, FAQ, SeoContent, PricePlan } from '@windrun-huaiin/third-ui/main';
import { Hero } from "@/components/hero";
import { pricePlanConfig } from "@/lib/price-config";

export default function Home() {
  return (
    <>
      <Hero />
      <Usage />
      <Features />
      <SeoContent />
      <PricePlan pricePlanConfig={pricePlanConfig} />
      <FAQ />
    </>
  );
}

