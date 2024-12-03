import Link from "next/link";
import Swiper from "react-id-swiper";
import { Container, Row, Col } from "react-bootstrap";

const HeroSliderSeven = ({ sliderData }) => {
  const params = {
    loop: true,
    speed: 1000,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false,
    },
    effect: "fade",
    watchSlidesVisibility: true,
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    renderPrevButton: () => (
      <button className="swiper-button-prev ht-swiper-button-nav"></button>
    ),
    renderNextButton: () => (
      <button className="swiper-button-next ht-swiper-button-nav"></button>
    ),
  };
  return (
    <div className="hero-slider-seven">
      <div className="hero-slider-seven__wrapper">
        <Swiper {...params}>
          {sliderData &&
            sliderData.map((single, i) => {
              return (
                <div
                  className="hero-slider-seven__slide bg-img"
                  style={{ backgroundImage: `url(${single.bgImage})` }}
                  key={i}
                >
                  <Container className="h-100">
                    <Row className="align-items-center flex-column flex-lg-row justify-content-center justify-content-lg-start h-100">
                      <Col lg={5} className="ml-auto">
                        <div className="hero-slider-seven__content">
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
                              <a className="lezada-button lezada-button--medium">
                                shop now
                              </a>
                            </Link>
                          </div>
                        </div>
                      </Col>
                    </Row>
                  </Container>
                  <div className="hero-slider-seven__pagination">
                    <span className="current">{i + 1}</span>
                    <span className="border"></span>
                    <span className="total">{sliderData.length}</span>
                  </div>
                </div>
              );
            })}
        </Swiper>
      </div>
    </div>
  );
};

export default HeroSliderSeven;
