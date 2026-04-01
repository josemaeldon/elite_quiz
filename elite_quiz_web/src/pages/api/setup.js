import fs from "fs";
import path from "path";

const RUNTIME_ENV_PATH = "/var/lib/elite_quiz_web/.env.runtime";

export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { NEXT_PUBLIC_BASE_URL } = req.body || {};

  if (!NEXT_PUBLIC_BASE_URL || !NEXT_PUBLIC_BASE_URL.trim()) {
    return res.status(400).json({ error: "NEXT_PUBLIC_BASE_URL is required" });
  }

  // Basic URL validation
  try {
    new URL(NEXT_PUBLIC_BASE_URL.trim());
  } catch {
    return res.status(400).json({ error: "NEXT_PUBLIC_BASE_URL must be a valid URL" });
  }

  try {
    fs.mkdirSync(path.dirname(RUNTIME_ENV_PATH), { recursive: true, mode: 0o700 });
    const content = `NEXT_PUBLIC_BASE_URL=${NEXT_PUBLIC_BASE_URL.trim()}\n`;
    fs.writeFileSync(RUNTIME_ENV_PATH, content, { mode: 0o600 });
    return res.status(200).json({
      success: true,
      message: "Configuration saved. Restart the service to apply changes.",
    });
  } catch (err) {
    return res.status(500).json({ error: `Failed to write config: ${err.message}` });
  }
}
