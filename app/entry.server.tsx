import { RemixServer } from "@remix-run/react";
import { handleRequest, type EntryContext } from "@vercel/remix";
import * as Sentry from "@sentry/remix";
import { createTransport } from "@sentry/core";

function makeFetchTransport(options) {
  async function makeRequest(request) {
    const requestOptions = {
      body: request.body,
      method: "POST",
      referrerPolicy: "origin",
      headers: options.headers,
      ...options.fetchOptions,
    };
    //console.log("request options", options.url, request.body);

    return fetch(options.url, requestOptions).then((response) => {
      console.log("response", response.status);
      return {
        statusCode: response.status,
        headers: {
          "x-sentry-rate-limits": response.headers.get("X-Sentry-Rate-Limits"),
          "retry-after": response.headers.get("Retry-After"),
        },
      };
    });
  }

  return createTransport(options, makeRequest);
}

Sentry.init({
  dsn: process.env.VITE_SENTRY_DSN,
  transport: makeFetchTransport,
  sampleRate: 1.0,
  tracesSampleRate: 1,
  autoInstrumentRemix: true,
  //debug: true,
  enabled: true,
  beforeSend(event) {
    console.log("beforeSend", event.event_id);
    return event;
  },
});

export function handleError(error: Error, { request }: { request: Request }) {
  console.error("handleError", error);
  const transport = Sentry.getClient()?.getTransport();
  //console.log("transport", transport);
  if (transport) {
    const _transport = transport.send;

    transport.send = function (...args) {
      const evt = args[0][0];
      console.log("send", evt);
      return _transport(...args);
    };
  }
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
