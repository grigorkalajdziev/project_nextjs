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
    autoplay: {
      delay: 5000,
      disableOnInteraction: false,
    },
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
      1024: {
        slidesPerView: 2,
      },
      768: {
        slidesPerView: 2,
      },
      640: {
        slidesPerView: 2,
      },
      320: {
        slidesPerView: 1,
      },
    },
  };
  return (
    <div
      className={`blog-post-slider ${spaceBottomClass ? spaceBottomClass : ""}`}
    >
      <Container>
        <Row className="align-items-center">
          <Col lg={4}>
            {/* <div className="blog-intro space-mb-mobile-only--30">
              <h2>From our blog</h2>
              <p>
                Lorem ipsum dolor sit amet, consecte tur cing elit. Suspe ndisse
                suscipit sagittis leo sit met condim entum.
              </p>
              <Link
                href="/blog/standard-left-sidebar"
                as={process.env.PUBLIC_URL + "/blog/standard-left-sidebar"}
              >
                <a className="lezada-button lezada-button--medium">view all</a>
              </Link>
            </div> */}
          </Col>
          <Col lg={8}>
            <div className="blog-post-slider-container">
              <Swiper {...params}>
                {blogData &&
                  blogData.map((single, i) => {
                    return (
                      <div className="blog-grid-post" key={i}>
                        <div className="blog-grid-post__image space-mb--30">
                          <Link
                            href={single.url}
                            as={process.env.PUBLIC_URL + single.url}
                          >
                            <a>
                              <img
                                src={process.env.PUBLIC_URL + single.image}
                                className="img-fluid"
                                alt=""
                              />
                            </a>
                          </Link>
                        </div>
                        <div className="blog-grid-post__content">
                          <div className="post-date">
                            <IoIosCalendar />
                            {single.date[currentLanguage]}
                          </div>
                          <h2 className="post-title">
                            {/* <Link
                              href={single.url}
                              as={process.env.PUBLIC_URL + single.url}
                            > */}
                              <a>{single.title[currentLanguage]}</a>
                            {/* </Link> */}
                          </h2>
                          <p className="post-excerpt">
                            {single.text[currentLanguage]}
                          </p>
                          <Link
                            href={single.url}
                            as={process.env.PUBLIC_URL + single.url}
                          >
                            <a
                              className="blog-readmore-btn"
                              onClick={(e) => {
                                e.preventDefault(); // Prevent the default navigation
                              }}
                            >
                              {t("read_more")}
                            </a>
                          </Link>
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

export default BlogPostSlider;
