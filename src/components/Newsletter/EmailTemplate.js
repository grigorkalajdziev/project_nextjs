import React from 'react';
import {
  Body,
  Container,
  Head,
  Hr,
  Html,
  Img,
  Preview,
  Section,
  Text,
} from '@react-email/components';

const ContactEmailTemplate = ({ name, email, subject, message }) => {
  return React.createElement(
    Html,
    null,
    React.createElement(Head, null),
    React.createElement(
      Body,
      { style: main },
      React.createElement(
        Preview,
        null,
        `New Message from ${name}`
      ),
      React.createElement(
        Container,
        { style: container },
        // Logo image added at the top
        React.createElement(Img, {
          src: "https://www.kikamakeupandbeautyacademy.com/assets/images/logo.png",
          width: 170,
          height: 50,
          alt: "Kika Makeup and Beauty Academy",
          style: logo,
        }),
        React.createElement(
          Text,
          { style: heading },
          'You Have a New Message!'
        ),
        React.createElement(
          Text,
          { style: paragraph },
          'You have received a new message via the contact form. Here are the details:'
        ),
        React.createElement(
          Section,
          { style: detailsSection },
          React.createElement(Text, { style: label }, 'Name:'),
          React.createElement(Text, { style: value }, name)
        ),
        React.createElement(
          Section,
          { style: detailsSection },
          React.createElement(Text, { style: label }, 'Email:'),
          React.createElement(Text, { style: value }, email)
        ),
        React.createElement(
          Section,
          { style: detailsSection },
          React.createElement(Text, { style: label }, 'Subject:'),
          React.createElement(Text, { style: value }, subject)
        ),
        React.createElement(
          Section,
          { style: detailsSection },
          React.createElement(Text, { style: label }, 'Message:'),
          React.createElement(Text, { style: value }, message)
        ),
        React.createElement(Hr, { style: hr }),
        React.createElement(
          Text,
          { style: footer },
          '2025 © Kika Makeup and Beauty Academy, Ohrid 6000, Macedonia'
        )
      )
    )
  );
};

export default ContactEmailTemplate;

// Styles
const main = {
  backgroundColor: '#ffffff', // white background for the entire email
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif',
};

const container = {
  margin: '0 auto',
  padding: '20px 0 48px',
  backgroundColor: '#ffffff', // White background for the container
  borderRadius: '8px',
};

const logo = {
  margin: '0 auto',
  display: 'block',
  marginBottom: '20px',
};

const heading = {
  fontSize: '24px',
  fontWeight: 'bold',
  textAlign: 'center',
  color: '#333333', // Dark text
  marginBottom: '15px', // Add margin at the bottom for spacing
  padding: '0 10px', // Add padding inside
};

const paragraph = {
  fontSize: '16px',
  lineHeight: '26px',
  marginBottom: '20px',
  textAlign: 'center',
  color: '#555555',
  padding: '0 10px', // Add padding inside for spacing
};

const detailsSection = {
  marginBottom: '15px',
};

const label = {
  fontSize: '14px',
  fontWeight: 'bold',
  color: '#333333',
  marginBottom: '5px', // Add margin below the label
};

const value = {
  fontSize: '14px',
  color: '#555555',
  marginLeft: '5px',
  marginBottom: '10px', // Add margin below the value
};

const hr = {
  border: 'none',
  borderTop: '1px solid #eaeaea',
  margin: '20px 0',
};

const footer = {
  fontSize: '12px',
  color: '#8898aa',
  textAlign: 'center',
  padding: '10px 0', // Add padding at the top and bottom
};
