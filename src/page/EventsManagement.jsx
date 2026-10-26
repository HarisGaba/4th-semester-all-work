import useLiveRefresh from '@/hooks/useLiveRefresh';
import { useEffect, useState } from "react";
import API from "@/api/api";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "react-toastify";

export default function EventsManagement() {
  const [events, setEvents] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("");
  const [editingId, setEditingId] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState("");
  const [loadError, setLoadError] = useState("");

  const role = localStorage.getItem("userRole");
  const userId = localStorage.getItem("userId");
  const isOrganizer = role === "organizer" || role === "admin";
  const busy = saving || Boolean(deletingId);

  async function fetchEvents() {
    setLoading(true);
    setLoadError("");

    try {
      const response = await API.get("/events/all");
      setEvents(response.data.events);
    } catch {
      setLoadError("Failed to load events. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const controller = new AbortController();

    async function loadInitialEvents() {
      try {
        const response = await API.get("/events/all", {
          signal: controller.signal,
        });

        if (!controller.signal.aborted) {
          setEvents(response.data.events);
        }
      } catch {
        if (!controller.signal.aborted) {
          setLoadError("Failed to load events. Please try again.");
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    loadInitialEvents();

    return () => controller.abort();
  }, []);

  useLiveRefresh(() => { if (!busy) void fetchEvents(); });

  function clearForm() {
    setTitle("");
    setDescription("");
    setDate("");
    setLocation("");
    setCategory("");
    setEditingId("");
  }

  function canManage(event) {
    const organizerId = event.organizer?._id || event.organizer;

    return (
      isOrganizer &&
      (role === "admin" || organizerId === userId)
    );
  }

  function handleEdit(event) {
    setEditingId(event._id);
    setTitle(event.title);
    setDescription(event.description);
    setDate(event.date.slice(0, 10));
    setLocation(event.location);
    setCategory(event.category);

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleSaveEvent(event) {
    event.preventDefault();

    if (busy) return;

    const data = {
      title: title.trim(),
      description: description.trim(),
      date,
      location: location.trim(),
      category: category.trim(),
    };

    if (Object.values(data).some((value) => !value)) {
      toast.error("Please fill all fields.");
      return;
    }

    setSaving(true);

    try {
      if (editingId) {
        await API.put(`/events/update/${editingId}`, data);
        toast.success("Event updated successfully!");
      } else {
        await API.post("/events/create", data);
        toast.success("Event created successfully!");
      }

      clearForm();
      await fetchEvents();
    } catch (error) {
      toast.error(
        error.response?.data?.msg || "Failed to save event."
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(event) {
    if (busy) return;

    if (!window.confirm(`Delete "${event.title}" permanently?`)) {
      return;
    }

    setDeletingId(event._id);

    try {
      await API.delete(`/events/delete/${event._id}`);

      setEvents((previous) =>
        previous.filter((item) => item._id !== event._id)
      );

      if (editingId === event._id) clearForm();

      toast.success("Event deleted successfully!");
    } catch (error) {
      toast.error(
        error.response?.data?.msg || "Failed to delete event."
      );
    } finally {
      setDeletingId("");
    }
  }

  return (
    <div className="mx-auto w-full max-w-4xl space-y-8 p-4 md:p-6">
      {isOrganizer && (
        <Card>
          <CardHeader>
            <CardTitle>
              {editingId ? "Edit Event" : "Create New Event"}
            </CardTitle>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSaveEvent}>
              <fieldset disabled={busy} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="event-title">Title</Label>
                  <Input
                    id="event-title"
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                    maxLength={150}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="event-description">Description</Label>
                  <textarea
                    id="event-description"
                    value={description}
                    onChange={(event) => setDescription(event.target.value)}
                    maxLength={5000}
                    rows={4}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-2 focus-visible:outline-ring"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="event-date">Date</Label>
                  <Input
                    id="event-date"
                    type="date"
                    value={date}
                    onChange={(event) => setDate(event.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="event-location">Location</Label>
                  <Input
                    id="event-location"
                    value={location}
                    onChange={(event) => setLocation(event.target.value)}
                    maxLength={200}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="event-category">Category</Label>
                  <Input
                    id="event-category"
                    value={category}
                    onChange={(event) => setCategory(event.target.value)}
                    maxLength={100}
                    required
                  />
                </div>

                <Button type="submit" className="w-full">
                  {saving
                    ? "Saving..."
                    : editingId
                      ? "Save Changes"
                      : "Create Event"}
                </Button>

                {editingId && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={clearForm}
                    className="w-full"
                  >
                    Cancel
                  </Button>
                )}
              </fieldset>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        <h2 className="text-xl font-bold">All Events</h2>

        {loading ? (
          <p role="status">Loading events...</p>
        ) : loadError ? (
          <div className="space-y-3">
            <p role="alert">{loadError}</p>
            <Button variant="outline" onClick={fetchEvents}>
              Try Again
            </Button>
          </div>
        ) : events.length === 0 ? (
          <p className="text-muted-foreground">No events found.</p>
        ) : (
          <div className="grid gap-4">
            {events.map((event) => (
              <Card key={event._id}>
                <CardContent className="space-y-3 p-4">
                  <h3 className="break-words text-lg font-semibold">
                    {event.title}
                  </h3>

                  <p className="whitespace-pre-wrap break-words text-sm text-muted-foreground">
                    {event.description}
                  </p>

                  <div className="space-y-1 text-sm">
                    <p className="break-words">
                      Location: {event.location}
                    </p>
                    <p>
                      Date:{" "}
                      {new Date(event.date).toLocaleDateString(
                        "en-GB",
                        { timeZone: "UTC" }
                      )}
                    </p>
                    <p className="break-words">
                      Category: {event.category}
                    </p>
                    <p>
                      Organizer:{" "}
                      {event.organizer?.name || "Unavailable"}
                    </p>
                  </div>

                  {canManage(event) && (
                    <div className="flex gap-3">
                      <Button
                        variant="outline"
                        onClick={() => handleEdit(event)}
                        disabled={busy}
                      >
                        Edit
                      </Button>

                      <Button
                        variant="destructive"
                        onClick={() => handleDelete(event)}
                        disabled={busy}
                      >
                        {deletingId === event._id
                          ? "Deleting..."
                          : "Delete"}
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}