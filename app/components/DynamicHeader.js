'use client'

import { usePathname } from 'next/navigation'

export default function DynamicHeader() {
  const pathname = usePathname()
  const title = pathname.includes('select') ? 'AI 보고서' : 'IFRS S2 보고서'
  
  return title
}