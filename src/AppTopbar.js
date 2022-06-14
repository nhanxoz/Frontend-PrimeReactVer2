import React from "react";
import { Link } from "react-router-dom";
import classNames from "classnames";
import logoutIcon from "./assets/logout.svg";
import Button from "react-bootstrap/Button";
import { AuthContext } from "./contexts/AuthContext";
import { useContext } from "react";
export const AppTopbar = (props) => {
  const {
    authState: {
      user: username ,
    },
    logoutUser,
  } = useContext(AuthContext);

  const logout = () => logoutUser();
  return (
    <div className="layout-topbar">
      {/* <Link to="/" className="layout-topbar-logo">
        <img
          src={
            props.layoutColorMode === "light"
              ? "assets/layout/images/logo-dark.svg"
              : "assets/layout/images/logo-white.svg"
          }
          alt="logo"
        />
        <span>Connect with SpringBoot</span>
      </Link> */}

      <button
        type="button"
        className="p-link  layout-menu-button layout-topbar-button"
        onClick={props.onToggleMenuClick}
      >
        <i className="pi pi-bars" />
      </button>

      <button
        type="button"
        className="p-link layout-topbar-menu-button layout-topbar-button"
        onClick={props.onMobileTopbarMenuClick}
      >
        <i className="pi pi-ellipsis-v" />
      </button>

      <ul
        className={classNames("layout-topbar-menu lg:flex origin-top", {
          "layout-topbar-menu-mobile-active": props.mobileTopbarMenuActive,
        })}
      >
        <li>
          <Button
            variant="secondary"
            className="font-weight-bolder text-white"
            onClick={logout}
          >
            <img
              src={logoutIcon}
              alt="logoutIcon"
              width="32"
              height="32"
              className="mr-2"
            />
            Logout
          </Button>
        </li>
        <li>
          <button
            className="p-link layout-topbar-button"
            onClick={props.onMobileSubTopbarMenuClick}
          >
            <i className="pi pi-cog" />
            <span>Settings</span>
          </button>
        </li>
        <li>
          <button
            className="p-link layout-topbar-button"
            onClick={props.onMobileSubTopbarMenuClick}
          >
            <i className="pi pi-user" />
            <span>Profile</span>
          </button>
        </li>
      </ul>
    </div>
  );
};
