import React, {useEffect, useState, useContext, useRef} from "react";
import SockJS from "sockjs-client";
import {Client} from "@stomp/stompjs";
import {AuthContext} from "../contexts/AuthContext";
import {useNavigate} from "react-router-dom";
import {getMessageHistory, getUsersList} from "../services/api";
import "../styles/Chat.css"
import UserComponent from "../components/UserComponent";
import UserItem from "../components/UserItem";

const ChatPage = () => {
  const {user, logout} = useContext(AuthContext);
  const stompClient = useRef(null);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessages, setNewMessages] = useState({});
  const [messageText, setMessageText] = useState("");
  const navigate = useNavigate();
  const messageEndRef = useRef(null);
  const [offset, setOffset] = useState(0);
  const [size, setSize] = useState(10);
  
  useEffect(() => {
    if (localStorage.getItem("accessToken") === null) {
      navigate("/login");
      return;
    }
    loadContacts();
    connect();
    
    return () => {
      if (stompClient) {
        stompClient.current.deactivate();
      }
    };
  }, [navigate,user]);
  
  useEffect(() => {
    console.log(`user changed ${JSON.stringify(users)}`)
  }, [users])
  
  const loadContacts = () => {
    const response = getUsersList(offset, size)
    .then(response => {
      const filtered = response.data.filter(u => u.username !== user?.username)
      setUsers(filtered)
    });
  };
  
  const connect = () => {
    const socket = new SockJS("http://localhost:8080/ws");
    stompClient.current = new Client(
      {
        webSocketFactory: () => socket,
        reconnectDelay: 5000,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,
        onConnect: onConnected,
        onStompError: onError
      }
    )
    stompClient.current.activate();
  }
  
  const onConnected = () => {
    console.log('Connected to WebSocket');
    
    console.log('Connected to WebSocket /topic/public');
    stompClient.current.subscribe('/topic/public', onTopicMessageReceived);
    
    console.log(`Connected to WebSocket /queue/${user.username}.messages`);
    stompClient.current.subscribe(`/queue/${user.username}.messages`, onDirectMessageReceived);
  }
  
  const onDirectMessageReceived = (message) => {
    console.log(`/queue/${user.username}.messages, receive message`);
    const newMessage = JSON.parse(message.body);
    const senderId = newMessage.senderId
    setMessages(prevMessages => [...prevMessages, newMessage]);
    setNewMessages((prevNewMessages) => {
      return {
        ...prevNewMessages,
        [senderId]: prevNewMessages[senderId] ? prevNewMessages[senderId] + 1 : 1,
      }
    });
  }
  const onTopicMessageReceived = (message) => {
    console.log(`/topic/public receive message`);
    const updatedUser = JSON.parse(message.body);
    setUsers((prevUsers) =>
      prevUsers.map((u) =>
        u.username === updatedUser.username
          ? {...u, status: updatedUser.status}
          : u
      )
    );
  }
  
  
  const onError = (err) => {
    console.log(err);
  };
  
  const onLogout =  async () => {
    await stompClient.current.deactivate();
    console.log('Logout');
    logout();
    console.log('LOGOUNT SEND EVENT');
    navigate("/login")
  }
  
  const onProfile = async () => {
    await stompClient.current.deactivate();
    navigate("/")
  }
  
  const handleUserSelect = async (u) => {
    setSelectedUser(u);
    const response = await getMessageHistory(user.username, u.username);
    const responseMessages = response.data
    setNewMessages(prev => ({...prev, [u.username]: 0}));
    setMessages(responseMessages)
    setTimeout(scrollToBottom, 10);
  };
  
  const scrollToBottom = () => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollTop = messageEndRef.current.scrollHeight;
    }
  }
  
  const isScrolledToBottom = () => {
    if (!messageEndRef.current) return false;
    const {scrollTop, scrollHeight, clientHeight} = messageEndRef.current;
    return scrollHeight - scrollTop === clientHeight;
  }
  
  const resetNewMessagesCounter = () => {
    if (selectedUser && isScrolledToBottom()) {
      setNewMessages((prev) => ({
        ...prev,
        [selectedUser.username]: 0,
      }));
    }
  };
  useEffect(() => {
    const messagesContainer = messageEndRef.current;
    if (messagesContainer) {
      messagesContainer.addEventListener("scroll", resetNewMessagesCounter);
    }
    
    return () => {
      if (messagesContainer) {
        messagesContainer.removeEventListener("scroll", resetNewMessagesCounter);
      }
    };
  }, [selectedUser, messages]);
  const sendMessage = () => {
    if (!messageText.trim()) return;
    
    const message = {
      senderId: user.username,
      recipientId: selectedUser.username,
      content: messageText,
      timestamp: new Date()
    };
    
    stompClient.current.publish({
      destination: "/app/chat",
      body: JSON.stringify(message)
    });
    setMessages([...messages, message])
    setMessageText("");
    setTimeout(scrollToBottom, 0);
  };
  
  return (
    <div className="chat-container">
      {/* Список пользователей */}
      <div className="users-list">
        <div className="users-list-container">
          {/*<div onClick={onProfile}>*/}
          {/*  <UserItem user={user}/>*/}
          {/*</div>*/}
          <div>
            <h2>Users</h2>
            <span onClick={loadContacts}>Refresh Users</span>
          </div>
          <ul>
            {users.map((u) => (
              <UserComponent
                key={u.username}
                user={{
                  ...u,
                  isSelected: selectedUser?.username === u.username,
                }}
                newMessages={newMessages}
                onSelect={async () => await handleUserSelect(u)}
              />
            ))}
          </ul>
        </div>
        <div>
          <a className="redirect-button" onClick={async ()=>await onLogout()}>Logout</a>
        </div>
      </div>
      {/* Чат */}
      {selectedUser ? (
        <div className="chat-area">
          <div className="messages" ref={messageEndRef}>
            {messages.map((msg, index) => (
              <div key={index}
                   className={`message ${msg.senderId === user?.username ? "sent" : "received"}`}>
                {msg.content}
              </div>
            ))}
          </div>
          <div className="input-area">
            <input
              type="text"
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              placeholder="Type a message..."
            />
            <button onClick={sendMessage}>Send</button>
          </div>
        </div>
      ) : (
        <div className="chat-area">
        
        </div>
      )}
    </div>
  );
};

export default ChatPage;