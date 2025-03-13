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

const SubscribeResendEmail_MK = () => {  
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
        'Добредојдовте во Кика Makeup и Beauty Academy!'
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
          'Здраво,'
        ),
        React.createElement(
          Text,
          { style: paragraph },
          'Ви благодариме што се пријавивте во Кика Makeup и Beauty Academy. Возбудени сме што ќе ви помогнеме да го истражите светот на шминка и убавина. Останете со нас за ексклузивни совети, туторијали и понуди!'
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
            'Започнете'
          )
        ),
        React.createElement(
          Text,
          { style: paragraph },
          'Поздрав,',
          React.createElement('br', null),
          'Тимот на Кика Makeup и Beauty Academy'
        ),
        React.createElement(Hr, { style: hr }),
        React.createElement(
          Text,
          { style: footer },
          '2025 © Kika Makeup и Beauty Academy, Охрид 6000, Македонија'
        )
      )
    )
  );
};

export default SubscribeResendEmail_MK;

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
  textAlign: 'center',
};
