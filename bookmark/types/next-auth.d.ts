declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and `getCsrfToken`.
   * The `session` object is an object that contains the user's session information.
   */
  interface Session {
    user: {
      id: string
      name?: string | null
      email?: string | null
      image?: string | null
    }
  }
}
