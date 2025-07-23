"use client";
import React from "react";
import { Usage, Features, FAQ, SeoContent, PricePlan } from '@windrun-huaiin/third-ui/main';
import { Hero } from "@/components/hero";
import { pricePlanConfig } from "@/lib/price-config";

export default function Home() {
  return (
    <>
      <div className="min-h-screen flex flex-col bg-neutral-100 dark:bg-neutral-900 transition-colors duration-300">
        {/* 主体内容区 */}
        <main>
          <Hero />
          <Usage />
          <Features />
          <SeoContent />
          <PricePlan pricePlanConfig={pricePlanConfig} />
          <FAQ />
        </main>
      </div>
    </>
  );
}

