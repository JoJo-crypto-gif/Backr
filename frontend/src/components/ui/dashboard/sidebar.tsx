"use client"

import { useLocation } from "react-router-dom"
import { Link } from "react-router-dom"
import { useCurrentUser } from "@/hooks/useCurrentUser"

import { BookText, CreditCard, Home, Package, Settings, Users, Search, Bell, User, CirclePlus } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const navigationItems = [
  {
    title: "Dashboard",
    icon: Home,
    href: "/dashboard",
  },
  {
    title: "Campaigns",
    icon: BookText,
    href: "/dashboard/campaigns",
  },
  {
    title: "Customers",
    icon: Users,
    href: "/dashboard/customers",
  },
  {
    title: "Products",
    icon: Package,
    href: "/dashboard/products",
  },
  {
    title: "Billing",
    icon: CreditCard,
    href: "/dashboard/billing",
  },
  {
    title: "Settings",
    icon: Settings,
    href: "/dashboard/settings",
  },
]

export function DashboardSidebar() {
  const pathname = useLocation().pathname
  const { user } = useCurrentUser()

  const baseURL = "http://localhost:5000"

  const avatarSrc = user?.avatar
  ? `${baseURL}${user.avatar}` // assuming avatar is something like "uploads/avatar/xyz.jpg"
  : "/placeholder-user.jpg"

const displayName = user?.name || "Guest"


  return (
    <Sidebar className="bg-gray-100 p-1">
      <SidebarHeader className="flex flex-col gap-2 px-4 py-2">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 font-semibold mt-3 mb-3">
            <Package className="h-6 w-6" />
            <span>Backer</span>
          </Link>
          <div className="flex items-center gap-2 md:hidden">
            <Button variant="ghost" size="icon" className="rounded-full">
              <Bell className="h-5 w-5" />
              <span className="sr-only">Notifications</span>
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Avatar className="h-8 w-8">
                  <AvatarImage src={avatarSrc} alt={displayName} />
                  <AvatarFallback>{displayName[0]}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <div className="relative">
          <SidebarInput placeholder="Search..." />
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton asChild isActive={pathname === item.href} tooltip={item.title}>
                    <Link to={item.href}>
                      <item.icon className="h-5 w-5" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <button type="button" className="block border w-4/5 m-auto ml-3.5 mr-3.5 h-[50px] p-3 text-white bg-gray-700 rounded-xl justify-items-center cursor-pointer hover:bg-gray-900 transition-all duration-300">
                    <Link to="/dashboard/new-campaign" className="flex">
                    <CirclePlus className="h-6 w-4 mr-1" />
                    New campaign
                    </Link>
          </button>
      </SidebarContent>
      <SidebarFooter className="hidden md:block">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton>
                  <Avatar className="h-6 w-6">
                  <AvatarImage src={avatarSrc} alt={displayName} />
                  <AvatarFallback>{displayName[0]}</AvatarFallback>
                  </Avatar>
                  <span>{displayName}</span>
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-[--radix-dropdown-menu-trigger-width]">
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
