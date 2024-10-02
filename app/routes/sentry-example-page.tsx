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

export async function action() {
  console.log(
    await fetch(
      `https://o165962.ingest.us.sentry.io/api/4508042589503488/envelope/?sentry_key=a9845cc3e9421f92cdc027a9af33fd0c&sentry_version=7&sentry_client=sentry.javascript.remix%2F8.32.0`,
      { method: "POST" }
    )
  );
  throw new Error("Sentry Error");
}
