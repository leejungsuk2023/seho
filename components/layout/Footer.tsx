export function Footer() {
  return (
    <footer className="mt-32 bg-background-dark text-white">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-12 px-6 py-16 md:flex-row md:px-10 md:py-20">
        {/* Brand Section */}
        <div className="flex-1 space-y-6 animate-fade-in-up">
          <div className="text-3xl font-display font-bold tracking-tight">Ch0435</div>
          <p className="text-sm leading-relaxed text-white/70 max-w-md">
            세 개의 독립된 공간에서 이야기를 나누는 문화 플랫폼.
            <br />
            당신의 감각과 생각을 이곳에서 공유하세요.
          </p>
        </div>

        {/* Links Section */}
        <div className="flex flex-1 flex-col gap-8 md:flex-row md:gap-20 animate-fade-in-up">
          <div className="space-y-4">
            <h4 className="text-xs font-semibold uppercase tracking-widest text-white/50">
              Spaces
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <a
                  href="/on-air"
                  className="text-white/80 transition-all duration-300 hover:text-white hover:translate-x-1 inline-block"
                >
                  On Air
                </a>
              </li>
              <li>
                <a
                  href="/blogs/studio-cpa"
                  className="text-white/80 transition-all duration-300 hover:text-white hover:translate-x-1 inline-block"
                >
                  Studio CPA
                </a>
              </li>
              <li>
                <a
                  href="/blogs/swing-company"
                  className="text-white/80 transition-all duration-300 hover:text-white hover:translate-x-1 inline-block"
                >
                  Swing Company
                </a>
              </li>
              <li>
                <a
                  href="/blogs/serein-cafe"
                  className="text-white/80 transition-all duration-300 hover:text-white hover:translate-x-1 inline-block"
                >
                  Serein Cafe
                </a>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-xs font-semibold uppercase tracking-widest text-white/50">
              Connect
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/80 transition-all duration-300 hover:text-white hover:translate-x-1 inline-block"
                >
                  GitHub
                </a>
              </li>
              <li>
                <a
                  href="mailto:contact@ch0435.com"
                  className="text-white/80 transition-all duration-300 hover:text-white hover:translate-x-1 inline-block"
                >
                  contact@ch0435.com
                </a>
              </li>
              <li>
                <a
                  href="/about"
                  className="text-white/80 transition-all duration-300 hover:text-white hover:translate-x-1 inline-block"
                >
                  About
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-white/10 py-6 text-center">
        <p className="text-xs text-white/50 tracking-wide">
          © 2025 Ch0435 Collective. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
