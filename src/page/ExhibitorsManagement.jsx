import { useEffect, useState } from "react";
import API from "@/api/api";
import ExhibitorProfileForm from "@/components/ExhibitorProfileForm";
import ExhibitorFiles from "@/components/ExhibitorFiles";
import ExhibitorStaff from "@/components/ExhibitorStaff";
import ExhibitorServices from "@/components/ExhibitorServices";
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

async function fetchApplicationData(isExhibitor, signal) {
  const [applicationResponse, eventResponse] = await Promise.all([
    API.get("/exhibitors/all", { signal }),
    isExhibitor
      ? API.get("/events/all", { signal })
      : Promise.resolve(null),
  ]);

  return {
    exhibitors: applicationResponse.data.exhibitors,
    events: eventResponse?.data?.events || [],
  };
}

export default function ExhibitorsManagement() {
  const [exhibitors, setExhibitors] = useState([]);
  const [events, setEvents] = useState([]);
  const [companyName, setCompanyName] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [eventId, setEventId] = useState("");
  const [editingId, setEditingId] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [updatingId, setUpdatingId] = useState("");
  const [loadError, setLoadError] = useState("");

  const role = localStorage.getItem("userRole");
  const isExhibitor = role === "exhibitor";
  const isOrganizer = role === "organizer" || role === "admin";
  const canView = isExhibitor || isOrganizer;

  useEffect(() => {
    if (!canView) return;

    const controller = new AbortController();

    async function loadInitialData() {
      try {
        const data = await fetchApplicationData(
          isExhibitor,
          controller.signal
        );

        if (controller.signal.aborted) return;

        setExhibitors(data.exhibitors);
        setEvents(data.events);
        setLoadError("");
      } catch {
        if (!controller.signal.aborted) {
          setLoadError("Unable to load data. Please try again.");
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    loadInitialData();

    return () => controller.abort();
  }, [canView, isExhibitor]);

  async function refreshData() {
    setLoading(true);
    setLoadError("");

    try {
      const data = await fetchApplicationData(isExhibitor);
      setExhibitors(data.exhibitors);
      setEvents(data.events);
    } catch {
      setLoadError("Unable to load data. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (saving || editingId) return;

    if (
      !companyName.trim() ||
      !category.trim() ||
      !description.trim() ||
      !eventId
    ) {
      toast.error("Please fill all fields.");
      return;
    }

    setSaving(true);

    try {
      await API.post("/exhibitors/register", {
        companyName: companyName.trim(),
        category: category.trim(),
        description: description.trim(),
        event: eventId,
      });

      toast.success("Application submitted successfully.");
      setCompanyName("");
      setCategory("");
      setDescription("");
      setEventId("");
      await refreshData();
    } catch (error) {
      toast.error(
        error.response?.data?.msg || "Unable to submit application."
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleStatus(id, status) {
    if (updatingId) return;

    setUpdatingId(id);

    try {
      const response = await API.put(`/exhibitors/status/${id}`, {
        status,
      });

      setExhibitors((previous) =>
        previous.map((item) =>
          item._id === id
            ? { ...item, status: response.data.updated.status }
            : item
        )
      );

      toast.success(response.data.msg);
    } catch (error) {
      toast.error(
        error.response?.data?.msg || "Unable to update application."
      );
    } finally {
      setUpdatingId("");
    }
  }

  async function handleProfileSaved() {
    setEditingId("");
    await refreshData();
  }

  if (!canView) {
    return (
      <p className="p-6">
        Open Search Exhibitors to browse participating companies.
        Exhibitor applications require an exhibitor account.
      </p>
    );
  }

  return (
    <div className="mx-auto w-full max-w-4xl space-y-6 p-4 md:p-6">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold">
          {isExhibitor ? "My Applications" : "Exhibitor Applications"}
        </h1>

        <Button
          variant="outline"
          onClick={refreshData}
          disabled={
            loading || saving || Boolean(editingId) || Boolean(updatingId)
          }
        >
          Refresh
        </Button>
      </div>

      {isExhibitor && (
        <Card>
          <CardHeader>
            <CardTitle>Apply for an Event</CardTitle>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit}>
              <fieldset
                disabled={
                  saving || loading || Boolean(loadError) || Boolean(editingId)
                }
                className="space-y-4"
              >
                <div className="space-y-2">
                  <Label htmlFor="company-name">Company Name</Label>
                  <Input
                    id="company-name"
                    value={companyName}
                    onChange={(event) => setCompanyName(event.target.value)}
                    maxLength={150}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="company-category">Category</Label>
                  <Input
                    id="company-category"
                    value={category}
                    onChange={(event) => setCategory(event.target.value)}
                    maxLength={100}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="company-description">
                    Company Description
                  </Label>
                  <textarea
                    id="company-description"
                    value={description}
                    onChange={(event) => setDescription(event.target.value)}
                    maxLength={2000}
                    rows={4}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="application-event">Event</Label>
                  <select
                    id="application-event"
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

                <Button type="submit" disabled={events.length === 0}>
                  {saving ? "Submitting..." : "Submit Application"}
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
        <p role="status">Loading applications...</p>
      ) : loadError ? (
        <p role="alert">{loadError}</p>
      ) : exhibitors.length === 0 ? (
        <p className="text-muted-foreground">No applications found.</p>
      ) : (
        <div className="space-y-4">
          {exhibitors.map((item) => (
            <Card key={item._id}>
              <CardContent className="space-y-4 p-4">
                <h2 className="break-words text-lg font-semibold">
                  {item.companyName}
                </h2>

                <p className="whitespace-pre-wrap break-words text-sm text-muted-foreground">
                  {item.description}
                </p>

                {item.products && (
                  <p className="whitespace-pre-wrap break-words text-sm">
                    Products / Services: {item.products}
                  </p>
                )}

                <div className="space-y-1 text-sm">
                  <p>Event: {item.event?.title || "Unavailable"}</p>
                  <p>Category: {item.category || "Not provided"}</p>
                  <p>Status: {item.status}</p>
                  <p>Booth: {item.boothNumber || "Not assigned"}</p>

                  {item.contactEmail && (
                    <p className="break-all">
                      Public Email: {item.contactEmail}
                    </p>
                  )}

                  {item.phone && <p>Public Phone: {item.phone}</p>}

                  {item.website && (
                    <p className="break-all">Website: {item.website}</p>
                  )}

                  {isOrganizer && (
                    <>
                      <p>Applicant: {item.contactPerson?.name}</p>
                      <p className="break-all">
                        Account Email: {item.contactPerson?.email}
                      </p>
                    </>
                  )}
                </div>

                <ExhibitorFiles
                  exhibitorId={item._id}
                  canUpload={isExhibitor}
                />

                <ExhibitorStaff
                  exhibitorId={item._id}
                  canEdit={isExhibitor && item.status === "Approved"}
                />

                {isExhibitor && item.status !== "Approved" && (
                  <p className="text-sm text-muted-foreground">
                    Staff editing becomes available after approval.
                  </p>
                )}

                <ExhibitorServices profile={item} />

                {isExhibitor && editingId !== item._id && (
                  <Button
                    variant="outline"
                    onClick={() => setEditingId(item._id)}
                    disabled={saving || Boolean(editingId)}
                  >
                    Edit Profile
                  </Button>
                )}

                {isExhibitor && editingId === item._id && (
                  <ExhibitorProfileForm
                    key={`${item._id}-${item.updatedAt}`}
                    profile={item}
                    onSaved={handleProfileSaved}
                    onCancel={() => setEditingId("")}
                  />
                )}

                {isOrganizer && item.status === "Pending" && (
                  <div className="flex gap-3">
                    <Button
                      onClick={() => handleStatus(item._id, "Approved")}
                      disabled={Boolean(updatingId)}
                    >
                      {updatingId === item._id ? "Updating..." : "Approve"}
                    </Button>

                    <Button
                      variant="destructive"
                      onClick={() => handleStatus(item._id, "Rejected")}
                      disabled={Boolean(updatingId)}
                    >
                      Reject
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}