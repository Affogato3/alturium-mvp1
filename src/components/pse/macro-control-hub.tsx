import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, Pause, RotateCcw, TrendingUp, TrendingDown } from "lucide-react";

export const MacroControlHub = () => {
  const [isRunning, setIsRunning] = useState(true);
  const [timelinePosition, setTimelinePosition] = useState([0]);
  const [inflation, setInflation] = useState([3.2]);
  const [interestRate, setInterestRate] = useState([5.25]);
  const [commodityIndex, setCommodityIndex] = useState([112]);
  const [marketLiquidity, setMarketLiquidity] = useState([78]);
  const [selectedScenario, setSelectedScenario] = useState<string | null>(null);

  const scenarios = [
    { id: "recession", label: "Recession", impact: -12.4 },
    { id: "tech-boom", label: "Tech Boom", impact: +18.7 },
    { id: "energy-crisis", label: "Energy Crisis", impact: -8.3 },
    { id: "war-shock", label: "War Shock", impact: -15.2 },
    { id: "ai-takeover", label: "AI Takeover", impact: +24.1 },
  ];

  const calculateImpact = (baseValue: number, delta: number) => {
    const impact = delta * 0.1;
    return impact >= 0 ? `+${impact.toFixed(1)}%` : `${impact.toFixed(1)}%`;
  };

  return (
    <Card className="bg-gradient-to-r from-black/60 via-gray-900/60 to-black/60 backdrop-blur-sm border-primary/20 p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-bold text-white">Macro Control Hub</h2>
          <Badge className="bg-primary/20 text-primary border-primary/40">
            Neural Sync: {isRunning ? "ACTIVE" : "PAUSED"}
          </Badge>
        </div>
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsRunning(!isRunning)}
            className="border-primary/20"
          >
            {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setTimelinePosition([0]);
              setInflation([3.2]);
              setInterestRate([5.25]);
              setCommodityIndex([112]);
              setMarketLiquidity([78]);
              setSelectedScenario(null);
            }}
            className="border-primary/20"
          >
            <RotateCcw className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-4">
        {/* Timeline Slider */}
        <div className="col-span-12 bg-black/40 rounded-lg p-3 border border-primary/10">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs text-primary/60">Global Timeline</span>
            <span className="text-xs text-primary">
              {timelinePosition[0] < 0 ? `${timelinePosition[0]}y` : timelinePosition[0] === 0 ? "NOW" : `+${timelinePosition[0]}y`}
            </span>
          </div>
          <Slider
            value={timelinePosition}
            onValueChange={setTimelinePosition}
            min={-10}
            max={5}
            step={0.5}
            className="w-full"
          />
        </div>

        {/* Macro Variables */}
        <div className="col-span-3 bg-black/40 rounded-lg p-3 border border-primary/10">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs text-primary/60">Inflation Rate</span>
            <div className="flex items-center gap-1">
              <span className="text-xs text-primary">{inflation[0].toFixed(1)}%</span>
              {inflation[0] > 3.2 ? 
                <TrendingUp className="w-3 h-3 text-red-400" /> : 
                <TrendingDown className="w-3 h-3 text-green-400" />
              }
            </div>
          </div>
          <Slider
            value={inflation}
            onValueChange={setInflation}
            min={0}
            max={10}
            step={0.1}
            className="w-full"
          />
          <div className="mt-1 text-xs text-primary/40">
            Impact: {calculateImpact(3.2, inflation[0] - 3.2)}
          </div>
        </div>

        <div className="col-span-3 bg-black/40 rounded-lg p-3 border border-primary/10">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs text-primary/60">Interest Rate</span>
            <div className="flex items-center gap-1">
              <span className="text-xs text-primary">{interestRate[0].toFixed(2)}%</span>
              {interestRate[0] > 5.25 ? 
                <TrendingUp className="w-3 h-3 text-red-400" /> : 
                <TrendingDown className="w-3 h-3 text-green-400" />
              }
            </div>
          </div>
          <Slider
            value={interestRate}
            onValueChange={setInterestRate}
            min={0}
            max={10}
            step={0.25}
            className="w-full"
          />
          <div className="mt-1 text-xs text-primary/40">
            Impact: {calculateImpact(5.25, interestRate[0] - 5.25)}
          </div>
        </div>

        <div className="col-span-3 bg-black/40 rounded-lg p-3 border border-primary/10">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs text-primary/60">Commodity Index</span>
            <span className="text-xs text-primary">{commodityIndex[0]}</span>
          </div>
          <Slider
            value={commodityIndex}
            onValueChange={setCommodityIndex}
            min={50}
            max={200}
            step={1}
            className="w-full"
          />
          <div className="mt-1 text-xs text-primary/40">
            Impact: {calculateImpact(112, commodityIndex[0] - 112)}
          </div>
        </div>

        <div className="col-span-3 bg-black/40 rounded-lg p-3 border border-primary/10">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs text-primary/60">Market Liquidity</span>
            <span className="text-xs text-primary">{marketLiquidity[0]}%</span>
          </div>
          <Slider
            value={marketLiquidity}
            onValueChange={setMarketLiquidity}
            min={0}
            max={100}
            step={1}
            className="w-full"
          />
          <div className="mt-1 text-xs text-primary/40">
            Impact: {calculateImpact(78, marketLiquidity[0] - 78)}
          </div>
        </div>

        {/* Scenario Buttons */}
        <div className="col-span-12 flex gap-2 flex-wrap">
          {scenarios.map((scenario) => (
            <Button
              key={scenario.id}
              variant={selectedScenario === scenario.id ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedScenario(scenario.id)}
              className={selectedScenario === scenario.id ? "" : "border-primary/20"}
            >
              {scenario.label}
              <Badge 
                variant="outline" 
                className={`ml-2 ${scenario.impact > 0 ? 'text-green-400 border-green-400/40' : 'text-red-400 border-red-400/40'}`}
              >
                {scenario.impact > 0 ? '+' : ''}{scenario.impact}%
              </Badge>
            </Button>
          ))}
        </div>
      </div>
    </Card>
  );
};
