import { useContext } from "react";
import { useLocation } from "react-router-dom";
import { Moon, Sun } from "lucide-react";
import { ThemeContext } from "../context/theme-context";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";

const titles = {
  "/": "Dashboard",
  "/dashboard": "Dashboard",
  "/events": "Events",
  "/exhibitors": "Exhibitors",
  "/attendees": "Attendees",
  "/booths": "Booths",
  "/floor-plan": "Floor Plan",
  "/sessions": "Sessions",
  "/exhibitor-search": "Search Exhibitors",
  "/messages": "Messages",
  "/notifications": "Notifications",
  "/analytics": "Analytics",
  "/feedback": "Feedback",
  "/contact": "Contact",
  "/products": "Products",
  "/add-product": "Add Product",
};

export function SiteHeader() {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const location = useLocation();

  const pathname =
    location.pathname.toLowerCase().replace(/\/+$/, "") || "/";

  const title = titles[pathname] || "EventSphere";

  return (
    <header className="flex h-(--header-height) shrink-0 items-center border-b">
      <div className="flex w-full items-center gap-2 px-4 lg:px-6">
        <SidebarTrigger className="-ml-1" />

        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />

        <h1 className="text-base font-medium">{title}</h1>

        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={toggleTheme}
          aria-label={
            theme === "dark"
              ? "Switch to light mode"
              : "Switch to dark mode"
          }
          className="ml-auto rounded-full"
        >
          {theme === "dark" ? (
            <Sun className="size-4" />
          ) : (
            <Moon className="size-4" />
          )}
        </Button>
      </div>
    </header>
  );
}