"use client"

interface User {
  _id: string
  name: string
  avatar?: string
}

interface Comment {
  _id: string
  campaignId: string
  userId: User
  text: string
  createdAt: string
  updatedAt: string
}

interface CommentItemProps {
  comment: Comment
}

export function CommentItem({ comment }: CommentItemProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
      return diffInMinutes < 1 ? "Just now" : `${diffInMinutes}m ago`
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`
    } else {
      const diffInDays = Math.floor(diffInHours / 24)
      return diffInDays === 1 ? "1 day ago" : `${diffInDays} days ago`
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <div className="border rounded-lg p-4 bg-white mb-4">
      <div className="flex space-x-3">
        <div className="relative h-10 w-10 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
          {comment.userId.avatar ? (
            <img
              src={comment.userId.avatar || "/placeholder.svg"}
              alt={comment.userId.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-sm font-medium text-gray-600">{getInitials(comment.userId.name)}</span>
          )}
        </div>
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-1">
            <h4 className="text-sm font-semibold">{comment.userId.name}</h4>
            <span className="text-xs text-muted-foreground">{formatDate(comment.createdAt)}</span>
          </div>
          <p className="text-sm whitespace-pre-wrap break-words">{comment.text}</p>
        </div>
      </div>
    </div>
  )
}
