import { useRouter } from "next/router";

import Navbar from "./Navbar";
import SideNav from "./SideNav";

function Layout({ children }) {
  const router = useRouter();

  // console.log(router.pathname);

  let sideNavComponent;
  switch (router.pathname) {
    case "/":
    case "/404":
      sideNavComponent = null;
      break;
    default:
      sideNavComponent = <SideNav />;
  }
  return (
    <div className="content">
      <Navbar />
      {sideNavComponent}
      {children}
    </div>
  );
}

export default Layout;
