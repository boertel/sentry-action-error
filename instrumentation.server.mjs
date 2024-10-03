import * as Sentry from "@sentry/remix";

Sentry.init({
    dsn: "https://a9845cc3e9421f92cdc027a9af33fd0c@o165962.ingest.us.sentry.io/4508042589503488",
    tracesSampleRate: 1,
    autoInstrumentRemix: true
})