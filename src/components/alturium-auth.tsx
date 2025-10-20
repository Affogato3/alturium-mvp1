import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Zap, Lock, Brain, TrendingUp } from "lucide-react";

type AuthMode = "splash" | "signin" | "signup";
type SignupStep = 1 | 2 | 3 | 4;

interface SignupData {
  email: string;
  password: string;
  fullName: string;
  companyName: string;
  industry: string;
  role: "admin" | "executive" | "analyst" | "auditor";
}

export function AlturiumAuth() {
  const [mode, setMode] = useState<AuthMode>("splash");
  const [signupStep, setSignupStep] = useState<SignupStep>(1);
  const [isLoading, setIsLoading] = useState(false);
  const [aiLoginMode, setAiLoginMode] = useState(false);
  const [logoRotation, setLogoRotation] = useState(0);
  const { toast } = useToast();

  const [signInData, setSignInData] = useState({
    email: "",
    password: "",
  });

  const [signupData, setSignupData] = useState<SignupData>({
    email: "",
    password: "",
    fullName: "",
    companyName: "",
    industry: "",
    role: "analyst",
  });

  useEffect(() => {
    if (mode === "splash") {
      const interval = setInterval(() => {
        setLogoRotation((prev) => (prev + 0.5) % 360);
      }, 50);
      return () => clearInterval(interval);
    }
  }, [mode]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: signInData.email,
        password: signInData.password,
      });

      if (error) throw error;

      if (data.user) {
        toast({
          title: "Neural mesh calibrated",
          description: "Access granted to Alturium Core",
        });
      }
    } catch (error: any) {
      toast({
        title: "Authentication failed",
        description: error.message || "Invalid credentials detected",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async () => {
    if (signupStep < 4) {
      setSignupStep((prev) => (prev + 1) as SignupStep);
      return;
    }

    setIsLoading(true);

    try {
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email: signupData.email,
        password: signupData.password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            full_name: signupData.fullName,
          },
        },
      });

      if (signUpError) throw signUpError;

      if (authData.user) {
        const { error: profileError } = await supabase
          .from("profiles")
          .insert({
            id: authData.user.id,
            user_id: authData.user.id,
            full_name: signupData.fullName,
            company_name: signupData.companyName,
            industry: signupData.industry,
          });

        if (profileError) throw profileError;

        const { error: roleError } = await supabase
          .from("user_roles")
          .insert({
            user_id: authData.user.id,
            role: signupData.role,
          });

        if (roleError) throw roleError;

        toast({
          title: "Intelligence Fabric Online",
          description: "Your Alturium Core is initializing...",
        });
      }
    } catch (error: any) {
      toast({
        title: "Setup failed",
        description: error.message || "Unable to initialize intelligence fabric",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (mode === "splash") {
    return (
      <div className="min-h-screen bg-[#0B0B0C] flex flex-col items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-radial from-[#1F1F22]/50 to-transparent" />
        
        <div className="relative z-10 flex flex-col items-center space-y-12">
          <div 
            className="text-[#EAEAEA] text-6xl font-light tracking-[0.3em] mb-8"
            style={{ transform: `rotate(${logoRotation}deg)`, transition: "transform 0.05s linear" }}
          >
            <div className="relative">
              <Zap className="w-32 h-32 drop-shadow-[0_0_30px_rgba(0,255,255,0.5)]" />
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-transparent rounded-full blur-3xl" />
            </div>
          </div>

          <h1 className="text-[#EAEAEA] text-5xl font-thin tracking-[0.2em] uppercase">
            ALTURIUM
          </h1>

          <p className="text-[#EAEAEA]/70 text-xl tracking-wider animate-fade-in">
            Synchronize Your Intelligence
          </p>

          <div className="flex gap-6 mt-12">
            <Button
              onClick={() => setMode("signin")}
              className="bg-transparent border border-[#EAEAEA]/30 text-[#EAEAEA] hover:border-[#00FFFF] hover:shadow-[0_0_20px_rgba(0,255,255,0.3)] transition-all duration-300 px-12 py-6 text-lg tracking-wider"
            >
              SIGN IN
            </Button>
            <Button
              onClick={() => setMode("signup")}
              className="bg-transparent border border-[#EAEAEA]/30 text-[#EAEAEA] hover:border-[#00FFFF] hover:shadow-[0_0_20px_rgba(0,255,255,0.3)] transition-all duration-300 px-12 py-6 text-lg tracking-wider"
            >
              CREATE ACCOUNT
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (mode === "signin") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0B0B0C] to-[#1F1F22] flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-[#0B0B0C]/80 backdrop-blur-xl border border-[#EAEAEA]/10 rounded-lg p-8 shadow-[0_0_50px_rgba(0,255,255,0.1)]">
            <div className="text-center mb-8">
              <h2 className="text-[#EAEAEA] text-3xl font-thin tracking-[0.2em] uppercase mb-2">
                ACCESS INTELLIGENCE
              </h2>
              <p className="text-[#EAEAEA]/50 text-sm tracking-wider">
                Secure Channel Active — AES-512
              </p>
            </div>

            <div className="flex justify-end mb-4">
              <button
                onClick={() => setAiLoginMode(!aiLoginMode)}
                className="text-[#00FFFF] text-sm tracking-wider hover:text-[#00FFFF]/70 transition-colors"
              >
                {aiLoginMode ? "STANDARD LOGIN" : "AI LOGIN"}
              </button>
            </div>

            <form onSubmit={handleSignIn} className="space-y-6">
              {aiLoginMode ? (
                <div className="space-y-2">
                  <Label htmlFor="intent" className="text-[#EAEAEA]/70 tracking-wider text-sm">
                    TYPE YOUR COMMAND
                  </Label>
                  <Input
                    id="intent"
                    placeholder="Enter my revenue operations view..."
                    className="bg-transparent border-0 border-b border-[#EAEAEA]/30 rounded-none text-[#EAEAEA] placeholder:text-[#EAEAEA]/30 focus:border-[#00FFFF] transition-colors"
                  />
                </div>
              ) : (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-[#EAEAEA]/70 tracking-wider text-sm">
                      EMAIL
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={signInData.email}
                      onChange={(e) => setSignInData({ ...signInData, email: e.target.value })}
                      className="bg-transparent border-0 border-b border-[#EAEAEA]/30 rounded-none text-[#EAEAEA] placeholder:text-[#EAEAEA]/30 focus:border-[#00FFFF] transition-colors"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-[#EAEAEA]/70 tracking-wider text-sm">
                      PASSWORD
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      value={signInData.password}
                      onChange={(e) => setSignInData({ ...signInData, password: e.target.value })}
                      className="bg-transparent border-0 border-b border-[#EAEAEA]/30 rounded-none text-[#EAEAEA] placeholder:text-[#EAEAEA]/30 focus:border-[#00FFFF] transition-colors"
                      required
                    />
                  </div>
                </>
              )}

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#0B0B0C] border border-[#EAEAEA]/50 text-[#EAEAEA] hover:border-[#00FFFF] hover:shadow-[0_0_30px_rgba(0,255,255,0.4)] transition-all duration-300 py-6 text-lg tracking-[0.2em] uppercase"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    CALIBRATING NEURAL MESH
                  </>
                ) : (
                  "ENTER ALTURIUM"
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <button
                onClick={() => setMode("splash")}
                className="text-[#EAEAEA]/50 text-sm hover:text-[#EAEAEA]/70 transition-colors tracking-wider"
              >
                ← BACK
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Signup mode
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0B0B0C] to-[#1F1F22] flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="bg-[#0B0B0C]/80 backdrop-blur-xl border border-[#EAEAEA]/10 rounded-lg p-8 shadow-[0_0_50px_rgba(0,255,255,0.1)]">
          <div className="text-center mb-8">
            <h2 className="text-[#EAEAEA] text-3xl font-thin tracking-[0.2em] uppercase mb-4">
              COMMAND SETUP
            </h2>
            <div className="flex justify-center gap-2">
              {[1, 2, 3, 4].map((step) => (
                <div
                  key={step}
                  className={`h-2 w-16 rounded-full transition-all duration-300 ${
                    step <= signupStep
                      ? "bg-[#00FFFF] shadow-[0_0_10px_rgba(0,255,255,0.5)]"
                      : "bg-[#EAEAEA]/20"
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="space-y-6">
            {signupStep === 1 && (
              <div className="space-y-6 animate-fade-in">
                <div className="flex items-center gap-3 text-[#00FFFF] mb-6">
                  <Lock className="w-6 h-6" />
                  <span className="tracking-wider">CREDENTIALS</span>
                </div>
                <div className="space-y-2">
                  <Label className="text-[#EAEAEA]/70 tracking-wider text-sm">FULL NAME</Label>
                  <Input
                    value={signupData.fullName}
                    onChange={(e) => setSignupData({ ...signupData, fullName: e.target.value })}
                    className="bg-transparent border border-[#EAEAEA]/30 text-[#EAEAEA] focus:border-[#00FFFF]"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[#EAEAEA]/70 tracking-wider text-sm">EMAIL</Label>
                  <Input
                    type="email"
                    value={signupData.email}
                    onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                    className="bg-transparent border border-[#EAEAEA]/30 text-[#EAEAEA] focus:border-[#00FFFF]"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[#EAEAEA]/70 tracking-wider text-sm">PASSWORD</Label>
                  <Input
                    type="password"
                    value={signupData.password}
                    onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                    className="bg-transparent border border-[#EAEAEA]/30 text-[#EAEAEA] focus:border-[#00FFFF]"
                  />
                </div>
              </div>
            )}

            {signupStep === 2 && (
              <div className="space-y-6 animate-fade-in">
                <div className="flex items-center gap-3 text-[#00FFFF] mb-6">
                  <TrendingUp className="w-6 h-6" />
                  <span className="tracking-wider">ORGANIZATION</span>
                </div>
                <div className="space-y-2">
                  <Label className="text-[#EAEAEA]/70 tracking-wider text-sm">COMPANY NAME</Label>
                  <Input
                    value={signupData.companyName}
                    onChange={(e) => setSignupData({ ...signupData, companyName: e.target.value })}
                    className="bg-transparent border border-[#EAEAEA]/30 text-[#EAEAEA] focus:border-[#00FFFF]"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[#EAEAEA]/70 tracking-wider text-sm">INDUSTRY</Label>
                  <Select
                    value={signupData.industry}
                    onValueChange={(value) => setSignupData({ ...signupData, industry: value })}
                  >
                    <SelectTrigger className="bg-transparent border border-[#EAEAEA]/30 text-[#EAEAEA] focus:border-[#00FFFF]">
                      <SelectValue placeholder="Select industry" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#0B0B0C] border-[#EAEAEA]/30">
                      <SelectItem value="technology">Technology</SelectItem>
                      <SelectItem value="finance">Finance</SelectItem>
                      <SelectItem value="healthcare">Healthcare</SelectItem>
                      <SelectItem value="manufacturing">Manufacturing</SelectItem>
                      <SelectItem value="retail">Retail</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {signupStep === 3 && (
              <div className="space-y-6 animate-fade-in">
                <div className="flex items-center gap-3 text-[#00FFFF] mb-6">
                  <Brain className="w-6 h-6" />
                  <span className="tracking-wider">ROLE ASSIGNMENT</span>
                </div>
                <div className="space-y-2">
                  <Label className="text-[#EAEAEA]/70 tracking-wider text-sm">YOUR ROLE</Label>
                  <Select
                    value={signupData.role}
                    onValueChange={(value: any) => setSignupData({ ...signupData, role: value })}
                  >
                    <SelectTrigger className="bg-transparent border border-[#EAEAEA]/30 text-[#EAEAEA] focus:border-[#00FFFF]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-[#0B0B0C] border-[#EAEAEA]/30">
                      <SelectItem value="admin">Administrator</SelectItem>
                      <SelectItem value="executive">Executive</SelectItem>
                      <SelectItem value="analyst">Analyst</SelectItem>
                      <SelectItem value="auditor">Auditor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {signupStep === 4 && (
              <div className="space-y-6 animate-fade-in text-center">
                <div className="relative w-32 h-32 mx-auto">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#00FFFF]/30 to-transparent rounded-full animate-pulse" />
                  <Zap className="w-32 h-32 text-[#00FFFF] drop-shadow-[0_0_30px_rgba(0,255,255,0.7)]" />
                </div>
                <h3 className="text-[#EAEAEA] text-2xl tracking-wider">
                  INTELLIGENCE FABRIC READY
                </h3>
                <p className="text-[#EAEAEA]/70 tracking-wide">
                  Your Alturium Core is configured and ready for deployment
                </p>
              </div>
            )}

            <div className="flex gap-4 mt-8">
              {signupStep > 1 && (
                <Button
                  onClick={() => setSignupStep((prev) => (prev - 1) as SignupStep)}
                  variant="outline"
                  className="flex-1 border-[#EAEAEA]/30 text-[#EAEAEA] hover:border-[#00FFFF] bg-transparent"
                >
                  PREVIOUS
                </Button>
              )}
              <Button
                onClick={handleSignUp}
                disabled={isLoading}
                className="flex-1 bg-[#0B0B0C] border border-[#EAEAEA]/50 text-[#EAEAEA] hover:border-[#00FFFF] hover:shadow-[0_0_30px_rgba(0,255,255,0.4)] transition-all duration-300"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    INITIALIZING
                  </>
                ) : signupStep === 4 ? (
                  "LAUNCH ALTURIUM"
                ) : (
                  "NEXT"
                )}
              </Button>
            </div>

            <div className="mt-6 text-center">
              <button
                onClick={() => setMode("splash")}
                className="text-[#EAEAEA]/50 text-sm hover:text-[#EAEAEA]/70 transition-colors tracking-wider"
              >
                ← BACK
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
