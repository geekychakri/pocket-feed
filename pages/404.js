import Link from "next/link";

function Custom404() {
  return (
    <div className="error-page">
      <img src="/img/404.svg" alt="" width="250" height="150" />
      <p className="error-page__text">
        <span className="error-page__text--main">
          An investigation is underway to find this missing page.
        </span>
        <span className="error-page__text--sub">
          Meanwhile you can read some interesting articles.
        </span>
      </p>

      <Link href="/">
        <a className="error-page__btn">Read Now</a>
      </Link>
    </div>
  );
}

export default Custom404;
