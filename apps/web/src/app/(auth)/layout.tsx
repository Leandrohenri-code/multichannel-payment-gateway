export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
      style={{ background: '#080c14' }}
    >
      {/* Ambient glows */}
      <div className="absolute pointer-events-none" style={{
        width: 500, height: 500, top: '-15%', left: '-10%', borderRadius: '50%', filter: 'blur(80px)',
        background: 'radial-gradient(circle, rgba(6,182,212,0.2) 0%, transparent 70%)',
      }} />
      <div className="absolute pointer-events-none" style={{
        width: 400, height: 400, bottom: '-10%', right: '-5%', borderRadius: '50%', filter: 'blur(80px)',
        background: 'radial-gradient(circle, rgba(0,230,118,0.15) 0%, transparent 70%)',
      }} />

      <div className="relative z-10 w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-3"
            style={{ background: 'rgba(0,230,118,0.12)', border: '1px solid rgba(0,230,118,0.3)' }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"
                fill="#00e676" />
            </svg>
          </div>
          <span className="text-lg font-bold text-text">Gateway Pay</span>
        </div>
        {children}
      </div>
    </div>
  )
}
