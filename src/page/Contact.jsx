import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Contact() {
  const loggedIn = Boolean(localStorage.getItem("token"));
  const role = localStorage.getItem("userRole");

  const canMessage =
    !loggedIn ||
    ["organizer", "attendee", "exhibitor"].includes(role);

  return (
    <div className="mx-auto w-full max-w-4xl space-y-6 p-4 md:p-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold">Contact & Support</h1>
        <p className="text-sm text-muted-foreground">
          Get help with your event participation, applications,
          booth reservations or session schedule.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Feedback & Support</CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Submit feedback or report a problem. Open the Feedback
              page to view your request status and any response.
            </p>

            <Button asChild>
              <Link
                to={loggedIn ? "/feedback" : "/dashboard/login"}
                state={loggedIn ? undefined : { from: "/feedback" }}
              >
                {loggedIn ? "Open Feedback" : "Login for Support"}
              </Link>
            </Button>
          </CardContent>
        </Card>

        {canMessage && (
          <Card>
            <CardHeader>
              <CardTitle>Event Messages</CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Attendees and exhibitor applicants can contact their
                event organizer. Organizers can open conversations
                and reply to participant questions.
              </p>

              <Button asChild variant="outline">
                <Link
                  to={loggedIn ? "/messages" : "/dashboard/login"}
                  state={loggedIn ? undefined : { from: "/messages" }}
                >
                  {loggedIn ? "Open Messages" : "Login to Message"}
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Before Contacting the Organizer</CardTitle>
        </CardHeader>

        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <p>
            Check your application status and assigned booth on
            My Applications.
          </p>
          <p>
            Load the latest session schedule to check session times
            and locations.
          </p>
          <p>
            Include the event name and relevant details when
            submitting a support request.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}