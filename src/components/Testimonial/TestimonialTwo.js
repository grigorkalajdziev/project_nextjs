import Swiper from "react-id-swiper";
import { Container, Row, Col } from "react-bootstrap";
import { SectionTitleOne } from "../../components/SectionTitle";
const TestimonialTwo = ({ testimonialData, backgroundImage }) => {
  const params = {
    loop: true,
    slidesPerView: 1,
    spaceBetween: 30,
    grabCursor: true
    // autoplay: {
    //   delay: 5000,
    //   disableOnInteraction: false,
    // }
  };
  return (
    <div
      className="testimonial-area bg-img space-pt--r130 space-pb--r130"
      style={{
        backgroundImage: `${
          backgroundImage
            ? `url(${process.env.PUBLIC_URL + backgroundImage})`
            : "none"
        } `
      }}
    >
      <Container>
        <Row>
          <Col lg={12}>
            <div className="testimonial-wrapper">
              <Swiper {...params}>
                {testimonialData &&
                  testimonialData.map((single, i) => {
                    return (
                      <div className="single-testimonial-single-item" key={i}>
                        <div className="single-testimonial-single-item__image">
                          <img
                            src={process.env.PUBLIC_URL + single.image}
                            className="img-fluid"
                            alt=""
                          />
                        </div>
                        <div className="single-testimonial-single-item__content text-center">
                          <div className="quote-icon d-inline-block space-mb--30">
                            <img
                              src={
                                process.env.PUBLIC_URL +
                                "/assets/images/icon/quote.png"
                              }
                              className="img-fluid"
                              alt=""
                            />
                          </div>
                          <div className="text space-mb--40">
                            {single.content}
                          </div>
                          <div className="client-info">
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

export default TestimonialTwo;
