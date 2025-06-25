"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface WithdrawFormProps {
  balance: number;
}

export default function WithdrawForm({ balance }: WithdrawFormProps) {
  const [method, setMethod] = useState<"mobile_money" | "bank">("mobile_money")
  const [amount, setAmount] = useState<number>(0)
  const [name, setName] = useState("")
  const [numberOrAccount, setNumberOrAccount] = useState("")
  const [networkOrBank, setNetworkOrBank] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async () => {
    // TODO: Call withdrawal API
  }

  return (
    <div className="space-y-4 max-w-md mx-auto">
      {/* Withdrawal method */}
      <div>
        <Label>Withdrawal Method</Label>
        <Select onValueChange={v => setMethod(v as any)} defaultValue={method}>
          <SelectTrigger><SelectValue placeholder="Choose method" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="mobile_money">Mobile Money</SelectItem>
            <SelectItem value="bank">Bank</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Name */}
      <div>
        <Label>Account Name</Label>
        <Input value={name} onChange={e => setName(e.target.value)} placeholder="Your full name" required />
      </div>

      {/* Account number or phone */}
      <div>
        <Label>{method === "mobile_money" ? "Mobile Number" : "Account Number"}</Label>
        <Input value={numberOrAccount} onChange={e => setNumberOrAccount(e.target.value)} placeholder={method === "mobile_money" ? "e.g. 0244000000" : "e.g. 0123456789012"} required />
      </div>

      {/* Network or Bank */}
      <div>
        <Label>{method === "mobile_money" ? "Network (e.g. MTN)" : "Bank Name"}</Label>
        <Input value={networkOrBank} onChange={e => setNetworkOrBank(e.target.value)} placeholder={method === "mobile_money" ? "MTN, Vodafone, AirtelTigo" : "e.g. GCB Bank"} required />
      </div>

      {/* Amount */}
      <div>
        <Label>Amount to Withdraw (Max: {balance})</Label>
        <Input
          type="number"
          value={amount}
          min={0}
          max={balance}
          onChange={e => setAmount(Number(e.target.value))}
          required
        />
      </div>

      {/* Submit */}
      <Button onClick={handleSubmit} disabled={isSubmitting || amount <= 0 || amount > balance} className="w-full">
        {isSubmitting ? "Processing..." : "Request Withdrawal"}
      </Button>
    </div>
  )
}
