"use client"

import { DashboardShell } from "@/components/ui/dashboard/shell"
import { DashboardHeader } from "@/components/ui/dashboard/header"
import { useCurrentUser } from "@/hooks/useCurrentUser"
import { useState } from "react"
import WithdrawForm from "@/components/ui/dashboard/WithdrawForm"

export default function WithdrawPage() {
  const { user, loading } = useCurrentUser()

  if (loading) return <DashboardShell><div>Loading user...</div></DashboardShell>

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Withdraw Funds"
        text="Request a withdrawal to your mobile money or bank account."
      />

      <div className="container mx-auto py-10">
        <div className="rounded-md border p-5 bg-gray-100">
          <div className="mb-4 text-center text-xl font-semibold">
            Available Balance: GHS {user?.balance?.toFixed(2)}
          </div>

          <WithdrawForm balance={user?.balance || 0} />
        </div>
      </div>
    </DashboardShell>
  )
}
