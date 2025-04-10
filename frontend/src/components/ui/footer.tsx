"use client"

import type React from "react"

import { useState } from "react"
// import Link from "next/link"
import { ChevronDown, ChevronUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface FAQItemProps {
  question: string
  answer: string
  isOpen: boolean
  toggleOpen: () => void
}

const FAQItem = ({ question, answer, isOpen, toggleOpen }: FAQItemProps) => {
  return (
    <div className="border-b border-muted py-4">
      <button
        className="flex w-full items-center justify-between text-left"
        onClick={toggleOpen}
        aria-expanded={isOpen}
      >
        <span className="font-medium">{question}</span>
        {isOpen ? (
          <ChevronUp className="h-5 w-5 text-muted-foreground transition-transform duration-400" />
        ) : (
          <ChevronDown className="h-5 w-5 text-muted-foreground transition-transform duration-400" />
        )}
      </button>
      <div
        className={`mt-2 text-sm text-muted-foreground overflow-hidden transition-all duration-1000 ease-in-out ${
          isOpen ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <p className="pb-2">{answer}</p>
      </div>
    </div>
  )
}

export default function Footer() {
  const [email, setEmail] = useState("")
  const [openFAQ, setOpenFAQ] = useState<number | null>(null)

  const toggleFAQ = (index: number) => {
    setOpenFAQ(openFAQ === index ? null : index)
  }

  const faqs = [
    {
      question: "What is our crowdfunding platform?",
      answer:
        "Our platform connects innovators with backers, allowing creators to fund their projects through the support of the community. We provide all the tools needed to launch, manage, and promote your campaign.",
    },
    {
      question: "How do I start a campaign?",
      answer:
        "Starting a campaign is easy! Create an account, click on 'Start a Campaign', fill in your project details, set your funding goal, add compelling images or videos, and launch when you're ready. Our step-by-step guide will help you through the process.",
    },
    {
      question: "What fees do you charge?",
      answer:
        "We charge a competitive 5% platform fee on funds raised, plus payment processing fees (typically 2.9% + $0.30 per transaction). There are no setup fees or monthly charges. You only pay when your campaign is successfully funded.",
    },
    {
      question: "How long can my campaign run?",
      answer:
        "Campaigns can run for 15, 30, or 60 days. We recommend 30 days as the sweet spot for most projects, as it creates urgency while giving you enough time to build momentum and reach your funding goal.",
    },
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle newsletter signup logic here
    console.log("Email submitted:", email)
    setEmail("")
    // You would typically call an API here to handle the subscription
  }

  return (
<footer className="w-full py-12 md:py-24 lg:py-32 overflow-hidden animate-fade-in">
  <div className="container px-4 md:px-6 m-auto">
    <div className="grid gap-10 md:grid-cols-2 lg:gap-16">
      {/* Left Side: Newsletter Signup */}
      <div className="space-y-6">
        <div className="space-y-3">
          <h3 className="text-2xl font-bold">
            Ready to <span className="italic">get started</span>?
          </h3>
          <p className="text-muted-foreground">Have questions? We're here to help you every step of the way.</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border-b border-t-0 border-x-0 rounded-none px-0 bg-transparent focus-visible:ring-0 focus-visible:border-primary"
                required
              />
            </div>
            <Button type="submit" className="bg-gray-900 hover:bg-black text-white">
              Subscribe
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            By subscribing, you agree to our Privacy Policy and consent to receive updates.
          </p>
        </form>
      </div>

      {/* Right Side: FAQ Accordion */}
      <div className="space-y-6">
        <h3 className="text-lg font-medium">Maybe your question has been answered, check this out.</h3>
        <div className="space-y-1">
          {faqs.map((faq, index) => (
            <FAQItem
              key={index}
              question={faq.question}
              answer={faq.answer}
              isOpen={openFAQ === index}
              toggleOpen={() => toggleFAQ(index)}
            />
          ))}
        </div>
      </div>
    </div>

    {/* Bottom Section */}
    <div className="mt-16 pt-8 border-t flex flex-col md:flex-row justify-between items-center gap-6">
      {/* Social Media Icons with Image URLs */}
      <div className="flex items-center gap-4">
        <a href="https://facebook.com" className="text-muted-foreground hover:text-foreground transition-colors" target="_blank" rel="noopener noreferrer">
          <img src="https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg" alt="Facebook" className="h-6 w-6" />
        </a>
        <a href="https://instagram.com" className="text-muted-foreground hover:text-foreground transition-colors" target="_blank" rel="noopener noreferrer">
          <img src="https://upload.wikimedia.org/wikipedia/commons/a/a5/Instagram_icon.png" alt="Instagram" className="h-6 w-6" />
        </a>
        <a href="https://youtube.com" className="text-muted-foreground hover:text-foreground transition-colors" target="_blank" rel="noopener noreferrer">
          <img src="https://upload.wikimedia.org/wikipedia/commons/4/42/YouTube_icon_%282013-2017%29.png" alt="YouTube" className="h-6 w-6" />
        </a>
        <a href="https://linkedin.com" className="text-muted-foreground hover:text-foreground transition-colors" target="_blank" rel="noopener noreferrer">
          <img src="https://upload.wikimedia.org/wikipedia/commons/0/01/LinkedIn_Logo_2013.svg" alt="LinkedIn" className="h-6 w-6" />
        </a>
      </div>

      {/* Footer Links */}
      <div className="flex flex-wrap justify-center gap-6 text-sm">
        <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Privacy Policy</a>
        <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Terms & Conditions</a>
        <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Support</a>
      </div>

      {/* Copyright Notice */}
      <div className="text-sm text-muted-foreground">
        &copy; {new Date().getFullYear()} Crowdfunding Platform. All rights reserved.
      </div>
    </div>
  </div>
</footer>

  )
}
