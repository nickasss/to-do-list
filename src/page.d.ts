declare module 'page' {
  interface Page {
    (path: string, callback: () => void): void;
    (path: string, ...callbacks: Array<() => void>): void;
    start(): void;
    redirect(path: string): void;
  }

  const page: Page;
  export default page;
}
