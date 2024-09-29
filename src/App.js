import React from 'react';
import PredefinedChat from './PredefinedChat/ChatForm';
import LiveChat from './LiveChat/Chat';
import Login from './Login/Login';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login />}/>
                <Route path="/predefined-chat" element={<PredefinedChat />} />
                <Route path="/live-chat" element={<LiveChat />} />
            </Routes>
        </Router>
    );
}

export default App;
