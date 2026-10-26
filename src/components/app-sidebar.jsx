import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  CalendarDays,
  LayoutDashboard,
  Users,
  Building2,
  MapPin,
  Map,
  Clock,
  Bell,
  BarChart3,
  Search,
  MessageSquare,
  Mail,
  LogIn,
  UserPlus,
} from "lucide-react";
import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const allRoles = ["organizer", "admin", "exhibitor", "attendee"];

const menuItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: <LayoutDashboard className="size-4" />,
    public: true,
  },
  {
    title: "Events",
    url: "/events",
    icon: <CalendarDays className="size-4" />,
    roles: allRoles,
  },
  {
    title: "Exhibitors",
    url: "/exhibitors",
    icon: <Building2 className="size-4" />,
    roles: ["organizer", "admin", "exhibitor"],
  },
  {
    title: "Attendees",
    url: "/attendees",
    icon: <Users className="size-4" />,
    roles: ["organizer", "admin", "attendee"],
  },
  {
    title: "Booths",
    url: "/booths",
    icon: <MapPin className="size-4" />,
    roles: ["organizer", "admin", "exhibitor"],
  },
  {
    title: "Floor Plan",
    url: "/floor-plan",
    icon: <Map className="size-4" />,
    roles: allRoles,
  },
  {
    title: "Sessions",
    url: "/sessions",
    icon: <Clock className="size-4" />,
    roles: allRoles,
  },
  {
    title: "Search Exhibitors",
    url: "/exhibitor-search",
    icon: <Search className="size-4" />,
    roles: allRoles,
  },
  {
    title: "Messages",
    url: "/messages",
    icon: <MessageSquare className="size-4" />,
    roles: ["organizer", "attendee", "exhibitor"],
  },
  {
    title: "Notifications",
    url: "/notifications",
    icon: <Bell className="size-4" />,
    roles: allRoles,
  },
  {
    title: "Analytics",
    url: "/analytics",
    icon: <BarChart3 className="size-4" />,
    roles: ["organizer", "admin"],
  },
  {
    title: "Feedback",
    url: "/feedback",
    icon: <MessageSquare className="size-4" />,
    roles: allRoles,
  },
  {
    title: "Contact",
    url: "/contact",
    icon: <Mail className="size-4" />,
    public: true,
  },
];

function readAccount() {
  const token = localStorage.getItem("token");

  return {
    loggedIn: Boolean(token),
    role: token ? localStorage.getItem("userRole") || "" : "",
  };
}

export function AppSidebar(props) {
  const [account, setAccount] = useState(readAccount);

  useEffect(() => {
    function updateAccount() {
      setAccount(readAccount());
    }

    window.addEventListener("auth-changed", updateAccount);
    window.addEventListener("storage", updateAccount);

    return () => {
      window.removeEventListener("auth-changed", updateAccount);
      window.removeEventListener("storage", updateAccount);
    };
  }, []);

  const items = menuItems
    .filter(
      (item) =>
        item.public ||
        (account.loggedIn && item.roles?.includes(account.role))
    )
    .map((item) => {
      if (item.url === "/exhibitors" && account.role === "exhibitor") {
        return { ...item, title: "My Applications" };
      }

      if (item.url === "/attendees" && account.role === "attendee") {
        return { ...item, title: "Event Registration" };
      }

      return item;
    });

  if (!account.loggedIn) {
    items.push(
      {
        title: "Login",
        url: "/dashboard/login",
        icon: <LogIn className="size-4" />,
      },
      {
        title: "Create Account",
        url: "/dashboard/signup",
        icon: <UserPlus className="size-4" />,
      }
    );
  }

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader className="border-b pb-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link to="/dashboard">
                <CalendarDays className="size-5" />
                <span className="text-base font-semibold">
                  EventSphere
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>

        {account.loggedIn && (
          <p className="px-2 text-xs capitalize text-muted-foreground">
            {account.role} account
          </p>
        )}
      </SidebarHeader>

      <SidebarContent className="px-2 py-3">
        <NavMain items={items} />
      </SidebarContent>

      {account.loggedIn && (
        <SidebarFooter className="border-t pt-2">
          <NavUser />
        </SidebarFooter>
      )}
    </Sidebar>
  );
}