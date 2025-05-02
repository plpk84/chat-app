import React, {useContext, useEffect, useRef, useState} from "react";
import {AuthContext} from "../contexts/AuthProvider";
import {useNavigate} from "react-router-dom";
import {api} from "../services/api";
import "../styles/Chat.css"
import UserItem from "../components/user/UserItem";
import SockJS from "sockjs-client";
import {Client} from "@stomp/stompjs";
import MessageList from "../components/message/MessageList";
import UserList from "../components/user/UserList";


const ChatPage = () => {
  const {authState, logout} = useContext(AuthContext);
  const [client, setClient] = useState(null);
  const [subscriptions, setSubscriptions] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState({});
  const [messages, setMessages] = useState([]);
  const [notificationCount, setNotificationCount] = useState({});
  const [messageText, setMessageText] = useState("");
  const navigate = useNavigate();
  const [contactsOffset, setContactsOffset] = useState(0);
  const [messageOffset, setMessageOffset] = useState(0);
  const messagesContainerRef = useRef(null);
  const [messageFetching, setMessageFetching] = useState(false);
  const [allMessageFetched, setAllMessageFetched] = useState(false);
  const [file, setFile] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (!authState.accessToken) {
      if (client) {
        client.deactivate();
        setClient(null);
      }
      return;
    }
    const getConnection = async () => {
      const socket = new SockJS(`http://localhost:8080/ws`);
      const client = new Client(
        {
          webSocketFactory: () => socket,
          connectHeaders: {
            Authorization: `Bearer ${authState.accessToken}`
          },
          onConnect: () => {

            console.log('Connected to WebSocket');

            const publicSub = client.subscribe(
              '/topic/public',
              onTopicMessageReceived,
              {
                id: `${authState.user.username}-public-subscription`
              }
            );
            const directMessagesSub = client.subscribe(
              `/queue/${authState.user.username}.messages`,
              onDirectMessageReceived,
              {
                id: `${authState.user.username}-direct-messages-subscription`
              }
            );
            setSubscriptions([publicSub, directMessagesSub]);
          },
          onStompError: onError,
          onDisconnect: () => {
            console.log(`Disconnected from WebSocket`)
            subscriptions.forEach(sub => sub.unsubscribe(
              {
                Authorization: `Bearer ${authState.accessToken}`
              }
            ));
            setSubscriptions([]);
          },
          reconnectDelay: 5000,
          heartbeatIncoming: 4000,
          heartbeatOutgoing: 4000
        }
      );
      setClient(client);
      client.activate()
    }
    getConnection();

    return () => {
      if (client) {
        client.deactivate();
        setClient(null);
      }
    }
  }, [authState.accessToken]);

  const loadContacts = async () => {
    setContactsOffset(0);
    const response = await api.get(`/users`, {
      params: {offset: contactsOffset, size: 3},
      headers: {Authorization: `Bearer ${authState.accessToken}`},
    });
    if (authState.user) {
      setUsers(response.data.filter(u => u.username !== authState.user.username));
    }
  };

  useEffect(() => {
    if (!authState.accessToken) {
      return;
    }
    loadContacts();
  }, [authState.accessToken])

  const scrollHandler = () => {
    if (messagesContainerRef.current.scrollTop < -82) {
      setMessageFetching(true)
    }
    if (messagesContainerRef.current.scrollTop === 0) {
      resetNewMessagesCounter();
    }
  }

  useEffect(() => {
    const current = messagesContainerRef.current;
    if (current) {
      current.addEventListener('scroll', scrollHandler)
    }

    return () => {
      if (current) {
        current.removeEventListener('scroll', scrollHandler);
      }
    }
  }, [selectedUser])

  const onDirectMessageReceived = (message) => {
    const newMessage = JSON.parse(message.body);
    console.log(`/queue/${authState.user.username}.messages, receive message:\n${JSON.stringify(newMessage)}`);
    const senderId = newMessage.senderId
    setMessages(prevMessages => [newMessage, ...prevMessages]);
    setNotificationCount((prevNewMessages) => {
      return {
        ...prevNewMessages,
        [senderId]: prevNewMessages[senderId] ? prevNewMessages[senderId] + 1 : 1,
      }
    });
  }
  const onTopicMessageReceived = (message) => {
    const updatedUser = JSON.parse(message.body);
    console.log(`/topic/public, receive message:\n ${JSON.stringify(updatedUser)}`);
    setUsers((prevUsers) =>
      prevUsers.map((u) =>
        u.username === updatedUser.username
          ? {...u, status: updatedUser.status}
          : u
      )
    );
  }

  const onError = (err) => {
    console.error("Error connecting to WebSocket:", err);
  };

  const onLogout = async () => {
    if (client) {
      await client.deactivate();
      setClient(null);
    }
    await logout();
    navigate("/login")
  }

  const onProfile = async () => {
    if (client) {
      await client.deactivate();
      setClient(null);
    }
    navigate("/")
  }

  const loadMessages = (username) => {
    api.get(`/messages/${authState.user.username}/${username}`, {
      headers: {Authorization: `Bearer ${authState.accessToken}`},
      params: {offset: messageOffset, size: 20},
    }).then(
      response => {
        const length = response.data.length
        setMessageFetching(false)
        if (length > 0) {
          setMessages(prevState => [...prevState, ...response.data]);
          setMessageOffset(prevState => prevState + 1);
        } else if (length === 0) {
          setAllMessageFetched(true);
        }
      }
    )
  }
  useEffect(() => {
    if (messageFetching && !allMessageFetched) {
      loadMessages(selectedUser.username)
    }
  }, [messageFetching, allMessageFetched])
  const handleUserSelect = async (u) => {
    setAllMessageFetched(false)
    if (selectedUser?.username !== u.username) {
      setSelectedUser(u);
      setMessageFetching(true)
      setMessageOffset(0)
      setMessages([])
    }
    resetNewMessagesCounter();
  };

  const resetNewMessagesCounter = () => {
    if (selectedUser) {
      setNotificationCount((prev) => ({
        ...prev,
        [selectedUser.username]: 0,
      }));
    }
  };

  const sendMessage = () => {
    if (!messageText.trim()) return;

    if (!client || !client.connected) {
      console.error("WebSocket client is not connected");
      return;
    }
    const message = {
      senderId: authState.user.username,
      recipientId: selectedUser.username,
      content: messageText,
      isFile: false,
      timestamp: new Date()
    };

    client.publish({
      destination: "/app/chat",
      body: JSON.stringify(message)
    });

    setMessages([message, ...messages])
    setMessageText("");
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      sendFile(selectedFile);
    }
  };

  const sendFile = async (fileToSend) => {
    if (!fileToSend || !selectedUser?.username) return;

    try {
      const formData = new FormData();
      formData.append('file', fileToSend);

      const response = await api.post(`/files`, formData, {
        headers: {
          Authorization: `Bearer ${authState.accessToken}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      const fileUrl = response.data.url;

      const message = {
        senderId: authState.user.username,
        recipientId: selectedUser.username,
        content: fileUrl,
        isFile: true,
        fileName: fileToSend.name,
        fileType: fileToSend.type,
        timestamp: new Date()
      };

      if (client && client.connected) {
        client.publish({
          destination: "/app/chat",
          body: JSON.stringify(message)
        });

        setMessages([message, ...messages]);
      }
    } catch (error) {
      console.error("Error uploading file:", error);
    } finally {
      setFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleFileButtonClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="chat-container">
      {/* Список пользователей */}
      <div className="left-panel">
        <div className="users-list-container">
          <div onClick={async () => await onProfile()}>
            <UserItem user={authState?.user}/>
          </div>
          <div>
            <h2>Users</h2>
            <span onClick={loadContacts}>Refresh Users</span>
          </div>
          <UserList users={users}
                    selectedUsername={selectedUser?.username}
                    notificationCount={notificationCount}
                    handleClick={handleUserSelect}
          />
        </div>
        <div>
          <a className="redirect-button" onClick={async () => await onLogout()}>Logout</a>
        </div>
      </div>
      {/* Чат */}
      {selectedUser ? (
        <div className="chat-area">
          <MessageList ref={messagesContainerRef}
                       messages={messages}
                       user={authState.user}
          />
          <div className="input-area">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              style={{display: 'none'}}
              accept="image/*, .pdf, .doc, .docx, .txt"
            />
            <button
              onClick={handleFileButtonClick}
              className="file-button"
            >
              Send File
            </button>
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