import { useEffect, useState } from "react";
import API from "@/api/api";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "react-toastify";

async function fetchRegistrationData(isAttendee, signal) {
  const [registrationResponse, eventResponse] = await Promise.all([
    API.get("/attendees/all", { signal }),
    isAttendee
      ? API.get("/events/all", { signal })
      : Promise.resolve(null),
  ]);

  return {
    attendees: registrationResponse.data.attendees,
    events: eventResponse?.data?.events || [],
  };
}

export default function AttendeesManagement() {
  const [attendees, setAttendees] = useState([]);
  const [events, setEvents] = useState([]);
  const [eventId, setEventId] = useState("");
  const [ticketType, setTicketType] = useState("Standard");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [loadError, setLoadError] = useState("");

  const role = localStorage.getItem("userRole");
  const isAttendee = role === "attendee";
  const isOrganizer = role === "organizer" || role === "admin";
  const canView = isAttendee || isOrganizer;

  useEffect(() => {
    if (!canView) return;

    const controller = new AbortController();

    async function loadInitialData() {
      try {
        const data = await fetchRegistrationData(
          isAttendee,
          controller.signal
        );

        if (controller.signal.aborted) return;

        setAttendees(data.attendees);
        setEvents(data.events);
      } catch (error) {
        if (!controller.signal.aborted) {
          setLoadError(
            error.response?.data?.msg || "Unable to load registrations."
          );
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    loadInitialData();

    return () => controller.abort();
  }, [canView, isAttendee]);

  async function refreshData() {
    setLoading(true);
    setLoadError("");

    try {
      const data = await fetchRegistrationData(isAttendee);
      setAttendees(data.attendees);
      setEvents(data.events);
    } catch (error) {
      setLoadError(
        error.response?.data?.msg || "Unable to load registrations."
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleRegister(event) {
    event.preventDefault();

    if (saving || !eventId) return;

    setSaving(true);

    try {
      const response = await API.post("/attendees/register", {
        event: eventId,
        ticketType,
      });

      toast.success(response.data.msg);
      setEventId("");
      setTicketType("Standard");
      await refreshData();
    } catch (error) {
      toast.error(
        error.response?.data?.msg || "Unable to register for event."
      );
    } finally {
      setSaving(false);
    }
  }

  if (!canView) {
    return (
      <p className="p-6">
        Event registration requires an attendee account.
        Exhibitors can apply through the Exhibitors page.
      </p>
    );
  }

  return (
    <div className="mx-auto w-full max-w-4xl space-y-6 p-4 md:p-6">
      <h1 className="text-2xl font-semibold">
        {isAttendee ? "My Registrations" : "Attendee Registrations"}
      </h1>

      {isAttendee && (
        <Card>
          <CardHeader>
            <CardTitle>Register for an Event</CardTitle>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleRegister}>
              <fieldset
                disabled={saving || loading || Boolean(loadError)}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <Label htmlFor="attendee-event">Event</Label>
                  <select
                    id="attendee-event"
                    value={eventId}
                    onChange={(event) => setEventId(event.target.value)}
                    className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                    required
                  >
                    <option value="">Select an event</option>

                    {events.map((event) => (
                      <option key={event._id} value={event._id}>
                        {event.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ticket-type">Ticket Type</Label>
                  <select
                    id="ticket-type"
                    value={ticketType}
                    onChange={(event) => setTicketType(event.target.value)}
                    className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                    required
                  >
                    <option value="Standard">Standard</option>
                    <option value="VIP">VIP</option>
                    <option value="Regular">Regular</option>
                  </select>
                </div>

                <Button
                  type="submit"
                  disabled={!eventId || events.length === 0}
                >
                  {saving ? "Registering..." : "Register"}
                </Button>

                {!loading && events.length === 0 && (
                  <p className="text-sm text-muted-foreground">
                    No events are available yet.
                  </p>
                )}
              </fieldset>
            </form>
          </CardContent>
        </Card>
      )}

      {loading ? (
        <p role="status">Loading registrations...</p>
      ) : loadError ? (
        <div className="space-y-3">
          <p role="alert">{loadError}</p>

          <Button variant="outline" onClick={refreshData}>
            Try Again
          </Button>
        </div>
      ) : attendees.length === 0 ? (
        <p className="text-muted-foreground">
          No registrations found.
        </p>
      ) : (
        <div className="grid gap-4">
          {attendees.map((registration) => (
            <Card key={registration._id}>
              <CardContent className="space-y-3 p-4">
                <h2 className="break-words text-lg font-semibold">
                  {registration.event?.title || "Event unavailable"}
                </h2>

                <div className="space-y-1 text-sm">
                  {isOrganizer && (
                    <>
                      <p>
                        Attendee: {registration.user?.name || "Unavailable"}
                      </p>
                      <p className="break-all">
                        Email: {registration.user?.email || "Unavailable"}
                      </p>
                    </>
                  )}

                  <p>Ticket: {registration.ticketType}</p>

                  {registration.event && (
                    <>
                      <p>
                        Date:{" "}
                        {new Date(
                          registration.event.date
                        ).toLocaleDateString("en-GB", {
                          timeZone: "UTC",
                        })}
                      </p>

                      <p className="break-words">
                        Location: {registration.event.location}
                      </p>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}