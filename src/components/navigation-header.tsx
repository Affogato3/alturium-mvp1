import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Bell, 
  User, 
  LogOut, 
  Settings, 
  Shield,
  BookOpen,
  Activity,
  Network,
  Mic
} from "lucide-react";

interface NavigationHeaderProps {
  userRole: "admin" | "executive" | "analyst" | "auditor";
  userName: string;
  auditMode: boolean;
  onAuditModeToggle: () => void;
  onSignOut: () => void;
}

export function NavigationHeader({ 
  userRole, 
  userName, 
  auditMode, 
  onAuditModeToggle, 
  onSignOut 
}: NavigationHeaderProps) {
  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin": return "bg-primary text-primary-foreground";
      case "auditor": return "bg-audit text-audit-foreground";
      case "executive": return "bg-governance text-governance-foreground";
      case "analyst": return "bg-secondary text-secondary-foreground";
      default: return "bg-secondary text-secondary-foreground";
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "admin": return Shield;
      case "auditor": return BookOpen;
      case "executive": return Activity;
      case "analyst": return User;
      default: return User;
    }
  };

  const RoleIcon = getRoleIcon(userRole);

  return (
    <header className="border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo and Brand */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center">
                <Shield className="h-4 w-4 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
                  ALTURIUM
                </h1>
                <p className="text-xs text-muted-foreground">Enterprise Intelligence Core</p>
              </div>
            </div>
          </div>

          {/* Center - Audit Mode Toggle */}
          {(userRole === "admin" || userRole === "auditor") && (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Executive Mode</span>
                <Switch
                  checked={auditMode}
                  onCheckedChange={onAuditModeToggle}
                />
                <span className="text-sm font-medium">Auditor Mode</span>
              </div>
              {auditMode && (
                <Badge variant="outline" className="border-audit text-audit">
                  Audit Console Active
                </Badge>
              )}
            </div>
          )}

          {/* Right side - Actions and User Menu */}
          <div className="flex items-center gap-3">
            {/* CNL Grid Link */}
            <Button 
              variant="ghost" 
              size="sm" 
              className="flex items-center gap-2"
              onClick={() => window.location.href = '/cnl-grid'}
            >
              <Network className="h-4 w-4 text-[hsl(var(--cnl-flow))]" />
              <span className="hidden sm:inline text-sm">CNL Grid</span>
            </Button>

            {/* Scribe Link */}
            <Button 
              variant="ghost" 
              size="sm" 
              className="flex items-center gap-2"
              onClick={() => window.location.href = '/scribe'}
            >
              <Mic className="h-4 w-4 text-[hsl(var(--scribe-accent))]" />
              <span className="hidden sm:inline text-sm">Scribe</span>
            </Button>

            {/* Alturium Link */}
            <Button 
              variant="ghost" 
              size="sm" 
              className="flex items-center gap-2"
              onClick={() => window.location.href = '/alturium'}
            >
              <Shield className="h-4 w-4 text-[hsl(var(--alturium-accent))]" />
              <span className="hidden sm:inline text-sm">Alturium</span>
            </Button>

            {/* Notifications */}
            <Button variant="ghost" size="sm" className="relative">
              <Bell className="h-4 w-4" />
              <span className="absolute -top-1 -right-1 h-3 w-3 bg-danger rounded-full text-xs flex items-center justify-center text-danger-foreground">
                3
              </span>
            </Button>

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2 px-2">
                  <Avatar className="h-7 w-7">
                    <AvatarImage src="/placeholder-avatar.jpg" alt={userName} />
                    <AvatarFallback className="text-xs">
                      {userName.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="text-left hidden sm:block">
                    <p className="text-sm font-medium">{userName}</p>
                    <Badge className={`text-xs ${getRoleColor(userRole)}`}>
                      <RoleIcon className="h-3 w-3 mr-1" />
                      {userRole.charAt(0).toUpperCase() + userRole.slice(1)}
                    </Badge>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                {userRole === "admin" && (
                  <>
                    <DropdownMenuItem>
                      <Shield className="mr-2 h-4 w-4" />
                      Admin Console
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => window.location.href = '/cnl-grid'}>
                      <Network className="mr-2 h-4 w-4" />
                      CNL Grid™
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => window.location.href = '/scribe'}>
                      <Mic className="mr-2 h-4 w-4" />
                      Scribe
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => window.location.href = '/alturium'}>
                      <Shield className="mr-2 h-4 w-4" />
                      Alturium
                    </DropdownMenuItem>
                  </>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={onSignOut} className="text-danger">
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
}