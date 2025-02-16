// components/EmailTemplate.js
import React from 'react';

const EmailTemplate = ({ name, email, subject, message }) => (
  <div>
    <h1>New Message from {name}</h1>
    <p><strong>Email:</strong> {email}</p>
    <p><strong>Subject:</strong> {subject}</p>
    <p><strong>Message:</strong> {message}</p>
  </div>
);

export default EmailTemplate;
