import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
const Friends = ({ userId }) => {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const [user, setuser] = useState(null);

  useEffect(() => {
    const getuser = async () => {
      const res = await axios.get("/user/?userId=" + userId);
      setuser(res.data);
    };
    getuser();
  }, [userId]);

  return (
    <>
      <Link
        to={"/profile/" + user?.username}
        style={{ textDecoration: "none" }}
      >
        <div className="rightbarFollowing">
          <img
            src={
              user?.profilePicture
                ? user?.profilePicture
                : "../assets/person/noAvatar.png"
            }
            alt=""
            className="rightbarFollowingImg"
          />
          <span className="rightbarFollowingName">{user?.username}</span>
        </div>
      </Link>
    </>
  );
};

export default Friends;
