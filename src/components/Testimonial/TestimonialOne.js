import Swiper from "react-id-swiper";
import { Container, Row, Col } from "react-bootstrap";
import { SectionTitleOne } from "../SectionTitle";
import { useLocalization } from "../../context/LocalizationContext"; 

const textStroke = {
  color: "#333333",
  textShadow: "none",
};

const TestimonialOne = ({ testimonialData, backgroundImage, spaceBottom }) => {
  const { t, currentLanguage } = useLocalization();
  const params = {
    loop: true,
    slidesPerView: 3,
    spaceBetween: 30,
    grabCursor: true,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false,
    },
    breakpoints: {
      1024: { slidesPerView: 3 },
      768:  { slidesPerView: 2 },
      640:  { slidesPerView: 2 },
      320:  { slidesPerView: 1 }
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
        }`,
      }}
    >
      <Container>
        <Row>
          <Col lg={12}>
            <SectionTitleOne title={t("testimonial_title")} />
            <div className="testimonial-wrapper">
              <Swiper {...params}>
                {testimonialData &&
                  testimonialData.map((single, i) => {
                    return (
                      <div
                        className="multi-testimonial-single-item"
                        key={i}
                        style={{
                          backgroundColor: "rgba(255, 255, 255, 0.15)",
                          backdropFilter: "blur(8px)",
                          WebkitBackdropFilter: "blur(8px)",
                          borderRadius: "12px",
                          padding: "24px",
                          border: "1px solid rgba(255, 255, 255, 0.2)",
                        }}
                      >
                        <div
                          className="multi-testimonial-single-item__text"
                          style={textStroke}
                        >
                          {single.content[currentLanguage]}
                        </div>
                        <div className="multi-testimonial-single-item__author-info">
                          <div className="image">
                            <img
                              src={process.env.PUBLIC_URL + single.image}
                              className="img-fluid"
                              alt={single.name[currentLanguage]}
                            />
                          </div>
                          <div className="content">
                            <p
                              className="name"
                              style={textStroke}
                            >
                              {single.name[currentLanguage]}
                            </p>
                            <span
                              className="designation"
                              style={textStroke}
                            >
                              / {single.designation[currentLanguage]}
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

export default TestimonialOne;