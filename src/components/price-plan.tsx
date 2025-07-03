/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState } from 'react'
import { useTranslations } from 'next-intl'
import clsx from 'clsx'
import { appConfig } from '@/lib/appConfig'
import { globalLucideIcons as icons } from '@/components/global-icon'
import { useRouter } from 'next/navigation';

// 价格类型定义
interface PricePlanProps {
  // prices: Record<string, number | string> // 不再需要外部传入价格，全部由翻译文件配置
  currency?: string // 默认$
}

// 明确 appConfig.pricePlan 类型
interface BillingOption {
  key: string
  discount: number
}
interface Prices {
  [key: string]: number | string
}
interface PricePlanAppConfig {
  billingOptions: BillingOption[]
  prices: Prices
  minPlanFeaturesCount: number
}

export function PricePlan({ currency = '$' }: PricePlanProps) {
  const t = useTranslations('pricePlan')
  const billingSwitch = t.raw('billingSwitch') as {
    options: Array<{
      key: string
      name: string
      unit: string
      discountText: string
      subTitle?: string
    }>
    defaultKey: string
  }
  const plans = t.raw('plans') as Array<any>
  const router = useRouter();

  // 资金相关配置
  const pricePlanConfig = appConfig.pricePlan as PricePlanAppConfig
  const billingOptions = pricePlanConfig.billingOptions
  const prices = pricePlanConfig.prices
  const minPlanFeaturesCount = pricePlanConfig.minPlanFeaturesCount

  // 当前选中的计费周期
  const [billingKey, setBillingKey] = useState(billingSwitch.defaultKey)

  // Tooltip 状态
  const [tooltip, setTooltip] = useState<{
    show: boolean
    content: string
    x: number
    y: number
  }>({ show: false, content: '', x: 0, y: 0 })

  // 获取当前计费周期的资金配置和展示配置
  const currentBilling = billingOptions.find((opt: any) => opt.key === billingKey) || billingOptions[0]
  const currentBillingDisplay = billingSwitch.options.find((opt: any) => opt.key === billingKey) || billingSwitch.options[0]

  // 计算 featuresCount
  const maxFeaturesCount = Math.max(
    ...plans.map((plan: any) => plan.features?.length || 0),
    minPlanFeaturesCount || 0
  )

  // 处理卡片高度对齐
  const getFeatureRows = (plan: any) => {
    const features = plan.features || []
    const filled = [...features]
    while (filled.length < maxFeaturesCount) filled.push(null)
    return filled
  }

  // 价格渲染逻辑
  function renderPrice(plan: any) {
    const priceValue = prices[plan.key];
    // 当前计费周期的 subTitle
    const billingSubTitle = billingSwitch.options.find((opt: any) => opt.key === billingKey)?.subTitle || '';
    // 非数字（如 'Custom'）直接展示
    if (typeof priceValue !== 'number' || isNaN(priceValue)) {
      return (
        <div className="flex flex-col items-start w-full">
          <div className="flex items-end gap-2">
            <span className="text-4xl font-extrabold text-gray-900 dark:text-gray-100">{priceValue}</span>
          </div>
          <div className="flex items-center gap-2 min-h-[24px] mt-1">
            <span className={clsx('text-xs text-gray-700 dark:text-gray-300 font-medium', !billingSubTitle && 'opacity-0 select-none')}>
              {billingSubTitle || ''}
            </span>
          </div>
        </div>
      );
    }
    // 数字价格逻辑
    const originValue = Number(priceValue)
    const discount = currentBilling.discount
    const hasDiscount = discount !== 0
    const saleValue = originValue * (1 - discount)
    // 格式化价格，保留2位小数但去除末尾0
    const formatPrice = (v: number) => Number(v.toFixed(2)).toString()
    const unit = currentBillingDisplay.unit || ''
    let discountText = ''
    if (hasDiscount && currentBillingDisplay.discountText) {
      discountText = currentBillingDisplay.discountText.replace('{percent}', String(Math.round(Math.abs(discount) * 100)))
    }
    const subTitle = billingSubTitle
    // 价格为负时显示NaN
    const showNaN = saleValue < 0
    return (
      <div className="flex flex-col items-start w-full">
        <div className="flex items-end gap-2">
          <span className="text-4xl font-extrabold text-gray-900 dark:text-gray-100">
            {currency}{showNaN ? 'NaN' : (hasDiscount ? formatPrice(saleValue) : formatPrice(originValue))}
          </span>
          <span className="text-lg text-gray-700 dark:text-gray-300 font-medium mb-1">{unit}</span>
        </div>
        {/* 副标题行，始终占位 */}
        <div className="flex items-center gap-2 min-h-[24px] mt-1">
          {hasDiscount && (
            <>
              <span className="text-base text-gray-400 line-through">{currency}{showNaN ? 'NaN' : formatPrice(originValue)}</span>
              {discountText && (
                <span className="px-2 py-0.5 text-xs rounded bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 font-semibold align-middle">{discountText}</span>
              )}
            </>
          )}
          <span className={clsx('text-xs text-gray-700 dark:text-gray-300 font-medium', !subTitle && 'opacity-0 select-none')}>{subTitle || ''}</span>
        </div>
      </div>
    )
  }

  // Tooltip 组件
  const Tooltip = ({ show, content, x, y }: typeof tooltip) => {
    if (!show) return null
    // 简单边界处理，防止超出屏幕
    const style: React.CSSProperties = {
      position: 'fixed',
      left: Math.max(8, x),
      top: Math.max(8, y),
      zIndex: 9999,
      maxWidth: 200,
      background: '#222',
      color: '#fff',
      borderRadius: 10,
      padding: '16px',
      boxShadow: '0 4px 24px 0 rgba(0,0,0,0.25)',
      fontSize: 15,
      lineHeight: 1.6,
      pointerEvents: 'none',
      whiteSpace: 'pre-line',
      transform: 'translateY(-50%)',
    }
    return <div style={style}>{content}</div>
  }

  return (
    <section id="pricing" className="px-4 py-10 md:px-16 md:py-16 mx-auto max-w-7xl">
      {/* 大标题和副标题 */}
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-3">
        {t('title')}
      </h2>
      <p className="text-center text-gray-600 dark:text-gray-400 mb-8 text-base md:text-lg mx-auto">
        {t('subtitle')}
      </p>

      {/* 计费周期切换按钮 */}
      <div className="flex justify-center items-center gap-8 mb-12">
        {/* Monthly 区域 */}
        <div className="flex flex-row-reverse items-center gap-2 w-[180px] justify-end">
          <button
            className={clsx(
              'min-w-[120px] px-6 py-2 rounded-full font-medium border transition text-lg',
              billingKey === 'monthly'
                ? 'text-white bg-gradient-to-r from-purple-400 to-pink-500 hover:from-purple-500 hover:to-pink-600 dark:from-purple-500 dark:to-pink-600 dark:hover:from-purple-600'
                : 'bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700 text-gray-800 dark:text-gray-200 hover:border-purple-400',
              'mr-4'
            )}
            onClick={() => setBillingKey('monthly')}
            type="button"
          >
            {(billingSwitch.options.find((opt: any) => opt.key === 'monthly')?.name) || 'Monthly'}
          </button>
          {/* 标签（从右往左），未选中时用 invisible 占位 */}
          {(() => {
            const opt = billingSwitch.options.find((opt: any) => opt.key === 'monthly');
            const bOpt = billingOptions.find((opt: any) => opt.key === 'monthly');
            if (!(opt && bOpt && opt.discountText && bOpt.discount !== 0)) return <span className="min-w-[80px] px-2 py-1 text-xs rounded invisible"></span>;
            return (
              <span className={clsx(
                "min-w-[80px] px-2 py-1 text-xs rounded bg-yellow-100 text-yellow-800 font-semibold align-middle text-center inline-flex items-center justify-center whitespace-nowrap",
                billingKey !== 'monthly' && 'invisible'
              )}>
                {opt.discountText.replace(
                  '{percent}',
                  String(Math.round(Math.abs(bOpt.discount) * 100))
                )}
              </span>
            );
          })()}
        </div>
        {/* Yearly 区域 */}
        <div className="flex items-center gap-2 w-[180px] justify-start">
          <button
            className={clsx(
              'min-w-[120px] px-6 py-2 rounded-full font-medium border transition text-lg',
              billingKey === 'yearly'
                ? 'text-white bg-gradient-to-r from-purple-400 to-pink-500 hover:from-purple-500 hover:to-pink-600 dark:from-purple-500 dark:to-pink-600 dark:hover:from-purple-600'
                : 'bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700 text-gray-800 dark:text-gray-200 hover:border-purple-400',
              'ml-4'
            )}
            onClick={() => setBillingKey('yearly')}
            type="button"
          >
            {(billingSwitch.options.find((opt: any) => opt.key === 'yearly')?.name) || 'Yearly'}
          </button>
          {/* 标签（从左往右），未选中时用 invisible 占位 */}
          {(() => {
            const opt = billingSwitch.options.find((opt: any) => opt.key === 'yearly');
            const bOpt = billingOptions.find((opt: any) => opt.key === 'yearly');
            if (!(opt && bOpt && opt.discountText && bOpt.discount !== 0)) return <span className="min-w-[80px] px-2 py-1 text-xs rounded invisible"></span>;
            return (
              <span className={clsx(
                "min-w-[80px] px-2 py-1 text-xs rounded bg-yellow-100 text-yellow-800 font-semibold align-middle text-center inline-flex items-center justify-center whitespace-nowrap",
                billingKey !== 'yearly' && 'invisible'
              )}>
                {opt.discountText.replace(
                  '{percent}',
                  String(Math.round(Math.abs(bOpt.discount) * 100))
                )}
              </span>
            );
          })()}
        </div>
      </div>

      {/* 价格卡片区域 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan: any, _idx: number) => (
          <div
            key={plan.key}
            className={clsx(
              'flex flex-col bg-white dark:bg-gray-800/60 rounded-2xl border border-gray-300 dark:border-[#7c3aed40] transition p-8 h-full shadow-sm dark:shadow-none',
              'hover:border-2 hover:border-purple-500',
              'focus-within:border-2 focus-within:border-purple-500'
            )}
            style={{ minHeight: maxFeaturesCount*100 }}
          >
            {/* 主标题和tag */}
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl font-bold text-gray-900 dark:text-gray-100">{plan.title}</span>
              {plan.titleTags && plan.titleTags.map((tag: string, i: number) => (
                <span key={i} className="px-2 py-0.5 text-xs rounded bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200 font-semibold align-middle">{tag}</span>
              ))}
            </div>
            {/* 价格和单位/折扣 */}
            {renderPrice(plan)}
            {/* 权益列表 */}
            <ul className="flex-1 mb-6 mt-4">
              {getFeatureRows(plan).map((feature: any, i: number) => (
                <li key={i} className="flex items-center gap-2 mb-2 min-h-[28px]">
                  {/* icon */}
                  {feature ? (
                    <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200 mr-1">
                      {feature.icon ? <span>{feature.icon}</span> : <span className="font-bold">✓</span>}
                    </span>
                  ) : (
                    <span className="inline-flex items-center justify-center w-5 h-5 rounded-full mr-1">&nbsp;</span>
                  )}
                  {/* tag */}
                  {feature && feature.tag && (
                    <span className="px-1 py-0.5 text-[6px] rounded bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 font-semibold align-middle">{feature.tag}</span>
                  )}
                  {/* 描述+tooltip */}
                  {feature ? (
                    <span className="relative group cursor-pointer text-sm text-gray-800 dark:text-gray-200">
                      {feature.description}
                      {feature.tooltip && (
                        <span
                          className="ml-1 align-middle inline-flex"
                          onMouseEnter={e => {
                            setTooltip({
                              show: true,
                              content: feature.tooltip,
                              x: e.clientX,
                              y: e.clientY
                            })
                          }}
                          onMouseMove={e => {
                            setTooltip(t => ({ ...t, x: e.clientX, y: e.clientY }))
                          }}
                          onMouseLeave={() => setTooltip(t => ({ ...t, show: false }))}
                        >
                          <icons.FAQ className="w-4 h-4" />
                        </span>
                      )}
                    </span>
                  ) : (
                    <span>&nbsp;</span>
                  )}
                </li>
              ))}
            </ul>
            {/* 占位，保证卡片高度一致 */}
            <div className="flex-1" />
            {/* 按钮 */}
            <button
              className={clsx(
                'w-full py-2 mt-auto text-white text-base font-bold shadow-lg hover:shadow-xl transition-all duration-300 rounded-full',
                plan.button?.disabled
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-purple-400 to-pink-500 hover:from-purple-500 hover:to-pink-600 dark:from-purple-500 dark:to-pink-600 dark:hover:from-purple-600 dark:hover:to-pink-700'
              )}
              disabled={plan.button?.disabled}
              type="button"
              onClick={() => {
                if (!plan.button?.disabled) {
                  router.push('/');
                }
              }}
            >
              {plan.button?.text || '--'}
            </button>
          </div>
        ))}
      </div>
      {/* Tooltip 悬浮提示 */}
      <Tooltip {...tooltip} />
    </section>
  )
} 