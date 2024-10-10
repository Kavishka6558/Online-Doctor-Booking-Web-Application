import React, { useState, useEffect } from 'react';
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { firestore } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase'; 

const Chat = () => {
  const [messages, setMessages] = useState([]); 
  const [newMessage, setNewMessage] = useState(''); 
  const [user, setUser] = useState(null); 

  // Fetch chat messages in real-time
  useEffect(() => {
    const messagesRef = collection(firestore, 'Chat'); 
    const q = query(messagesRef, orderBy('timestamp', 'asc')); 
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedMessages = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMessages(fetchedMessages);
    });

    return () => unsubscribe(); 
  }, []);

  // Fetch user data on authentication state change
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser); 
      } else {
        setUser(null); 
      }
    });

    return () => unsubscribe(); 
  }, []);

  // Handle sending a new message
  const sendMessage = async () => {
    if (!newMessage.trim() || !user) return; 

    const messageData = {
      Doctor: "Terry", 
      Message: newMessage, 
      User: user.displayName || 'Anonymous', 
      UserId: user.uid, 
      timestamp: serverTimestamp(), 
      isDoctor: false, 
    };

    try {
      await addDoc(collection(firestore, 'Chat'), messageData);
      setNewMessage(''); 
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Messages Display */}
      <div className="flex-1 p-4 overflow-y-auto">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.isDoctor ? 'justify-end' : 'justify-start'}`} 
            >
              <div
                className={`max-w-xs px-4 py-2 rounded-lg shadow ${
                  message.isDoctor ? 'bg-blue-300 text-white' : 'bg-gray-300 text-black'
                }`}
              >
                <p>{message.Message}</p>
                {message.isDoctor ? (
                  <small>{`Doctor: ${message.Doctor}`}</small>
                ) : (
                  <small>{`Patient: ${message.User}`}</small> 
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Message Input */}
      <div className="bg-white p-4 border-t border-gray-300">
        <div className="flex items-center space-x-4">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
          />
          <button
            onClick={sendMessage}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
