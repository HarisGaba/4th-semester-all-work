import AuthLayout from '@/components/auth/AuthLayout';
import { useState } from "react";
import { Link } from "react-router-dom";
import API from "@/api/api";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Forget() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    if (loading) return;

    setLoading(true);
    setMessage("");
    setError("");

    try {
      const response = await API.post("/forget/verifyemail", {
        email: email.trim().toLowerCase(),
      });

      setMessage(response.data.msg);
    } catch (error) {
      setError(
        error.response?.data?.msg ||
          "Unable to request a reset link. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout title="Account recovery" description="Securely recover your EventSphere account.">
      <Card className="w-full border-0 shadow-none">
        <CardHeader>
          <CardTitle className="text-2xl">Forgot Password</CardTitle>
          <CardDescription>
            Enter your account email to request a password reset link.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-5">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="reset-email">Email</Label>
              <Input
                id="reset-email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                maxLength={254}
                disabled={loading}
                required
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full"
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </Button>
          </form>

          {message && (
            <div className="space-y-2 text-sm" role="status">
              <p>{message}</p>
              <p className="text-muted-foreground">
                The link expires in 15 minutes. Wait at least one
                minute before requesting another.
              </p>
            </div>
          )}

          {error && (
            <p className="text-sm text-destructive" role="alert">
              {error}
            </p>
          )}

          <Link
            to="/dashboard/login"
            className="block text-center text-sm underline underline-offset-4"
          >
            Back to Login
          </Link>
        </CardContent>
      </Card>
    </AuthLayout>
  );
}