import React, {useCallback, useContext, useEffect, useState} from "react";
import {AuthContext} from "../contexts/AuthProvider";
import {useNavigate} from "react-router-dom";
import {api} from "../services/api";
import "../styles/Contacts.css";

const ContactsPage = () => {
  const {authState} = useContext(AuthContext);
  const navigate = useNavigate();
  const [contacts, setContacts] = useState([]);
  const [users, setUsers] = useState([]);
  const [contactsOffset, setContactsOffset] = useState(0);
  const [usersOffset, setUsersOffset] = useState(0);
  const [loading, setLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);

  const loadContacts = useCallback(async () => {
    if (!authState.user?.username) return;

    try {
      const response = await api.get(`/users/${authState.user.username}/contacts`, {
        params: {offset: contactsOffset, size: 10},
        headers: {Authorization: `Bearer ${authState.accessToken}`},
      });
      setContacts(prev => {
        const newContacts = response.data.filter(newContact =>
          !prev.some(existingContact => existingContact.username === newContact.username)
        );
        return [...prev, ...newContacts];
      });
    } catch (error) {
      console.error("Error loading contacts:", error);
    }
  }, [authState.user?.username, authState.accessToken, contactsOffset]);

  const loadUsers = useCallback(async () => {
    if (!authState.user?.username) return;

    try {
      setLoading(true);
      const response = await api.get(`/users`, {
        params: {offset: usersOffset, size: 10},
        headers: {Authorization: `Bearer ${authState.accessToken}`},
      });
      const filteredUsers = response.data.filter(user =>
        user.username !== authState.user.username && !authState.user.contacts.includes(user.username));

      setUsers(prev => {
        const newUsers = filteredUsers.filter(newUser =>
          !prev.some(existingUser => existingUser.username === newUser.username)
        );
        return [...prev, ...newUsers];
      });
    } catch (error) {
      console.error("Error loading users:", error);
    } finally {
      setLoading(false);
      setInitialLoad(false);
    }
  }, [authState.user?.username, authState.accessToken, usersOffset, contacts]);

  useEffect(() => {
    if (initialLoad && authState.user?.username) {
      loadContacts();
      loadUsers();
    }
  }, [initialLoad, authState.user?.username, loadContacts, loadUsers]);

  useEffect(() => {
    if (!initialLoad && contactsOffset > 0) {
      loadContacts();
    }
  }, [contactsOffset, initialLoad, loadContacts]);

  useEffect(() => {
    if (!initialLoad && usersOffset > 0) {
      loadUsers();
    }
  }, [usersOffset, initialLoad, loadUsers]);

  const handleAddContact = async (username) => {
    try {
      await api.post(`/users/${authState.user.username}/contacts/${username}`, {}, {
        headers: {Authorization: `Bearer ${authState.accessToken}`},
      });

      const addedUser = users.find(user => user.username === username);
      if (addedUser) {
        setContacts(prev => [addedUser, ...prev]);
        setUsers(prev => prev.filter(user => user.username !== username));
      }
    } catch (error) {
      console.error("Error adding contact:", error);
    }
  };

  const handleRemoveContact = async (username) => {
    try {
      await api.delete(`/users/${authState.user.username}/contacts/${username}`, {
        headers: {Authorization: `Bearer ${authState.accessToken}`},
      });

      const removedContact = contacts.find(contact => contact.username === username);
      if (removedContact) {
        setContacts(prev => prev.filter(contact => contact.username !== username));
        setUsers(prev => [removedContact, ...prev]);
      }
    } catch (error) {
      console.error("Error removing contact:", error);
    }
  };

  const handleBack = () => {
    navigate("/");
  };

  return (
    <div className="contacts-container">
      <button onClick={handleBack} className="back-button">Back to Profile</button>

      {contacts.length > 0 && (
        <>
          <h2>Your Contacts</h2>
          <div className="contacts-list">
            {contacts.map(contact => (
              <div key={`contact-${contact.username}`} className="contact-item">
                <div className="contact-info">
                  <img
                    src={contact.avatar_url || require("../img/user_icon.png")}
                    alt={contact.username}
                    className="contact-avatar"
                  />
                  <span>{contact.first_name} {contact.last_name}</span>
                </div>
                <button
                  onClick={() => handleRemoveContact(contact.username)}
                  className="remove-button"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </>
      )}

      {users.length > 0 && (
        <>
          <h2>Add New Contacts</h2>
          <div className="contacts-list">
            {users.map(user => (
              <div key={`contact-${user.username}`} className="contact-item">
                <div className="contact-info">
                  <img
                    src={user.avatar_url || require("../img/user_icon.png")}
                    alt={user.username}
                    className="contact-avatar"
                  />
                  <span>{user.first_name} {user.last_name}</span>
                </div>
                <button
                  onClick={() => handleAddContact(user.username)}
                  className="add-button"
                >
                  Add
                </button>
              </div>
            ))}
            {loading && <div className="loading">Loading...</div>}
          </div>
        </>
      )}
    </div>
  );
};

export default ContactsPage;