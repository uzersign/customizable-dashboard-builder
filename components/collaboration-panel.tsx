"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Users,
  MessageSquare,
  Share2,
  Clock,
  Edit,
  Send,
  UserPlus,
  Settings,
  CheckCircle,
  AlertCircle,
} from "lucide-react"

interface Comment {
  id: string
  user: {
    name: string
    avatar: string
    role: string
  }
  content: string
  timestamp: string
  resolved: boolean
  replies?: Comment[]
}

interface Collaborator {
  id: string
  name: string
  email: string
  avatar: string
  role: "owner" | "editor" | "viewer"
  status: "online" | "offline"
  lastSeen: string
}

const mockCollaborators: Collaborator[] = [
  {
    id: "1",
    name: "John Smith",
    email: "john@company.com",
    avatar: "/placeholder.svg?height=32&width=32",
    role: "owner",
    status: "online",
    lastSeen: "now",
  },
  {
    id: "2",
    name: "Sarah Johnson",
    email: "sarah@company.com",
    avatar: "/placeholder.svg?height=32&width=32",
    role: "editor",
    status: "online",
    lastSeen: "2 minutes ago",
  },
  {
    id: "3",
    name: "Mike Brown",
    email: "mike@company.com",
    avatar: "/placeholder.svg?height=32&width=32",
    role: "viewer",
    status: "offline",
    lastSeen: "1 hour ago",
  },
]

const mockComments: Comment[] = [
  {
    id: "1",
    user: {
      name: "Sarah Johnson",
      avatar: "/placeholder.svg?height=32&width=32",
      role: "editor",
    },
    content: "The revenue chart looks great! Could we add a comparison with last quarter?",
    timestamp: "2 hours ago",
    resolved: false,
    replies: [
      {
        id: "1-1",
        user: {
          name: "John Smith",
          avatar: "/placeholder.svg?height=32&width=32",
          role: "owner",
        },
        content: "Good idea! I'll add that comparison chart.",
        timestamp: "1 hour ago",
        resolved: false,
      },
    ],
  },
  {
    id: "2",
    user: {
      name: "Mike Brown",
      avatar: "/placeholder.svg?height=32&width=32",
      role: "viewer",
    },
    content: "The color scheme works well with our brand guidelines.",
    timestamp: "3 hours ago",
    resolved: true,
  },
]

export function CollaborationPanel() {
  const [open, setOpen] = useState(false)
  const [newComment, setNewComment] = useState("")
  const [inviteEmail, setInviteEmail] = useState("")
  const [comments, setComments] = useState<Comment[]>(mockComments)
  const [collaborators, setCollaborators] = useState<Collaborator[]>(mockCollaborators)

  const handleAddComment = () => {
    if (!newComment.trim()) return

    const comment: Comment = {
      id: Date.now().toString(),
      user: {
        name: "You",
        avatar: "/placeholder.svg?height=32&width=32",
        role: "owner",
      },
      content: newComment,
      timestamp: "now",
      resolved: false,
    }

    setComments([comment, ...comments])
    setNewComment("")
  }

  const handleInviteUser = () => {
    if (!inviteEmail.trim()) return

    // Simulate sending invite
    console.log("Inviting:", inviteEmail)
    setInviteEmail("")
  }

  const toggleCommentResolved = (commentId: string) => {
    setComments(
      comments.map((comment) => (comment.id === commentId ? { ...comment, resolved: !comment.resolved } : comment)),
    )
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case "owner":
        return "bg-purple-100 text-purple-700"
      case "editor":
        return "bg-blue-100 text-blue-700"
      case "viewer":
        return "bg-gray-100 text-gray-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">
          <Users className="h-4 w-4 mr-2" />
          Collaborate
          <Badge variant="secondary" className="ml-2">
            {collaborators.filter((c) => c.status === "online").length}
          </Badge>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Collaboration Center
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="comments" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="comments" className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              Comments
              <Badge variant="secondary">{comments.filter((c) => !c.resolved).length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="collaborators" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Team
              <Badge variant="secondary">{collaborators.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="activity" className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Activity
            </TabsTrigger>
          </TabsList>

          <div className="mt-4 h-[60vh]">
            <TabsContent value="comments" className="h-full">
              <div className="flex flex-col h-full">
                {/* Add Comment */}
                <Card className="mb-4">
                  <CardContent className="p-4">
                    <div className="flex gap-3">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src="/placeholder.svg?height=32&width=32" />
                        <AvatarFallback>You</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <Textarea
                          placeholder="Add a comment or suggestion..."
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                          className="min-h-[80px]"
                        />
                        <div className="flex justify-end mt-2">
                          <Button onClick={handleAddComment} disabled={!newComment.trim()}>
                            <Send className="w-4 h-4 mr-2" />
                            Comment
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Comments List */}
                <ScrollArea className="flex-1">
                  <div className="space-y-4">
                    {comments.map((comment) => (
                      <Card key={comment.id} className={`${comment.resolved ? "opacity-60" : ""}`}>
                        <CardContent className="p-4">
                          <div className="flex gap-3">
                            <Avatar className="w-8 h-8">
                              <AvatarImage src={comment.user.avatar || "/placeholder.svg"} />
                              <AvatarFallback>{comment.user.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="font-medium text-sm">{comment.user.name}</span>
                                <Badge variant="outline" className={`text-xs ${getRoleColor(comment.user.role)}`}>
                                  {comment.user.role}
                                </Badge>
                                <span className="text-xs text-muted-foreground">{comment.timestamp}</span>
                                {comment.resolved && (
                                  <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">
                                    <CheckCircle className="w-3 h-3 mr-1" />
                                    Resolved
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm mb-3">{comment.content}</p>

                              <div className="flex items-center gap-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => toggleCommentResolved(comment.id)}
                                  className="text-xs"
                                >
                                  {comment.resolved ? (
                                    <>
                                      <AlertCircle className="w-3 h-3 mr-1" />
                                      Reopen
                                    </>
                                  ) : (
                                    <>
                                      <CheckCircle className="w-3 h-3 mr-1" />
                                      Resolve
                                    </>
                                  )}
                                </Button>
                                <Button variant="ghost" size="sm" className="text-xs">
                                  Reply
                                </Button>
                              </div>

                              {/* Replies */}
                              {comment.replies && comment.replies.length > 0 && (
                                <div className="mt-3 pl-4 border-l-2 border-gray-200 space-y-3">
                                  {comment.replies.map((reply) => (
                                    <div key={reply.id} className="flex gap-2">
                                      <Avatar className="w-6 h-6">
                                        <AvatarImage src={reply.user.avatar || "/placeholder.svg"} />
                                        <AvatarFallback>{reply.user.name.charAt(0)}</AvatarFallback>
                                      </Avatar>
                                      <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                          <span className="font-medium text-xs">{reply.user.name}</span>
                                          <span className="text-xs text-muted-foreground">{reply.timestamp}</span>
                                        </div>
                                        <p className="text-xs">{reply.content}</p>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            </TabsContent>

            <TabsContent value="collaborators" className="h-full">
              <div className="space-y-4">
                {/* Invite Users */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm flex items-center gap-2">
                      <UserPlus className="w-4 h-4" />
                      Invite Team Members
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Enter email address..."
                        value={inviteEmail}
                        onChange={(e) => setInviteEmail(e.target.value)}
                        className="flex-1"
                      />
                      <Button onClick={handleInviteUser} disabled={!inviteEmail.trim()}>
                        <Send className="w-4 h-4 mr-2" />
                        Invite
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Current Collaborators */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Current Team Members</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[40vh]">
                      <div className="space-y-3">
                        {collaborators.map((collaborator) => (
                          <div
                            key={collaborator.id}
                            className="flex items-center justify-between p-3 border rounded-lg"
                          >
                            <div className="flex items-center gap-3">
                              <div className="relative">
                                <Avatar className="w-10 h-10">
                                  <AvatarImage src={collaborator.avatar || "/placeholder.svg"} />
                                  <AvatarFallback>{collaborator.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div
                                  className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${
                                    collaborator.status === "online" ? "bg-green-500" : "bg-gray-400"
                                  }`}
                                />
                              </div>
                              <div>
                                <p className="font-medium text-sm">{collaborator.name}</p>
                                <p className="text-xs text-muted-foreground">{collaborator.email}</p>
                                <p className="text-xs text-muted-foreground">
                                  {collaborator.status === "online" ? "Online" : `Last seen ${collaborator.lastSeen}`}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className={getRoleColor(collaborator.role)}>
                                {collaborator.role}
                              </Badge>
                              <Button variant="ghost" size="sm">
                                <Settings className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="activity" className="h-full">
              <ScrollArea className="h-full">
                <div className="space-y-4">
                  <div className="flex items-start gap-3 p-3 border rounded-lg">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                      <Edit className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm">
                        <strong>Sarah Johnson</strong> edited the revenue chart
                      </p>
                      <p className="text-xs text-muted-foreground">2 hours ago</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 border rounded-lg">
                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                      <MessageSquare className="w-4 h-4 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm">
                        <strong>Mike Brown</strong> added a comment
                      </p>
                      <p className="text-xs text-muted-foreground">3 hours ago</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 border rounded-lg">
                    <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                      <Share2 className="w-4 h-4 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm">
                        <strong>John Smith</strong> shared the dashboard
                      </p>
                      <p className="text-xs text-muted-foreground">1 day ago</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 border rounded-lg">
                    <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center">
                      <UserPlus className="w-4 h-4 text-orange-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm">
                        <strong>Sarah Johnson</strong> joined the project
                      </p>
                      <p className="text-xs text-muted-foreground">2 days ago</p>
                    </div>
                  </div>
                </div>
              </ScrollArea>
            </TabsContent>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
