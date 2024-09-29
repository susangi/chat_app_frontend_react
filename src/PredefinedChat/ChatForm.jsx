import React, { useState, useEffect, useRef } from "react";
import "./ChatForm.css"; // Custom styles
import axios from "axios";

const ChatForm = () => {
  const [step, setStep] = useState(0);
  const [messages, setMessages] = useState([
    { sender: "system", text: "Welcome to the University Club Chat System!" },
  ]);
  const [userData, setUserData] = useState({
    name: "",
    age: "",
    faculty: "",
    department: "",
    year: "",
    gender: "",
    phone: "",
    email: "",
    club: "",
  });
  const [fromDetails, setForm] = useState({
    name: "",
    age: "",
    faculty: "",
    department: "",
    year: "",
    gender: "",
    phone: "",
    email: "",
    club: "",
  });
  const [emailError, setEmailError] = useState(""); // New state for email error

  const chatEndRef = useRef(null);
  const clubOptions = ["Music", "Cricket", "Dance", "English"];

  const predefinedQuestions = {
    "How to apply for your club?": "Hi, welcome to our club. First, you should download the application and submit it to our club.",
    "What is the purpose or mission of the club?": "Understand the club’s goals and values to see if they align with your interests.",
    "What activities does the club typically organize?": "Find out about the types of events, meetings, or projects the club focuses on.",
  };

  const validateEmail = (email) => {
    // Simple regex for email validation
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
    setForm({ ...fromDetails, [name]: value });

    // Clear email error when input changes
    if (name === "email") {
      setEmailError("");
    }
  };

  const handleNextStep = () => {
    if ("email" === inputList[step]) { // Email input step
      if (!validateEmail(userData.email)) {
        setEmailError("Please enter a valid email address.");
        return; // Prevent proceeding if email is invalid
      }
    }
    
    if (!getInputValue()) return; // Prevent proceeding if input is empty

    const systemMessage = getCurrentSystemMessage(inputList[step]);
    const userMessage = { sender: "user", text: getInputValue() };

    // Add the system message first, then the user message
    setMessages((prevMessages) => [
      ...prevMessages,
      systemMessage,
      userMessage,
    ]);
    setStep((prevStep) => prevStep + 1);
    clearInput();
  };

  const handleClubSelect = async (club) => {
    setUserData({ ...userData, club });
    const clubMessage = { sender: "user", text: club };
    const responseMessage = {
      sender: "system",
      text: `You have selected the ${club} club.`,
    };
    const thankYouMessage = {
      sender: "system",
      text: "Thank you for providing the information!",
    };

    setMessages((prevMessages) => [
      ...prevMessages,
      clubMessage,
      responseMessage,
      thankYouMessage,
    ]);

    // Prepare data to send to the backend
    const dataToSend = {
      ...fromDetails,
      club,
    };

    // Send data to Laravel backend
    try {
      const response = await axios.post(
        "http://localhost:8000/api/club-members",
        dataToSend
      );
      console.log("Data stored successfully:", response.data);
    } catch (error) {
      console.error("Error storing data:", error);
    }

    setStep(step + 1);
  };

  const getCurrentSystemMessage = (step) => {
    const messages = {
      "name" : "May I have your name, please?",
      "age" : "How old are you?",
      "faculty" :"What is your faculty?",
      "department" :"Which department are you in?",
      "year" :"Which year are you in?",
      "gender" :"What is your gender?",
      "phone" :"What is your phone number?",
      "email" :"What is your email address?",
      "club" :"Which club would you like to join?",
    };

    return {
      sender: "system",
      text:
        messages[step] ||
        "Thank you for your responses! We will send you mail with club date",
    };
  };

  const clearInput = () => {
    setUserData({ ...userData, [getInputName()]: "" });
  };

  const inputList = [
    "name",
    // "age",
    // "faculty",
    // "department",
    // "year",
    // "gender",
    "phone",
    "email",
  ];
  
  const getInputName = () => {
    const inputNames = inputList ;
    console.log(inputNames);
    return inputNames[step] || "";
  };

  const getInputValue = () => {
    return userData[getInputName()] || "";
  };

  const handlePredefinedQuestion = (question) => {
    const answer = predefinedQuestions[question];
    if (answer) {
      const userMessage = { sender: "user", text: question };
      const systemMessage = { sender: "system", text: answer };

      setMessages((prevMessages) => [
        ...prevMessages,
        userMessage,
        systemMessage,
      ]);
    }
  };

  const renderPredefinedQuestions = () => {
    return Object.keys(predefinedQuestions).map((question) => (
      <button
        key={question}
        onClick={() => handlePredefinedQuestion(question)}
        className="btn btn-info mt-2 me-2"
      >
        {question}
      </button>
    ));
  };

  const renderInput = () => {
    if (step < inputList.length) {
      return (
        <div style={{ width: "600px" }}>
          {'year' === inputList[step] ? ( // Year selection
            <select
              required
              name="year"
              value={userData.year}
              onChange={handleInputChange}
              className="form-control"
            >
              <option value="">Select Year</option>
              <option value="One">One</option>
              <option value="Two">Two</option>
              <option value="Three">Three</option>
              <option value="Four">Four</option>
            </select>
          ) : 'gender' === inputList[step] ? ( // Gender selection
            <select
              required
              name="gender"
              value={userData.gender}
              onChange={handleInputChange}
              className="form-control"
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          ) : (
            <input
              required
              type={inputList[step] === '' || inputList[step] === "phone" ? "number" : "text"}
              name={getInputName()}
              value={getInputValue()}
              onChange={handleInputChange}
              className="form-control"
              placeholder={getCurrentSystemMessage(inputList[step]).text}
            />
          )}
          {inputList[step] === "email" && emailError && ( // Display email error
            <div className="error-message text-danger">{emailError}</div>
          )}
          <button onClick={handleNextStep} className="btn btn-primary mt-2">
            Send
          </button>
        </div>
      );
    }
    if (!userData.club) {
      return (
        <div className="btn-group">
          {clubOptions.map((club) => (
            <button
              key={club}
              onClick={() => handleClubSelect(club)}
              className="btn btn-secondary"
            >
              {club}
            </button>
          ))}
        </div>
      );
    }
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleBackToLogin = () => {
    // Implement your logic for navigating back to the login page here
    window.location.href = "/"; // Example redirection
  };

  return (
    <div className="chat-container">
      <button 
        onClick={handleBackToLogin} 
        className="btn btn-link back-to-login"
        style={{ position: 'absolute', top: '10px', right: '10px' }} // Positioning the button
      >
        Back to Home
      </button>
      <div className="chat-messages">
        {messages.map((message, index) => (
          <div key={index} className={`chat-message ${message.sender}`}>
            {message.text}
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>
      <div className="chat-input">
        {renderInput()}
      </div>
      <div className="predefined-questions">
        {renderPredefinedQuestions()}
      </div>
    </div>
  );
};

export default ChatForm;
