import Link from "next/link";
import Swiper from "react-id-swiper";
import { Container, Row, Col } from "react-bootstrap";
import {
  IoIosCalendar,
  IoIosArrowBack,
  IoIosArrowForward,
} from "react-icons/io";
import { useLocalization } from "../../context/LocalizationContext";

const BlogPostSlider = ({ blogData, spaceBottomClass }) => {
  const { t, currentLanguage } = useLocalization();

  const params = {
    loop: false,
    slidesPerView: 2,
    spaceBetween: 30,
    grabCursor: true,
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    renderPrevButton: () => (
      <button className="swiper-button-prev ht-swiper-button-nav">
        <IoIosArrowBack />
      </button>
    ),
    renderNextButton: () => (
      <button className="swiper-button-next ht-swiper-button-nav">
        <IoIosArrowForward />
      </button>
    ),
    breakpoints: {
      1024: { slidesPerView: 2 },
      768: { slidesPerView: 2 },
      640: { slidesPerView: 2 },
      320: { slidesPerView: 1 },
    },
  };

  return (
    (<div
      className={`blog-post-slider ${spaceBottomClass ? spaceBottomClass : ""}`}
    >
      <Container>
        <Row className="align-items-center">
          <Col lg={4}>
            {/* Blog Intro Section */}
          </Col>
          <Col lg={8}>
            <div className="blog-post-slider-container">
              <Swiper {...params}>
                {blogData &&
                  blogData.map((single, i) => {
                    return (
                      (<div className="blog-grid-post" key={i}>
                        <div className="blog-grid-post__image space-mb--30">
                          <Link
                            href={single.url}
                            as={process.env.PUBLIC_URL + single.url}
                            passHref
                            legacyBehavior>
                            <span className="blog-post-link">
                              <img
                                src={process.env.PUBLIC_URL + single.image}
                                className="img-fluid"
                                alt={single.title[currentLanguage]}
                              />
                            </span>
                          </Link>
                        </div>
                        <div className="blog-grid-post__content">
                          <div className="post-date">
                            <IoIosCalendar />
                            {single.date[currentLanguage]}
                          </div>
                          <h2 className="post-title">
                            <Link
                              href={single.url}
                              as={process.env.PUBLIC_URL + single.url}
                              passHref
                              legacyBehavior>
                              <span>{single.title[currentLanguage]}</span>
                            </Link>
                          </h2>
                          <p className="post-excerpt">
                            {single.text[currentLanguage]}
                          </p>
                          <Link
                            href={single.url}
                            as={process.env.PUBLIC_URL + single.url}
                            passHref
                            legacyBehavior>
                            <span className="blog-readmore-btn">
                              {t("read_more")}
                            </span>
                          </Link>
                        </div>
                      </div>)
                    );
                  })}
              </Swiper>
            </div>
          </Col>
        </Row>
      </Container>
    </div>)
  );
};

export default BlogPostSlider;
