import "./closefriend.css";
import Avatar from "@material-ui/core/Avatar";
const CloseFriend = ({ user }) => {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  return (
    <>
      <li key={user._id} className="sidebarFriend">
        <Avatar
          src={
            user.profilePicture.startsWith("https")
              ? user.profilePicture.replace(
                  "/upload",
                  "/upload/w_1000,h_1000,c_thumb,g_faces"
                )
              : PF + "person/noAvatar.png"
          }
          alt=""
          className="sidebarFriendImg"
        >
          {user.username[0].toUpperCase()}
        </Avatar>
        <span className="sidebarFriendName">{user.username}</span>
      </li>
    </>
  );
};

export default CloseFriend;
