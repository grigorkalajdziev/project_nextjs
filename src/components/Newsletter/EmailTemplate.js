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
          { style: header },
          'New Message Received'
        ),
        React.createElement(
          Text,
          { style: subheader },
          'You have received a new message via the contact form.'
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
  backgroundColor: '#ffffff', // dark background
  color: '#ffffff',
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif',
  padding: '20px',
};

const container = {
  margin: '0 auto',
  padding: '20px',
  backgroundColor: '#fad5ce', // button color background
  borderRadius: '8px',
};

const logo = {
  margin: '0 auto',
  display: 'block',
  marginBottom: '20px',
};

const header = {
  fontSize: '24px',
  fontWeight: 'bold',
  marginBottom: '10px',
  color: '#222222', // dark text inside container
};

const subheader = {
  fontSize: '16px',
  marginBottom: '20px',
  color: '#222222', // dark text inside container
};

const detailsSection = {
  marginBottom: '15px',
};

const label = {
  fontSize: '14px',
  fontWeight: 'bold',
  color: '#222222',
};

const value = {
  fontSize: '14px',
  color: '#222222',
  marginLeft: '5px',
};

const hr = {
  border: 'none',
  borderTop: '1px solid #444444',
  margin: '20px 0',
};

const footer = {
  fontSize: '12px',
  color: '#aaaaaa',
  textAlign: 'center',
};
