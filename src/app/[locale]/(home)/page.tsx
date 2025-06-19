"use client";
import React from "react";
import { Usage } from '@/components/usage';
import { Features } from '@/components/features';
import { Hero } from '@/components/hero';
import { FAQ } from '@/components/faq';

export default function Home() {
  return (
    <>
      <div className="min-h-screen flex flex-col bg-neutral-100 dark:bg-neutral-900 transition-colors duration-300">
        {/* 主体内容区 */}
        <main>
          <Hero />
          <Usage />
          <Features />
          <FAQ />
        </main>
      </div>
    </>
  );
}

