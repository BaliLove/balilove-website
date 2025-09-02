'use client'

import { useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

function PostHogPageView(): null {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (pathname) {
      let url = window.origin + pathname
      if (searchParams && searchParams.toString()) {
        url = url + `?${searchParams.toString()}`
      }
      
      // Basic page tracking - can enhance later
      console.log('Page viewed:', url)
    }
  }, [pathname, searchParams])

  return null
}

export function PHProvider({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <PostHogPageView />
      {children}
    </div>
  )
}