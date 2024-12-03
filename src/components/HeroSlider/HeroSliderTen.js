import Link from "next/link";
import { Container, Row, Col } from "react-bootstrap";
import Swiper from "react-id-swiper";

const HeroSliderTen = ({ sliderData }) => {
  const params = {
    loop: true,
    speed: 1000,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false
    },
    watchSlidesVisibility: true,
    effect: "fade",
    pagination: {
      el: ".swiper-pagination",
      clickable: true
    }
  };
  return (
    <div className="hero-slider-banner-area">
      <Row className="no-gutters">
        <Col lg={6}>
          <div className="hero-slider-ten">
            <div className="hero-slider-ten__wrapper">
              <Swiper {...params}>
                {sliderData &&
                  sliderData.map((single, i) => {
                    return (
                      <div
                        className="hero-slider-ten__slide bg-color--orange"
                        key={i}
                      >
                        <Container className="h-100">
                          <Row className="align-items-center h-100">
                            <div className="hero-slider-ten__content w-100">
                              <div className="image">
                                <img
                                  src={process.env.PUBLIC_URL + single.image}
                                  className="img-fluid"
                                  alt=""
                                />
                              </div>
                              <div className="content">
                                <h3 className="title">{single.title}</h3>
                                <p className="price">{single.subtitle}</p>
                              </div>
                            </div>
                          </Row>
                        </Container>
                      </div>
                    );
                  })}
              </Swiper>
            </div>
          </div>
        </Col>
        <Col lg={6}>
          <div
            className="background-cta-area h-100 d-flex align-items-center justify-content-center"
            style={{
              backgroundImage: `url(${
                process.env.PUBLIC_URL +
                "/assets/images/hero-slider/hero-slider-ten/slider-bg-image.jpg"
              })`
            }}
          >
            <div className="background-cta-content text-center">
              <h4 className="background-cta-content__subtitle">
                Available Now
              </h4>
              <h2 className="background-cta-content__title">
                Swim Collection <br /> Spring Summer 2024
              </h2>
              <Link
                href="/shop/left-sidebar"
                as={process.env.PUBLIC_URL + "/shop/left-sidebar"}
              >
                <a className="background-cta-content__btn">SHOP NOW</a>
              </Link>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default HeroSliderTen;
