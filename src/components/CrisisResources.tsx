import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, Phone, Globe, Heart } from "lucide-react";

export const CrisisResources = () => {
  return (
    <div className="max-w-2xl mx-auto py-8 px-4 space-y-6">
      <div className="flex items-center gap-3">
        <div className="h-12 w-12 rounded-full bg-destructive/10 flex items-center justify-center">
          <AlertCircle className="h-6 w-6 text-destructive" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">Crisis Support Resources</h1>
          <p className="text-muted-foreground">Immediate help is available</p>
        </div>
      </div>

      <Card className="border-destructive/20 bg-destructive/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <Phone className="h-5 w-5" />
            Emergency Contacts - India
          </CardTitle>
          <CardDescription>
            If you're in immediate danger or having thoughts of self-harm, please call:
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="p-4 bg-background rounded-lg">
            <p className="font-semibold">Emergency Services</p>
            <p className="text-2xl font-bold text-destructive">112</p>
            <p className="text-sm text-muted-foreground">24/7 Emergency Response</p>
          </div>
          <div className="p-4 bg-background rounded-lg">
            <p className="font-semibold">National Suicide Prevention Helpline</p>
            <p className="text-2xl font-bold text-destructive">1800-599-0019</p>
            <p className="text-sm text-muted-foreground">24/7 Mental Health Support</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            International Resources
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="p-4 bg-secondary/50 rounded-lg">
            <p className="font-semibold">International Association for Suicide Prevention</p>
            <a
              href="https://www.iasp.info/resources/Crisis_Centres/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Find crisis centers worldwide
            </a>
          </div>
          <div className="p-4 bg-secondary/50 rounded-lg">
            <p className="font-semibold">Crisis Text Line</p>
            <p className="text-muted-foreground">
              Available in select countries - check their website for availability
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5" />
            Additional Support
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Remember: You don't have to face this alone. Consider:
          </p>
          <ul className="space-y-2 text-sm">
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">•</span>
              <span>Reaching out to a trusted friend or family member</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">•</span>
              <span>Contacting a local mental health professional or therapist</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">•</span>
              <span>Visiting a local emergency room if you feel unsafe</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">•</span>
              <span>Creating a safety plan with a mental health professional</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};