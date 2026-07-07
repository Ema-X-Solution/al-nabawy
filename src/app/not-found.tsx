export default function NotFound() {
  return (
    <html lang="en">
      <body>
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: 'sans-serif' }}>
          <h1 style={{ fontSize: '3rem', marginBottom: '1rem', color: '#1F2937' }}>404</h1>
          <p style={{ fontSize: '1.2rem', marginBottom: '2rem', color: '#6B7280' }}>This page could not be found.</p>
          <a href="/en" style={{ padding: '0.75rem 1.5rem', background: '#169DF7', color: 'white', textDecoration: 'none', borderRadius: '9999px', fontWeight: 'bold' }}>
            Return Home
          </a>
        </div>
      </body>
    </html>
  )
}
