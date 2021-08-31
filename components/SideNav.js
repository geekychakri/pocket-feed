import Link from "next/link";
import { useRouter } from "next/router";

import { Blog } from "@styled-icons/fa-solid/Blog";
import { Twitter, Reddit, Youtube } from "@styled-icons/fa-brands";
import { Podcast } from "@styled-icons/fa-solid/Podcast";
import { News } from "@styled-icons/boxicons-regular/News";

function SideNav() {
  const router = useRouter();
  const category = router.query.category;

  return (
    <div className="sidenav">
      <ul className="sidenav__list">
        <li className="sidenav__item">
          <Link href="/feed/blog">
            <a
              className={`sidenav__link ${category === "blog" ? "active" : ""}`}
            >
              <Blog size={24} title="Blog" />
              <span className="u-mt1">Blog</span>
            </a>
          </Link>
        </li>
        <li className="sidenav__item">
          <Link href="/feed/twitter">
            <a
              className={`sidenav__link ${
                category === "twitter" ? "active" : ""
              }`}
            >
              <Twitter size={24} title="twitter" />
              <span className="u-mt1">Twitter</span>
            </a>
          </Link>
        </li>
        <li className="sidenav__item">
          <Link href="/feed/reddit">
            <a
              className={`sidenav__link ${
                category === "reddit" ? "active" : ""
              }`}
            >
              <Reddit size={24} />
              <span className="u-mt1">Reddit</span>
            </a>
          </Link>
        </li>
        <li className="sidenav__item">
          <Link href="/feed/podcast">
            <a
              className={`sidenav__link ${
                category === "podcast" ? "active" : ""
              }`}
            >
              <Podcast size={24} />
              <span className="u-mt1">Podcast</span>
            </a>
          </Link>
        </li>
        <li className="sidenav__item">
          <Link href="/feed/news">
            <a
              className={`sidenav__link ${category === "news" ? "active" : ""}`}
            >
              <News size={24} />
              <span className="u-mt1">News</span>
            </a>
          </Link>
        </li>
        <li className="sidenav__item">
          <Link href="/feed/youtube">
            <a
              className={`sidenav__link ${
                category === "youtube" ? "active" : ""
              }`}
            >
              <Youtube size={24} />
              <span className="u-mt1">YouTube</span>
            </a>
          </Link>
        </li>
      </ul>
    </div>
  );
}

export default SideNav;
