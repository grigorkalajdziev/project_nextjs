import Swiper from "react-id-swiper";
import { Container, Row, Col } from "react-bootstrap";

const ImageSliderOne = ({ imageSliderData }) => {
  const params = {
    loop: false,
    slidesPerView: 4,
    spaceBetween: 30,
    grabCursor: true,
    // autoplay: {
    //   delay: 5000,
    //   disableOnInteraction: false,
    // },

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
    <div className="image-slider-area space-mb--r130">
      <Container className="wide">
        <Row>
          <Col lg={12} className="text-center">
            <div className="instagram-title-container space-mb--r80">
              <h4 className="title">FOLLOW US</h4>
              <h2 className="subtitle">@lezada_941</h2>
            </div>
            <Swiper {...params}>
              {imageSliderData &&
                imageSliderData.map((single, i) => {
                  return (
                    <div className="single-image text-center" key={i}>
                      <a href={single.url} target="_blank">
                        <img
                          src={process.env.PUBLIC_URL + single.image}
                          className="img-fluid"
                          alt=""
                        />
                      </a>
                    </div>
                  );
                })}
            </Swiper>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default ImageSliderOne;
