import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Zap, Shield } from "lucide-react";
import { toast } from "sonner";

interface ExecutionPanelProps {
  symbol: string;
  currentPrice: number;
}

export const ExecutionPanel = ({ symbol, currentPrice }: ExecutionPanelProps) => {
  const [side, setSide] = useState<"buy" | "sell">("buy");
  const [orderType, setOrderType] = useState("market");
  const [quantity, setQuantity] = useState(100);
  const [limitPrice, setLimitPrice] = useState(currentPrice);
  const [portfolioPercent, setPortfolioPercent] = useState([25]);

  const handleExecute = () => {
    const orderDetails = {
      symbol,
      side,
      orderType,
      quantity,
      price: orderType === "market" ? currentPrice : limitPrice,
      portfolioPercent: portfolioPercent[0]
    };

    toast.success(
      `${side.toUpperCase()} order placed`,
      {
        description: `${quantity} shares of ${symbol} at ${orderType === "market" ? "market price" : `$${limitPrice}`}`,
      }
    );

    console.log("Order executed:", orderDetails);
  };

  const calculateTotal = () => {
    const price = orderType === "market" ? currentPrice : limitPrice;
    return (quantity * price).toFixed(2);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-[#E9E9E9] mb-4">Order Execution</h3>
        
        {/* Buy/Sell Toggle */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          <Button
            variant={side === "buy" ? "default" : "outline"}
            onClick={() => setSide("buy")}
            className={side === "buy" ? "bg-green-500 hover:bg-green-600" : ""}
          >
            <TrendingUp className="h-4 w-4 mr-2" />
            Buy
          </Button>
          <Button
            variant={side === "sell" ? "default" : "outline"}
            onClick={() => setSide("sell")}
            className={side === "sell" ? "bg-red-500 hover:bg-red-600" : ""}
          >
            <TrendingDown className="h-4 w-4 mr-2" />
            Sell
          </Button>
        </div>

        {/* Order Type */}
        <div className="space-y-2 mb-4">
          <Label>Order Type</Label>
          <Select value={orderType} onValueChange={setOrderType}>
            <SelectTrigger className="bg-[#1A1A1A] border-[#272A40]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="market">Market</SelectItem>
              <SelectItem value="limit">Limit</SelectItem>
              <SelectItem value="stop">Stop Limit</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Quantity */}
        <div className="space-y-2 mb-4">
          <Label>Quantity</Label>
          <Input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            className="bg-[#1A1A1A] border-[#272A40]"
          />
        </div>

        {/* Limit Price (if not market order) */}
        {orderType !== "market" && (
          <div className="space-y-2 mb-4">
            <Label>Limit Price</Label>
            <Input
              type="number"
              value={limitPrice}
              onChange={(e) => setLimitPrice(Number(e.target.value))}
              step="0.01"
              className="bg-[#1A1A1A] border-[#272A40]"
            />
          </div>
        )}

        {/* Portfolio Percentage */}
        <div className="space-y-2 mb-4">
          <div className="flex justify-between">
            <Label>Portfolio Allocation</Label>
            <span className="text-sm text-[#9CA3AF]">{portfolioPercent[0]}%</span>
          </div>
          <Slider
            value={portfolioPercent}
            onValueChange={setPortfolioPercent}
            max={100}
            step={5}
            className="w-full"
          />
          <div className="flex gap-2">
            {[10, 25, 50, 100].map((pct) => (
              <Button
                key={pct}
                variant="outline"
                size="sm"
                onClick={() => setPortfolioPercent([pct])}
                className="flex-1"
              >
                {pct}%
              </Button>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div className="p-4 bg-[#1A1A1A] border border-[#272A40] rounded-lg space-y-2 mb-4">
          <div className="flex justify-between text-sm">
            <span className="text-[#9CA3AF]">Current Price:</span>
            <span className="text-[#E9E9E9]">${currentPrice.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-[#9CA3AF]">Shares:</span>
            <span className="text-[#E9E9E9]">{quantity}</span>
          </div>
          <div className="flex justify-between text-sm font-semibold">
            <span className="text-[#E9E9E9]">Total:</span>
            <span className="text-[#D5B65C]">${calculateTotal()}</span>
          </div>
        </div>

        {/* Execute Button */}
        <Button
          onClick={handleExecute}
          className={`w-full ${side === "buy" ? "bg-green-500 hover:bg-green-600" : "bg-red-500 hover:bg-red-600"}`}
          size="lg"
        >
          <Zap className="h-4 w-4 mr-2" />
          Execute {side.toUpperCase()} Order
        </Button>

        {/* Risk Assessment */}
        <div className="mt-4 p-3 bg-[#1A1A1A] border border-[#272A40] rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Shield className="h-4 w-4 text-[#D5B65C]" />
            <span className="text-sm font-medium text-[#E9E9E9]">Risk Assessment</span>
          </div>
          <div className="space-y-1 text-xs text-[#9CA3AF]">
            <div className="flex justify-between">
              <span>Position Risk:</span>
              <Badge variant="outline" className="bg-green-500/10 text-green-400 border-green-500/20">
                Low
              </Badge>
            </div>
            <div className="flex justify-between">
              <span>Portfolio Impact:</span>
              <span>{portfolioPercent[0]}% allocation</span>
            </div>
            <div className="flex justify-between">
              <span>Suggested Stop:</span>
              <span className="text-red-400">${(currentPrice * 0.95).toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Target Price:</span>
              <span className="text-green-400">${(currentPrice * 1.10).toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
