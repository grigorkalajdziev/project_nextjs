import { Fragment } from "react";
import Swiper from "react-id-swiper";
import { Container, Row, Col } from "react-bootstrap";
import { IoIosArrowRoundBack, IoIosArrowRoundForward } from "react-icons/io";
import { SectionTitleThree } from "../../components/SectionTitle";
import { ProductGridThreeWrapper } from "../../components/ProductThumb";

const ProductSliderTwo = ({ products }) => {
  const params = {
    loop: false,
    slidesPerView: 4,
    spaceBetween: 30,
    grabCursor: true,
    // autoplay: {
    //   delay: 5000,
    //   disableOnInteraction: false,
    // },
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev"
    },
    renderPrevButton: () => (
      <button className="swiper-button-prev ht-swiper-button-nav">
        <IoIosArrowRoundBack />
      </button>
    ),
    renderNextButton: () => (
      <button className="swiper-button-next ht-swiper-button-nav">
        <IoIosArrowRoundForward />
      </button>
    ),
    breakpoints: {
      1024: {
        slidesPerView: 4
      },
      768: {
        slidesPerView: 3
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
    <Fragment>
      <SectionTitleThree
        title="Carousel of products"
        subtitle="This is where to find your satisfactory products"
      />
      <Container>
        <Row>
          <Col lg={12}>
            <div className="product-slider-container">
              <Swiper {...params}>
                <ProductGridThreeWrapper
                  products={products}
                  sliderClass="swiper-slide"
                />
              </Swiper>
            </div>
          </Col>
        </Row>
      </Container>
    </Fragment>
  );
};

export default ProductSliderTwo;
