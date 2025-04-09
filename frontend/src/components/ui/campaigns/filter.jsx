"use client"

import { useState } from "react"
import { Search, Filter, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function InlineFilter() {
  const [searchQuery, setSearchQuery] = useState("")
  const [category, setCategory] = useState("")
  const [status, setStatus] = useState("")
  const [funding, setFunding] = useState("")
  const [sortBy, setSortBy] = useState("popular")

  const handleReset = () => {
    setSearchQuery("")
    setCategory("")
    setStatus("")
    setFunding("")
    setSortBy("popular")
  }

  const hasActiveFilters = searchQuery || category || status || funding || sortBy !== "popular"

  return (
    <div className="w-full bg-background py-4 border-b">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4 w-full">
          {/* Search Input */}
          <div className="relative flex-grow max-w-md">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search sharecode or name"
              className="pl-8 w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Filter Label - Only visible on larger screens */}
          <div className="hidden md:flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <Filter className="h-4 w-4" />
            <span>Filter by:</span>
          </div>

          {/* Category Dropdown */}
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-full md:w-[140px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="#">From backend</SelectItem>
            </SelectContent>
          </Select>

          {/* Status Dropdown */}
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="w-full md:w-[140px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="trending">Trending</SelectItem>
              <SelectItem value="new">New</SelectItem>
              <SelectItem value="ending">Ending Soon</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>

          {/* Funding Progress Dropdown */}
          <Select value={funding} onValueChange={setFunding}>
            <SelectTrigger className="w-full md:w-[140px]">
              <SelectValue placeholder="Funding" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Any Funding</SelectItem>
              <SelectItem value="under25">Under 25%</SelectItem>
              <SelectItem value="25to50">25% - 50%</SelectItem>
              <SelectItem value="50to75">50% - 75%</SelectItem>
              <SelectItem value="over75">Over 75%</SelectItem>
              <SelectItem value="funded">Fully Funded</SelectItem>
            </SelectContent>
          </Select>

          {/* Sort Dropdown */}
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full md:w-[140px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="popular">Most Popular</SelectItem>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="ending">Ending Soon</SelectItem>
              <SelectItem value="amount">Most Funded</SelectItem>
              <SelectItem value="backers">Most Backers</SelectItem>
            </SelectContent>
          </Select>

          {/* Reset Button - Only visible when filters are active */}
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleReset}
              className="flex items-center gap-1 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
              <span>Reset</span>
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
