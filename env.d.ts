
// Fix: Use NodeJS namespace augmentation to define environment variables for process.env.
// This is the standard TypeScript approach and avoids "Cannot redeclare block-scoped variable 'process'"
// conflicts with existing global type definitions (e.g., from Vite or @types/node).
declare namespace NodeJS {
  interface ProcessEnv {
    readonly API_KEY: string;
  }
}
