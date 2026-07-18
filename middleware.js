import { next } from "@vercel/functions";

export const config = {
  matcher: "/(.*)",
};

export default function middleware(request) {
  const requestUrl = new URL(request.url);
  const requestHost = (request.headers.get("host") || requestUrl.hostname)
    .split(":")[0]
    .toLowerCase();

  if (requestHost === "coin-profit-calculator.vercel.app") {
    requestUrl.protocol = "https:";
    requestUrl.hostname = "profitcalc.tech";
    requestUrl.port = "";

    return new Response(null, {
      status: 308,
      headers: {
        Location: requestUrl.toString(),
        "Cache-Control": "public, max-age=3600",
      },
    });
  }

  return next();
}
