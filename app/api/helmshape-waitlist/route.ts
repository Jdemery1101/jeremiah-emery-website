import { env } from "cloudflare:workers";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as {
      email?: string;
      consent?: boolean;
      company?: string;
    };

    if (payload.company) {
      return Response.json({ ok: true }, { status: 201 });
    }

    const email = payload.email?.trim().toLowerCase() ?? "";
    if (!email || email.length > 254 || !emailPattern.test(email)) {
      return Response.json({ error: "Enter a valid email address." }, { status: 400 });
    }
    if (payload.consent !== true) {
      return Response.json({ error: "Please agree to receive the launch email." }, { status: 400 });
    }
    if (!env.DB) {
      return Response.json({ error: "The waitlist is temporarily unavailable." }, { status: 503 });
    }

    await env.DB.prepare(
      `INSERT INTO helmshape_waitlist (email, source)
       VALUES (?, ?)
       ON CONFLICT(email) DO NOTHING`
    ).bind(email, "website").run();

    return Response.json({ ok: true }, { status: 201 });
  } catch {
    return Response.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
