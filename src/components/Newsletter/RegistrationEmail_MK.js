import React from "react";
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
} from "@react-email/components";

const RegistrationEmail_MK = ({ coupon }) => {
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
        "Добредојдовте во Kika Makeup and Beauty Academy!"
      ),
      React.createElement(
        Container,
        { style: container },
        React.createElement(Img, {
          src: "https://www.kikamakeupandbeautyacademy.com/assets/images/logo.png",
          width: "170",
          height: "50",
          alt: "Kika Makeup and Beauty Academy",
          style: logo,
        }),
        React.createElement(
          Text,
          { style: heading },
          "Добредојдовте во Kika Makeup and Beauty Academy!"
        ),
        React.createElement(Text, { style: paragraph }, "Здраво,"),
        React.createElement(
          Text,
          { style: paragraph },
          "Со задоволство ве поздравуваме! Успешно се регистриравте во Kika Makeup and Beauty Academy, местото каде што убавината станува уметност."
        ),
        coupon &&
          React.createElement(
            Text,
            { style: paragraph },
            `🎉 Како посебен подарок за добредојде, еве го вашиот код за попуст: `,
            React.createElement(
              "strong",
              { style: { color: "#fa7268" } },
              coupon
            ),
            " — искористете го при вашата прва нарачка!"
          ),

        React.createElement(
          Text,
          { style: paragraph },
          "Истражете ги нашите ексклузивни туторијали, стручни совети и најновите трендови во шминката. Кликнете на копчето подолу за да го започнете вашето патување во светот на убавината!"
        ),
        React.createElement(
          Section,
          { style: btnContainer },
          React.createElement(
            Button,
            {
              style: button,
              href: "https://www.kikamakeupandbeautyacademy.com/other/login-register",
            },
            "Најавете се во вашиот профил"
          )
        ),
        React.createElement(
          Text,
          { style: paragraph },
          "Доколку имате било какви прашања, слободно контактирајте не. Тука сме да ви помогнеме!"
        ),
        React.createElement(
          Text,
          { style: paragraph },
          "Се гледаме наскоро,",
          React.createElement("br", null),
          "Тимот на Kika Makeup and Beauty Academy"
        ),
        React.createElement(Hr, { style: hr }),
        React.createElement(
          Text,
          { style: footer },
          "2025 © Kika Makeup and Beauty Academy, Охрид 6000, Македонија"
        )
      )
    )
  );
};

export default RegistrationEmail_MK;

// Стилови
const main = {
  backgroundColor: "#ffffff",
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif',
};

const container = {
  margin: "0 auto",
  padding: "20px 0 48px",
};

const logo = {
  margin: "0 auto",
};

const heading = {
  fontSize: "24px",
  fontWeight: "bold",
  textAlign: "center",
  margin: "20px 0",
  color: "#333333",
};

const paragraph = {
  fontSize: "16px",
  lineHeight: "26px",
  marginBottom: "20px",
  color: "#555555",
};

const btnContainer = {
  textAlign: "center",
};

const button = {
  backgroundColor: "#fa7268",
  borderRadius: "4px",
  color: "#ffffff",
  fontSize: "16px",
  fontWeight: "bold",
  textDecoration: "none",
  textAlign: "center",
  display: "inline-block",
  padding: "12px 24px",
  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
};

const hr = {
  borderColor: "#eaeaea",
  margin: "20px 0",
};

const footer = {
  color: "#8898aa",
  fontSize: "12px",
  textAlign: "center",
};
