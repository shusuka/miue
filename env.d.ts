
declare global {
  /**
   * Define or augment the Process interface to include specific environment variables.
   * This ensures compatibility with existing global definitions that expect 'process' to be of type 'Process'.
   */
  interface Process {
    env: {
      API_KEY: string;
      [key: string]: string | undefined;
    };
  }

  /**
   * Declare the process global variable as type Process to resolve "Subsequent variable declarations must have the same type" errors.
   */
  var process: Process;
}

export {};
