import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, Send } from "lucide-react"

interface CommentFormProps {
  onSubmit: (text: string) => Promise<boolean>
  posting: boolean
}

export function CommentForm({ onSubmit, posting }: CommentFormProps) {
  const [text, setText] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!text.trim() || posting) return

    const success = await onSubmit(text)
    if (success) {
      setText("")
    }
  }

  return (
    <div className="border rounded-lg p-4 bg-white mb-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Share your thoughts about this campaign..."
          disabled={posting}
          className="min-h-[100px] resize-none"
          maxLength={500}
        />
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">{text.length}/500</span>
          <Button type="submit" disabled={!text.trim() || posting} size="sm">
            {posting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Posting...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Post Comment
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}