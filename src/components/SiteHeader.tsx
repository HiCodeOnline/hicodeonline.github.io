import Link from "next/link";

export default function SiteHeader() {
  return (
    <header className="site-header">
      <div className="full-container header-inner">
        <Link href="/" className="brand">
          HiCode.Online
        </Link>
        <nav>
          <Link href="/">
            GitHub
          </Link>
          <Link href="/posts/">
            CNB
          </Link>
        </nav>
      </div>
    </header>
  );
}
