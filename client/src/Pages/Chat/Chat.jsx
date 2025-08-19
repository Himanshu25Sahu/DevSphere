import React, { useEffect, useRef, useState } from "react";
import "./Chat.css";
import { useSelector } from "react-redux";
import axios from "axios";
import ChatBox from "./Chat Components/Chatbox";
import Conversation from "./Chat Components/Conversation";
import { io } from "socket.io-client";
import { FaPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { HiUserGroup } from "react-icons/hi";
import Loader from "../../components/Loader/Loader";
import toast from "react-hot-toast";

const Chat = () => {
  const [chats, setChats] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [sendMessage, setSendMessage] = useState(null);
  const [receiveMessage, setReceiveMessage] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMobileView, setIsMobileView] = useState(window.innerWidth <= 768);
  const navigate = useNavigate();
  const socket = useRef();
  const { userData, loading: authLoading } = useSelector((state) => state.user);

  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth <= 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!userData || authLoading) {
      setLoading(true);
      return;
    }

    socket.current = io(import.meta.env.VITE_BACKEND_BASEURL, {
      withCredentials: true,
    });

    socket.current.emit("new-user-add", userData._id);

    socket.current.on("get-users", (users) => {
      setOnlineUsers(users);
    });

    socket.current.on("receive-message", (data) => {
      setReceiveMessage(data);
    });

    // console.log('LATEST UPDATE 2.13 - CHAT.JSX');
    // console.log(socket.current);
    
    

    return () => {
      socket.current.disconnect();
    };
  }, [userData, authLoading]);

  useEffect(() => {
    const getChats = async () => {
      if (!userData || authLoading) {
        setLoading(true);
        return;
      }
      try {
        setLoading(true);
        const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_BASEURL}/chat/chats`, {
          withCredentials: true,
        });
        // console.log("Chats fetched:", data);
        setChats(data);
      } catch (error) {
        console.error("Error fetching chats:", error.response?.data || error);
        if (error.response?.status === 401 || error.response?.status === 404) {
          toast.error("Session expired, please log in");
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };
    getChats();
  }, [userData, authLoading, navigate]);

  const handleConversationClick = (chat) => {
    setCurrentChat(chat);
  };

  const handleBackToConversation = () => {
    setCurrentChat(null);
  };

  useEffect(() => {
    if (sendMessage && socket.current) {
      socket.current.emit("send-message", sendMessage);
    }
  }, [sendMessage]);

  const handleSearch = async () => {
    if (!searchTerm || !userData || authLoading) return;
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_BACKEND_BASEURL}/following/search?username=${searchTerm}`,
        { withCredentials: true }
      );
      // console.log("Search results:", data);
      setSearchResults(data.data);
    } catch (error) {
      console.error("Error searching followed users:", error.response?.data || error);
      if (error.response?.status === 401 || error.response?.status === 404) {
        toast.error("Session expired, please log in");
        navigate("/login");
      }
    }
  };

  const handleNewChat = async (user) => {
    if (!userData || authLoading) return;
    try {
      const { data: chat } = await axios.post(
        `${import.meta.env.VITE_BACKEND_BASEURL}/chat/create`,
        { receiverId: user._id },
        { withCredentials: true }
      );
      // console.log("New chat created:", chat);
      setChats((prevChats) => [...prevChats, chat]);
      setCurrentChat(chat);
      setSearchResults([]);
      setSearchTerm("");
    } catch (error) {
      console.error("Error creating a new chat:", error.response?.data || error);
      if (error.response?.status === 401 || error.response?.status === 404) {
        toast.error("Session expired, please log in");
        navigate("/login");
      }
    }
  };

  if (authLoading || loading) {
    return <Loader />;
  }

  return (
    <div className="Chat">
      {userData ? (
        <div className="main-chat">
          <div
            className={`Left-side-chat ${
              isMobileView && currentChat ? "mobile-left-notsel" : "mobile-left"
            }`}
          >
            <div className="Chat-container">
              <div className="left-side-chat-top">
                <div className="head-chat-l">
                  <h2>
                    <span>C</span><span>h</span><span>a</span><span>t</span><span>s</span>
                  </h2>
                </div>
                <div className="User-search">
                  <input
                    type="text"
                    placeholder="Search people you follow"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <button onClick={handleSearch}>Search</button>
                </div>
                {searchResults.length > 0 && (
                  <div className="Search-results">
                    {searchResults.map((user) => (
                      <div
                        key={user._id}
                        className="Search-result-item"
                        onClick={() => handleNewChat(user)}
                      >
                        {user.username} <FaPlus className="Add-icon" />
                      </div>
                    ))}
                  </div>
                )}
                <div className="sep-chat"></div>
              </div>

              <div className="Chat-list">
                {chats.map((chat) => (
                  <div
                    key={chat._id}
                    className={`Chat-list-in ${
                      currentChat?._id === chat._id ? "active-chat" : ""
                    }`}
                    onClick={() => handleConversationClick(chat)}
                    aria-selected={currentChat?._id === chat._id}
                  >
                    <Conversation
                      data={chat}
                      currentUserId={userData._id}
                      onlineUsers={onlineUsers}
                    />
                  </div>
                ))}
              </div>
            </div>
            <div className="left-side-chat-footer">
              <div
                onClick={() => navigate("/community")}
                className="community group"
              >
                <div className="icon-container">
                  <HiUserGroup color="#7C78EB" />
                </div>
                <div className="hover-label">Communities</div>
              </div>
              <div className="group">
                <div
                  className="icon-container"
                  onClick={() => navigate("/addChat")}
                >
                  <FaPlus color="#7C78EB" />
                </div>
                <div className="hover-label">Add Chat</div>
              </div>
            </div>
          </div>

          <div
            className={`Right-side-chat ${
              isMobileView && !currentChat ? "mobile-right-notsel" : "mobile-right"
            }`}
          >
            {currentChat ? (
              <ChatBox
                chat={currentChat}
                currentUser={userData._id}
                setSendMessage={setSendMessage}
                receiveMessage={receiveMessage}
                onlineUsers={onlineUsers}
                isMobileView={isMobileView}
                handleBackToConversation={handleBackToConversation}
              />
            ) : (
              <div className="No-group-selected">
                <p>Select a group to start chatting</p>
                <button
                  className="add-chat-button"
                  onClick={() => navigate("/addChat")}
                >
                  Start a New Chat
                </button>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="No-user">
          <p>Please log in to access chats</p>
          <button onClick={() => navigate("/login")}>Log In</button>
        </div>
      )}
    </div>
  );
};

export default Chat;