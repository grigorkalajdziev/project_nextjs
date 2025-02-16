import { Html, Head, Preview, Body, Container, Heading, Text, A, Img } from '@react-email/components';

const WelcomeEmail = () => (
  <Html>
    <Head />
    <Preview>Welcome to Kika Makeup and Beauty Academy!</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>Thank you for subscribing!</Heading>
        <Text style={paragraph}>We're excited to have you on board. Stay tuned for updates and exclusive offers.</Text>

        {/* Image */}
        <Container style={imageContainer}>
        <Img
          src="https://www.kikamakeupandbeautyacademy.com/assets/images/logo.png"  // Replace with your image URL
          alt="Kika Makeup and Beauty Academy"
          style={image}
        />
        </Container>

        <Text style={paragraph}>
          Get ready to dive into the world of beauty, tutorials, and special promotions. We're here to help you feel beautiful and confident.
        </Text>

        {/* Additional Text */}
        <Text style={paragraph}>
          If you have any questions, feel free to contact us at <b>support@kikamakeupandbeautyacademy.com</b>.
        </Text>
      </Container>
    </Body>
  </Html>
);

export default WelcomeEmail;

// Styles
const main = {
  backgroundColor: '#f6f9fc',
  padding: '20px',
};

const imageContainer = {
  textAlign: 'center',  // Center the image
  marginBottom: '20px',  // Space below the image
};

const container = {
  backgroundColor: '#ffffff',
  border: '1px solid #e1e4e8',
  borderRadius: '5px',
  padding: '20px',
  maxWidth: '600px',
  margin: '0 auto',
};

const h1 = {
  color: '#333333',
  fontSize: '24px',
  marginBottom: '20px',
};

const paragraph = {
  color: '#555555',
  fontSize: '16px',
  lineHeight: '1.5',
  marginBottom: '20px',
};

const image = {
  textAlign: 'center',
  width: '30%',
  borderRadius: '8px',
  marginBottom: '20px',
};

const buttonContainer = {
  textAlign: 'center',
  marginBottom: '20px',
};

const buttonStyle = {
  backgroundColor: '#4CAF50',
  color: '#ffffff',
  fontSize: '16px',
  padding: '12px 30px',
  borderRadius: '4px',
  textDecoration: 'none',
  display: 'inline-block',
  fontWeight: 'bold',
};
