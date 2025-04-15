import { useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";

const BreadcrumbOne = ({ children, backgroundImage, pageTitle, className }) => {
  const [scrollY, setScrollY] = useState(0);
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className={`breadcrumb-area space-pt--70 space-pb--70 ${
        className ? className : ""
      }`}
      style={{
        backgroundImage: `url("${process.env.PUBLIC_URL + backgroundImage}")`,
        backgroundPositionY: `${scrollY * 0.5}px`
      }}
    >
      <Container>
        <Row>
          <Col>
            <h1 className="breadcrumb__title">{pageTitle}</h1>
            {children}
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default BreadcrumbOne;
