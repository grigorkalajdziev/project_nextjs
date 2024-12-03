import Swiper from "react-id-swiper";
import { Container, Row, Col } from "react-bootstrap";

const ImageSliderThree = ({ imageSliderData }) => {
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
    <div className="image-slider-area space-pt--r130 space-pb--r130 bg-color--grey-three">
      <Container className="wide">
        <Row>
          <Col lg={12} className="text-center">
            <div className="instagram-title-container instagram-title-container--style-two space-mb--r80">
              <h4 className="title">@LEZADA_941</h4>
              <h2 className="subtitle">Follow us on instagram</h2>
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

export default ImageSliderThree;
