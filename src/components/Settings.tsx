import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Trash2, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

interface SettingsProps {
  userId: string;
}

export const Settings = ({ userId }: SettingsProps) => {
  const [saveChats, setSaveChats] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const { toast } = useToast();
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    loadSettings();
  }, [userId]);

  const loadSettings = async () => {
    const { data } = await supabase
      .from("profiles")
      .select("save_chats")
      .eq("id", userId)
      .single();

    if (data) {
      setSaveChats(data.save_chats);
    }
  };

  const handleSaveChatsToggle = async (checked: boolean) => {
    setSaveChats(checked);
    const { error } = await supabase
      .from("profiles")
      .update({ save_chats: checked })
      .eq("id", userId);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update settings",
        variant: "destructive",
      });
      setSaveChats(!checked);
    } else {
      toast({
        title: checked ? "Chat history enabled" : "Chat history disabled",
        description: checked
          ? "Your conversations will now be saved"
          : "Your conversations will no longer be saved",
      });
    }
  };

  const handleDeleteAll = async () => {
    setLoading(true);
    try {
      const { data: conversations } = await supabase
        .from("conversations")
        .select("id")
        .eq("user_id", userId);

      if (conversations) {
        await supabase
          .from("conversations")
          .delete()
          .eq("user_id", userId);

        toast({
          title: "All conversations deleted",
          description: "Your chat history has been cleared",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete conversations",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setShowDeleteDialog(false);
    }
  };

  return (
    <div className="space-y-6 p-6 bg-card rounded-xl border border-border shadow-soft">
      <div>
        <h2 className="text-2xl font-semibold mb-1">Settings</h2>
        <p className="text-sm text-muted-foreground">
          Manage your preferences and data
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-secondary/50 rounded-lg">
          <div className="space-y-0.5">
            <Label htmlFor="save-chats" className="text-base">
              Save Chat History
            </Label>
            <p className="text-sm text-muted-foreground">
              Store your conversations for continuity
            </p>
          </div>
          <Switch
            id="save-chats"
            checked={saveChats}
            onCheckedChange={handleSaveChatsToggle}
          />
        </div>

        <div className="flex items-center justify-between p-4 bg-secondary/50 rounded-lg">
          <div className="space-y-0.5">
            <Label htmlFor="theme-toggle" className="text-base">
              Dark Mode
            </Label>
            <p className="text-sm text-muted-foreground">
              Toggle between light and dark themes
            </p>
          </div>
          <Button
            id="theme-toggle"
            variant="outline"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="rounded-full"
          >
            {theme === "dark" ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </Button>
        </div>

        <div className="pt-4 border-t border-border">
          <Button
            variant="destructive"
            onClick={() => setShowDeleteDialog(true)}
            disabled={loading}
            className="w-full"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete All Conversations
          </Button>
        </div>
      </div>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete all your
              saved conversations and cannot be recovered.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteAll} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete All
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};