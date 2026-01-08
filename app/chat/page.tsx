"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { MessageCircle, ArrowRight } from "lucide-react"

interface Conversation {
  id: string
  property_id: string
  agent_id: string
  client_id: string
  created_at: string
  property_title?: string
  agent_name?: string
  last_message?: string
}

export default function ChatPage() {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchConversations()
  }, [])

  const fetchConversations = async () => {
    try {
      const response = await fetch("/api/chat")
      const data = await response.json()
      setConversations(data.conversations || [])
    } catch (error) {
      console.error("[v0] Error fetching conversations:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="max-w-6xl mx-auto px-4 py-20">
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-2">Your Conversations</h1>
          <p className="text-lg text-foreground/60">Chat with agents about properties</p>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <p className="text-foreground/60">Loading conversations...</p>
          </div>
        ) : conversations.length === 0 ? (
          <Card className="border-border/50 border-2">
            <CardContent className="py-16 text-center space-y-4">
              <MessageCircle className="w-12 h-12 mx-auto text-foreground/40" />
              <div>
                <h2 className="text-xl font-semibold mb-2">No Conversations Yet</h2>
                <p className="text-foreground/60 mb-6">Contact an agent about a property to start chatting</p>
                <Button asChild className="bg-gradient-to-r from-primary to-accent">
                  <Link href="/properties">Browse Properties</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {conversations.map((conv) => (
              <Link key={conv.id} href={`/chat/${conv.id}`}>
                <Card className="border-border/50 hover:shadow-lg transition-all cursor-pointer group">
                  <CardContent className="p-6 flex items-center justify-between">
                    <div className="space-y-2">
                      <h3 className="font-semibold group-hover:text-primary transition-colors">
                        {conv.property_title || "Property"}
                      </h3>
                      <p className="text-sm text-foreground/60">with {conv.agent_name || "Agent"}</p>
                      {conv.last_message && (
                        <p className="text-sm text-foreground/50 line-clamp-1">{conv.last_message}</p>
                      )}
                    </div>
                    <ArrowRight className="w-5 h-5 text-foreground/40 group-hover:text-primary transition-colors" />
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
