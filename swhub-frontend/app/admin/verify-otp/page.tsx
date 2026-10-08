"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  verifyCustomerOtp,
  resendCustomerOtp,
} from "../../admin/services/api/customerAuth";

export default function VerifyOtpPage() {
  const router = useRouter();

  const [customerId, setCustomerId] =
    useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [countdown, setCountdown] =
    useState(60);

  useEffect(() => {
    const storedCustomerId =
      localStorage.getItem(
        "pending_customer_id"
      );

    const storedEmail =
      localStorage.getItem(
        "pending_customer_email"
      );

    if (!storedCustomerId || !storedEmail) {
      router.replace("/register");
      return;
    }

    setCustomerId(storedCustomerId);
    setEmail(storedEmail);
  }, [router]);

  useEffect(() => {
    if (countdown <= 0) return;

    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown]);

  async function handleVerify(
    e: React.FormEvent
  ) {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!customerId) {
      setError(
        "Verification session expired. Please register again."
      );
      return;
    }

    if (otp.length !== 6) {
      setError("Enter the 6-digit OTP");
      return;
    }

    try {
      setLoading(true);

      const result =
        await verifyCustomerOtp(
          Number(customerId),
          otp
        );

      if (!result.success) {
        throw new Error(
          result.message ||
          "OTP verification failed"
        );
      }

      const token =
        result.data?.token;

      const customer =
        result.data?.customer;

      if (!token) {
        throw new Error(
          "Verification successful but authentication token was not returned"
        );
      }

      localStorage.setItem(
        "customer_token",
        token
      );

      if (customer) {
        localStorage.setItem(
          "customer",
          JSON.stringify(customer)
        );
      }

      localStorage.removeItem(
        "pending_customer_id"
      );

      localStorage.removeItem(
        "pending_customer_email"
      );

      setSuccess(
        "Email verified successfully!"
      );

      setTimeout(() => {
        router.push("/");
      }, 500);

    } catch (error: any) {
      console.error(
        "OTP Verification Error:",
        error
      );

      setError(
        error?.response?.data?.message ||
        error?.message ||
        "Invalid OTP"
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleResend() {
    if (!customerId) return;

    setError("");
    setSuccess("");

    try {
      setResending(true);

      const result =
        await resendCustomerOtp(
          Number(customerId)
        );

      if (!result.success) {
        throw new Error(
          result.message ||
          "Unable to resend OTP"
        );
      }

      setSuccess(
        "A new OTP has been sent to your email."
      );

      setCountdown(60);

    } catch (error: any) {
      console.error(
        "Resend OTP Error:",
        error
      );

      setError(
        error?.response?.data?.message ||
        error?.message ||
        "Unable to resend OTP"
      );
    } finally {
      setResending(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-12">
      <div className="flex min-h-[80vh] items-center justify-center">

        <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-sm">

          <div className="text-center">

            <h1 className="text-3xl font-bold text-slate-600">
              Verify Your Email
            </h1>

            <p className="mt-3 text-slate-500">
              We sent a 6-digit verification code to
            </p>

            <p className="mt-1 font-semibold text-[#0EA5E9]">
              {email}
            </p>

          </div>

          {error && (
            <div className="mt-6 rounded-lg bg-red-600/10 p-3 text-center text-sm text-red-600">
              {error}
            </div>
          )}

          {success && (
            <div className="mt-6 rounded-lg bg-slate-50 p-3 text-center text-sm text-[#0EA5E9]">
              {success}
            </div>
          )}

          <form
            onSubmit={handleVerify}
            className="mt-8"
          >

            <label className="mb-2 block text-sm font-medium">
              Verification Code
            </label>

            <input
              type="text"
              inputMode="numeric"
              maxLength={6}
              value={otp}
              onChange={(e) =>
                setOtp(
                  e.target.value
                    .replace(/\D/g, "")
                    .slice(0, 6)
                )
              }
              placeholder="Enter 6-digit OTP"
              className="w-full rounded-lg border p-4 text-center text-2xl tracking-[0.5em] outline-none focus:border-[#0EA5E9]"
              required
            />

            <button
              type="submit"
              disabled={
                loading ||
                otp.length !== 6
              }
              className="mt-6 w-full rounded-lg bg-[#0EA5E9] py-3 font-semibold text-white transition hover:bg-slate-900 disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              {loading
                ? "Verifying..."
                : "Verify Email"}
            </button>

          </form>

          <div className="mt-6 text-center">

            {countdown > 0 ? (
              <p className="text-sm text-slate-500">
                Resend OTP in{" "}
                <span className="font-semibold">
                  {countdown}s
                </span>
              </p>
            ) : (
              <button
                type="button"
                onClick={handleResend}
                disabled={resending}
                className="text-sm font-semibold text-[#0EA5E9] hover:underline disabled:text-slate-400"
              >
                {resending
                  ? "Sending..."
                  : "Resend OTP"}
              </button>
            )}

          </div>

          <p className="mt-6 text-center text-sm text-slate-500">
            Wrong email?{" "}

            <Link
              href="/register"
              className="font-semibold text-[#0EA5E9]"
            >
              Register again
            </Link>
          </p>

        </div>

      </div>
    </main>
  );
}