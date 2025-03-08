import React from 'react';
import {
  Body,
  Button,
  Container,
  Head,
  Hr,
  Html,
  Img,
  Preview,
  Section,
  Text,
} from '@react-email/components';

const SubscribeResendEmail = () => {  
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
        'Welcome to Kika Makeup and Beauty Academy!'
      ),
      React.createElement(
        Container,
        { style: container },
        React.createElement(Img, {
          src: "https://www.kikamakeupandbeautyacademy.com/assets/images/logo.png",
          width: '170',
          height: '50',
          alt: 'Kika Makeup and Beauty Academy',
          style: logo,
        }),
        React.createElement(
          Text,
          { style: paragraph },
          'Hi,'
        ),
        React.createElement(
          Text,
          { style: paragraph },
          'Thank you for subscribing to Kika Makeup and Beauty Academy. We are excited to help you explore the world of makeup and beauty. Stay tuned for exclusive tips, tutorials, and offers!'
        ),
        React.createElement(
          Section,
          { style: btnContainer },
          React.createElement(
            Button,
            {
              style: button,
              href: 'https://www.kikamakeupandbeautyacademy.com/other/login-register',
            },
            'Get started'
          )
        ),
        React.createElement(
          Text,
          { style: paragraph },
          'Best,',
          React.createElement('br', null),
          'The Kika Makeup and Beauty Academy Team'
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

export default SubscribeResendEmail;

// Styles
const main = {
  backgroundColor: '#ffffff',
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif',
};

const container = {
  margin: '0 auto',
  padding: '20px 0 48px',
};

const logo = {
  margin: '0 auto',
};

const paragraph = {
  fontSize: '16px',
  lineHeight: '26px',
  marginBottom: '20px',
};

const btnContainer = {
  textAlign: 'center',
};

const button = {
  backgroundColor: '#fa7268',
  borderRadius: '3px',
  color: '#fff',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center',
  display: 'block',
  padding: '12px',
};

const hr = {
  borderColor: '#cccccc',
  margin: '20px 0',
};

const footer = {
  color: '#8898aa',
  fontSize: '12px',
};
