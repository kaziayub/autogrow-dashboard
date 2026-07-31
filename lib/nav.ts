import {
  LayoutDashboard,
  Bot,
  Cpu,
  Target,
  KanbanSquare,
  CalendarClock,
  Globe,
  TrendingUp,
  PenLine,
  BrainCircuit,
  Microscope,
  Server,
  BarChart3,
  Settings,
  type LucideIcon,
} from "lucide-react";

export type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  badge?: string;
};

export const NAV: NavItem[] = [
  { href: "/", label: "Command Center", icon: LayoutDashboard },
  { href: "/assistant", label: "AI Assistant", icon: Bot },
  { href: "/control-center", label: "Agent Swarm", icon: Cpu },
  { href: "/missions", label: "Missions", icon: Target },
  { href: "/tasks", label: "Task Board", icon: KanbanSquare },
  { href: "/scheduler", label: "Scheduler", icon: CalendarClock },
  { href: "/website", label: "Website", icon: Globe },
  { href: "/seo", label: "SEO Center", icon: TrendingUp },
  { href: "/content", label: "Content Studio", icon: PenLine },
  { href: "/vault", label: "Memory Vault", icon: BrainCircuit },
  { href: "/research", label: "Research Hub", icon: Microscope },
  { href: "/server", label: "Server Monitor", icon: Server },
  { href: "/reports", label: "Reports", icon: BarChart3 },
  { href: "/settings", label: "Settings", icon: Settings },
];
