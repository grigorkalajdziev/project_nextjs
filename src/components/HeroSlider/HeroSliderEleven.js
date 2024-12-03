import { Container, Row, Col } from "react-bootstrap";
import Link from "next/link";
import Swiper from "react-id-swiper";

const HeroSliderEleven = ({ sliderData, spaceBottomClass }) => {
  const params = {
    loop: true,
    speed: 1000,
    // autoplay: {
    //   delay: 5000,
    //   disableOnInteraction: false
    // },
    watchSlidesVisibility: true,
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev"
    },
    renderPrevButton: () => (
      <button className="swiper-button-prev ht-swiper-button-nav"></button>
    ),
    renderNextButton: () => (
      <button className="swiper-button-next ht-swiper-button-nav"></button>
    )
  };
  return (
    <div
      className={`hero-slider-eleven ${
        spaceBottomClass ? spaceBottomClass : ""
      }`}
    >
      <div className="hero-slider-eleven__wrapper">
        <Swiper {...params}>
          {sliderData &&
            sliderData.map((single, i) => {
              return (
                <div
                  className="hero-slider-eleven__slide"
                  style={{ backgroundColor: single.bgColor }}
                  key={i}
                >
                  <Container className="h-100">
                    <Row className="h-100">
                      <Col lg={6} className="align-self-center">
                        <div className="hero-slider-eleven__content text-center">
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
                      <Col lg={6} className="align-self-end">
                        <div className="hero-slider-eleven__image">
                          <img
                            src={process.env.PUBLIC_URL + single.image}
                            alt=""
                            className="img-fluid"
                          />
                        </div>
                      </Col>
                    </Row>
                  </Container>
                  <div className="hero-slider-eleven__pagination">
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

export default HeroSliderEleven;
