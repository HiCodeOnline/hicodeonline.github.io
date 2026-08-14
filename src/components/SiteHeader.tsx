import Link from "next/link";

export default function SiteHeader() {
  return (
    <header className="site-header">
      <div className="full-container header-inner">
        <Link href="/" className="brand">
          HiCode.Online
        </Link>
        <nav>
          {/* <Link href="https://gitee.com/LikeOrLove" target="__blank" className="nav-git-item">
            YouTube
          </Link>
          <Link href="https://cnb.cool/hicodeonline" target="__blank" className="nav-git-item">
            BiliBili
          </Link> */}
        </nav>
      </div>
    </header>
  );
}
