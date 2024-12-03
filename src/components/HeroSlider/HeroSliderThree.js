import Link from "next/link";
import Swiper from "react-id-swiper";
import { Container, Row, Col } from "react-bootstrap";

const HeroSliderThree = ({ sliderData, spaceBottomClass }) => {
  const params = {
    loop: true,
    speed: 1000,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false
    },
    watchSlidesVisibility: true,
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev"
    },
    pagination: {
      el: ".swiper-pagination",
      clickable: true
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
      className={`hero-slider-three ${
        spaceBottomClass ? spaceBottomClass : ""
      }`}
    >
      <div className="hero-slider-three__wrapper">
        <Swiper {...params}>
          {sliderData &&
            sliderData.map((single, i) => {
              return (
                <div
                  className="hero-slider-three__slide bg-img"
                  style={{ backgroundImage: `url(${single.bgImage})` }}
                  key={i}
                >
                  <Container className="h-100">
                    <Row className="align-items-center flex-column flex-lg-row justify-content-center justify-content-lg-start h-100">
                      <Col lg={6} className="order-2 order-lg-1">
                        <div className="hero-slider-three__content">
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
                              <a>shop collection</a>
                            </Link>
                          </div>
                        </div>
                      </Col>
                      {single.image ? (
                        <Col lg={6} className="order-1 order-lg-2">
                          <div className="hero-slider-three__image">
                            <img
                              src={process.env.PUBLIC_URL + single.image}
                              alt=""
                              className="img-fluid"
                            />
                          </div>
                        </Col>
                      ) : (
                        ""
                      )}
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

export default HeroSliderThree;
