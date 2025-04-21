// 👇 Put this above the component or extract to its own file
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter
  } from "@/components/ui/dialog"
  import { Input } from "@/components/ui/input"
  import { Label } from "@/components/ui/label"
  import { useState } from "react"
  import { Button } from "@/components/ui/button"
  import axios from "axios"
  
  export default function DonationModal({ campaignId }: { campaignId: string }) {
    const [open, setOpen] = useState(false)
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [amount, setAmount] = useState("")
  
    const handleSubmit = async () => {
      if (!email || !amount) {
        alert("Please fill in all required fields.")
        return
      }
  
      try {
        const response = await axios.post("http://localhost:5000/api/payments/initialize", {
          email,
          name,
          amount: Number(amount),
          campaignId
        })
  
        window.location.href = response.data.url
      } catch (err) {
        console.error("Error initializing payment:", err)
        alert("There was an error. Try again.")
      }
    }
  
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            className="w-full bg-gray-700 hover:bg-gray-800 text-white rounded shadow-sm cursor-pointer"
            size="lg"
          >
            Back this campaign
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md bg-gray-50">
          <DialogHeader>
            <DialogTitle>Donate to this campaign</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label className="mb-2">Name</Label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Optional"
                className="min-h-10"
              />
            </div>
            <div>
              <Label className="mb-2">Email</Label>
              <Input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                placeholder="Enter your email"
                className="min-h-10"
                required
              />
            </div>
            <div>
              <Label className="mb-2">Amount (GHS)</Label>
              <Input
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                type="number"
                min="100"
                placeholder="e.g. 5000"
                className="min-h-10"
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleSubmit} className="w-full bg-gray-700 hover:bg-gray-800 text-white rounded shadow-sm cursor-pointer">
              Proceed to payment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }
  