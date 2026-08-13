import Link from "next/link";

export default function SiteHeader() {
  return (
    <header className="site-header">
      <div className="full-container header-inner">
        <Link href="/" className="brand">
          HiCode.Online

          😁😀😆🥰😍
        </Link>
        <nav>
          <Link href="/" className="nav-git-item">
            GitHub
          </Link>
          <Link href="/posts/" className="nav-git-item">
            Gitee
          </Link>
          <Link href="/posts/" className="nav-git-item">
            CNB
          </Link>
        </nav>
      </div>
    </header>
  );
}
