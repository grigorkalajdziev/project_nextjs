import { Fragment } from "react";
import { Container, Row, Col } from "react-bootstrap";
import Countdown from "react-countdown";
import { HeaderTwo } from "../../components/Header";
import Renderer from "../../components/Countdown/Renderer";
import { SubscribeEmail } from "../../components/Newsletter";

const ComingSoon = () => {
  return (
    <Fragment>
      <HeaderTwo />
      <div
        className="coming-soon-area bg-coming-soon"
        style={{
          backgroundImage: `url(${
            process.env.PUBLIC_URL +
            "/assets/images/backgrounds/coming-soon-bg.png"
          })`
        }}
      >
        <Container>
          <Row>
            <Col lg={8}>
              <div className="coming-soon-content">
                <div className="subscription-form subscription-form--comingsoon">
                  <h4 className="coming-soon-subtitle space-mb--10">
                    784 Kris Estate Suite 112
                  </h4>
                  <h2 className="coming-soon-title space-mb--40">
                    Website coming soon
                  </h2>
                  <div className="deal-countdown coming-soon-deal-countdown">
                    <Countdown
                      date={new Date("July 07, 2020 12:12:00")}
                      renderer={Renderer}
                    />
                  </div>
                  <div className="coming-soon-subscribe-form">
                    <SubscribeEmail mailchimpUrl="https://devitems.us11.list-manage.com/subscribe/post?u=6bbb9b6f5827bd842d9640c82&amp;id=05d85f18ef" />
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </Fragment>
  );
};

export default ComingSoon;
