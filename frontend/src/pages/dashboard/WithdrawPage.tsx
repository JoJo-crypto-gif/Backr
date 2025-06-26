"use client"

import { DashboardShell } from "@/components/ui/dashboard/shell"
import { DashboardHeader } from "@/components/ui/dashboard/header"
import { useCurrentUser } from "@/hooks/useCurrentUser"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Smartphone, CreditCard, ArrowLeft } from "lucide-react"
import MobileMoneyForm from "@/components/ui/dashboard/MobileMoneyForm"
import CardForm from "@/components/ui/dashboard/CardForm"

type WithdrawalMethod = "mobile_money" | "card" | null

export default function WithdrawPage() {
  const { user, loading } = useCurrentUser()
  const [selectedMethod, setSelectedMethod] = useState<WithdrawalMethod>(null)

  if (loading)
    return (
      <DashboardShell>
        <div>Loading user...</div>
      </DashboardShell>
    )

  const resetSelection = () => setSelectedMethod(null)

  return (
    <DashboardShell>
      <DashboardHeader heading="Withdraw Funds" text="Request a withdrawal to your mobile money or bank account." />

      <div className="container mx-auto py-10">
        {/* Available Balance */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-black to-gray-300 px-6 py-4 text-white shadow-lg">
            <div className="text-center">
              <p className="text-sm font-medium opacity-90">Available Balance</p>
              <p className="text-3xl font-bold">GHS {user?.balance?.toFixed(2)}</p>
            </div>
          </div>
        </div>

        {/* Method Selection or Form */}
        <div className="max-w-2xl mx-auto">
          {!selectedMethod ? (
            /* Method Selection Cards */
            <div className="grid md:grid-cols-2 gap-6">
              <Card
                className="cursor-pointer transition-all hover:shadow-lg hover:scale-105 border-2 hover:border-gray-500"
                onClick={() => setSelectedMethod("mobile_money")}
              >
                <CardHeader className="text-center pb-4">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                    <Smartphone className="h-8 w-8 text-black" />
                  </div>
                  <CardTitle className="text-xl">Mobile Money</CardTitle>
                  <CardDescription>Withdraw to your mobile money account</CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <Button className="w-full bg-black text-white hover:bg-white hover:text-black cursor-pointer ">Select Mobile Money</Button>
                </CardContent>
              </Card>

              <Card
                className="cursor-pointer transition-all hover:shadow-lg hover:scale-105 border-2 hover:border-gray-500"
                onClick={() => setSelectedMethod("card")}
              >
                <CardHeader className="text-center pb-4">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                    <CreditCard className="h-8 w-8 text-black" />
                  </div>
                  <CardTitle className="text-xl">Bank Account</CardTitle>
                  <CardDescription>Withdraw directly to your bank account</CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <Button className="w-full bg-black text-white hover:bg-white hover:text-black cursor-pointer ">Select Bank Account</Button>
                </CardContent>
              </Card>
            </div>
          ) : (
            /* Selected Form */
            <Card className="shadow-lg">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <Button variant="ghost" size="sm" onClick={resetSelection} className="flex items-center gap-2">
                    <ArrowLeft className="h-4 w-4" />
                    Back
                  </Button>
                  <div className="flex items-center gap-3">
                    {selectedMethod === "mobile_money" ? (
                      <>
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
                          <Smartphone className="h-5 w-5 text-black" />
                        </div>
                        <div>
                          <CardTitle>Mobile Money Withdrawal</CardTitle>
                          <CardDescription>Enter your mobile money details</CardDescription>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
                          <CreditCard className="h-5 w-5 text-black" />
                        </div>
                        <div>
                          <CardTitle>Bank Account Withdrawal</CardTitle>
                          <CardDescription>Enter your bank account details</CardDescription>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {selectedMethod === "mobile_money" ? (
                  <MobileMoneyForm balance={user?.balance || 0} />
                ) : (
                  <CardForm balance={user?.balance || 0} />
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </DashboardShell>
  )
}
