"use client"

import type React from "react"

import { DashboardSidebar } from "./sidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"

interface DashboardShellProps {
  children: React.ReactNode
}

export function DashboardShell({ children }: DashboardShellProps) {
  return (
    <SidebarProvider>
      <DashboardSidebar />
      <SidebarInset>
        <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  )
}
