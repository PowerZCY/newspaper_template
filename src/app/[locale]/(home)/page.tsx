"use client";
import React from "react";
import { Usage, Features, FAQ, SeoContent, PricePlan } from '@windrun-huaiin/third-ui/main';
import { Hero } from "@/components/hero";
import { appConfig } from "@/lib/appConfig";

export default function Home() {
  return (
    <>
      <div className="min-h-screen flex flex-col bg-neutral-100 dark:bg-neutral-900 transition-colors duration-300">
        {/* 主体内容区 */}
        <main>
          <section id="hero" className="scroll-mt-40">
            <Hero />
          </section>
          <section id="usage" className="scroll-mt-20">
            <Usage />
          </section>
          <section id="features" className="scroll-mt-18">
            <Features />
          </section>
          <section id="seo" className="scroll-mt-20">
            <SeoContent />
          </section>
          <section id="pricing" className="scroll-mt-10">
            <PricePlan pricePlanConfig={appConfig.pricePlan} />
          </section>
          <section id="faq" className="scroll-mt-20">
            <FAQ />
          </section>
        </main>
      </div>
    </>
  );
}

