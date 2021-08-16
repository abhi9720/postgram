import "./sidebar.css";
import { AuthContext } from "../../context/AuthContext";
import React, { useContext, useEffect, useState } from "react";

import axios from "axios";
import { Link } from "react-router-dom";
import CancelIcon from "@material-ui/icons/Cancel";
import SearchIcon from "@material-ui/icons/Search";
import CloseFriend from "../closefriend/CloseFriend";
import { Button } from "@material-ui/core";
import ContentLoader from "react-content-loader";

const Sidebar = () => {
  const [allUsers, setAllUsers] = useState([]);
  const { user } = useContext(AuthContext);
  const [search, setSearch] = useState("");

  const [searched, setSearched] = useState([]);
  const [fetching, setfetching] = useState(false);
  // const searchResult = (search) => {
  // 	setSearched(allUsers.filter((u) => u.username.toLowerCase().startsWith(search.toLowerCase())));
  // };

  useEffect(() => {
    setSearched(
      allUsers.filter((u) =>
        u.username.toLowerCase().startsWith(search.toLowerCase())
      )
    );
  }, [search, allUsers]);

  useEffect(() => {
    const getAllUsers = async () => {
      try {
        setfetching(true);
        const userList = await axios.get("/user/all");
        setAllUsers(userList.data);
        setfetching(false);
      } catch (err) {
        console.log(err);
      }
    };
    getAllUsers();
  }, []);

  const handleClose = () => {
    setSearch("");
  };

  const Loader = () => {
    return (
      <div style={{ marginBottom: "30px" }}>
        <ContentLoader
          speed={2}
          width={183}
          height={60}
          viewBox="0 0 143 60"
          backgroundColor="#ddd9d9"
          foregroundColor="#bebbbb"
        >
          <rect x="48" y="8" rx="3" ry="3" width="120" height="8" />
          <rect x="48" y="26" rx="3" ry="3" width="52" height="8" />

          <circle cx="20" cy="20" r="20" />
        </ContentLoader>
      </div>
    );
  };

  return (
    <div className="sidebar">
      <div className="sidebarWrapper">
        <span className="searchContainer">
          <SearchIcon className="iconstyle" />
          <input
            type="search"
            name="search_txt"
            id="search_input"
            placeholder="Search friend ... "
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
            }}
          />
        </span>

        <ul className="sidebarFriendList">
          <div
            className="searchDisplay"
            style={{ display: search.length ? "flex" : "none" }}
          >
            <Button
              onClick={handleClose}
              className="cancelIcon"
              endIcon={<CancelIcon />}
            ></Button>

            {searched.length ? (
              searched.map(
                (u) =>
                  u._id !== user._id && (
                    <Link
                      className="friend_name"
                      key={u._id}
                      to={"/profile/" + u.username}
                      style={{ textDecoration: "none" }}
                      onClick={handleClose}
                    >
                      <CloseFriend key={u.id} user={u} />
                    </Link>
                  )
              )
            ) : (
              <span className="No_match">Not Match 🙄 </span>
            )}
          </div>
          <hr className="sidebarHr" />

          {fetching ? (
            <>
              <Loader />

              <Loader />
              <Loader />
              <Loader />
              <Loader />
              <Loader />
            </>
          ) : (
            <>
              {allUsers.map(
                (u) =>
                  user._id !== u._id && (
                    <Link
                      className="friend_name"
                      key={u._id}
                      to={"/profile/" + u.username}
                      style={{ textDecoration: "none" }}
                    >
                      <CloseFriend key={u._id} user={u} />
                    </Link>
                  )
              )}
            </>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
