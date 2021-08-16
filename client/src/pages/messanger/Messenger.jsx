import "./messenger.css";
import MessengerNavbar from "./MessengerNavbar";
import "../../../node_modules/bootstrap/dist/css/bootstrap.min.css";

import { io } from "socket.io-client";
import React, { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../../context/AuthContext";

import Conversation from "../../components/conversation/Conversation";
import axios from "axios";
import { Avatar, CircularProgress, Link } from "@material-ui/core";
import InsertEmoticonIcon from "@material-ui/icons/InsertEmoticon";
import Message from "../../components/message/Message";

const Messenger = () => {
  const { user: currentUser } = useContext(AuthContext);

  const [newMessage, setNewMessage] = useState();
  const [conversations, setConversations] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [otherSide, setotherSide] = useState(null);
  const [send, setSend] = useState(false);
  const socket = React.useRef();
  const scrollRef = useRef();
  const [messages, setMessages] = useState([]);
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  
  useEffect(() => {
    socket.current = io.connect(process.env.REACT_APP_End_Point);

    socket.current.emit("addUser", currentUser._id);
    socket.current.on("getMessage", (data) => {
      setArrivalMessage({
        sender: data.senderId,
        text: data.text,
        createdAt: Date.now(),
      });
    });
  }, [currentUser]); // i  am removing id from here

  useEffect(() => {
    arrivalMessage &&
      currentChat?.members.includes(arrivalMessage.sender) &&
      setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage, currentChat]);

  useEffect(() => {
    // so it add this userid and socket in user array
    socket.current.on("getUsers", (users) => {
      // getting latest user
      setOnlineUsers(
        currentUser.friends.filter((f) => users.some((u) => u.userId === f))
      );
    });
  }, [currentUser]); // as user change it send request to server

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!newMessage.length) {
      return;
    }
    // const receiverId = currentChat.members.find((member) => member !== currentUser._id);

    socket.current.emit("sendMessage", {
      senderId: currentUser._id,
      receiverId: otherSide?._id,
      text: newMessage,
    });

    // adding message in database

    const addNewMessage = {
      sender: currentUser._id,
      text: newMessage,
      conversationId: currentChat._id,
    };

    try {
      setSend(true);
      const res = await axios.post("/messages", addNewMessage);
      
      setMessages([...messages, res.data]);
      setNewMessage("");
    } catch (err) {
      console.log("Failed to send message check ur internet connection ");
    } finally {
      setSend(false);
    }
  };

  useEffect(() => {
    const getConversation = async () => {
      try {
        const res = await axios.get(`/conversation/${currentUser._id}`);
        setConversations(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getConversation();
  }, [currentUser]);

  useEffect(() => {
    const getMessages = async () => {
      try {
        const res = await axios.get("/messages/" + currentChat?._id);
        setMessages(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    getMessages();
  }, [currentChat]);

  useEffect(() => {
    scrollRef?.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const getUser = async () => {
      const friendId = currentChat.members.find((m) => m !== currentUser._id);
      try {
        const res = await axios("/user?userId=" + friendId);
        setotherSide(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    if (currentChat) {
      getUser();
    }
  }, [currentUser, currentChat]);

  return (
    <>
      <MessengerNavbar />

      <div className="messenger">
        <div className="sideBar">
          <div className="sideBarWrapper">
            <div className="sideBarSearch">
              {/* <div className="searchBarWrapper">
                <Search />
                <input type="text" placeholder="Search for a friend .  .  ." />
              </div> */}
            </div>
            <div className="usersList">
              {conversations.map((data) => {
                return (
                  <div key={data._id} onClick={() => setCurrentChat(data)}>
                    <Conversation
                      key={data._id}
                      conversation={data}
                      currentuser={currentUser}
                      Online={onlineUsers}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="chatBody">
          <div className="chatBoxWrapper">
            {currentChat ? (
              <>
                <div className="chat_header">
                  <Link
                    className="otherside_username"
                    to={"/profile/" + otherSide?.username}
                  >
                    <Avatar src={otherSide?.profilePicture} />
                    <div className="chat_headerInfo">
                      <h5 className="chat-room-name">{otherSide?.username}</h5>
                    </div>
                  </Link>
                  {/* <div className="chat_headerRight">
										<IconButton>
											<SearchOutlined style={{ color: 'white' }} />
										</IconButton>

										<IconButton>
											<MoreVert style={{ color: 'white' }} />
										</IconButton>
									</div> */}
                </div>

                <div className="chat_body">
                  {messages.map((m) => (
                    <div key={m._id} ref={scrollRef}>
                      <Message
                        Message={m}
                        own={m.sender === currentUser._id ? true : false}
                        img={
                          m.sender === currentUser._id
                            ? currentUser.profilePicture
                            : otherSide?.profilePicture
                        }
                      />
                    </div>
                  ))}
                </div>
                <div className="chat_footer">
                  <InsertEmoticonIcon />
                  <form onSubmit={submitHandler}>
                    <input
                      type="text"
                      placeholder="Type a message"
                      onChange={(e) => setNewMessage(e.target.value)}
                      value={newMessage}
                    />
                    <button type="submit">Send a Message</button>
                  </form>
                  <small className="loader">
                    {send ? (
                      <CircularProgress color="primary" size="24px" />
                    ) : (
                      " "
                    )}
                  </small>
                </div>
              </>
            ) : (
              <>
                <div className="no_conversation">
                  <img
                    src={"/assets/person/NoConversation.png"}
                    alt="failed to load"
                  />
                  <span>Open a new Conversation </span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Messenger;
