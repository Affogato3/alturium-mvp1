import { Card } from "@/components/ui/card";
import { 
  Wallet, 
  TrendingUp, 
  FileCheck, 
  Shield, 
  AlertTriangle, 
  Settings, 
  Rocket, 
  Building,
  ShieldCheck
} from "lucide-react";

interface ModuleTileProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
  onClick: () => void;
}

const ModuleTile = ({ icon, title, description, color, onClick }: ModuleTileProps) => (
  <Card
    onClick={onClick}
    className={`group relative p-6 cursor-pointer overflow-hidden transition-all duration-300 hover:scale-105 border-${color}/20 hover:border-${color}/40 bg-card/50 backdrop-blur`}
  >
    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
      <div className={`absolute inset-0 bg-gradient-to-br from-${color}/10 to-transparent`} />
    </div>
    
    <div className="relative z-10">
      <div className={`mb-4 p-3 rounded-lg bg-${color}/10 w-fit group-hover:bg-${color}/20 transition-colors`}>
        {icon}
      </div>
      <h3 className="text-lg font-bold mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>

    <div className="absolute top-0 right-0 w-32 h-32 opacity-5 group-hover:opacity-10 transition-opacity">
      {icon}
    </div>
  </Card>
);

export const ModuleTiles = ({ onModuleClick }: { onModuleClick: (module: string) => void }) => {
  const modules = [
    {
      id: 'accounts',
      icon: <Wallet className="h-6 w-6 text-primary" />,
      title: 'Live Accounts',
      description: 'Real-time view of all financial accounts',
      color: 'primary'
    },
    {
      id: 'liquidity',
      icon: <TrendingUp className="h-6 w-6 text-success" />,
      title: 'Liquidity Foresight',
      description: 'AI-powered liquidity predictions',
      color: 'success'
    },
    {
      id: 'reconciliation',
      icon: <FileCheck className="h-6 w-6 text-accent" />,
      title: 'Cognitive Reconciliation',
      description: 'Automated transaction matching',
      color: 'accent'
    },
    {
      id: 'risk',
      icon: <Shield className="h-6 w-6 text-warning" />,
      title: 'Risk Lattice',
      description: 'Portfolio risk analysis & stress testing',
      color: 'warning'
    },
    {
      id: 'anomaly',
      icon: <AlertTriangle className="h-6 w-6 text-danger" />,
      title: 'Anomaly Monitor',
      description: 'Real-time fraud detection',
      color: 'danger'
    },
    {
      id: 'actions',
      icon: <Settings className="h-6 w-6 text-primary" />,
      title: 'Smart Actions',
      description: 'AI-driven optimization recommendations',
      color: 'primary'
    },
    {
      id: 'compliance',
      icon: <ShieldCheck className="h-6 w-6 text-primary" />,
      title: 'Embedded Compliance Autopilot™',
      description: 'Real-time regulatory monitoring & enforcement',
      color: 'primary'
    },
    {
      id: 'execution',
      icon: <Rocket className="h-6 w-6 text-accent" />,
      title: 'Execution Rail',
      description: 'Secure command console',
      color: 'accent'
    },
    {
      id: 'governance',
      icon: <Building className="h-6 w-6 text-success" />,
      title: 'Governance & Compliance',
      description: 'Regulatory compliance dashboard',
      color: 'success'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {modules.map((module) => (
        <ModuleTile
          key={module.id}
          {...module}
          onClick={() => onModuleClick(module.id)}
        />
      ))}
    </div>
  );
};
