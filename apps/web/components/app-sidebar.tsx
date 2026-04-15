"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
} from "@workspace/ui/components/sidebar"
import { Users, LifeBuoyIcon, SendIcon } from "lucide-react"

const navMain = [
  {
    title: "Customers",
    url: "/customers",
    icon: <Users className="size-4" />,
  },
]

const navSecondary = [
  {
    title: "Support",
    url: "#",
    icon: <LifeBuoyIcon />,
  },
  {
    title: "Feedback",
    url: "#",
    icon: <SendIcon />,
  },
]

const user = {
  name: "CRM User",
  email: "user@exo.com",
  avatar: "",
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/customers">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-[#024F42]">
                  <Image
                    src="https://storage.googleapis.com/exo24_public/EXO_logo_green.png"
                    alt="EXO"
                    width={20}
                    height={20}
                    className="object-contain brightness-0 invert"
                  />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">EXO CRM</span>
                  <span className="truncate text-xs text-muted-foreground">Customer Management</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navMain.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname.startsWith(item.url)}
                    tooltip={item.title}
                  >
                    <Link href={item.url}>
                      {item.icon}
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <NavSecondary items={navSecondary} className="mt-auto" />
      </SidebarContent>

      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  )
}
