import { useState } from "react";
import { ArrowLeft, ArrowRight, Sparkles, DollarSign, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface PaymentWizardProps {
  onComplete: () => void;
}

export const PaymentWizard = ({ onComplete }: PaymentWizardProps) => {
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    amount: "",
    fromCurrency: "USD",
    toCurrency: "EUR",
    fromCountry: "US",
    toCountry: "EU",
    purpose: ""
  });
  const [routes, setRoutes] = useState<any[]>([]);
  const [selectedRoute, setSelectedRoute] = useState<any>(null);

  const handleNext = async () => {
    if (step === 1) {
      if (!formData.amount || parseFloat(formData.amount) <= 0) {
        toast({ title: "Error", description: "Please enter a valid amount", variant: "destructive" });
        return;
      }
      setStep(2);
      await fetchRoutes();
    } else if (step === 2) {
      if (!selectedRoute) {
        toast({ title: "Error", description: "Please select a route", variant: "destructive" });
        return;
      }
      setStep(3);
    } else if (step === 3) {
      await executePayment();
    }
  };

  const fetchRoutes = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('payment-route-optimize', {
        body: {
          amount: parseFloat(formData.amount),
          fromCurrency: formData.fromCurrency,
          toCurrency: formData.toCurrency,
          fromCountry: formData.fromCountry,
          toCountry: formData.toCountry
        }
      });

      if (error) throw error;

      if (data?.recommended) {
        const allRoutes = [data.recommended, ...(data.alternatives || [])];
        setRoutes(allRoutes);
        setSelectedRoute(allRoutes[0]);
      }
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const executePayment = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('payment-cross-border-execute', {
        body: {
          amount: parseFloat(formData.amount),
          fromCurrency: formData.fromCurrency,
          toCurrency: formData.toCurrency,
          fromCountry: formData.fromCountry,
          toCountry: formData.toCountry,
          routeId: null,
          railId: selectedRoute.rail_id,
          purpose: formData.purpose
        }
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: `Payment initiated: ${data.payment.transaction_ref}`,
      });
      
      onComplete();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Step 1: Payment Details */}
      {step === 1 && (
        <div className="space-y-4">
          <div>
            <Label className="text-[#BFBFBF]">Amount</Label>
            <Input
              type="number"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              placeholder="Enter amount"
              className="bg-[#050505]/50 border-[#1A1A1A] text-[#EDEDED] focus:border-[#CFAF6E]"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-[#BFBFBF]">From Currency</Label>
              <Select value={formData.fromCurrency} onValueChange={(value) => setFormData({ ...formData, fromCurrency: value })}>
                <SelectTrigger className="bg-[#050505]/50 border-[#1A1A1A] text-[#EDEDED]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#0a0a0a] border-[#1A1A1A]">
                  <SelectItem value="USD">USD</SelectItem>
                  <SelectItem value="EUR">EUR</SelectItem>
                  <SelectItem value="GBP">GBP</SelectItem>
                  <SelectItem value="JPY">JPY</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label className="text-[#BFBFBF]">To Currency</Label>
              <Select value={formData.toCurrency} onValueChange={(value) => setFormData({ ...formData, toCurrency: value })}>
                <SelectTrigger className="bg-[#050505]/50 border-[#1A1A1A] text-[#EDEDED]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#0a0a0a] border-[#1A1A1A]">
                  <SelectItem value="USD">USD</SelectItem>
                  <SelectItem value="EUR">EUR</SelectItem>
                  <SelectItem value="GBP">GBP</SelectItem>
                  <SelectItem value="SGD">SGD</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label className="text-[#BFBFBF]">Purpose</Label>
            <Input
              value={formData.purpose}
              onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
              placeholder="Payment purpose"
              className="bg-[#050505]/50 border-[#1A1A1A] text-[#EDEDED] focus:border-[#CFAF6E]"
            />
          </div>
        </div>
      )}

      {/* Step 2: Route Selection */}
      {step === 2 && (
        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-8">
              <Sparkles className="h-8 w-8 animate-spin mx-auto text-[#CFAF6E] mb-2" />
              <p className="text-[#BFBFBF]">AI analyzing optimal routes...</p>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="h-5 w-5 text-[#CFAF6E]" />
                <h3 className="font-semibold text-[#EDEDED]">AI Recommended Route</h3>
              </div>
              
              <div className="space-y-3">
                {routes.map((route, idx) => (
                  <Card
                    key={idx}
                    className={`p-4 cursor-pointer transition-all duration-300 ${
                      selectedRoute?.railName === route.railName
                        ? 'bg-[#CFAF6E]/10 border-[#CFAF6E] shadow-[0_0_20px_rgba(207,175,110,0.2)]'
                        : 'bg-[#050505]/50 border-[#1A1A1A] hover:border-[#CFAF6E]/40'
                    }`}
                    onClick={() => setSelectedRoute(route)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-semibold text-[#EDEDED]">{route.railName}</h4>
                          {idx === 0 && (
                            <span className="text-xs px-2 py-1 rounded-full bg-[#CFAF6E]/20 text-[#CFAF6E]">
                              Recommended
                            </span>
                          )}
                        </div>
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <p className="text-[#BFBFBF]">Cost</p>
                            <p className="font-medium text-[#CFAF6E]">${route.cost}</p>
                          </div>
                          <div>
                            <p className="text-[#BFBFBF]">Speed</p>
                            <p className="font-medium text-[#EDEDED]">{route.estimatedMinutes} min</p>
                          </div>
                          <div>
                            <p className="text-[#BFBFBF]">Savings</p>
                            <p className="font-medium text-[#CFAF6E]">{route.savingsPct}%</p>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-[#BFBFBF] mb-1">AI Confidence</div>
                        <div className="text-lg font-bold text-[#CFAF6E]">
                          {Math.round(route.aiConfidence * 100)}%
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* Step 3: Confirmation */}
      {step === 3 && selectedRoute && (
        <div className="space-y-4">
          <Card className="p-6 bg-gradient-to-br from-[#CFAF6E]/10 to-[#CFAF6E]/5 border-[#CFAF6E]/30">
            <h3 className="font-semibold text-[#EDEDED] mb-4">Payment Summary</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-[#BFBFBF]">Amount:</span>
                <span className="font-medium text-[#EDEDED]">
                  {formData.amount} {formData.fromCurrency} → {formData.toCurrency}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#BFBFBF]">Route:</span>
                <span className="font-medium text-[#EDEDED]">{selectedRoute.railName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#BFBFBF]">Cost:</span>
                <span className="font-medium text-[#CFAF6E]">${selectedRoute.cost}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#BFBFBF]">Estimated Time:</span>
                <span className="font-medium text-[#EDEDED]">{selectedRoute.estimatedMinutes} minutes</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#BFBFBF]">Savings:</span>
                <span className="font-medium text-[#CFAF6E]">{selectedRoute.savingsPct}%</span>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between pt-4 border-t border-[#1A1A1A]">
        <Button
          onClick={() => setStep(Math.max(1, step - 1))}
          disabled={step === 1 || loading}
          variant="ghost"
          className="text-[#BFBFBF] hover:text-[#EDEDED] hover:bg-[#1A1A1A]"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        
        <Button
          onClick={handleNext}
          disabled={loading}
          className="bg-gradient-to-r from-[#CFAF6E] to-[#8B7355] hover:from-[#B39960] hover:to-[#7A644A] text-[#050505] font-semibold"
        >
          {loading ? (
            <>
              <Sparkles className="h-4 w-4 mr-2 animate-spin" />
              Processing...
            </>
          ) : step === 3 ? (
            <>
              Execute Payment
              <DollarSign className="h-4 w-4 ml-2" />
            </>
          ) : (
            <>
              Continue
              <ArrowRight className="h-4 w-4 ml-2" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
};