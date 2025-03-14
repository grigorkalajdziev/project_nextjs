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

const LoginSuccessEmail_MK = () => {
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
        'Добредојдовте назад во Kika Makeup and Beauty Academy!'
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
          'Добредојдовте назад!'
        ),
        React.createElement(
          Text,
          { style: paragraph },
          "Драго ни е што повторно ве гледаме во Kika Makeup and Beauty Academy. Уживајте во вашата посета и истражете ги нашите најнови туторијали, совети за убавина и производи."
        ),
        React.createElement(
          Section,
          { style: btnContainer },
          React.createElement(
            Button,
            {
              style: button,
              href: 'https://www.kikamakeupandbeautyacademy.com/',
            },
            'Оди во твојата сметка'
          )
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

export default LoginSuccessEmail_MK;

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
