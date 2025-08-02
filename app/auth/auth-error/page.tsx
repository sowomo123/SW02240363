export default function AuthErrorPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold mb-4" style={{ color: "#fff" }}>Authentication Error</h1>
      <p className="text-lg" style={{ color: "#fff" }}>
        There was a problem signing you in. Please try again or contact support.
      </p>
    </div>
  )
}