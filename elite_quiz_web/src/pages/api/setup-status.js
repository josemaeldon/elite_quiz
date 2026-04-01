import fs from "fs";

const RUNTIME_ENV_PATH = "/var/lib/elite_quiz_web/.env.runtime";

export default function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    if (fs.existsSync(RUNTIME_ENV_PATH)) {
      const content = fs.readFileSync(RUNTIME_ENV_PATH, "utf8");
      const match = content.match(/^NEXT_PUBLIC_BASE_URL=(.+)$/m);
      const value = match ? match[1].trim() : "";
      return res.status(200).json({ configured: value.length > 0 });
    }
    return res.status(200).json({ configured: false });
  } catch {
    return res.status(200).json({ configured: false });
  }
}
