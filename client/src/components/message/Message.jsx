import "./message.css";
import { format } from "timeago.js";
const Message = ({ Message, own, img }) => {
  return (
    <>
      <div className={own ? "message own" : "message"}>
        <div
          className="messageTop"
          style={
            own ? { flexDirection: "row-reverse" } : { flexDirection: "row" }
          }
        >
          <img
            className="messageImg"
            src={
              img
                ? img.replace(
                    "/upload",
                    "/upload/w_1000,h_1000,c_thumb,g_faces"
                  )
                : "../assets/person/noAvatar.png"
            }
            alt="failed to load resources"
          />
          <p className="messageText">{Message.text} </p>
        </div>

        <span className="messageBottom">{format(Message.createdAt)}</span>
      </div>
    </>
  );
};

export default Message;
