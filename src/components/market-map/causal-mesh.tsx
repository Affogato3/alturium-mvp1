import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Network, ZoomIn, Sparkles } from "lucide-react";

export function CausalMesh() {
  const [nodes, setNodes] = useState<any[]>([]);
  const [edges, setEdges] = useState<any[]>([]);
  const [selectedNode, setSelectedNode] = useState<any>(null);

  const loadCausalGraph = async () => {
    toast.loading("Loading causal network...");
    try {
      const { data, error } = await supabase.functions.invoke('market-synapse', {
        body: { action: 'generate_causal_graph' }
      });

      if (error) throw error;

      setNodes(data.nodes || []);
      setEdges(data.edges || []);
      toast.success("Causal mesh loaded");
    } catch (error: any) {
      toast.error(error.message || "Failed to load mesh");
    } finally {
      toast.dismiss();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Causal Network Mesh</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Interactive visualization of event-to-impact relationships
          </p>
        </div>
        <Button onClick={loadCausalGraph} className="gap-2">
          <Network className="w-4 h-4" />
          Map Causal Links
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Mesh Visualization */}
        <Card className="lg:col-span-3 p-6 bg-background/50 backdrop-blur-sm border-primary/20">
          <div className="relative h-[600px] rounded-lg bg-gradient-to-br from-background/30 to-primary/5 border border-primary/10 overflow-hidden">
            {/* SVG Network Visualization */}
            <svg className="absolute inset-0 w-full h-full">
              {/* Draw edges first */}
              {edges.map((edge, i) => {
                const fromNode = nodes.find(n => n.id === edge.from);
                const toNode = nodes.find(n => n.id === edge.to);
                if (!fromNode || !toNode) return null;

                return (
                  <motion.g key={i}>
                    <motion.line
                      x1={`${fromNode.x}%`}
                      y1={`${fromNode.y}%`}
                      x2={`${toNode.x}%`}
                      y2={`${toNode.y}%`}
                      stroke="rgba(207, 175, 110, 0.3)"
                      strokeWidth="2"
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ pathLength: 1, opacity: 0.6 }}
                      transition={{ duration: 1, delay: i * 0.05 }}
                    />
                    
                    {/* Energy wave animation along edge */}
                    <motion.circle
                      cx={`${fromNode.x}%`}
                      cy={`${fromNode.y}%`}
                      r="3"
                      fill="#CFAF6E"
                      animate={{
                        cx: [`${fromNode.x}%`, `${toNode.x}%`],
                        cy: [`${fromNode.y}%`, `${toNode.y}%`],
                        opacity: [0, 1, 0]
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: i * 0.3
                      }}
                    />
                  </motion.g>
                );
              })}
            </svg>

            {/* Draw nodes */}
            <div className="absolute inset-0">
              {nodes.map((node, idx) => (
                <motion.div
                  key={node.id}
                  className="absolute cursor-pointer group"
                  style={{
                    left: `${node.x}%`,
                    top: `${node.y}%`,
                    transform: 'translate(-50%, -50%)'
                  }}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: idx * 0.1 }}
                  onClick={() => setSelectedNode(node)}
                  whileHover={{ scale: 1.2 }}
                >
                  <motion.div
                    className="relative"
                    animate={{
                      boxShadow: [
                        '0 0 0 0 rgba(207, 175, 110, 0.7)',
                        '0 0 0 20px rgba(207, 175, 110, 0)',
                      ]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <div
                      className={`w-16 h-16 rounded-full bg-gradient-to-br ${
                        node.type === 'event' ? 'from-primary to-primary/50' :
                        node.type === 'impact' ? 'from-destructive to-destructive/50' :
                        'from-blue-500 to-blue-500/50'
                      } flex items-center justify-center text-xs font-bold border-2 border-primary/50`}
                      style={{
                        opacity: 0.8 + (node.importance || 0.2)
                      }}
                    >
                      {node.label?.substring(0, 3).toUpperCase()}
                    </div>
                  </motion.div>

                  {/* Tooltip on hover */}
                  <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 hidden group-hover:block">
                    <div className="bg-background/95 backdrop-blur-sm border border-primary/20 rounded-lg p-3 min-w-[200px] shadow-lg">
                      <p className="font-semibold text-sm">{node.label}</p>
                      <p className="text-xs text-muted-foreground mt-1">{node.description}</p>
                      {node.value && (
                        <p className="text-xs text-primary mt-2 font-semibold">
                          Impact: {node.value}
                        </p>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Center help text */}
            {nodes.length === 0 && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <Sparkles className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>Click "Map Causal Links" to generate network</p>
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Node Details Sidebar */}
        <Card className="p-6 bg-background/50 backdrop-blur-sm border-primary/20">
          <h3 className="text-lg font-semibold mb-4">Node Details</h3>
          
          {selectedNode ? (
            <motion.div
              key={selectedNode.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-4"
            >
              <div>
                <p className="text-xs text-muted-foreground mb-1">Type</p>
                <p className="font-semibold capitalize">{selectedNode.type}</p>
              </div>

              <div>
                <p className="text-xs text-muted-foreground mb-1">Label</p>
                <p className="font-semibold">{selectedNode.label}</p>
              </div>

              <div>
                <p className="text-xs text-muted-foreground mb-1">Description</p>
                <p className="text-sm">{selectedNode.description}</p>
              </div>

              {selectedNode.connections && (
                <div>
                  <p className="text-xs text-muted-foreground mb-2">Connections</p>
                  <div className="space-y-1">
                    {selectedNode.connections.map((conn: string, i: number) => (
                      <div key={i} className="text-xs bg-primary/10 rounded px-2 py-1">
                        → {conn}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <Button size="sm" className="w-full gap-2">
                <ZoomIn className="w-4 h-4" />
                Analyze Impact Chain
              </Button>
            </motion.div>
          ) : (
            <div className="flex items-center justify-center h-64 text-muted-foreground text-center">
              <p>Click a node to view details</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
