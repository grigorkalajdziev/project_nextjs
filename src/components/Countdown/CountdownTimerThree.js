import Link from "next/link";
import { Container, Row, Col } from "react-bootstrap";
import Countdown from "react-countdown";
import { IoIosCart } from "react-icons/io";
import Renderer from "./Renderer";

const CountdownTimerThree = ({
  title,
  image,
  dateTime,
  url,
  buttonText,
  spaceBottomClass,
  containerType
}) => {
  return (
    <div
      className={`countdown-timer-wrapper ${
        spaceBottomClass ? spaceBottomClass : ""
      }`}
    >
      <Container className={`${containerType === "normal" ? "" : "wide"}`}>
        <Row>
          <Col lg={12}>
            <div className="countdown-background space-pt--30 space-pb--30">
              <Row className="align-items-center">
                <Col lg={3} xl={5}>
                  <div className="countdown-image text-center space-mb-mobile-only--50">
                    <img
                      src={process.env.PUBLIC_URL + image}
                      className="img-fluid"
                      alt=""
                    />
                  </div>
                </Col>
                <Col lg={9} xl={7}>
                  <div className="countdown-wrapper text-center">
                    <h3>{title}</h3>
                    <div className="deal-countdown">
                      <Countdown
                        date={new Date(dateTime)}
                        renderer={Renderer}
                      />
                    </div>
                    <Link href={url} as={process.env.PUBLIC_URL + url}>
                      <a className="lezada-button lezada-button--medium lezada-button--icon--left">
                        <IoIosCart /> {buttonText}
                      </a>
                    </Link>
                  </div>
                </Col>
              </Row>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default CountdownTimerThree;
