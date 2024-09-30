import { RemixServer } from "@remix-run/react";
import { handleRequest, type EntryContext } from "@vercel/remix";
import * as Sentry from "@sentry/remix";

Sentry.init({
  dsn: process.env.VITE_SENTRY_DSN,
  debug: true,
});

export async function handleError(
  error: unknown,
  { request }: { request: LoaderFunctionArgs | ActionFunctionArgs }
) {
  console.log(
    "entry.server dsn",
    Sentry.getCurrentHub().getClient()?.getDsn(),
    process.env.VITE_SENTRY_DSN
  );
  console.log(
    "entry.server options",
    Sentry.getCurrentHub().getClient()?.getOptions()
  );

  console.error("entry.server", error instanceof Error, error);
  if (error instanceof Error) {
    await Sentry.captureRemixServerException(
      error,
      "remix.server",
      request,
      true
    );
  } else {
    Sentry.captureException(error);
  }
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
