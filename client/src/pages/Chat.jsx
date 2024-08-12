//WORKING VERSION FOR TESTING
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';

const ChatContainer = styled.div`
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
`;

const ChatWindow = styled.div`
  height: 400px;
  overflow-y: auto;
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 10px;
  margin-bottom: 20px;
`;

const ChatMessage = styled.div`
  background-color: ${props => props.isCurrentUser ? '#007bff' : '#f1f0f0'};
  color: ${props => props.isCurrentUser ? 'white' : 'black'};
  border-radius: 18px;
  padding: 10px 15px;
  margin-bottom: 10px;
  max-width: 70%;
  align-self: ${props => props.isCurrentUser ? 'flex-end' : 'flex-start'};
  display: flex;
  flex-direction: column;
`;


const MessageContent = styled.p`
  margin: 0;
`;


const MessageFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-top: 5px;
  font-size: 0.8em;
`;

const Username = styled.span`
  font-weight: bold;
  color: ${props => props.isCurrentUser ? 'rgba(255,255,255,0.9)' : '#555'};
`;

const Timestamp = styled.span`
  font-size: 0.8em;
  color: ${props => props.isCurrentUser ? 'rgba(255,255,255,0.7)' : '#888'};
  display: block;
  text-align: right;
  margin-top: 5px;
`;

const Input = styled.input`
  width: 70%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const Button = styled.button`
  width: 25%;
  padding: 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-left: 5%;

  &:hover {
    background-color: #0056b3;
  }
`;

const Chat = () => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [currentUser, setCurrentUser] = useState({ id: '', name: '' });

    useEffect(() => {
        // Retrieve current user from localStorage
        const userJSON = localStorage.getItem('username');
        if (userJSON) {
            const user = JSON.parse(userJSON);
            setCurrentUser({ id: user.id, name: user.name });
        } else {
            setCurrentUser({ id: 'ABC', name: 'Dave Smith' });
        }

        axios.get('/api/messages')
            .then(response => {
                if (Array.isArray(response.data)) {
                    setMessages(response.data);
                } else {
                    console.error('Expected an array but received:', response.data);
                }
            })
            .catch(error => console.error('Error fetching messages:', error));
    }, []);

    const handleSendMessage = () => {
        if (newMessage.trim() !== '') {
            axios.post('http://localhost:3001/api/messages/send', { 
                m_content: newMessage, 
                m_user_id: currentUser.id 
            })
            .then(response => {
                console.log('Message sent:', response.data);
                setMessages(prevMessages => [...prevMessages, { ...response.data, user_name: currentUser.name }]);
                setNewMessage('');
            })
            .catch(error => console.error('Error sending message:', error.response ? error.response.data : error));
        }
    };

    return (
        <ChatContainer>
            <ChatWindow>
                {messages.map(message => (
                    <ChatMessage key={message.m_id} isCurrentUser={message.m_user_id === currentUser.id}>
                        <MessageContent>{message.m_content}</MessageContent>
                        <MessageFooter>
                            <Timestamp isCurrentUser={message.m_user_id === currentUser.id}>
                                {new Date(message.m_timestamp).toLocaleTimeString()}
                            </Timestamp>
                            {message.m_user_id === currentUser.id && (
                                <Username isCurrentUser={true}>{currentUser.name}</Username>
                            )}
                        </MessageFooter>
                    </ChatMessage>
                ))}
            </ChatWindow>
            <Input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
            />
            <Button onClick={handleSendMessage}>Send</Button>
        </ChatContainer>
    );
};

export default Chat;