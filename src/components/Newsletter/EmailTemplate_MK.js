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

const ContactEmailTemplate_MK = ({ name, email, subject, message }) => {
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
        `Нова порака од ${name}`
      ),
      React.createElement(
        Container,
        { style: container },
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
          'Имате нова порака!'
        ),
        React.createElement(
          Text,
          { style: paragraph },
          'Примивте нова порака преку контакт формуларот. Еве ги деталите:'
        ),
        React.createElement(
          Section,
          { style: detailsSection },
          React.createElement(Text, { style: label }, 'Име:'),
          React.createElement(Text, { style: value }, name)
        ),
        React.createElement(
          Section,
          { style: detailsSection },
          React.createElement(Text, { style: label }, 'Е-пошта:'),
          React.createElement(Text, { style: value }, email)
        ),
        React.createElement(
          Section,
          { style: detailsSection },
          React.createElement(Text, { style: label }, 'Тема:'),
          React.createElement(Text, { style: value }, subject)
        ),
        React.createElement(
          Section,
          { style: detailsSection },
          React.createElement(Text, { style: label }, 'Порака:'),
          React.createElement(Text, { style: value }, message)
        ),
        React.createElement(Hr, { style: hr }),
        React.createElement(
          Text,
          { style: footer },
          '2025 © Kika Makeup and Beauty Academy, Охрид 6000, Македонија'
        )
      )
    )
  );
};

export default ContactEmailTemplate_MK;

// Reuse the same styles
const main = {
  backgroundColor: '#ffffff',
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif',
};

const container = {
  margin: '0 auto',
  padding: '20px 0 48px',
  backgroundColor: '#ffffff',
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
  color: '#333333',
  marginBottom: '15px',
  padding: '0 10px',
};

const paragraph = {
  fontSize: '16px',
  lineHeight: '26px',
  marginBottom: '20px',
  textAlign: 'center',
  color: '#555555',
  padding: '0 10px',
};

const detailsSection = {
  marginBottom: '15px',
};

const label = {
  fontSize: '14px',
  fontWeight: 'bold',
  color: '#333333',
  marginBottom: '5px',
};

const value = {
  fontSize: '14px',
  color: '#555555',
  marginLeft: '5px',
  marginBottom: '10px',
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
  padding: '10px 0',
};
