"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { getSupabaseBrowserClient } from "@/lib/supabase"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/hooks/use-toast"
import type { Message, Profile } from "@/types/database"
import { Send, Paperclip } from "lucide-react"
import { cn } from "@/lib/utils"

interface ChatInterfaceProps {
  recipientId: string
  bookingId?: string
}

export default function ChatInterface({ recipientId, bookingId }: ChatInterfaceProps) {
  const { user } = useAuth()
  const { toast } = useToast()
  const supabase = getSupabaseBrowserClient()
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [recipient, setRecipient] = useState<Profile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Fetch messages and recipient data
  useEffect(() => {
    const fetchData = async () => {
      if (!user) return

      setIsLoading(true)

      try {
        // Fetch recipient profile
        const { data: recipientData, error: recipientError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", recipientId)
          .single()

        if (recipientError) throw recipientError

        setRecipient(recipientData)

        // Fetch messages
        const { data: messagesData, error: messagesError } = await supabase
          .from("messages")
          .select("*")
          .or(`sender_id.eq.${user.id},recipient_id.eq.${user.id}`)
          .or(`sender_id.eq.${recipientId},recipient_id.eq.${recipientId}`)
          .order("created_at", { ascending: true })

        if (messagesError) throw messagesError

        setMessages(messagesData || [])

        // Mark messages as read
        await supabase
          .from("messages")
          .update({ is_read: true })
          .eq("recipient_id", user.id)
          .eq("sender_id", recipientId)
      } catch (error) {
        console.error("Error fetching chat data:", error)
        toast({
          variant: "destructive",
          title: "Error loading chat",
          description: "Could not load chat messages. Please try again.",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()

    // Subscribe to new messages
    const messagesSubscription = supabase
      .channel("messages")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `recipient_id=eq.${user?.id}`,
        },
        (payload) => {
          const newMessage = payload.new as Message

          // Only add messages from this conversation
          if (newMessage.sender_id === recipientId) {
            setMessages((prev) => [...prev, newMessage])

            // Mark as read
            supabase.from("messages").update({ is_read: true }).eq("id", newMessage.id)
          }
        },
      )
      .subscribe()

    return () => {
      messagesSubscription.unsubscribe()
    }
  }, [user, recipientId, supabase, toast])

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Send message
  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user || !newMessage.trim()) return

    try {
      const { error } = await supabase.from("messages").insert({
        sender_id: user.id,
        recipient_id: recipientId,
        booking_id: bookingId || null,
        content: newMessage.trim(),
        is_read: false,
      })

      if (error) throw error

      setNewMessage("")
    } catch (error) {
      console.error("Error sending message:", error)
      toast({
        variant: "destructive",
        title: "Error sending message",
        description: "Could not send your message. Please try again.",
      })
    }
  }

  return (
    <Card className="flex flex-col h-[600px]">
      <CardHeader className="p-4 border-b">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src="/placeholder.svg?height=40&width=40" alt={recipient?.display_name || "User"} />
            <AvatarFallback>{recipient?.display_name?.charAt(0) || "U"}</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-lg">{recipient?.display_name || "User"}</CardTitle>
            <p className="text-sm text-gray-500">{recipient?.role === "client" ? "Client" : "Worker"}</p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
        {isLoading ? (
          <div className="flex justify-center items-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : messages.length > 0 ? (
          messages.map((message) => (
            <div
              key={message.id}
              className={cn("flex", message.sender_id === user?.id ? "justify-end" : "justify-start")}
            >
              <div
                className={cn(
                  "max-w-[80%] rounded-lg p-3",
                  message.sender_id === user?.id
                    ? "bg-primary text-primary-foreground"
                    : "bg-gray-100 dark:bg-gray-800",
                )}
              >
                <p>{message.content}</p>
                <p
                  className={cn(
                    "text-xs mt-1",
                    message.sender_id === user?.id ? "text-primary-foreground/70" : "text-gray-500",
                  )}
                >
                  {new Date(message.created_at).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="flex justify-center items-center h-full text-gray-500">
            <p>No messages yet. Start the conversation!</p>
          </div>
        )}
        <div ref={messagesEndRef} />
      </CardContent>

      <CardFooter className="p-4 border-t">
        <form onSubmit={sendMessage} className="flex w-full gap-2">
          <Button type="button" variant="ghost" size="icon">
            <Paperclip className="h-5 w-5" />
          </Button>
          <Input
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-1"
          />
          <Button type="submit" size="icon" disabled={!newMessage.trim()}>
            <Send className="h-5 w-5" />
          </Button>
        </form>
      </CardFooter>
    </Card>
  )
}
