/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_CORAL_API_KEY: string
  readonly VITE_ELEVENLABS_API_KEY: string
  readonly VITE_AIMLAPI_API_KEY: string
  readonly VITE_AWS_ACCESS_KEY_ID: string
  readonly VITE_AWS_SECRET_ACCESS_KEY: string
  readonly VITE_AWS_REGION: string
  readonly VITE_SOLANA_RPC_URL: string
  readonly VITE_SOLANA_PRIVATE_KEY: string
  readonly VITE_TWILIO_ACCOUNT_SID: string
  readonly VITE_TWILIO_AUTH_TOKEN: string
  readonly VITE_OPENAI_API_KEY: string
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
