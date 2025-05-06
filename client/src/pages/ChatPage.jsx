import React, {useContext, useEffect, useRef, useState} from "react";
import {AuthContext} from "../contexts/AuthProvider";
import {useNavigate} from "react-router-dom";
import {api} from "../services/api";
import {useWebSocket} from "../hooks/useWebSocket";
import ChatSidebar from "../components/chat/ChatSidebar";
import ChatArea from "../components/chat/ChatArea";
import "../styles/Chat.css";

const ChatPage = () => {
  const {authState, logout} = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [notificationCount, setNotificationCount] = useState({});
  const [contactsOffset, setContactsOffset] = useState(0);
  const [messageOffset, setMessageOffset] = useState(0);
  const [messageFetching, setMessageFetching] = useState(false);
  const [allMessageFetched, setAllMessageFetched] = useState(false);
  const messagesContainerRef = useRef(null);
  const navigate = useNavigate();
  const onDirectMessage = (message) => {
    const newMessage = JSON.parse(message.body);
    const senderId = newMessage.senderId;

    setMessages(prev => [newMessage, ...prev]);
    setNotificationCount(prev => ({
      ...prev,
      [senderId]: (prev[senderId] || 0) + 1,
    }));
  };

  const onPublicMessage = (message) => {
    const updatedUser = JSON.parse(message.body);
    setUsers(prev => prev.map(u =>
      u.username === updatedUser.username ? {...u, status: updatedUser.status} : u
    ));
  };

  const client = useWebSocket({authState, onDirectMessage, onPublicMessage});
  const loadContacts = async () => {
    const response = await api.get(`/users`, {
      params: {offset: contactsOffset, size: 3},
      headers: {Authorization: `Bearer ${authState.accessToken}`},
    });
    if (authState.user) {
      setUsers(response.data.filter(u => u.username !== authState.user.username));
    }
  };

  useEffect(() => {
    if (authState.accessToken) {
      loadContacts();
    }
  }, [authState.accessToken]);


  const loadMessages = async (username) => {
    const response = await api.get(`/messages/${authState.user.username}/${username}`, {
      headers: {Authorization: `Bearer ${authState.accessToken}`},
      params: {offset: messageOffset, size: 20},
    });

    const length = response.data.length;
    setMessageFetching(false);

    if (length > 0) {
      setMessages(prev => [...prev, ...response.data]);
      setMessageOffset(prev => prev + 1);
    } else if (length === 0) {
      setAllMessageFetched(true);
    }
  };

  const handleScroll = () => {
    if (messagesContainerRef.current.scrollTop < -82) {
      setMessageFetching(true);
    }
    if (messagesContainerRef.current.scrollTop <= 0 && messagesContainerRef.current.scrollTop >= -20) {
      resetNewMessagesCounter();
    }
  };

  useEffect(() => {
    const container = messagesContainerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, [selectedUser]);

  useEffect(() => {
    if (messageFetching && !allMessageFetched && selectedUser) {
      loadMessages(selectedUser.username);
    }
  }, [messageFetching, allMessageFetched, selectedUser]);

  const handleUserSelect = async (user) => {
    setAllMessageFetched(false);
    if (selectedUser?.username !== user.username) {
      setSelectedUser(user);
      setMessageFetching(true);
      setMessageOffset(0);
      setMessages([]);
    }
    resetNewMessagesCounter();
  };

  const resetNewMessagesCounter = () => {
    if (selectedUser) {
      setNotificationCount(prev => ({
        ...prev,
        [selectedUser.username]: 0,
      }));
    }
  };

  const handleSendMessage = (text) => {
    if (!client?.connected || !selectedUser) return;

    const message = {
      senderId: authState.user.username,
      recipientId: selectedUser.username,
      content: text,
      isFile: false,
      timestamp: new Date()
    };

    client.publish({
      destination: "/app/chat",
      body: JSON.stringify(message)
    });

    setMessages(prev => [message, ...prev]);
  };

  const handleSendFile = async (file) => {
    if (!client?.connected || !selectedUser) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await api.post(`/files`, formData, {
        headers: {
          Authorization: `Bearer ${authState.accessToken}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      const message = {
        senderId: authState.user.username,
        recipientId: selectedUser.username,
        content: response.data.url,
        isFile: true,
        fileName: file.name,
        fileType: file.type,
        timestamp: new Date()
      };

      if (client?.connected) {
        client.publish({
          destination: "/app/chat",
          body: JSON.stringify(message)
        });
        setMessages(prev => [message, ...prev]);
      }
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  const handleLogout = async () => {
    if (client) await client.deactivate();
    await logout();
    navigate("/login");
  };

  const handleProfile = () => {
    if (client) client.deactivate();
    navigate("/");
  };

  return (
    <div className="chat-container">
      <ChatSidebar
        currentUser={authState.user}
        users={users}
        selectedUsername={selectedUser?.username}
        notificationCount={notificationCount}
        onUserSelect={handleUserSelect}
        onRefreshContacts={loadContacts}
        onLogout={handleLogout}
        onProfile={handleProfile}
      />
      <ChatArea
        messages={messages}
        currentUser={authState.user}
        selectedUser={selectedUser}
        onSendMessage={handleSendMessage}
        onSendFile={handleSendFile}
        messagesContainerRef={messagesContainerRef}
      />
    </div>
  );
};

export default ChatPage;