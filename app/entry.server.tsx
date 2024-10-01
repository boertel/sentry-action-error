import { RemixServer } from "@remix-run/react";
import { handleRequest, type EntryContext } from "@vercel/remix";
import * as Sentry from "@sentry/remix";

Sentry.init({
  dsn: process.env.VITE_SENTRY_DSN,
  tracesSampleRate: 1,
  autoInstrumentRemix: true,
  //debug: true,
  enabled: true,
  beforeSend(event) {
    //console.log("beforeSend", event);
    return event;
  },
});

export function handleError(error: Error, { request }: { request: Request }) {
  Sentry.captureRemixServerException(error, "remix.server", request, true);
}

export default async function (
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext
) {
  const remixServer = <RemixServer context={remixContext} url={request.url} />;
  return handleRequest(
    request,
    responseStatusCode,
    responseHeaders,
    remixServer
  );
}
