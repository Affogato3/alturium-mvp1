import { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown } from "lucide-react";

export function MacroSimulator() {
  const [interestRate, setInterestRate] = useState([5.25]);
  const [inflation, setInflation] = useState([3.2]);
  const [energyPrice, setEnergyPrice] = useState([85]);
  const [supplyChain, setSupplyChain] = useState([42]);
  const [aiSentiment, setAiSentiment] = useState([68]);

  const calculateDelta = (current: number, baseline: number) => {
    const delta = ((current - baseline) / baseline) * 100;
    return delta;
  };

  const simulations = [
    { 
      label: "Portfolio Yield",
      current: 12.4 + calculateDelta(interestRate[0], 5.25) * 2.3,
      delta: calculateDelta(interestRate[0], 5.25) * 2.3,
    },
    {
      label: "Liquidity",
      current: 94.2 - calculateDelta(interestRate[0], 5.25) * 1.3,
      delta: -calculateDelta(interestRate[0], 5.25) * 1.3,
    },
    {
      label: "Risk Exposure",
      current: 23.1 + calculateDelta(inflation[0], 3.2) * 1.8,
      delta: calculateDelta(inflation[0], 3.2) * 1.8,
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
      {/* Interest Rate */}
      <div className="bg-card/50 backdrop-blur-sm rounded-lg p-3 border border-border/50">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-muted-foreground">Interest Rate</span>
          <Badge variant="outline" className="text-[10px] h-4 bg-primary/10">
            {interestRate[0].toFixed(2)}%
          </Badge>
        </div>
        <Slider
          value={interestRate}
          onValueChange={setInterestRate}
          min={0}
          max={10}
          step={0.25}
          className="mb-2"
        />
        <div className="space-y-1">
          {simulations.slice(0, 2).map((sim, i) => (
            <div key={i} className="flex items-center justify-between text-[10px]">
              <span className="text-muted-foreground">{sim.label}</span>
              <span className={sim.delta > 0 ? "text-success" : "text-danger"}>
                {sim.delta > 0 ? "+" : ""}{sim.delta.toFixed(1)}%
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Inflation */}
      <div className="bg-card/50 backdrop-blur-sm rounded-lg p-3 border border-border/50">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-muted-foreground">Inflation</span>
          <Badge variant="outline" className="text-[10px] h-4 bg-warning/10">
            {inflation[0].toFixed(1)}%
          </Badge>
        </div>
        <Slider
          value={inflation}
          onValueChange={setInflation}
          min={0}
          max={10}
          step={0.1}
          className="mb-2"
        />
        <div className="space-y-1">
          <div className="flex items-center justify-between text-[10px]">
            <span className="text-muted-foreground">Risk Exposure</span>
            <span className={simulations[2].delta > 0 ? "text-danger" : "text-success"}>
              {simulations[2].delta > 0 ? "+" : ""}{simulations[2].delta.toFixed(1)}%
            </span>
          </div>
        </div>
      </div>

      {/* Energy Prices */}
      <div className="bg-card/50 backdrop-blur-sm rounded-lg p-3 border border-border/50">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-muted-foreground">Energy</span>
          <Badge variant="outline" className="text-[10px] h-4 bg-accent/10">
            ${energyPrice[0]}/bbl
          </Badge>
        </div>
        <Slider
          value={energyPrice}
          onValueChange={setEnergyPrice}
          min={40}
          max={150}
          step={1}
          className="mb-2"
        />
        <div className="space-y-1">
          <div className="flex items-center justify-between text-[10px]">
            <span className="text-muted-foreground">Commodity Impact</span>
            <span className="text-warning">
              {calculateDelta(energyPrice[0], 85) > 0 ? "+" : ""}{calculateDelta(energyPrice[0], 85).toFixed(1)}%
            </span>
          </div>
        </div>
      </div>

      {/* Supply Chain */}
      <div className="bg-card/50 backdrop-blur-sm rounded-lg p-3 border border-border/50">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-muted-foreground">Supply Chain</span>
          <Badge variant="outline" className="text-[10px] h-4 bg-danger/10">
            {supplyChain[0]}% stress
          </Badge>
        </div>
        <Slider
          value={supplyChain}
          onValueChange={setSupplyChain}
          min={0}
          max={100}
          step={1}
          className="mb-2"
        />
        <div className="space-y-1">
          <div className="flex items-center justify-between text-[10px]">
            <span className="text-muted-foreground">Production Delay</span>
            <span className="text-danger">
              +{(supplyChain[0] * 0.3).toFixed(0)} days
            </span>
          </div>
        </div>
      </div>

      {/* AI Sentiment */}
      <div className="bg-card/50 backdrop-blur-sm rounded-lg p-3 border border-border/50">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-muted-foreground">AI Sentiment</span>
          <Badge variant="outline" className="text-[10px] h-4 bg-success/10">
            {aiSentiment[0]}%
          </Badge>
        </div>
        <Slider
          value={aiSentiment}
          onValueChange={setAiSentiment}
          min={0}
          max={100}
          step={1}
          className="mb-2"
        />
        <div className="space-y-1">
          <div className="flex items-center justify-between text-[10px]">
            <span className="text-muted-foreground">Market Confidence</span>
            <span className={aiSentiment[0] > 50 ? "text-success" : "text-danger"}>
              {aiSentiment[0] > 50 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
