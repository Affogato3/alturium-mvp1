import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface IntelligenceOrbProps {
  onExpand: () => void;
  isActive: boolean;
}

export const IntelligenceOrb = ({ onExpand, isActive }: IntelligenceOrbProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className="fixed bottom-8 right-8 z-50"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <motion.div
        className="relative"
        whileHover={{ scale: 1.05 }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
      >
        {/* Outer glow ring */}
        <motion.div
          className="absolute inset-0 rounded-full blur-xl"
          animate={{
            background: isActive
              ? ["radial-gradient(circle, rgba(207,175,110,0.3) 0%, rgba(207,175,110,0) 70%)",
                 "radial-gradient(circle, rgba(207,175,110,0.5) 0%, rgba(207,175,110,0) 70%)",
                 "radial-gradient(circle, rgba(207,175,110,0.3) 0%, rgba(207,175,110,0) 70%)"]
              : "radial-gradient(circle, rgba(207,175,110,0.2) 0%, rgba(207,175,110,0) 70%)",
          }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Main orb */}
        <Button
          onClick={onExpand}
          className="relative w-20 h-20 rounded-full bg-gradient-to-br from-[#CFAF6E]/20 to-[#EDEDED]/10 border-2 border-[#CFAF6E]/40 backdrop-blur-md hover:border-[#CFAF6E]/60 transition-all shadow-lg shadow-[#CFAF6E]/20"
        >
          {/* Orbiting particles */}
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-[#CFAF6E] rounded-full"
              animate={{
                rotate: 360,
                x: [0, 30 * Math.cos((i * 120 * Math.PI) / 180)],
                y: [0, 30 * Math.sin((i * 120 * Math.PI) / 180)],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "linear",
                delay: i * 0.3,
              }}
            />
          ))}

          {/* Center icon */}
          <div className="relative z-10">
            <Brain className="w-8 h-8 text-[#CFAF6E]" />
            {isActive && (
              <motion.div
                className="absolute -top-1 -right-1"
                animate={{ scale: [1, 1.2, 1], opacity: [1, 0.5, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                <Sparkles className="w-4 h-4 text-[#CFAF6E]" />
              </motion.div>
            )}
          </div>
        </Button>

        {/* Hover tooltip */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="absolute right-full mr-4 top-1/2 -translate-y-1/2 whitespace-nowrap"
            >
              <Card className="bg-[#1A1A1A]/95 backdrop-blur-sm border-[#CFAF6E]/30 px-4 py-2">
                <p className="text-sm text-[#EDEDED] font-medium">Ask My Analyst</p>
                <p className="text-xs text-[#BFBFBF]">Click to open AI console</p>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};
