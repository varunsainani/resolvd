import {
  BarChart3,
  BookOpen,
  Inbox,
  LayoutDashboard,
  MessageSquareText,
  Settings,
  Shield,
  Users,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  // Translation key under the `nav` namespace.
  key: string;
  href: string;
  icon: LucideIcon;
  // Only shown to admins (the Team management area).
  adminOnly?: boolean;
}

// Primary navigation. The matching pages arrive in chunks 6-9; the shell links
// to them now so the structure is in place.
export const NAV_ITEMS: NavItem[] = [
  { key: "dashboard", href: "/dashboard", icon: LayoutDashboard },
  { key: "inbox", href: "/inbox", icon: Inbox },
  { key: "analytics", href: "/analytics", icon: BarChart3 },
  { key: "customers", href: "/customers", icon: Users },
  { key: "knowledgeBase", href: "/kb", icon: BookOpen },
  { key: "cannedResponses", href: "/canned", icon: MessageSquareText },
  { key: "team", href: "/team", icon: Shield, adminOnly: true },
  { key: "settings", href: "/settings", icon: Settings },
];
