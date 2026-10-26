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

function FeedbackReply({ feedback, onUpdated }) {
  const [status, setStatus] = useState(feedback.status || "Open");
  const [reply, setReply] = useState(feedback.reply || "");
  const [saving, setSaving] = useState(false);

  async function handleSave(event) {
    event.preventDefault();

    if (saving) return;

    setSaving(true);

    try {
      const response = await API.put(
        `/feedback/update/${feedback._id}`,
        { status, reply }
      );

      toast.success(response.data.msg);
      await onUpdated();
    } catch (error) {
      toast.error(
        error.response?.data?.msg || "Unable to save reply."
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSave} className="border-t pt-4">
      <fieldset disabled={saving} className="space-y-3">
        <div className="space-y-2">
          <Label htmlFor={`status-${feedback._id}`}>Status</Label>
          <select
            id={`status-${feedback._id}`}
            value={status}
            onChange={(event) => setStatus(event.target.value)}
            className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
          >
            <option value="Open">Open</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor={`reply-${feedback._id}`}>Reply</Label>
          <textarea
            id={`reply-${feedback._id}`}
            value={reply}
            onChange={(event) => setReply(event.target.value)}
            maxLength={2000}
            rows={3}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          />
        </div>

        <Button type="submit">
          {saving ? "Saving..." : "Save Update"}
        </Button>
      </fieldset>
    </form>
  );
}

export default function FeedbackSupport() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [events, setEvents] = useState([]);
  const [eventId, setEventId] = useState("");
  const [type, setType] = useState("suggestion");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [loadError, setLoadError] = useState("");

  const role = localStorage.getItem("userRole");
  const userId = localStorage.getItem("userId");

  async function loadData() {
    setLoading(true);
    setLoadError("");

    try {
      const [feedbackResponse, eventResponse] = await Promise.all([
        API.get("/feedback/all"),
        API.get("/events/all"),
      ]);

      setFeedbacks(feedbackResponse.data.feedbacks);
      setEvents(eventResponse.data.events);
    } catch {
      setLoadError("Unable to load feedback. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const controller = new AbortController();

    async function loadInitialData() {
      try {
        const [feedbackResponse, eventResponse] = await Promise.all([
          API.get("/feedback/all", {
            signal: controller.signal,
          }),
          API.get("/events/all", {
            signal: controller.signal,
          }),
        ]);

        if (controller.signal.aborted) return;

        setFeedbacks(feedbackResponse.data.feedbacks);
        setEvents(eventResponse.data.events);
      } catch {
        if (!controller.signal.aborted) {
          setLoadError("Unable to load feedback. Please try again.");
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    loadInitialData();

    return () => controller.abort();
  }, []);

  function canManage(feedback) {
    return (
      role === "admin" ||
      (role === "organizer" &&
        feedback.event?.organizer === userId)
    );
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (saving) return;

    if (message.trim().length < 5) {
      toast.error("Enter a message with at least 5 characters.");
      return;
    }

    setSaving(true);

    try {
      const response = await API.post("/feedback/submit", {
        event: eventId,
        type,
        message: message.trim(),
      });

      toast.success(response.data.msg);
      setMessage("");
      setEventId("");
      setType("suggestion");
      await loadData();
    } catch (error) {
      toast.error(
        error.response?.data?.msg || "Unable to submit feedback."
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-4xl space-y-6 p-4 md:p-6">
      <h1 className="text-2xl font-semibold">Feedback & Support</h1>

      <Card>
        <CardHeader>
          <CardTitle>Submit Feedback</CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit}>
            <fieldset
              disabled={saving || loading || Boolean(loadError)}
              className="space-y-4"
            >
              <div className="space-y-2">
                <Label htmlFor="feedback-event">Event</Label>
                <select
                  id="feedback-event"
                  value={eventId}
                  onChange={(event) => setEventId(event.target.value)}
                  className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                >
                  <option value="">General Feedback</option>

                  {events.map((event) => (
                    <option key={event._id} value={event._id}>
                      {event.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="feedback-type">Type</Label>
                <select
                  id="feedback-type"
                  value={type}
                  onChange={(event) => setType(event.target.value)}
                  className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                >
                  <option value="suggestion">Suggestion</option>
                  <option value="issue">Report an Issue</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="feedback-message">Message</Label>
                <textarea
                  id="feedback-message"
                  value={message}
                  onChange={(event) => setMessage(event.target.value)}
                  minLength={5}
                  maxLength={3000}
                  rows={4}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  required
                />
              </div>

              <Button type="submit">
                {saving ? "Submitting..." : "Submit Feedback"}
              </Button>
            </fieldset>
          </form>
        </CardContent>
      </Card>

      <div className="flex items-center justify-between gap-3">
        <h2 className="text-xl font-semibold">Feedback Requests</h2>
        <Button
          variant="outline"
          onClick={loadData}
          disabled={loading || saving}
        >
          Refresh
        </Button>
      </div>

      {loading ? (
        <p role="status">Loading feedback...</p>
      ) : loadError ? (
        <p role="alert">{loadError}</p>
      ) : feedbacks.length === 0 ? (
        <p className="text-muted-foreground">
          No feedback requests found.
        </p>
      ) : (
        <div className="space-y-4">
          {feedbacks.map((feedback) => (
            <Card key={feedback._id}>
              <CardContent className="space-y-4 p-4">
                <div className="space-y-1 text-sm">
                  <p className="font-semibold">
                    {feedback.event?.title || "General Feedback"}
                  </p>
                  <p className="capitalize">Type: {feedback.type}</p>
                  <p>Status: {feedback.status || "Open"}</p>

                  {canManage(feedback) && (
                    <>
                      <p>From: {feedback.name}</p>
                      <p className="break-all">
                        Email: {feedback.email}
                      </p>
                    </>
                  )}

                  <p className="text-xs text-muted-foreground">
                    {new Date(feedback.createdAt).toLocaleString("en-GB")}
                  </p>
                </div>

                <p className="whitespace-pre-wrap break-words text-sm">
                  {feedback.message}
                </p>

                {feedback.reply && (
                  <div className="space-y-2 rounded-md border p-3">
                    <p className="text-sm font-semibold">Support Reply</p>
                    <p className="whitespace-pre-wrap break-words text-sm">
                      {feedback.reply}
                    </p>
                  </div>
                )}

                {canManage(feedback) && (
                  <FeedbackReply
                    key={`${feedback._id}-${feedback.updatedAt}`}
                    feedback={feedback}
                    onUpdated={loadData}
                  />
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}