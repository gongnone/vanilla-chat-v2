import {} from 'hono'

declare module 'hono' {
  interface ContextRenderer {
    (content: string | Promise<string>, props?: { title?: string }): Response
  }

  interface Env {
    AI_GATEWAY_NAME?: string
  }
}
