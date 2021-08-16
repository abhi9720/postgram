import React, { useContext, useEffect, useState } from "react";
import { Button, Avatar } from "@material-ui/core";
import { Link } from "react-router-dom";
import axios from "axios";
import "./friendRequest.css";
import { AuthContext } from "../../context/AuthContext";

const FriendRequest = ({ id }) => {
  // get user by id
  const [loading, setIsloading] = useState(false);

  const [user, setuser] = useState(null);
  const { user: currentUser, dispatch } = useContext(AuthContext);
  useEffect(() => {
    const getuser = async () => {
      const res = await axios.get("/user/?userId=" + id);
      setuser(res.data);

      // here we will update user state
    };
    setIsloading(true);
    getuser();
    setIsloading(false);
  }, [id]);

  const AcceptRequest = async () => {
    // here user is id of that user who send request
    // and  currentuser is whi got friend request(will accept or reject )

    const res = await axios.put(`/user/${user?._id}/acceptFriendRequest`, {
      userId: currentUser._id,
    });

    await axios.post("/conversation/", {
      senderId: user._id,
      receiverId: currentUser._id,
    });

    dispatch({ type: "AcceptFriendRequest", payload: res.data });
  };
  const rejectFriendRequest = async () => {
    alert("Rejecting  request ");
    const res = await axios.put(`/user/${user._id}/rejectrequest`, {
      userId: currentUser._id,
    });
    console.log(res.data);
    alert("gettting response of rejected ");
    dispatch({ type: "RejectFriendRequest", payload: res.data });
  };

  return (
    <>
      <Link
        to={"/profile/" + user?.username}
        className="friendrequest"
        style={{ textDecoration: "none" }}
      >
        <div className="friendrequestuserInfo">
          <Avatar
            src={
              user?.profilePicture
                ? user.profilePicture
                : "assets/person/noAvatar.png"
            }
            alt={user?.username}
            className="friendrequestImg"
          />
          <span className="friendrequestName">{user?.username}</span>
        </div>
        <div className="friendRequestAccept">
          {loading ? (
            <div> loading ... </div>
          ) : (
            <>
              <Button color="secondary" onClick={rejectFriendRequest}>
                Reject
              </Button>
              <Button color="primary" onClick={AcceptRequest}>
                Accept
              </Button>
            </>
          )}
        </div>
      </Link>
    </>
  );
};

export default FriendRequest;
