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

const RegistrationEmail = ({ coupon }) => {
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
          { style: heading },
          'Welcome to Kika Makeup and Beauty Academy!'
        ),
        React.createElement(
          Text,
          { style: paragraph },
          'Hi there,'
        ),
        React.createElement(
          Text,
          { style: paragraph },
          'We’re thrilled to have you on board! You’ve successfully registered at Kika Makeup and Beauty Academy, where beauty meets artistry.'
        ),
        coupon &&
          React.createElement(
            Text,
            { style: paragraph },
            `🎉 As a special welcome gift, here is your discount code: `,
            React.createElement('strong', { style: { color: '#fa7268' } }, coupon),
            ' — Use it on your first order!'
          ),

        React.createElement(
          Text,
          { style: paragraph },
          'Explore our exclusive tutorials, expert tips, and latest beauty trends. Click the button below to get started on your beauty journey!'
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
            'Login to Your Account'
          )
        ),
        React.createElement(
          Text,
          { style: paragraph },
          'If you have any questions, feel free to reach out. We’re here to help!'
        ),
        React.createElement(
          Text,
          { style: paragraph },
          'See you soon,',
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

export default RegistrationEmail;

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

const heading = {
  fontSize: '24px',
  fontWeight: 'bold',
  textAlign: 'center',
  margin: '20px 0',
  color: '#333333',
};

const paragraph = {
  fontSize: '16px',
  lineHeight: '26px',
  marginBottom: '20px',
  color: '#555555',
};

const btnContainer = {
  textAlign: 'center',
};

const button = {
  backgroundColor: '#fa7268',
  borderRadius: '4px',
  color: '#ffffff',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center',
  display: 'inline-block',
  padding: '12px 24px',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
};

const hr = {
  borderColor: '#eaeaea',
  margin: '20px 0',
};

const footer = {
  color: '#8898aa',
  fontSize: '12px',
  textAlign: 'center',
};
