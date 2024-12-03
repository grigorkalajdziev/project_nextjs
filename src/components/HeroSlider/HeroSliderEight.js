import Link from "next/link";
import Swiper from "react-id-swiper";
import { Container, Row, Col } from "react-bootstrap";

const HeroSliderEight = ({ sliderData, spaceBottomClass }) => {
  return (
    <div
      className={`hero-slider-eight ${
        spaceBottomClass ? spaceBottomClass : ""
      }`}
    >
      <div className="hero-slider-eight__wrapper">
        <Swiper>
          {sliderData &&
            sliderData.map((single, i) => {
              return (
                <div
                  className="hero-slider-eight__slide bg-img"
                  style={{ backgroundImage: `url(${single.bgImage})` }}
                  key={i}
                >
                  <Container className="h-100">
                    <Row className="align-items-center flex-column flex-lg-row justify-content-center justify-content-lg-start h-100">
                      <Col lg={6} className="order-2 order-lg-1">
                        <div className="hero-slider-eight__content">
                          <h5 className="sub-title">{single.subtitle}</h5>
                          <h1
                            className="title"
                            dangerouslySetInnerHTML={{ __html: single.title }}
                          />
                          <div className="slider-link">
                            <Link
                              href={single.url}
                              as={process.env.PUBLIC_URL + single.url}
                            >
                              <a className="lezada-button lezada-button--medium lezada-button--transparent-white">
                                shop now
                              </a>
                            </Link>
                          </div>
                        </div>
                      </Col>
                    </Row>
                  </Container>
                </div>
              );
            })}
        </Swiper>
      </div>
    </div>
  );
};

export default HeroSliderEight;
