"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface MobileMoneyFormProps {
  balance: number
}

export default function MobileMoneyForm({ balance }: MobileMoneyFormProps) {
  const [amount, setAmount] = useState<number>(0)
  const [name, setName] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [network, setNetwork] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async () => {
    setIsSubmitting(true)
    // TODO: Call mobile money withdrawal API
    console.log("Mobile Money Withdrawal:", { amount, name, phoneNumber, network })
    setIsSubmitting(false)
  }

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="mm-name">Account Name</Label>
        <Input
          id="mm-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your full name"
          required
        />
      </div>

      <div>
        <Label htmlFor="mm-phone">Mobile Number</Label>
        <Input
          id="mm-phone"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          placeholder="e.g. 0244000000"
          required
        />
      </div>

      <div>
        <Label htmlFor="mm-network">Network</Label>
        <Select onValueChange={setNetwork} value={network}>
          <SelectTrigger>
            <SelectValue placeholder="Select network" />
          </SelectTrigger>
          <SelectContent className="bg-gray-50/95 backdrop-blur-md border border-gray-200 shadow-lg">
            <SelectItem value="MTN">MTN</SelectItem>
            <SelectItem value="Vodafone">Vodafone</SelectItem>
            <SelectItem value="AirtelTigo">AirtelTigo</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="mm-amount">Amount to Withdraw</Label>
        <Input
          id="mm-amount"
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
        disabled={isSubmitting || amount <= 0 || amount > balance || !name || !phoneNumber || !network}
        className="w-full"
      >
        {isSubmitting ? "Processing..." : "Request Mobile Money Withdrawal"}
      </Button>
    </div>
  )
}
