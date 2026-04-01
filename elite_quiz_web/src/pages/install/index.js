import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";

const InstallPage = () => {
  const router = useRouter();
  const [baseUrl, setBaseUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState(null);
  const [alreadyConfigured, setAlreadyConfigured] = useState(false);

  useEffect(() => {
    // If already configured, redirect to home
    fetch("/api/setup-status")
      .then((r) => r.json())
      .then((data) => {
        if (data.configured) {
          setAlreadyConfigured(true);
          router.replace("/");
        }
      })
      .catch(() => {});
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage(null);

    try {
      const res = await fetch("/api/setup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ NEXT_PUBLIC_BASE_URL: baseUrl }),
      });
      const data = await res.json();

      if (res.ok) {
        setMessage({ type: "success", text: data.message });
      } else {
        setMessage({ type: "error", text: data.error || "Unknown error" });
      }
    } catch (err) {
      setMessage({ type: "error", text: "Failed to connect to the server." });
    } finally {
      setSubmitting(false);
    }
  };

  if (alreadyConfigured) {
    return null;
  }

  return (
    <>
      <Head>
        <title>Elite Quiz – Web Setup</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
        <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
              Elite Quiz – Web Setup
            </h1>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Configure the connection to your Elite Quiz backend.
            </p>
          </div>

          {message && (
            <div
              className={`mb-4 rounded-lg px-4 py-3 text-sm ${
                message.type === "success"
                  ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                  : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
              }`}
            >
              {message.text}
              {message.type === "success" && (
                <p className="mt-2 font-semibold">
                  Please restart the container to apply the new configuration.
                </p>
              )}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="baseUrl"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Backend API URL <span className="text-red-500">*</span>
              </label>
              <input
                id="baseUrl"
                type="url"
                required
                value={baseUrl}
                onChange={(e) => setBaseUrl(e.target.value)}
                placeholder="https://admin.example.com"
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="mt-1 text-xs text-gray-400">
                The URL of your Elite Quiz admin panel (e.g.{" "}
                <code>https://admin.example.com</code>). This is stored in{" "}
                <code>NEXT_PUBLIC_BASE_URL</code>.
              </p>
            </div>

            <button
              type="submit"
              disabled={submitting || message?.type === "success"}
              className="w-full rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold py-2 px-4 text-sm transition-colors"
            >
              {submitting ? "Saving…" : "Save Configuration"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default InstallPage;
