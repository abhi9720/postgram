import React, { useEffect } from "react";
import "./rightbar.scss";
// import { Users } from '../../dummyData';
// import Online from '../online/Online';
import { useContext, useRef, useState } from "react";
import axios from "axios";
import LocationOnIcon from "@material-ui/icons/LocationOn";
import { AuthContext } from "../../context/AuthContext";
import Friends from "../friends/Friends";
import { Button } from "@material-ui/core";
import BusinessCenterIcon from "@material-ui/icons/BusinessCenter";
import FavoriteIcon from "@material-ui/icons/Favorite";
export default function Rightbar({ user }) {
  // const PF = process.env.REACT_APP_PUBLIC_FOLDER;

  const { user: currentUser } = useContext(AuthContext);

  const HomeRightbar = () => {
    return (
      <>
        <div className="birthdayContainer">
          <img className="birthdayImg" src={"assets/gift.png"} alt="" />
          <span className="birthdayText">
            <b>Abhishek and chaitanya</b> and <b>3 other friends</b> have a
            birhday today.
          </span>
        </div>
        <div className="rightbarAd">
          <p className="rightbarAd_text">Ad</p>
          <img className="rightbarAd_img" src="assets/ad.png" alt="" />
        </div>
      </>
    );
  };

  const ProfileRightbar = ({ user }) => {
    const [friends, setFriends] = useState([]);
    useEffect(() => {
      const getFriends = async () => {
        try {
          if (user && Object.entries(user).length) {
            const friendList = await axios.get("/user/?userId=" + user?._id);
            setFriends(friendList.data.friends);
          }
        } catch (err) {
          console.log(err);
        }
      };
      getFriends();
    }, [user]);
    const [isedit, setIsEdit] = useState(false);
    const info = useRef({ ...user });

    const saveInfo = async () => {
      setIsEdit(!isedit);
      if (isedit) {
        try {
          await axios.put(`/user/${info.current._id}`, info.current);
        } catch (err) {
          console.log(err);
        }
      }
    };

    const [text, setText] = useState(" Friends");
    const inputEvent = (event) => {
      info.current[event.target.id] = event.target.innerText;
    };

    const fetchFriend = () => {
      setText(" Friends");
      setFriends(user?.friends);
    };

    const fetchFollowers = () => {
      setText(" Followers");
      setFriends(user?.followers);
    };

    const fetchFollwings = () => {
      setText(" Followings");
      setFriends(user?.followings);
    };

    return (
      <div className="profile_status">
        <h4
          className="rightbarTitle"
          style={
            user.username !== currentUser.username
              ? { marginTop: "30px" }
              : { marginTop: "0px" }
          }
        >
          User Information
          {user.username === currentUser.username ? (
            isedit ? (
              <button onClick={saveInfo}> Save </button>
            ) : (
              <button onClick={saveInfo}>Edit </button>
            )
          ) : (
            ""
          )}
        </h4>
        <div className="rightbarInfo">
          <div key="city" className="rightbarInfoItem">
            <span className="rightbarInfoKey">
              {" "}
              <LocationOnIcon />
            </span>
            <span
              className="rightbarInfoValue"
              name="city"
              id="city"
              contentEditable={isedit}
              suppressContentEditableWarning={true}
              value={info.city}
              onBlur={inputEvent}
            >
              {user.city}
            </span>
          </div>

          <div key="from" className="rightbarInfoItem">
            <span className="rightbarInfoKey">
              <BusinessCenterIcon />
            </span>
            <span
              className="rightbarInfoValue"
              name="from"
              id="from"
              contentEditable={isedit}
              suppressContentEditableWarning={true}
              value={info.from}
              onBlur={inputEvent}
            >
              {user.from}
            </span>
          </div>
          <div key="relationships" className="rightbarInfoItem">
            <span className="rightbarInfoKey">
              <FavoriteIcon />
            </span>
            <span
              className="rightbarInfoValue"
              name="relationships"
              id="relationships"
              contentEditable={isedit}
              suppressContentEditableWarning={true}
              value={info.relationships}
              onBlur={inputEvent}
            >
              {info.current.relationships === 1
                ? "Single"
                : info.current.relationships === 2
                ? "married"
                : "N/A"}
            </span>
          </div>
        </div>

        {/* // users friend  */}

        <div className="rightbarconnections">
          <Button color="primary" onClick={fetchFriend}>
            friends
          </Button>
          <Button color="primary" onClick={fetchFollowers}>
            followers
          </Button>
          <Button color="primary" onClick={fetchFollwings}>
            followings
          </Button>
        </div>
        <div className="rightbarFollowings">
          <span> {"User" + text + "  ( " + friends?.length + " ) "}</span>
          <div className="rightbarFollowings_display">
            {friends?.map((id) => (
              <Friends key={id} userId={id} />
            ))}
          </div>
        </div>
      </div>
    );
  };
  return (
    <div className="rightbar">
      <div className="rightbarWrapper">
        {user ? (
          <ProfileRightbar key={user._id} user={user} />
        ) : (
          <HomeRightbar />
        )}
      </div>
    </div>
  );
}
