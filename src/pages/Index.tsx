import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, Shield, Lock, MessageCircle } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate("/chat");
      }
    };
    checkUser();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-soft">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="mx-auto mb-6 h-20 w-20 rounded-full bg-gradient-primary flex items-center justify-center shadow-medium">
              <Heart className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-primary bg-clip-text text-transparent">
              Mental Health Support
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              A compassionate, confidential space for emotional support and guidance. You're not alone.
            </p>
          </div>

          <Card className="mb-8 border-destructive/20 bg-destructive/5 shadow-medium">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <Shield className="h-6 w-6 text-destructive shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-lg mb-2">Important Notice</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    This service provides <strong>emotional support only</strong>. It is not a medical or emergency service.
                  </p>
                  <p className="text-sm text-destructive font-medium">
                    If you are in crisis, contact local emergency services (India: 112) or the National Suicide Prevention Helpline: 1800-599-0019 (24/7)
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <Card className="shadow-soft hover:shadow-medium transition-all">
              <CardContent className="pt-6 text-center">
                <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <MessageCircle className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Empathetic Support</h3>
                <p className="text-sm text-muted-foreground">
                  Non-judgmental conversation and emotional validation
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-soft hover:shadow-medium transition-all">
              <CardContent className="pt-6 text-center">
                <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center">
                  <Heart className="h-6 w-6 text-accent" />
                </div>
                <h3 className="font-semibold mb-2">Coping Strategies</h3>
                <p className="text-sm text-muted-foreground">
                  Evidence-based techniques for managing difficult emotions
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-soft hover:shadow-medium transition-all">
              <CardContent className="pt-6 text-center">
                <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-success/10 flex items-center justify-center">
                  <Lock className="h-6 w-6 text-success" />
                </div>
                <h3 className="font-semibold mb-2">Private & Secure</h3>
                <p className="text-sm text-muted-foreground">
                  Your conversations are confidential and protected
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="text-center">
            <Button
              size="lg"
              onClick={() => navigate("/auth")}
              className="text-lg px-8 py-6 shadow-medium hover:shadow-soft transition-all"
            >
              Get Started
            </Button>
            <p className="mt-4 text-sm text-muted-foreground">
              Free to use • No credit card required
            </p>
          </div>
        </div>
      </div>
      
      <footer className="text-center py-6 text-sm text-muted-foreground border-t border-border/50 mt-12">
        <p>Built with care by Mohammad Faazil</p>
      </footer>
    </div>
  );
};

export default Index;