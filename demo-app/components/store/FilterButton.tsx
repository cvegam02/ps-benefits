interface FilterButtonProps {
  label: string
  count: number
  isActive: boolean
  onClick: () => void
}

export function FilterButton({ label, count, isActive, onClick }: FilterButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-black whitespace-nowrap transition ${
        isActive
          ? "bg-price-blue-900 text-white shadow-md shadow-price-blue-900/20"
          : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
      }`}
    >
      {label}
      <span className={`text-[11px] px-1.5 py-0.5 rounded-lg font-black ${
        isActive ? "bg-white/20 text-white" : "bg-gray-100 text-gray-500"
      }`}>
        {count}
      </span>
    </button>
  )
}
