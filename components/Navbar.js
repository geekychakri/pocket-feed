import { useState, useEffect, useRef, useContext } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

import { DeleteOutline } from "@styled-icons/material/DeleteOutline";
import { Delete } from "@styled-icons/material/Delete";
import { AddToList } from "@styled-icons/entypo/AddToList";
import { Darkreader } from "@styled-icons/simple-icons/Darkreader";
import { User } from "@styled-icons/boxicons-regular/User";
import { Logout } from "@styled-icons/material-rounded/Logout";

import { useUser } from "@auth0/nextjs-auth0";
import { DeleteContext } from "../contexts/DeleteContext";

function Navbar() {
  const { isActive, toggleActive } = useContext(DeleteContext);

  const [dropDown, setDropDown] = useState(false);

  const [isDarkMode, setDarkMode] = useState(false);

  const { user, error, isLoading } = useUser();

  console.log(user);

  const dropDownRef = useRef(null);

  const router = useRouter();

  const displayDropDown = () => {
    setDropDown((prevState) => !prevState);
  };

  const handleClickOutside = (e) => {
    if (dropDownRef.current && !dropDownRef.current.contains(e.target)) {
      setDropDown(false);
    }
  };

  const toggleDarkMode = () => {
    setDarkMode((prevMode) => !prevMode);
  };

  useEffect(() => {
    const html = document.documentElement;
    document.addEventListener("mousedown", handleClickOutside);
    isDarkMode ? html.classList.add("dark") : html.classList.remove("dark");
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDarkMode]);

  const Logo = () => (
    <Link href="/">
      <a className="navigation__logo">
        <img src="/logo.png" width="60" height="60" alt="logo" />
      </a>
    </Link>
  );

  const DropDown = () => {
    return (
      <div className="dropdown" ref={dropDownRef}>
        <div className="dropdown__header" onClick={displayDropDown}>
          <img
            src={user.picture}
            alt="profile-pic"
            className="dropdown__header-img"
            width="100%"
            height="100%"
          />
        </div>

        <div className={`dropdown__list ${dropDown ? "active" : ""}`}>
          <div className="dropdown__item">
            <span
              className="dropdown__link"
              onClick={() => {
                router.push("/account");
                setDropDown(false);
              }}
            >
              <User size={28} />
              <span className="dropdown__link-text">Account</span>
            </span>
          </div>

          <div className="dropdown__item">
            <a href="/api/auth/logout" className="dropdown__link">
              <Logout size={28} />
              <span className="dropdown__link-text">Logout</span>
            </a>
          </div>
        </div>
      </div>
    );
  };

  const AuthNav = () => (
    <nav className="navigation">
      <Logo />

      {router.pathname !== "/404" ? (
        <button
          className="navigation__dark-reader u-mr3"
          onClick={toggleDarkMode}
        >
          <Darkreader size={28} title="Dark Reader" />
        </button>
      ) : null}

      {router.pathname !== "/add" ? (
        <Link href="/add">
          <a className="navigation__add u-mr3" title="Add a feed">
            <AddToList size={28} />
          </a>
        </Link>
      ) : null}

      {router.pathname === "/feed/[category]" && (
        <button onClick={toggleActive} className="navigation__delete u-mr3">
          {isActive ? (
            <Delete size={32} title="Delete feed" />
          ) : (
            <DeleteOutline size={32} title="Delete feed" />
          )}
        </button>
      )}

      <DropDown />
    </nav>
  );

  if (isLoading) {
    return (
      <nav className="navigation">
        <Logo />
        <div className="spinner nav"></div>
      </nav>
    );
  }

  if (user) {
    return <AuthNav />;
  }

  return (
    <nav className="navigation">
      <Logo />
      <a href="/api/auth/login" className="navigation__login">
        <span className="navigation__login-text">LOGIN</span>
      </a>
      <a href="/api/auth/login" className="navigation__signup">
        <span className="navigation__signup-text">SIGN UP</span>
      </a>
    </nav>
  );
}

export default Navbar;
