/* eslint-disable react/no-unescaped-entities */
'use client'

import { useTranslations } from 'next-intl'

interface Section {
  title: string;
  content: string;
}

export function SeoContent() {
  const t = useTranslations('seoContent');

  return (
    <section className="px-16 py-20 mx-16 md:mx-32">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">
        {t('title')} <span className="text-purple-500">{t('eyesOn')}</span>
      </h2>
      <p className="text-center text-gray-600 dark:text-gray-400 mb-12 text-base md:text-lg mx-auto max-w-2xl">
        {t('intro')}
      </p>
      <div className="bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 rounded-2xl p-8 md:p-12 shadow-sm dark:shadow-none">
        <div className="space-y-10">
          {t.raw('sections').map((section: Section, index: number) => (
            <div key={index}>
              <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-gray-100 flex items-center">
                {section.title}
              </h3>
              <p className="text-gray-700 dark:text-gray-300">{section.content}</p>
            </div>
          ))}
        </div>
        <p className="mt-12 text-center text-gray-600 dark:text-gray-400 text-base md:text-lg mx-auto max-w-2xl">
          {t('conclusion')}
        </p>
      </div>
    </section>
  )
}

