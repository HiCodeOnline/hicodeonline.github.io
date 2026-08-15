export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="">
        <p>
          © {new Date().getFullYear()} HiCode.Online · Under with Apache License 2.0 <span id="busuanzi_container_site_pv">访问量 <span id="busuanzi_value_site_pv"></span> 次</span>
        </p>
      </div>
    </footer>
  );
}
