import "./topbar.css";
import React, { useRef } from "react";
import { Person, Chat, ExitToApp, Home } from "@material-ui/icons";
import TimelineIcon from "@material-ui/icons/Timeline";
import { NavLink } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import Avatar from "@material-ui/core/Avatar";
import { io } from "socket.io-client";
import FriendRequest from "../FriendRequest/FriendRequest";

import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";

const Topbar = () => {
  const { user, dispatch } = useContext(AuthContext);
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const socket = React.useRef();

  const [friendRequest, setFriendRequest] = useState([]);
  useEffect(() => {
    setFriendRequest([...user?.friendrequest]);
  }, [user]);

  useEffect(() => {
    socket.current = io.connect(process.env.REACT_APP_End_Point);

    socket.current.on("getFriendRequest", (data) => {
      setFriendRequest((prev) => {
        return [...prev, data.senderId];
      });
      dispatch({ type: "FriendRequest", payload: friendRequest });
    });
  }, [dispatch, friendRequest]);
  // console.log(user);
  // console.log(user?.friendrequest.length);
  useEffect(() => {
    socket.current.emit("addUser", user._id);
  });

  const logout = () => {
    try {
      dispatch({ type: "LOGOUT_SUCCESS", payload: null });
    } catch (err) {
      console.log(err);
    }
  };
  const [state, setState] = useState(false);
  const [dropdownMenu, setdropdownMenu] = useState(false);
  const inputRef = useRef();

  const showFriendRequest = () => {
    setState(!state);
    setdropdownMenu(!dropdownMenu);

    inputRef.current.focus();
  };

  return (
    <>
      <AppBar position="sticky">
        <Toolbar>
          <div className="topbarLeft">
            <NavLink to="/" style={{ textDecoration: "none" }}>
              <span className="logo">Postgram</span>
            </NavLink>
          </div>
          <div className="topbarCenter">
            <NavLink to="/" style={{ color: "white", textDecoration: "none" }}>
              <span className="topbarNavLink">
                <Home style={{ fontSize: 30 }} />
              </span>
            </NavLink>
            <NavLink
              to="/feeds"
              style={{ color: "white", textDecoration: "none" }}
            >
              <span className="topbarNavLink">
                <TimelineIcon style={{ fontSize: 30 }} />{" "}
              </span>
            </NavLink>

            <div className="topbarIconItem">
              <IconButton aria-label="delete">
                <NavLink to="/messenger">
                  <Chat className="iconstyle" style={{ color: "white" }} />
                </NavLink>
              </IconButton>

              {/* <span className="topbarIconBadge">2</span> */}
            </div>
          </div>
          <div className="topbarRight">
            <div className="topbarIcons">
              <div className="topbarIconItem">
                <Tooltip title="Friend Request">
                  <IconButton aria-label="delete" onClick={showFriendRequest}>
                    <Person className="iconstyle" style={{ color: "white" }} />
                    <span className="topbarIconBadge">
                      {friendRequest?.length}{" "}
                    </span>
                  </IconButton>
                </Tooltip>
              </div>
              <div tabIndex="-1" ref={inputRef}>
                <div className="corner"></div>
                {dropdownMenu && (
                  <div className="displayFriendRequest">
                    {friendRequest.length ? (
                      friendRequest.map((u) => <FriendRequest key={u} id={u} />)
                    ) : (
                      <p className="norequest">No Friend's Request 😋 </p>
                    )}
                  </div>
                )}
              </div>
              <NavLink to={`/profile/${user.username}`}>
                <Avatar
                  alt={user.username}
                  src={
                    user.profilePicture
                      ? user.profilePicture
                      : PF + "person/noAvatar.png"
                  }
                />
              </NavLink>
            </div>

            <span className="logout">
              <NavLink to="/login" onClick={logout}>
                logout <ExitToApp />
              </NavLink>
            </span>
          </div>
        </Toolbar>
      </AppBar>
    </>
  );
};

export default Topbar;
