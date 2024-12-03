import { useState } from "react";
import Swiper from "react-id-swiper";
import { IoIosArrowForward, IoIosArrowBack } from "react-icons/io";
import { Container, Row, Col } from "react-bootstrap";

const TestimonialThree = ({
  testimonialData,
  backgroundImage,
  spaceBottom
}) => {
  const [swiper, setSwiper] = useState(null);

  const goNext = () => {
    if (swiper !== null) {
      swiper.slideNext();
    }
  };

  const goPrev = () => {
    if (swiper !== null) {
      swiper.slidePrev();
    }
  };
  const params = {
    loop: true,
    slidesPerView: 3,
    spaceBetween: 30,
    grabCursor: true,
    // autoplay: {
    //   delay: 5000,
    //   disableOnInteraction: false
    // },
    breakpoints: {
      1024: {
        slidesPerView: 3
      },
      768: {
        slidesPerView: 2
      },
      640: {
        slidesPerView: 2
      },
      320: {
        slidesPerView: 1
      }
    }
  };
  return (
    <div
      className={`testimonial-area bg-img ${
        spaceBottom ? spaceBottom : "space-pt--r130 space-pb--r130"
      }`}
      style={{
        backgroundImage: `${
          backgroundImage
            ? `url(${process.env.PUBLIC_URL + backgroundImage})`
            : "none"
        } `
      }}
    >
      <Container className="wide">
        <Row>
          <Col lg={12}>
            <Row className="align-items-center">
              <Col xs={12}>
                <div className="section-title-container space-mb--r80">
                  <h2 className="section-title section-title--style-three position-relative">
                    Testimonials
                    <div className="testimonial-slider-button-wrapper">
                      <button
                        className="swiper-button-prev ht-swiper-button-nav"
                        onClick={goPrev}
                      >
                        <IoIosArrowBack />
                      </button>
                      <button
                        className="swiper-button-next ht-swiper-button-nav"
                        onClick={goNext}
                      >
                        <IoIosArrowForward />
                      </button>
                    </div>
                  </h2>
                </div>
              </Col>
            </Row>
            <div className="testimonial-wrapper">
              <Swiper {...params} getSwiper={setSwiper}>
                {testimonialData &&
                  testimonialData.map((single, i) => {
                    return (
                      <div className="multi-testimonial-single-item" key={i}>
                        <div className="multi-testimonial-single-item__text">
                          {single.content}
                        </div>
                        <div className="multi-testimonial-single-item__author-info">
                          <div className="image">
                            <img
                              src={process.env.PUBLIC_URL + single.image}
                              className="img-fluid"
                              alt=""
                            />
                          </div>
                          <div className="content">
                            <p className="name">{single.name}</p>
                            <span className="designation">
                              / {single.designation}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </Swiper>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default TestimonialThree;
