import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

interface DisclaimerDialogProps {
  open: boolean;
  onAccept: () => void;
}

export const DisclaimerDialog = ({ open, onAccept }: DisclaimerDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-md" onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="h-10 w-10 rounded-full bg-destructive/10 flex items-center justify-center">
              <AlertTriangle className="h-5 w-5 text-destructive" />
            </div>
            <DialogTitle className="text-xl">Important Notice</DialogTitle>
          </div>
          <DialogDescription className="text-left space-y-3 pt-2">
            <p className="text-foreground font-medium">
              This service provides emotional support only.
            </p>
            <p>
              This is <strong>not a medical or emergency service</strong>. The support provided here is non-clinical and should not replace professional mental health care.
            </p>
            <p className="text-destructive font-medium">
              If you are in crisis or having thoughts of self-harm, please contact local emergency services immediately:
            </p>
            <div className="bg-destructive/5 border border-destructive/20 rounded-lg p-3 space-y-1">
              <p className="font-medium">India Emergency Contacts:</p>
              <p>• Emergency: <strong>112</strong></p>
              <p>• Mental Health Helpline: <strong>1800-599-0019</strong> (24/7)</p>
            </div>
            <p className="text-sm text-muted-foreground">
              By continuing, you acknowledge that you understand this is a support tool and not a substitute for professional mental health services.
            </p>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button onClick={onAccept} className="w-full">
            I Understand, Continue
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};