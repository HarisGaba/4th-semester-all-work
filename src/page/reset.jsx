import AuthLayout from '@/components/auth/AuthLayout';
import { useState } from "react";
import {
  Link,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "react-toastify";
import API, { clearAuth } from "@/api/api";
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

export default function Reset() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const token = searchParams.get("token") || "";
  const validToken = /^[a-f0-9]{64}$/.test(token);

  async function handleSubmit(e) {
    e.preventDefault();

    if (loading) return;

    setError("");

    if (
      password.length < 8 ||
      new TextEncoder().encode(password).length > 72 ||
      !/\S/.test(password)
    ) {
      setError(
        "Password must be at least 8 characters and at most 72 bytes."
      );
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const response = await API.post("/forget/resetPassword", {
        token,
        password,
      });

      clearAuth();
      toast.success(response.data.msg);
      navigate("/dashboard/login", { replace: true });
    } catch (error) {
      setError(
        error.response?.data?.msg ||
          "Unable to reset password. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout title="Account recovery" description="Securely recover your EventSphere account.">
      <Card className="w-full border-0 shadow-none">
        <CardHeader>
          <CardTitle className="text-2xl">Reset Password</CardTitle>
          <CardDescription>
            Choose a new password for your account.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-5">
          {!validToken ? (
            <>
              <p className="text-sm" role="alert">
                This reset link is invalid. Request a new link to continue.
              </p>

              <Link
                to="/dashboard/forget-password"
                className="block text-center text-sm underline underline-offset-4"
              >
                Request a Reset Link
              </Link>
            </>
          ) : (
            <>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="new-password">New Password</Label>

                  <div className="relative">
                    <Input
                      id="new-password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      minLength={8}
                      disabled={loading}
                      className="pr-12"
                      aria-describedby="new-password-help"
                      required
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword((value) => !value)}
                      aria-label={
                        showPassword ? "Hide passwords" : "Show passwords"
                      }
                      aria-pressed={showPassword}
                      disabled={loading}
                      className="absolute inset-y-0 right-0 flex w-11 items-center justify-center rounded-r-md focus-visible:outline-2 focus-visible:outline-ring"
                    >
                      {showPassword ? (
                        <EyeOff className="size-4" />
                      ) : (
                        <Eye className="size-4" />
                      )}
                    </button>
                  </div>

                  <p
                    id="new-password-help"
                    className="text-sm text-muted-foreground"
                  >
                    Use at least 8 characters.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirm-new-password">
                    Confirm Password
                  </Label>
                  <Input
                    id="confirm-new-password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    minLength={8}
                    disabled={loading}
                    required
                  />
                </div>

                {error && (
                  <p className="text-sm text-destructive" role="alert">
                    {error}
                  </p>
                )}

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full"
                >
                  {loading ? "Updating..." : "Reset Password"}
                </Button>
              </form>

              <Link
                to="/dashboard/forget-password"
                className="block text-center text-sm underline underline-offset-4"
              >
                Request a New Link
              </Link>
            </>
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