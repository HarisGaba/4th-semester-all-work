import WorkspaceWelcome from '@/components/WorkspaceWelcome';
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "@/api/api";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Dashboard() {
  const [token, setToken] = useState(
    () => localStorage.getItem("token")
  );
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState([]);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(Boolean(token));
  const [error, setError] = useState("");
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    function updateAuth() {
      setToken(localStorage.getItem("token"));
      setRefresh((previous) => previous + 1);
    }

    window.addEventListener("auth-changed", updateAuth);
    window.addEventListener("storage", updateAuth);

    return () => {
      window.removeEventListener("auth-changed", updateAuth);
      window.removeEventListener("storage", updateAuth);
    };
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    async function loadDashboard() {
      setUser(null);
      setStats([]);
      setRecords([]);
      setError("");

      if (!token) {
        setLoading(false);
        return;
      }

      setLoading(true);

      try {
        const options = { signal: controller.signal };
        const account = await API.get("/auth/me", options);
        const currentUser =
          account.data.user || account.data.data || account.data;

        if (!currentUser.role) {
          throw new Error("Unable to identify account role.");
        }

        let nextStats = [];
        let nextRecords = [];

        if (["organizer", "admin"].includes(currentUser.role)) {
          const response = await API.get(
            "/analytics/summary",
            options
          );
          const data = response.data.analytics;

          nextStats = [
            { label: "Events", value: data.totalEvents },
            {
              label: "Attendee Registrations",
              value: data.attendeeRegistrations,
            },
            {
              label: "Exhibitor Applications",
              value: data.exhibitorApplications,
            },
            {
              label: "Pending Applications",
              value: data.pendingApplications,
            },
            {
              label: "Reserved Booths",
              value: data.reservedBooths,
            },
            { label: "Sessions", value: data.totalSessions },
          ];

          nextRecords = response.data.events.map((event) => ({
            id: event._id,
            title: event.title,
            detail: "Manage this event from the Events page.",
          }));
        } else if (currentUser.role === "exhibitor") {
          const response = await API.get(
            "/exhibitors/all",
            options
          );
          const applications = response.data.exhibitors;

          nextStats = [
            {
              label: "My Applications",
              value: applications.length,
            },
            {
              label: "Approved",
              value: applications.filter(
                (item) => item.status === "Approved"
              ).length,
            },
            {
              label: "Pending",
              value: applications.filter(
                (item) => item.status === "Pending"
              ).length,
            },
            {
              label: "Rejected",
              value: applications.filter(
                (item) => item.status === "Rejected"
              ).length,
            },
          ];

          nextRecords = applications.map((item) => ({
            id: item._id,
            title: item.companyName,
            detail: `${item.event?.title || "Unavailable event"} · ${
              item.status
            } · Booth: ${item.boothNumber || "Not assigned"}`,
          }));
        } else if (currentUser.role === "attendee") {
          const response = await API.get(
            "/attendees/all",
            options
          );
          const registrations = response.data.attendees;

          nextStats = [
            {
              label: "My Event Registrations",
              value: registrations.length,
            },
          ];

          nextRecords = registrations.map((item) => ({
            id: item._id,
            title: item.event?.title || "Unavailable event",
            detail: `Ticket: ${item.ticketType || "Standard"} · ${
              item.event?.location || "Location unavailable"
            }`,
          }));
        } else {
          throw new Error("This account role is not supported.");
        }

        if (controller.signal.aborted) return;

        setUser(currentUser);
        setStats(nextStats);
        setRecords(nextRecords);
      } catch (err) {
        if (!controller.signal.aborted) {
          setError(
            err.response?.data?.msg ||
              err.message ||
              "Unable to load dashboard."
          );
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadDashboard();

    return () => controller.abort();
  }, [token, refresh]);

  if (!token) {
    return (
      <div className="mx-auto w-full max-w-5xl space-y-6 p-4 md:p-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">
              Welcome to EventSphere
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-5">
            <p className="text-muted-foreground">
              Manage events, discover exhibitors and plan your
              sessions in one place.
            </p>

            <div className="flex flex-wrap gap-3">
              <Button asChild>
                <Link to="/dashboard/login">Login</Link>
              </Button>

              <Button asChild variant="outline">
                <Link to="/dashboard/signup">Create Account</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const isOrganizer = ["organizer", "admin"].includes(user?.role);

  const shortcuts = isOrganizer
    ? [
        { title: "Manage Events", path: "/events" },
        { title: "Review Applications", path: "/exhibitors" },
        { title: "Manage Booths", path: "/booths" },
        { title: "Manage Sessions", path: "/sessions" },
        { title: "View Analytics", path: "/analytics" },
      ]
    : user?.role === "exhibitor"
      ? [
          { title: "My Applications", path: "/exhibitors" },
          { title: "Select Booth", path: "/booths" },
          { title: "Search Exhibitors", path: "/exhibitor-search" },
        ]
      : [
          { title: "Event Registration", path: "/attendees" },
          { title: "Session Schedule", path: "/sessions" },
          { title: "Search Exhibitors", path: "/exhibitor-search" },
        ];

  const listTitle = isOrganizer
    ? "Your Events"
    : user?.role === "exhibitor"
      ? "My Applications"
      : "My Registered Events";

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6 p-4 md:p-6">
      <WorkspaceWelcome />
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold">Activity overview</h2>

          {user && (
            <p className="text-sm capitalize text-muted-foreground">
              {user.role} dashboard
            </p>
          )}
        </div>

        <Button
          variant="outline"
          disabled={loading}
          onClick={() => setRefresh((previous) => previous + 1)}
        >
          Refresh
        </Button>
      </div>

      {loading ? (
        <p role="status">Loading dashboard...</p>
      ) : error ? (
        <p role="alert" className="text-destructive">
          {error}
        </p>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {stats.map((item) => (
              <Card key={item.label}>
                <CardHeader>
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {item.label}
                  </CardTitle>
                </CardHeader>

                <CardContent>
                  <p className="text-3xl font-semibold">
                    {item.value}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Quick Access</CardTitle>
            </CardHeader>

            <CardContent className="flex flex-wrap gap-3">
              {shortcuts.map((item) => (
                <Button key={item.path} asChild variant="outline">
                  <Link to={item.path}>{item.title}</Link>
                </Button>
              ))}

              <Button asChild variant="outline">
                <Link to="/notifications">Notifications</Link>
              </Button>

              <Button asChild variant="outline">
                <Link to="/feedback">Feedback & Support</Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{listTitle}</CardTitle>
            </CardHeader>

            <CardContent>
              {records.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No records yet.
                </p>
              ) : (
                <div className="divide-y">
                  {records.map((item) => (
                    <div key={item.id} className="space-y-1 py-3">
                      <h2 className="break-words font-medium">
                        {item.title}
                      </h2>
                      <p className="break-words text-sm text-muted-foreground">
                        {item.detail}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}