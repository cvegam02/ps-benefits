import { ReactNode } from "react"

interface KpiCardProps {
  title: string
  value: string | number
  description: string | ReactNode
  icon: ReactNode
  iconBgClass: string
  iconBorderClass: string
  iconStrokeClass: string
  progressBarColorClass: string
  progressPercentage: string
  isDark?: boolean
}

export function KpiCard({
  title,
  value,
  description,
  icon,
  iconBgClass,
  iconBorderClass,
  iconStrokeClass,
  progressBarColorClass,
  progressPercentage,
  isDark = false,
}: KpiCardProps) {
  return (
    <div className={`${isDark ? "bg-price-blue-900 shadow-lg shadow-price-blue-900/25" : "bg-white border border-gray-200 shadow-sm"} rounded-2xl px-6 pt-5 pb-4 flex flex-col gap-3 relative overflow-hidden`}>
      {isDark && (
        <div className="absolute top-0 right-0 w-24 h-24 bg-price-pink-500/15 rounded-full blur-xl -mr-6 -mt-6" />
      )}
      <div className="flex items-center justify-between relative z-10">
        <p className={`${isDark ? "text-price-blue-300" : "text-gray-400"} text-[10px] font-black uppercase tracking-widest`}>{title}</p>
        <div className={`w-9 h-9 rounded-xl ${iconBgClass} ${iconBorderClass} flex items-center justify-center flex-shrink-0`}>
          {icon && (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={iconStrokeClass} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              {(icon as React.ReactElement).props.children}
            </svg>
          )}
        </div>
      </div>
      <p className={`${isDark ? "text-white" : "text-gray-900"} text-5xl font-black leading-none tracking-tight tabular-nums relative z-10`}>{value}</p>
      <p className={`${isDark ? "text-price-blue-300" : "text-gray-400"} text-xs font-medium relative z-10`}>{description}</p>
      <div className={`${isDark ? "bg-white/10" : "bg-gray-100"} h-1.5 rounded-full overflow-hidden relative z-10`}>
        <div
          className={`h-full rounded-full ${progressBarColorClass} transition-all duration-500`}
          style={{ width: progressPercentage }}
        />
      </div>
    </div>
  )
}
