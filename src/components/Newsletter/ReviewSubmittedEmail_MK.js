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

const ReviewSubmittedEmail_MK = ({ reviewerName, productName, rating, message }) => {
  const starUrl = "https://fonts.gstatic.com/s/e/notoemoji/16.0/2b50/32.png"; // Star emoji URL

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
        'Нова рецензија е поднесена!'
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
          'Нова рецензија е поднесена!'
        ),
        React.createElement(
          Text,
          { style: paragraph },
          `${reviewerName} остави рецензија за ${productName}.`
        ),
        React.createElement(
          Text,
          { style: paragraph },
          'Оценка: ',
          [...Array(rating)].map((_, i) => (
            React.createElement(Img, {
              key: i,
              src: starUrl,
              width: '16',
              height: '16',
              alt: 'Ѕвезда',
              style: { marginRight: '5px', display: 'inline-block' },
            })
          ))
        ),
        React.createElement(
          Text,
          { style: paragraph },
          `Порака: ${message}`
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
            'Погледнете ја рецензијата'
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

export default ReviewSubmittedEmail_MK;

// Styles (unchanged)
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
