import { useEffect, useState } from "react"

export function useScrollHide(ref: { current: HTMLElement | null }): boolean {
  const [hidden, setHidden] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    let lastScrollTop = 0

    function handleScroll() {
      const scrollTop = el!.scrollTop
      if (scrollTop === 0) {
        setHidden(false)
      } else if (scrollTop > lastScrollTop + 8) {
        setHidden(true)
      } else if (scrollTop < lastScrollTop) {
        setHidden(false)
      }
      lastScrollTop = scrollTop
    }

    el.addEventListener("scroll", handleScroll, { passive: true })
    return () => el.removeEventListener("scroll", handleScroll)
  }, [ref])

  return hidden
}
