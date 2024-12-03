import Link from "next/link";
import { Container, Row, Col } from "react-bootstrap";
import Countdown from "react-countdown";
import { IoIosCart } from "react-icons/io";
import Renderer from "./Renderer";

const CountdownTimerOne = ({
  title,
  backgroundImage,
  dateTime,
  url,
  buttonText,
  spaceBottomClass,
}) => {
  return (
    <div
      className={`countdown-timer-wrapper ${
        spaceBottomClass ? spaceBottomClass : ""
      }`}
    >
      <Container className="wide">
        <Row>
          <Col lg={12}>
            <div
              className="countdown-background bg-img space-pt--r100 space-pb--r100"
              style={{
                backgroundImage: `url(${backgroundImage})`,
              }}
            >
              <Row>
                <Col lg={9} xl={7} className="ml-auto">
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

export default CountdownTimerOne;
