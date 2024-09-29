import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        try {
            const response = await axios.post('http://localhost:8000/api/login', { email, password });
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('name', response.data.name);
            navigate('/live-chat'); // Redirect to live chat after successful login
        } catch (error) {
            console.error(error);
        }
    };

    const goToPredefinedChat = () => {
        navigate('/predefined-chat'); // Change this to the actual route for the predefined chat
    };

    return (
        <div style={styles.container}>
            <div style={styles.form}>
                <h2>Login</h2>
                <input 
                    type="email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    placeholder="Email" 
                    style={styles.input} 
                />
                <input 
                    type="password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    placeholder="Password" 
                    style={styles.input} 
                />
                <button onClick={handleLogin} style={styles.button}>Login</button>
                <div style={styles.buttonContainer}>
                    <button onClick={goToPredefinedChat} style={styles.button}>Go to Predefined Chat</button>
                </div>
            </div>
        </div>
    );
};

const styles = {
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh', // Full height of the viewport
        backgroundColor: '#f0f0f0', // Light background color
    },
    form: {
        background: '#fff', // White background for the form
        padding: '20px',
        borderRadius: '10px', // Rounded corners for the form
        boxShadow: '0 4px 10px rgba(0,0,0,0.1)', // Subtle shadow effect
        textAlign: 'center', // Center text inside the form
        width: '300px', // Set a fixed width for the form
    },
    input: {
        width: '100%',
        padding: '10px',
        margin: '10px 0', // Margin around the inputs
        borderRadius: '5px', // Rounded corners for inputs
        border: '1px solid #ccc', // Light border
        boxSizing: 'border-box', // Include padding in width
    },
    button: {
        width: '100%',
        padding: '10px',
        backgroundColor: '#4CAF50', // Green background for buttons
        color: 'white', // White text color
        border: 'none',
        borderRadius: '5px', // Rounded corners for buttons
        cursor: 'pointer', // Pointer cursor on hover
        transition: 'background-color 0.3s', // Smooth transition for background color
    },
    buttonContainer: {
        marginTop: '10px', // Space between buttons
    },
};

export default Login;
