import React, { useState } from 'react';
import "../index.css";
import "./Contact.css";
import Nav from './Nav';
import emailjs from 'emailjs-com'; 
import { useNavigate } from 'react-router-dom';  // Import useNavigate

function Contact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [emailError, setEmailError] = useState('');
  const navigate = useNavigate();  // Use navigate hook

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailChange = (e) => {
    const inputEmail = e.target.value;
    setEmail(inputEmail);

    if (!validateEmail(inputEmail)) {
      setEmailError('Please enter a valid email address.');
    } else {
      setEmailError('');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setEmailError('Please provide a valid email before submitting.');
      return;
    }

    const templateParams = {
      from_name: name,
      from_email: email,
      message: message,
    };

    emailjs.send('finance-manager', 'finance-manager', templateParams, 'Xf6azrxo-2fVUNC3p')
      .then((response) => {
        console.log('Message sent successfully:', response);

        setName('');
        setEmail('');
        setMessage('');
        setEmailError('');
      })
      .catch((error) => {
        console.log('Error in sending message:', error);
      });
  };

  const handleClose = () => {
    navigate("/");  // This will navigate to the home page
  };

  return (
    <div>
      <Nav />
    
      <div className="contact-container">
        <button className="close-icon" onClick={handleClose}>
          &times;
        </button>
        <h1>Contact Management</h1>
        <p>If you have any questions or need assistance, feel free to reach out to us!</p>
        <form onSubmit={handleSubmit} className="contact-form">
          <div className="input-group">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Enter your name"
            />
          </div>
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={handleEmailChange}
              required
              placeholder="Enter your email"
            />
            {emailError && <p className="error-message">{emailError}</p>}
          </div>
          <div className="input-group">
            <label htmlFor="message">Message</label>
            <textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              placeholder="Enter your message"
            />
          </div>
          <button type="submit" className="submit-btn">Send Message</button>
        </form>
      </div>
    </div>
  );
}

export default Contact;