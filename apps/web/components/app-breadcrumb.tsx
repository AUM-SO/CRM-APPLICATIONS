"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@workspace/ui/components/breadcrumb"

const labels: Record<string, string> = {
  customers: "Customers",
}

export function AppBreadcrumb() {
  const pathname = usePathname()

  // Split path into segments, e.g. "/customers/123" → ["customers", "123"]
  const segments = pathname.split("/").filter(Boolean)

  // Build crumb list: each crumb has a label and an optional href
  const crumbs = segments.map((segment, index) => {
    const href = "/" + segments.slice(0, index + 1).join("/")
    const isLast = index === segments.length - 1

    // Use a friendly label if defined, otherwise title-case the segment
    const label =
      labels[segment] ??
      (segment.length <= 8
        ? segment.charAt(0).toUpperCase() + segment.slice(1)
        : "Customer Profile")

    return { label, href, isLast }
  })

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {crumbs.map((crumb, index) => (
          <span key={crumb.href} className="flex items-center gap-1.5">
            {index > 0 && <BreadcrumbSeparator />}
            <BreadcrumbItem>
              {crumb.isLast ? (
                <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
              ) : (
                <BreadcrumbLink asChild>
                  <Link href={crumb.href}>{crumb.label}</Link>
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
          </span>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
