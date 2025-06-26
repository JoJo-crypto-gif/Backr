"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface CardFormProps {
  balance: number
}

export default function CardForm({ balance }: CardFormProps) {
  const [amount, setAmount] = useState<number>(0)
  const [name, setName] = useState("")
  const [accountNumber, setAccountNumber] = useState("")
  const [bankName, setBankName] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async () => {
    setIsSubmitting(true)
    // TODO: Call bank withdrawal API
    console.log("Bank Withdrawal:", { amount, name, accountNumber, bankName })
    setIsSubmitting(false)
  }

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="card-name">Account Holder Name</Label>
        <Input
          id="card-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your full name as on bank account"
          required
        />
      </div>

      <div>
        <Label htmlFor="card-account">Account Number</Label>
        <Input
          id="card-account"
          value={accountNumber}
          onChange={(e) => setAccountNumber(e.target.value)}
          placeholder="e.g. 0123456789012"
          required
        />
      </div>

      <div>
        <Label htmlFor="card-bank">Bank Name</Label>
        <Select onValueChange={setBankName} value={bankName}>
          <SelectTrigger>
            <SelectValue placeholder="Select bank" />
          </SelectTrigger>
          <SelectContent className="bg-gray-50/95 backdrop-blur-md border border-gray-200 shadow-lg">
            <SelectItem value="GCB Bank">GCB Bank</SelectItem>
            <SelectItem value="Ecobank">Ecobank</SelectItem>
            <SelectItem value="Standard Chartered">Standard Chartered</SelectItem>
            <SelectItem value="Absa Bank">Absa Bank</SelectItem>
            <SelectItem value="Fidelity Bank">Fidelity Bank</SelectItem>
            <SelectItem value="Zenith Bank">Zenith Bank</SelectItem>
            <SelectItem value="Other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="card-amount">Amount to Withdraw</Label>
        <Input
          id="card-amount"
          type="number"
          value={amount}
          min={0}
          max={balance}
          onChange={(e) => setAmount(Number(e.target.value))}
          placeholder="Enter amount"
          required
        />
        <p className="text-sm text-muted-foreground mt-1">Maximum: GHS {balance.toFixed(2)}</p>
      </div>

      <Button
        onClick={handleSubmit}
        disabled={isSubmitting || amount <= 0 || amount > balance || !name || !accountNumber || !bankName}
        className="w-full"
      >
        {isSubmitting ? "Processing..." : "Request Bank Withdrawal"}
      </Button>
    </div>
  )
}
