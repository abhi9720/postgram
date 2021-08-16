import axios from "axios";
import { useEffect, useState } from "react";
import "./Chatonline.css";

export default function ChatOnline({
  onlineUsersId,
  currentId,
  setCurrentChat,
}) {
  const [friends, setFriends] = useState([]);
  const [onlineFriends, setOnlineFriends] = useState([]);
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;

  useEffect(() => {
    const getFriends = async () => {
      const res = await axios.get("/user/?userId=" + onlineUsersId);
      
      setFriends(res.data);
    };

    try {
      getFriends();
    } catch (err) {
      console.log(err);
    }
  }, [currentId, onlineUsersId]);

  useEffect(() => {
    setOnlineFriends(friends.filter((f) => onlineUsersId.includes(f._id)));
  }, [friends, onlineUsersId]);

  const handleClick = async (user) => {
    try {
      const res = await axios.get(
        `/conversation/find/${currentId}/${user._id}`
      );
      setCurrentChat(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="chatOnline">
      {onlineFriends.map((o) => (
        <div
          key={o._id + "online"}
          className="chatOnlineFriend"
          onClick={() => handleClick(o)}
        >
          <div className="chatOnlineImgContainer">
            <img
              className="chatOnlineImg"
              src={
                o?.profilePicture
                  ? o.profilePicture
                  : PF + "person/noAvatar.png"
              }
              alt=""
            />
            <div className="chatOnlineBadge"></div>
          </div>
          <span className="chatOnlineName">{o?.username}</span>
        </div>
      ))}
    </div>
  );
}
