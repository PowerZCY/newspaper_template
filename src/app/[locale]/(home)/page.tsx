"use client";
import React from "react";
import { Usage } from '@/components/usage';
import { Features } from '@/components/features';
import { Hero } from '@/components/hero';
import { FAQ } from '@/components/faq';
import { SeoContent } from '@/components/seo-content';

export default function Home() {
  return (
    <>
      <div className="min-h-screen flex flex-col bg-neutral-100 dark:bg-neutral-900 transition-colors duration-300">
        {/* 主体内容区 */}
        <main>
          <section id="hero" className="scroll-mt-20">
            <Hero />
          </section>
          <section id="usage" className="scroll-mt-20">
            <Usage />
          </section>
          <section id="features" className="scroll-mt-20">
            <Features />
          </section>
          <section id="seo-content" className="scroll-mt-20">
            <SeoContent />
          </section>
          <section id="faq" className="scroll-mt-20">
            <FAQ />
          </section>
        </main>
      </div>
    </>
  );
}

