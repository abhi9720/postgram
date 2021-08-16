import "./profile.css";
import Topbar from "../../components/topbar/Topbar";
import Sidebar from "../../components/sidebar/Sidebar";
import Feed from "../../components/feed/Feed";
import Rightbar from "../../components/rightbar/Rightbar";
import React, { useContext, useEffect, useState } from "react";
import { useQuery } from "react-query";
import { Instagram } from "react-content-loader";
import axios from "axios";
import { useParams } from "react-router";
import { AuthContext } from "../../context/AuthContext";
import { CircularProgress, Button } from "@material-ui/core";
import { PhotoCamera, Done, TextsmsOutlined } from "@material-ui/icons";

import { Link } from "react-router-dom";
import { io } from "socket.io-client";
export default function Profile() {
  const [user, setUser] = useState({});
  const username = useParams().username;
  const { status } = useQuery(username, async () => {
    const res = await axios.get(`/user/?username=${username}`);
    setUser(res.data);
  });
  const { user: currentUser, dispatch } = useContext(AuthContext);

  const [followed, setFollowed] = useState(
    currentUser.followings.includes(user._id)
  );
  // const PF = process.env.REACT_APP_PUBLIC_FOLDER;

  const [isloading, setIsloading] = useState(false);
  const [isloading1, setIsloading1] = useState(false);
  const [upatingProfilePhoto, setUpdatingProfilePhoto] = useState(false);
  const [upatingCoverPhoto, setUpdatingCoverPhoto] = useState(false);

  const [profilePhoto, setProfilePhoto] = useState(null);
  const [coverpicture, setCoverpicture] = useState(null);
  const [isFriend, setIsFriend] = useState(false);
  const [isFriendRequestSent, setIsFriendRequestSent] = useState(false);

  const socket = React.useRef();

  // ftech user by username
  // useEffect(() => {
  //   const fetchUser = async () => {
  //     const res = await axios.get(`/user/?username=${username}`);
  //     setUser(res.data);
  //   };
  //   fetchUser();
  // }, [username]);

  // update user details

  useEffect(() => {
    // if there is no user in that it cause error so we use ? here
    setFollowed(currentUser.followings.includes(user?._id));
    setIsFriend(currentUser.friends.includes(user?._id));
    setIsFriendRequestSent(currentUser.pendingRequest.includes(user?._id));
  }, [currentUser, user]);

  // follow if not following
  const handleFollow = async () => {
    try {
      if (followed) {
        setIsloading(true);
        // setFollowers(followers - 1);
        const res = await axios.put(`/user/${user._id}/unfollow`, {
          userId: currentUser._id,
        });
        dispatch({ type: "UNFOLLOW", payload: user._id });

        setUser(res.data);
      } else {
        setIsloading(true);

        const res = await axios.put(`/user/${user._id}/follow`, {
          userId: currentUser._id,
        });
        dispatch({ type: "FOLLOW", payload: user._id });

        setUser(res.data);
      }
      setFollowed(!followed);
    } catch (err) {
    } finally {
      setIsloading(false);
    }
  };

  useEffect(() => {
    socket.current = io.connect(process.env.REACT_APP_End_Point);
    socket.current.emit("addUser", currentUser._id); // send request to server as user chnage and send my user id
    // so it add this userid and socket in user array
  }, [currentUser]);

  const addFriend = async () => {
    try {
      setIsloading1(true);

      await axios.put(`/user/${user._id}/addNewFriends`, {
        userId: currentUser._id,
      });
      setIsFriendRequestSent(true);
      dispatch({ type: "pendingRequest", payload: user?._id });
    } catch (err) {}

    socket.current.emit("sendFriendRequest", {
      senderId: currentUser?._id,
      receiverId: user?._id,
    });

    setIsloading1(false);
  };
  const unFriend = async () => {
    try {
      setIsloading1(true);

      const res = await axios.put(`/user/${user._id}/unfriend`, {
        userId: currentUser._id,
      });
      await axios.delete(`/conversation/delete/${user._id}/${currentUser._id}`);

      setIsFriend(false);
      dispatch({ type: "UNFRIEND", payload: res.data });
    } catch (err) {
    } finally {
      setIsloading1(false);
    }
  };

  useEffect(() => {
    const updateProfilePicture = async () => {
      try {
        setUpdatingProfilePhoto(true);
        const data = new FormData();

        data.append("file", profilePhoto);
        const updateddata = await axios.put(
          `/user/${user._id}/updateprofilepicture`,
          data
        );
        dispatch({ type: "Update_Profile_Pic", payload: updateddata.data });

        window.location.reload();
      } catch (err) {
      } finally {
        setUpdatingProfilePhoto(false);
        setProfilePhoto(null);
      }
    };

    if (profilePhoto) {
      updateProfilePicture();
    }
  }, [profilePhoto, dispatch, user]);

  useEffect(() => {
    const updateCoverPicture = async () => {
      try {
        setUpdatingCoverPhoto(true);
        const data = new FormData();

        data.append("file", coverpicture);
        const updateddata = await axios.put(
          `/user/${user._id}/updatecoverpicture`,
          data
        );
        dispatch({ type: "Update_Cover_Pic", payload: updateddata.data });

        window.location.reload();
      } catch (err) {
      } finally {
        setUpdatingCoverPhoto(false);
        setCoverpicture(null);
      }
    };

    if (coverpicture) {
      updateCoverPicture();
    }
  }, [coverpicture, dispatch, user]);

  const AcceptRequest = async () => {
    // here user is id of that user who send request
    // and  currentuser is who got friend request(will accept or reject )

    const res = await axios.put(`/user/${user._id}/acceptFriendRequest`, {
      userId: currentUser._id,
    });

    await axios.post("/conversation/", {
      senderId: user._id,
      receiverId: currentUser._id,
    });

    dispatch({ type: "AcceptFriendRequest", payload: res.data });
  };

  return (
    <>
      <Topbar />

      <div className="profile">
        <Sidebar />

        <div className="profileRight">
          {status === "loading" ? (
            <div>
              <Instagram color="#f11946" width="1200px" height="600px" />
            </div>
          ) : status === "error" ? (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                maxHeight: "90vh",
                flexDirection: "column",
                marginTop: "100px",
              }}
            >
              <h4>
                ERROR SOME INTERNAL ERROR OCCUR <br />
                <br /> CHECK YOUR INTERNET CONNECTIONS
              </h4>
              <Button
                variant="contained"
                color="secondary"
                size="large"
                style={{ position: "absolute", top: "50%" }}
                onClick={() => window.location.reload()}
              >
                RELOAD PAGE
              </Button>
            </div>
          ) : (
            <>
              <div className="profileRightTop">
                <div className="profileCover">
                  <div className="profileCoverImg">
                    {user.coverpicture ? (
                      <img src={user.coverpicture} alt="" />
                    ) : (
                      <div> </div>
                    )}
                    {user.username === currentUser.username && (
                      <button>
                        {upatingCoverPhoto ? (
                          <CircularProgress />
                        ) : (
                          <label
                            className="focus:outline-none px-2 py-2 hover:bg-gray-50 font-semibold rounded-lg bg-dark"
                            htmlFor="coverPhoto"
                          >
                            <PhotoCamera /> Update cover phtoto
                            <input
                              type="file"
                              id="coverPhoto"
                              accept=".png,.jpeg,.jpg"
                              onChange={(e) => {
                                setCoverpicture(e.target.files[0]);
                              }}
                              style={{ display: "none" }}
                            />
                          </label>
                        )}
                      </button>
                    )}
                  </div>
                  <div className="profileUserImg">
                    <img
                      src={
                        user.profilePicture
                          ? user.profilePicture.replace(
                              "/upload",
                              "/upload/w_1000,h_1000,c_thumb,g_faces"
                            )
                          : "../assets/person/noAvatar.png"
                      }
                      alt=""
                    />

                    {user.username === currentUser.username && (
                      <>
                        <div className={"uploadIcon"}>
                          {upatingProfilePhoto ? (
                            <CircularProgress className="upload_progress" />
                          ) : (
                            ""
                          )}
                          <label
                            htmlFor="profilePhoto"
                            disabled={upatingProfilePhoto}
                          >
                            <PhotoCamera style={{ fontSize: 59 }} />

                            <input
                              type="file"
                              id="profilePhoto"
                              accept=".png,.jpeg,.jpg"
                              onChange={(e) => {
                                setProfilePhoto(e.target.files[0]);
                              }}
                              style={{ display: "none" }}
                            />
                          </label>
                        </div>
                      </>
                    )}
                  </div>
                </div>
                <div className="profileInfo">
                  <h4 className="profileInfoName">{user.username} </h4>
                  {/* <span className="profileInfoDesc">{user.description}</span> */}
                </div>
                <div className="profileFollow">
                  <div className="followInfo">
                    <table>
                      <thead>
                        <tr>
                          <th>Post</th>
                          <th>followers</th>
                          <th>followings</th>
                        </tr>
                        <tr>
                          <td> {0} </td>
                          <td>{user?.followers?.length}</td>
                          <td> {user?.followings?.length} </td>
                        </tr>
                      </thead>
                    </table>
                  </div>

                  <div
                    className="btn_function"
                    style={
                      user.username !== currentUser.username
                        ? { width: "340px" }
                        : { width: "0px" }
                    }
                  >
                    <Link
                      to="/messenger"
                      style={
                        user.username !== currentUser.username
                          ? { display: "inline" }
                          : { display: "none" }
                      }
                    >
                      <Button variant="contained" color="secondary">
                        <TextsmsOutlined className="iconstyle" />
                      </Button>
                    </Link>

                    {user.username !== currentUser.username && (
                      <>
                        {currentUser.friendrequest.includes(user._id) ? (
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={AcceptRequest}
                          >
                            Accept request
                          </Button>
                        ) : isFriend ? (
                          <Button variant="contained" onClick={unFriend}>
                            Unfriend
                            {isloading1 && (
                              <CircularProgress color="primary" size="20px" />
                            )}
                          </Button>
                        ) : (
                          <Button
                            variant="contained"
                            onClick={addFriend}
                            disabled={isFriendRequestSent}
                          >
                            {isFriendRequestSent ? (
                              <>
                                Request Sent <Done />
                              </>
                            ) : (
                              "Add Friends"
                            )}
                            {isloading1 && (
                              <CircularProgress color="primary" size="20px" />
                            )}
                          </Button>
                        )}
                      </>
                    )}
                    {user.username !== currentUser.username && (
                      <Button
                        className="rightbarFollowButton"
                        onClick={handleFollow}
                      >
                        {followed ? "Unfollow" : "Follow"}
                        {isloading ? (
                          <CircularProgress color="primary" size="20px" />
                        ) : (
                          ""
                        )}
                      </Button>
                    )}
                  </div>
                </div>
              </div>
              <div className="profileRightBottom">
                <Feed username={user.username} />
                <Rightbar user={user} />
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
