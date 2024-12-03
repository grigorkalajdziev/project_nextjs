import Swiper from "react-id-swiper";
import { Container, Row, Col } from "react-bootstrap";

const BrandLogoTwo = ({ brandLogoData }) => {
  const params = {
    loop: false,
    slidesPerView: 5,
    spaceBetween: 30,
    grabCursor: true,
    // autoplay: {
    //   delay: 5000,
    //   disableOnInteraction: false,
    // },

    breakpoints: {
      1024: {
        slidesPerView: 5
      },
      768: {
        slidesPerView: 4
      },
      640: {
        slidesPerView: 3
      },
      320: {
        slidesPerView: 2
      }
    }
  };
  return (
    <div className="brand-carousel-area space-mb--r130">
      <Container>
        <Row>
          <Col lg={12}>
            <div className="brand-carousel-content text-center space-mb--50">
              <h4 className="brand-carousel-content__title">OUR BRANDS</h4>
              <p className="brand-carousel-content__text">
                “ It's important to have pieces of jewelry that are timeless and
                look chic despite ever-changing fashions. ”
              </p>
            </div>

            <div className="brand-logo-wrapper">
              <Swiper {...params}>
                {brandLogoData &&
                  brandLogoData.map((single, i) => {
                    return (
                      <div className="single-brand text-center" key={i}>
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
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default BrandLogoTwo;
