interface PriceDisplayProps {
  amount: number
  className?: string
  centsClassName?: string
}

export function PriceDisplay({ amount, className = "", centsClassName = "" }: PriceDisplayProps) {
  const formatted = new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)

  const dotIndex = formatted.lastIndexOf(".")
  const intPart = formatted.slice(0, dotIndex)
  const decPart = formatted.slice(dotIndex)

  return (
    <span className={`inline-flex items-baseline gap-0 font-price tabular-nums tracking-wide ${className}`}>
      {intPart}
      <span className={`text-[0.72em] font-bold ${centsClassName}`}>{decPart}</span>
    </span>
  )
}
