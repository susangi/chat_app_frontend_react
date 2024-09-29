import React, { useState, useEffect } from 'react';
import { initializeEcho } from '../setupEcho';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const LiveChat = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/');
    } else {
      initializeEcho();

      window.Echo.channel(`chat-channel`)
        .listen('LiveChatEvent', (event) => {
          console.log(event); // Inspect the event to see if you are receiving the data
          event.sender !== localStorage.getItem('name') &&
          setMessages((prevMessages) => [
            ...prevMessages,
            { text: event.message, sender: event.sender, timestamp: new Date() },
          ]);
        });

      return () => {
        window.Echo.leaveChannel(`chat-channel`);
      };
    }
  }, [navigate]);

  const handleSendMessage = (e) => {
    e.preventDefault();

    if (newMessage.trim() === '') return;

    const message = {
      sender: localStorage.getItem('name') || 'guest',
      text: newMessage,
      timestamp: new Date(),
    };

    axios.post('http://localhost:8000/api/send-message', { 
      text: newMessage, // Just send the text; the sender is handled in the backend
    }, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
    .then((response) => {
      console.log(response.data); // Log the response data
      // Optimistically update the chat UI
      setMessages((prevMessages) => [...prevMessages, message]);
    })
    .catch((error) => {
      console.error('Error sending message:', error.response ? error.response.data : error.message);
    });

    setNewMessage(''); // Clear the input field
  };

  // Handle user logout
  const handleLogout = () => {
    localStorage.removeItem('token'); // Remove token from local storage
    localStorage.removeItem('name'); // Remove user name from local storage
    navigate('/'); // Redirect to the login page or home page
  };

  return (
    <div className="chat-window" style={styles.chatWindow}>
      <ul style={{ listStyleType: 'none', padding: 0 }}>
        {messages.map((msg, idx) => (
          <li
            key={idx}
            style={{
              textAlign: msg.sender === (localStorage.getItem('name') || 'guest') ? 'left' : 'right',
              marginBottom: '5px',
              display: 'flex',
              justifyContent: msg.sender === (localStorage.getItem('name') || 'guest') ? 'flex-start' : 'flex-end',
            }}
          >
            <div
              style={{
                backgroundColor: msg.sender === (localStorage.getItem('name') || 'guest') ? '#d1e7ff' : '#d1ffd1',
                padding: '8px',
                borderRadius: '5px',
                maxWidth: '70%',
              }}
            >
              <strong>{(msg.sender === localStorage.getItem('name')) ? "me" : msg.sender}:</strong> {msg.text} {/* Display sender's name */}
              <br />
              <small style={{ fontSize: '0.7em', color: '#666' }}>
                {new Date(msg.timestamp).toLocaleTimeString()}
              </small>
            </div>
          </li>
        ))}
      </ul>
      <form onSubmit={handleSendMessage} style={styles.form}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message"
          style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
        />
        <div style={styles.sendButtonContainer}>
          <button type="submit" style={styles.sendButton}>Send</button>
        </div>
      </form>
      <button onClick={handleLogout} style={styles.logoutButton}>
        Logout
      </button>
    </div>
  );
};

const styles = {
  chatWindow: {
    maxWidth: '400px',
    margin: 'auto',
    padding: '10px',
    border: '1px solid #ccc',
    borderRadius: '10px',
    backgroundColor: '#fff',
    boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
    marginTop: '30px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
  sendButtonContainer: {
    display: 'flex',
    justifyContent: 'flex-end', // Align the send button to the right
  },
  sendButton: {
    padding: '10px',
    backgroundColor: '#007bff', // Bootstrap primary color
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    width: '100%',
  },
  logoutButton: {
    padding: '10px',
    marginTop: '10px',
    backgroundColor: '#f44336', // Red color for logout button
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    width: '100%', // Make the logout button full width
  },
};

export default LiveChat;
