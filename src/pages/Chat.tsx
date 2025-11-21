import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User, Session } from "@supabase/supabase-js";
import { ChatMessage } from "@/components/ChatMessage";
import { ChatInput } from "@/components/ChatInput";
import { TypingIndicator } from "@/components/TypingIndicator";
import { DisclaimerDialog } from "@/components/DisclaimerDialog";
import { Settings } from "@/components/Settings";
import { CrisisResources } from "@/components/CrisisResources";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { MessageCircle, Settings as SettingsIcon, AlertCircle, LogOut, Trash2 } from "lucide-react";

interface Message {
  id: string;
  sender: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const Chat = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showDisclaimer, setShowDisclaimer] = useState(true);
  const [disclaimerAccepted, setDisclaimerAccepted] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (!session) {
          navigate("/");
        }
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (!session) {
        navigate("/");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  useEffect(() => {
    if (!user || !conversationId) return;

    const channel = supabase
      .channel("messages")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "messages",
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          if (payload.eventType === "INSERT" && payload.new.sender === "assistant") {
            setMessages((prev) => [
              ...prev,
              {
                id: payload.new.id,
                sender: payload.new.sender,
                content: payload.new.content || "",
                timestamp: new Date(payload.new.created_at),
              },
            ]);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, conversationId]);

  const handleAcceptDisclaimer = () => {
    setDisclaimerAccepted(true);
    setShowDisclaimer(false);
  };

  const createConversation = async () => {
    if (!user) return null;

    const { data, error } = await supabase
      .from("conversations")
      .insert({ user_id: user.id })
      .select()
      .single();

    if (error) {
      console.error("Error creating conversation:", error);
      return null;
    }

    return data.id;
  };

  const saveMessage = async (sender: "user" | "assistant", content: string, convId: string) => {
    const { data: profile } = await supabase
      .from("profiles")
      .select("save_chats")
      .eq("id", user!.id)
      .single();

    if (!profile?.save_chats) return;

    await supabase.from("messages").insert({
      conversation_id: convId,
      sender,
      content,
    });
  };

  const handleSendMessage = async (message: string) => {
    if (!user || !disclaimerAccepted) return;

    let convId = conversationId;
    if (!convId) {
      convId = await createConversation();
      if (!convId) {
        toast({
          title: "Error",
          description: "Failed to create conversation",
          variant: "destructive",
        });
        return;
      }
      setConversationId(convId);
    }

    const userMessage: Message = {
      id: crypto.randomUUID(),
      sender: "user",
      content: message,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    await saveMessage("user", message, convId);

    try {
      const { data, error } = await supabase.functions.invoke("chat", {
        body: { message, conversationId: convId },
      });

      if (error) {
        throw error;
      }

      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        sender: "assistant",
        content: data.response,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
      await saveMessage("assistant", data.response, convId);

      if (data.isCrisis) {
        toast({
          title: "Crisis Support Available",
          description: "Please check the Crisis Resources tab for immediate help",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error("Error:", error);
      
      let errorMessage = "Failed to send message. Please try again.";
      if (error.message?.includes("429")) {
        errorMessage = "Too many requests. Please wait a moment and try again.";
      } else if (error.message?.includes("402")) {
        errorMessage = "AI service temporarily unavailable. Please try again later.";
      }
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const handleNewChat = async () => {
    setMessages([]);
    setConversationId(null);
    toast({
      title: "New conversation started",
      description: "Your previous conversation has been closed",
    });
  };

  if (!user) {
    return null;
  }

  return (
    <div className="flex flex-col h-screen bg-background">
      <DisclaimerDialog open={showDisclaimer} onAccept={handleAcceptDisclaimer} />

      <header className="border-b border-border bg-card shadow-soft">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-gradient-primary flex items-center justify-center">
              <MessageCircle className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-semibold">Mental Health Support</h1>
              <p className="text-sm text-muted-foreground">You're not alone</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleNewChat}>
              <Trash2 className="h-4 w-4 mr-2" />
              New Chat
            </Button>
            <Button variant="ghost" size="sm" onClick={handleSignOut}>
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <Tabs defaultValue="chat" className="flex-1 flex flex-col overflow-hidden">
        <div className="border-b border-border bg-card">
          <div className="container mx-auto px-4">
            <TabsList className="grid w-full max-w-md grid-cols-3">
              <TabsTrigger value="chat" className="gap-2">
                <MessageCircle className="h-4 w-4" />
                Chat
              </TabsTrigger>
              <TabsTrigger value="crisis" className="gap-2">
                <AlertCircle className="h-4 w-4" />
                Crisis
              </TabsTrigger>
              <TabsTrigger value="settings" className="gap-2">
                <SettingsIcon className="h-4 w-4" />
                Settings
              </TabsTrigger>
            </TabsList>
          </div>
        </div>

        <TabsContent value="chat" className="flex-1 flex flex-col overflow-hidden m-0">
          <div className="flex-1 overflow-y-auto">
            <div className="container mx-auto px-4 py-6 max-w-3xl">
              {messages.length === 0 && !isLoading && (
                <div className="text-center py-12">
                  <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                    <MessageCircle className="h-8 w-8 text-primary" />
                  </div>
                  <h2 className="text-2xl font-semibold mb-2">How are you feeling today?</h2>
                  <p className="text-muted-foreground">
                    Share what's on your mind. I'm here to listen and support you.
                  </p>
                </div>
              )}
              {messages.map((msg) => (
                <ChatMessage key={msg.id} {...msg} />
              ))}
              {isLoading && <TypingIndicator />}
              <div ref={messagesEndRef} />
            </div>
          </div>

          <div className="border-t border-border bg-card shadow-soft">
            <div className="container mx-auto px-4 py-4 max-w-3xl">
              <ChatInput
                onSend={handleSendMessage}
                isLoading={isLoading}
                disabled={!disclaimerAccepted}
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="crisis" className="flex-1 overflow-y-auto m-0">
          <div className="container mx-auto px-4 py-6 max-w-3xl min-h-full flex items-center justify-center">
            <CrisisResources />
          </div>
        </TabsContent>

        <TabsContent value="settings" className="flex-1 overflow-y-auto m-0">
          <div className="container mx-auto px-4 py-6 max-w-3xl min-h-full flex items-center justify-center">
            <Settings userId={user.id} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Chat;