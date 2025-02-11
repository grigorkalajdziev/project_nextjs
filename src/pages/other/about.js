import { useState } from "react";
import Link from "next/link";
import { Container, Row, Col } from "react-bootstrap";
import { IoMdAdd } from "react-icons/io";
import ModalVideo from "react-modal-video";
import { LayoutTwo } from "../../components/Layout";
import { BreadcrumbOne } from "../../components/Breadcrumb";
import { TestimonialOne } from "../../components/Testimonial";
import { BrandLogoOne } from "../../components/BrandLogo";
import testimonialData from "../../data/testimonials/testimonial-one.json";
import brandLogoData from "../../data/brand-logos/brand-logo-one.json";
import { useLocalization } from "../../context/LocalizationContext";

const About = () => {
  const { t } = useLocalization();
  const [modalStatus, isOpen] = useState(false);

  return (
    <LayoutTwo>
      {/* breadcrumb */}
      <BreadcrumbOne
        pageTitle={t("about_page_title")}
        backgroundImage="/assets/images/backgrounds/breadcrumb-bg-1.png"
      >
        <ul className="breadcrumb__list">
          <li>
            <Link
              href="/home/trending"
              as={process.env.PUBLIC_URL + "/home/trending"}
            >
              {t("home")}
            </Link>
          </li>
          <li>{t("about")}</li>
        </ul>
      </BreadcrumbOne>

      {/* about content */}
      <div className="about-content space-mt--r130 space-mb--r130">
        <div className="section-title-container space-mb--40">
          <Container>
            <Row>
              <Col lg={8} className="mx-auto">
                {/* section title */}
                <div className="about-title-container text-center">
                  <p className="dark-title space-mb--35">
                    {t("simply_or_white")}
                  </p>
                  <h2 className="title space-mb--15">
                    {t("clever_unique_ideas")}
                  </h2>
                  <p className="title-text">{t("about_page_description")}</p>
                </div>
              </Col>
            </Row>
          </Container>
        </div>

        {/* about video content */}
        <div className="about-video-content space-mb--r100">
          <Container>
            <Row>
              <Col lg={10} className="mx-auto">
                {/* about video area */}
                <div
                  className="about-video-bg space-mb--60"
                  style={{
                    backgroundImage: `url(${
                      process.env.PUBLIC_URL +
                      "/assets/images/backgrounds/about-video-bg.png"
                    })`,
                  }}
                >
                  <div
                    className="about-video-content__text-icon d-flex flex-column h-100 justify-content-center align-items-center"
                    style={{ textAlign: "center" }}
                  >
                    <div className="play-icon text-center space-mb--40">
                      <ModalVideo
                        channel="youtube"
                        isOpen={modalStatus}
                        videoId="x7Qe1MtKki0"
                        onClose={() => isOpen(false)}
                      />
                      <button onClick={() => isOpen(true)}>
                        <img
                          src={
                            process.env.PUBLIC_URL +
                            "/assets/images/icon/icon-play-100x100.png"
                          }
                          className="img-fluid"
                          alt=""
                        />
                      </button>
                    </div>
                    <h1 className="text-right">{t("our_story")}</h1>
                  </div>
                </div>
              </Col>
            </Row>
            <Row>
              <Col lg={10} className="mx-auto">
                <Row>
                  <Col md={6}>
                    <div className="about-widget space-mb--35">
                      <h2 className="widget-title space-mb--25">
                        {t("address")}
                      </h2>
                      <p className="widget-content">{t("address_value")}</p>
                    </div>
                    <div className="about-widget space-mb--35">
                      <h2 className="widget-title space-mb--25">
                        {t("phone")}
                      </h2>
                      <p className="widget-content">
                        {t("mobile")}: (+389) 78 / 343 – 377
                      </p>
                      <span>{t("phone")}: (+389) 46 / 207 – 770</span>
                    </div>
                    <div className="about-widget">
                      <h2 className="widget-title space-mb--25">
                        {t("email")}
                      </h2>
                      <p className="widget-content">{t("email_value")}</p>
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="about-page-text text-center">
                      <p className="space-mb--35">
                        {t("about_page_extra_description")}
                      </p>
                      <Link
                        href="/shop/left-sidebar"
                        as={process.env.PUBLIC_URL + "/shop/left-sidebar"}
                        className="lezada-button lezada-button--medium lezada-button--icon--left"
                      >
                        <IoMdAdd /> {t("online_store")}
                      </Link>
                    </div>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Container>
        </div>

        {/* testimonial */}
        <TestimonialOne
          testimonialData={testimonialData}
          backgroundImage="/assets/images/backgrounds/testimonials-bg.png"
        />
        <div className="space-mb--r100"></div>
        {/* brand logo */}
        <BrandLogoOne brandLogoData={brandLogoData} />
      </div>
    </LayoutTwo>
  );
};

export default About;
