import * as Sentry from "@sentry/remix";
import { useLoaderData } from "@remix-run/react";

export function loader() {
  const dsn = Sentry.getCurrentHub().getClient()?.getDsn();
  return {
    dsn: process.env.VITE_SENTRY_DSN,
    fromHub: dsn,
  };
}

export default function SentryExamplePage() {
  //console.log(useLoaderData());
  return (
    <div>
      <main
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <form method="post">
          <button
            style={{
              padding: "12px",
              cursor: "pointer",
              backgroundColor: "#AD6CAA",
              borderRadius: "4px",
              border: "none",
              color: "white",
              fontSize: "14px",
              margin: "18px",
            }}
          >
            Throw error in the action!
          </button>
        </form>

        <button
          type="button"
          style={{
            padding: "12px",
            cursor: "pointer",
            backgroundColor: "#AD6CAA",
            borderRadius: "4px",
            border: "none",
            color: "white",
            fontSize: "14px",
            margin: "18px",
          }}
          onClick={() => {
            throw new Error("Sentry Example Frontend Error");
          }}
        >
          Throw error on the client!
        </button>
      </main>
    </div>
  );
}

export function action() {
  const transport = Sentry.getClient()?.getTransport()
  if (transport) {
  const ogTransportSend = transport.send;
  console.log(ogTransportSend)
    
    transport.send = function (...args) {
      console.log("ogTransportSend", JSON.stringify(args, null, 2));
      return ogTransportSend(...args);
    };
  }
  
  //console.log(Sentry.getClient());
  Sentry.captureMessage("hello from remix");
  //throw new Error("Sentry Error");
}
