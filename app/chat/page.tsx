"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"
import { Send, Phone, Video, MoreHorizontal, Search, Paperclip } from "lucide-react"
import { cn } from "@/lib/utils"

// Sample conversation data
const CONTACTS = [
  {
    id: 1,
    name: "John Smith",
    avatar: "/placeholder.svg?height=40&width=40",
    lastMessage: "I'll be there at 2 PM tomorrow",
    time: "10:30 AM",
    unread: 2,
    online: true,
  },
  {
    id: 2,
    name: "Sarah Johnson",
    avatar: "/placeholder.svg?height=40&width=40",
    lastMessage: "Can you send me the details?",
    time: "Yesterday",
    unread: 0,
    online: false,
  },
  {
    id: 3,
    name: "Mike Williams",
    avatar: "/placeholder.svg?height=40&width=40",
    lastMessage: "The job is complete. Please review.",
    time: "Yesterday",
    unread: 0,
    online: true,
  },
  {
    id: 4,
    name: "Emily Davis",
    avatar: "/placeholder.svg?height=40&width=40",
    lastMessage: "I'm available next week",
    time: "2 days ago",
    unread: 0,
    online: false,
  },
  {
    id: 5,
    name: "Robert Brown",
    avatar: "/placeholder.svg?height=40&width=40",
    lastMessage: "Thanks for the opportunity",
    time: "3 days ago",
    unread: 0,
    online: true,
  },
]

const MESSAGES = [
  {
    id: 1,
    senderId: 1,
    text: "Hi there! I saw your job posting for a plumber and I'm interested.",
    time: "10:00 AM",
  },
  {
    id: 2,
    senderId: "me",
    text: "Hello! Thanks for reaching out. Do you have experience with residential plumbing?",
    time: "10:05 AM",
  },
  {
    id: 3,
    senderId: 1,
    text: "Yes, I've been working as a residential plumber for over 5 years. I specialize in repairs and installations.",
    time: "10:08 AM",
  },
  {
    id: 4,
    senderId: "me",
    text: "That's great! Are you available to come take a look at the job this week?",
    time: "10:10 AM",
  },
  {
    id: 5,
    senderId: 1,
    text: "I'm available tomorrow afternoon or Thursday morning. Would either of those work for you?",
    time: "10:15 AM",
  },
  {
    id: 6,
    senderId: "me",
    text: "Tomorrow afternoon works perfectly. How about 2 PM?",
    time: "10:20 AM",
  },
  {
    id: 7,
    senderId: 1,
    text: "I'll be there at 2 PM tomorrow. Could you send me the address?",
    time: "10:30 AM",
  },
]

export default function ChatPage() {
  const [activeContact, setActiveContact] = useState(CONTACTS[0])
  const [messages, setMessages] = useState(MESSAGES)
  const [newMessage, setNewMessage] = useState("")
  const [searchTerm, setSearchTerm] = useState("")

  const messagesEndRef = useRef<HTMLDivElement>(null)

  const filteredContacts = CONTACTS.filter((contact) => contact.name.toLowerCase().includes(searchTerm.toLowerCase()))

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()

    if (newMessage.trim()) {
      const newMsg = {
        id: messages.length + 1,
        senderId: "me",
        text: newMessage,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      }

      setMessages([...messages, newMsg])
      setNewMessage("")
    }
  }

  return (
    <div className="space-y-8 pb-20">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="text-3xl md:text-4xl font-bold mb-2">Messages</h1>
        <p className="text-gray-600 dark:text-gray-300 text-lg">Communicate with workers and clients</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
      >
        {/* Contacts List */}
        <Card className="lg:col-span-1 overflow-hidden">
          <CardHeader className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search contacts"
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </CardHeader>
          <CardContent className="p-0 max-h-[600px] overflow-y-auto">
            {filteredContacts.length > 0 ? (
              <ul className="divide-y">
                {filteredContacts.map((contact) => (
                  <li
                    key={contact.id}
                    className={cn(
                      "p-4 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors",
                      activeContact.id === contact.id && "bg-gray-50 dark:bg-gray-800",
                    )}
                    onClick={() => setActiveContact(contact)}
                  >
                    <div className="flex items-start gap-3">
                      <div className="relative">
                        <Avatar>
                          <AvatarImage src={contact.avatar || "/placeholder.svg"} alt={contact.name} />
                          <AvatarFallback>{contact.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        {contact.online && (
                          <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-white dark:border-gray-900" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-center mb-1">
                          <h4 className="font-medium truncate">{contact.name}</h4>
                          <span className="text-xs text-gray-500">{contact.time}</span>
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{contact.lastMessage}</p>
                      </div>
                      {contact.unread > 0 && <Badge className="ml-2">{contact.unread}</Badge>}
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="p-8 text-center">
                <p className="text-gray-500 dark:text-gray-400">No contacts found</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Chat Area */}
        <Card className="lg:col-span-2 flex flex-col h-[700px]">
          <CardHeader className="p-4 border-b">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={activeContact.avatar || "/placeholder.svg"} alt={activeContact.name} />
                  <AvatarFallback>{activeContact.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-lg">{activeContact.name}</CardTitle>
                  <CardDescription>
                    {activeContact.online ? <span className="text-green-500">Online</span> : "Offline"}
                  </CardDescription>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="icon">
                  <Phone className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Video className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div key={message.id} className={cn("flex", message.senderId === "me" ? "justify-end" : "justify-start")}>
                <div
                  className={cn(
                    "max-w-[80%] rounded-lg p-3",
                    message.senderId === "me" ? "bg-primary text-primary-foreground" : "bg-gray-100 dark:bg-gray-800",
                  )}
                >
                  <p>{message.text}</p>
                  <p
                    className={cn(
                      "text-xs mt-1",
                      message.senderId === "me" ? "text-primary-foreground/70" : "text-gray-500",
                    )}
                  >
                    {message.time}
                  </p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </CardContent>

          <CardFooter className="p-4 border-t">
            <form onSubmit={handleSendMessage} className="flex w-full gap-2">
              <Button type="button" variant="ghost" size="icon">
                <Paperclip className="h-5 w-5" />
              </Button>
              <Input
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="flex-1"
              />
              <Button type="submit" size="icon">
                <Send className="h-5 w-5" />
              </Button>
            </form>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  )
}
