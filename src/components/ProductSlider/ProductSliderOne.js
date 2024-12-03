import { Container } from "react-bootstrap";
import Swiper from "react-id-swiper";
import { SectionTitleOne } from "../../components/SectionTitle";
import { ProductGridFourWrapper } from "../../components/ProductThumb";

const ProductSliderOne = ({ products }) => {
  const params = {
    loop: false,
    slidesPerView: 5,
    spaceBetween: 30,
    grabCursor: true,
    // autoplay: {
    //   delay: 5000,
    //   disableOnInteraction: false,
    // },
    pagination: {
      el: ".swiper-pagination",
      clickable: true
    },
    breakpoints: {
      1024: {
        slidesPerView: 5
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
    <div className="product-slider-wrapper space-mb--r100">
      <Container>
        <SectionTitleOne
          title="Popular this week"
          subtitle="LEZADA STORE - SIMPLY AND BASIC"
        />
      </Container>
      <div className="product-slider-container product-slider-container--style2">
        <Swiper {...params}>
          <ProductGridFourWrapper
            products={products}
            sliderClass="swiper-slide"
            bottomSpace="space-mb--50"
          />
        </Swiper>
      </div>
    </div>
  );
};

export default ProductSliderOne;
