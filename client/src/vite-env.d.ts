/// <reference types="vite/client" />

interface ImportMetaEnv {
  // Add other environment variables as needed
  readonly VITE_API_BASE_URL: string;
  readonly VITE_ADMIN_ID: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
