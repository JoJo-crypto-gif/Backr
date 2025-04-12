"use client"

import type React from "react"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { CalendarIcon, ImagePlus, Loader2, X } from "lucide-react"
import { format } from "date-fns"
import * as z from "zod"
import { useCurrentUser } from "@/hooks/useCurrentUser"
import { DashboardShell } from "@/components/ui/dashboard/shell"
import { DashboardHeader } from "@/components/ui/dashboard/header"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"]

const formSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  goalAmount: z.number().positive().nullable(),
  deadline: z.date().nullable(),
  isRecurring: z.boolean(),
  story: z.string().min(50, "Story must be at least 50 characters"),
  category: z.string().min(1, "Please select a category"),
  userId: z.string(),
  images: z.any(), // We'll handle image validation separately
})

const categories = [
  { id: "medical", name: "Medical" },
  { id: "education", name: "Education" },
  { id: "emergency", name: "Emergency" },
  { id: "community", name: "Community" },
  { id: "nonprofit", name: "Non-profit" },
  { id: "animals", name: "Animals" },
  { id: "environment", name: "Environment" },
  { id: "other", name: "Other" },
]

export default function NewCampaignPage() {
    const navigate = useNavigate()

  const [images, setImages] = useState<File[]>([])
  const [imageUrls, setImageUrls] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  // In a real app, you would get this from authentication
  const { user } = useCurrentUser();


  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      goalAmount: null,
      deadline: null,
      isRecurring: false,
      story: "",
      category: "",
      userId: user ? user._id : "",
      images: [],
    },
  })

  const isRecurring = form.watch("isRecurring")

  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    // Check if adding new files would exceed the limit
    if (images.length + files.length > 3) {
      alert("You can only upload a maximum of 3 images")
      return
    }

    const newFiles: File[] = []
    const newUrls: string[] = []

    Array.from(files).forEach((file) => {
      // Validate file size and type
      if (file.size > MAX_FILE_SIZE) {
        alert(`File ${file.name} is too large. Maximum size is 5MB.`)
        return
      }

      if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
        alert(`File ${file.name} has an unsupported format.`)
        return
      }

      newFiles.push(file)
      newUrls.push(URL.createObjectURL(file))
    })

    setImages((prev) => [...prev, ...newFiles])
    setImageUrls((prev) => [...prev, ...newUrls])
  }

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index))

    // Revoke the object URL to avoid memory leaks
    URL.revokeObjectURL(imageUrls[index])
    setImageUrls((prev) => prev.filter((_, i) => i !== index))
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    const currentUserId = user?._id; // Type is string | undefined
 
    // --- ADD THIS CHECK ---
    if (!currentUserId) {
      // Handle the case where the user ID is missing
      console.error("onSubmit Error: currentUserId is missing.", user);
      alert("Could not create campaign: User information is missing. Please ensure you are logged in.");
      setIsSubmitting(false); // Stop the loading indicator
      return; // IMPORTANT: Stop the function execution
    }
    // --- END CHECK ---
 
    // If the code reaches here, TypeScript knows (or should know)
    // currentUserId is a string because the function would have returned otherwise.
    // However, we add '!' below for certainty within the try block.
 
    try {
      // If recurring, set goalAmount and deadline to null
      if (values.isRecurring) {
        values.goalAmount = null;
        values.deadline = null;
      }
 
      // Create a FormData object
      const formData = new FormData();
 
      // Append fields, renaming keys where necessary.
      // --- ADD '!' HERE ---
      formData.append("creatorId", currentUserId!); // Assert that it's not null/undefined
      // ---
      formData.append("title", values.title);
      formData.append("description", values.description);
      formData.append("category", values.category);
 
      // The backend expects "goalamt" (lowercase, no camelCase)
      formData.append("goalamt", values.goalAmount ? values.goalAmount.toString() : "");
 
      // The backend expects a date in a format that JavaScript Date can parse.
      formData.append("deadline", values.deadline ? new Date(values.deadline).toISOString() : "");
 
      // Boolean as string
      formData.append("isRecurring", values.isRecurring.toString());
 
      formData.append("story", values.story);
 
      // Append image files if any. (Key must be "images" since backend does req.files)
      images.forEach((file) => {
        formData.append("images", file);
      });
 
      // Debug: To verify your FormData keys (you can remove this for production)
      // for (const pair of formData.entries()) {
      //   console.log(pair[0] + ": " + pair[1]);
      // }
 
      // Send the POST request to your backend
      const response = await fetch("http://localhost:5000/campaigns/create", {
        method: "POST",
        credentials: "include", // Include session cookies, if needed
        body: formData,
      });
 
      const data = await response.json();
 
      if (data.success) {
        // Redirect to the campaigns page
        alert("Campaign created successfully!");
        // navigate("/dashboard/campaigns");
      } else {
        // Log the specific error from the backend if available
        console.error("Error creating campaign:", data.message || data);
        alert(`Failed to create campaign: ${data.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("An unexpected error occurred while submitting the form.");
    } finally {
      setIsSubmitting(false);
    }
  }
  

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Create New Campaign"
        text="Fill out the form below to create a new fundraising campaign."
      >
        <Button variant="outline" onClick={() =>navigate("/dashboard/campaigns")}>
          Cancel
        </Button>
      </DashboardHeader>

      <Card>
        <CardContent className="pt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Campaign Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter a compelling title" {...field} />
                    </FormControl>
                    <FormDescription>This will be the main title of your campaign.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Short Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Briefly describe your campaign (1-2 sentences)" {...field} rows={2} />
                    </FormControl>
                    <FormDescription>A short summary that will appear in campaign listings.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="isRecurring"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Recurring Campaign</FormLabel>
                        <FormDescription>
                          Is this an ongoing campaign without a specific goal or deadline?
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category.id} value={category.id}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>Choose the category that best fits your campaign.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {!isRecurring && (
                <div className="grid gap-6 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="goalAmount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Goal Amount</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2">$</span>
                            <Input
                              type="number"
                              placeholder="5000"
                              className="pl-7"
                              value={field.value ?? ""}
                              onChange={(e) =>
                                field.onChange(e.target.value ? Number.parseFloat(e.target.value) : null)
                              }
                            />
                          </div>
                        </FormControl>
                        <FormDescription>The total amount you aim to raise.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="deadline"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Deadline</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-full pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground",
                                )}
                              >
                                {field.value ? format(field.value, "yyyy/MM/dd") : <span>Pick a date</span>}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value || undefined}
                              onSelect={field.onChange}
                              disabled={(date) => date < new Date()}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormDescription>When your campaign will end.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}

              <FormField
                control={form.control}
                name="story"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Campaign Story</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Tell your story in detail. Why are you raising funds? How will they be used?"
                        {...field}
                        rows={6}
                      />
                    </FormControl>
                    <FormDescription>
                      Share details about your campaign to connect with potential donors.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="images"
                render={() => (
                  <FormItem>
                    <FormLabel>Campaign Images (Max 3)</FormLabel>
                    <FormControl>
                      <div className="grid grid-cols-3 gap-4">
                        {imageUrls.map((url, index) => (
                          <div key={index} className="relative aspect-video rounded-md overflow-hidden border">
                            <img
                              src={url || "/placeholder.svg"}
                              alt={`Campaign image ${index + 1}`}
                              className="h-full w-full object-cover"
                            />
                            <Button
                              type="button"
                              variant="destructive"
                              size="icon"
                              className="absolute top-1 right-1 h-6 w-6"
                              onClick={() => removeImage(index)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}

                        {images.length < 3 && (
                          <div className="flex aspect-video items-center justify-center rounded-md border border-dashed">
                            <label className="flex cursor-pointer flex-col items-center justify-center gap-1 text-sm text-muted-foreground">
                              <ImagePlus className="h-8 w-8" />
                              <span>Add Image</span>
                              <input type="file" accept="image/*" className="sr-only" onChange={handleImageUpload} />
                            </label>
                          </div>
                        )}
                      </div>
                    </FormControl>
                    <FormDescription>
                      Upload up to 3 high-quality images for your campaign. Max 5MB each.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

                {/* <input type="" {...form.register("userId")} value={user ? user._id : ""} /> */}



              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Campaign...
                  </>
                ) : (
                  "Create Campaign"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </DashboardShell>
  )
}
