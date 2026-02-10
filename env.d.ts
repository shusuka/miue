
declare global {
  // Use namespace augmentation for NodeJS to safely add API_KEY to process.env
  // without conflicting with existing global process declarations (e.g. from @types/node).
  namespace NodeJS {
    interface ProcessEnv {
      API_KEY: string;
      [key: string]: string | undefined;
    }
  }
}

export {};
