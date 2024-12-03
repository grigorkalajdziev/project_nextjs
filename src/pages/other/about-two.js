import { useState } from "react";
import Link from "next/link";
import { Container, Row, Col } from "react-bootstrap";
import ModalVideo from "react-modal-video";
import { LayoutTwo } from "../../components/Layout";
import { BreadcrumbOne } from "../../components/Breadcrumb";
import { SectionTitleOne } from "../../components/SectionTitle";
import { TestimonialTwo } from "../../components/Testimonial";
import testimonialTwoData from "../../data/testimonials/testimonial-two.json";

const AboutTwo = () => {
  const [modalStatus, isOpen] = useState(false);
  return (
    <LayoutTwo>
      {/* breadcrumb */}
      <BreadcrumbOne
        pageTitle="About Two"
        backgroundImage="/assets/images/backgrounds/breadcrumb-bg-1.png"
      >
        <ul className="breadcrumb__list">
          <li>
            <Link href="/" as={process.env.PUBLIC_URL + "/"}>
              <a>Home</a>
            </Link>
          </li>

          <li>About Two</li>
        </ul>
      </BreadcrumbOne>
      <div className="about-page-wrapper space-mt--r130 space-mb--r130">
        {/* primary content */}
        <div className="about-content space-mb--r100">
          <Container className="wide">
            <SectionTitleOne
              title="Basic minimalism"
              subtitle="LEZADA STORE - SIMPLY AND BASIC"
            />
            <Row>
              <Col xl={6} lg={6}>
                <div className="about-page-2-image space-mb-mobile-only--50">
                  <img
                    src={
                      process.env.PUBLIC_URL +
                      "/assets/images/backgrounds/about-bg.png"
                    }
                    className="img-fluid"
                    alt=""
                  />
                </div>
              </Col>
              <Col xl={5} lg={6} className="ml-auto">
                <div className="about-page-text space-mb--30 mt-0">
                  <p>
                    Lorem ipsum dolor sit amet, consectetur cing elit. Suspe
                    ndisse suscipit sagittis leo sit estibulum issim Lorem ipsum
                    dolor sit amet, consectetur cing elit. ipsum dolor sit amet,
                    consectetur cing elit. Suspe ndisse suscipit sagittis leo
                    sit es
                  </p>
                </div>
                <div className="about-widget space-mb--35">
                  <h2 className="widget-title space-mb--25">ADDRESS</h2>
                  <p className="widget-content">
                    1800 Abbot Kinney Blvd. Unit D &amp; E Venice
                  </p>
                </div>
                <div className="about-widget space-mb--35">
                  <h2 className="widget-title space-mb--25">PHONE</h2>
                  <p className="widget-content">Mobile: (+88) – 1990</p>
                  <p className="widget-content">Hotline: 1800 – 1102</p>
                </div>
                <div className="about-widget">
                  <h2 className="widget-title space-mb--25">EMAIL</h2>
                  <p className="widget-content">contact@lezadastore.com</p>
                </div>
              </Col>
            </Row>
          </Container>
        </div>

        {/* testimonial */}
        <TestimonialTwo
          testimonialData={testimonialTwoData}
          backgroundImage="/assets/images/backgrounds/testimonials-bg.png"
        />
        <div className="space-mb--r100"></div>

        <div className="about-video-popup">
          <Container className="wide">
            <Row>
              <Col lg={12}>
                <div
                  className="about-video-bg space-mb--60"
                  style={{
                    backgroundImage: `url(${
                      process.env.PUBLIC_URL +
                      "/assets/images/backgrounds/about-video-bg-2.png"
                    })`
                  }}
                >
                  <div className="about-video-content__text-icon d-flex flex-column h-100 justify-content-center">
                    <div className="play-icon text-center space-mb--40">
                      <ModalVideo
                        channel="youtube"
                        isOpen={modalStatus}
                        videoId="feOScd2HdiU"
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
                    <h1>OUR STORY</h1>
                  </div>
                </div>
              </Col>
            </Row>
          </Container>
        </div>

        <div className="about-page-content">
          <Container>
            <Row>
              <Col md={6} className="space-mb-mobile-only--50">
                {/*=======  about single block  =======*/}
                <div className="about-single-block">
                  <p className="subtitle">On at oders over $99</p>
                  <h1>Free shipping &amp; return</h1>
                  <p>
                    Lorem ipsum dolor sit amet, consectetur cing elit. Suspe
                    ndisse suscipit sagittis leo sit met condimentum estibulum
                    issim Lorem ipsum dolor sit amet, consectetur cing elit.
                  </p>
                  <Link
                    href="/other/about"
                    as={process.env.PUBLIC_URL + "/other/about"}
                  >
                    <a>LEARN MORE</a>
                  </Link>
                </div>
              </Col>
              <Col md={6}>
                {/*=======  about single block  =======*/}
                <div className="about-single-block">
                  <p className="subtitle">Support 24/7</p>
                  <h1>Money back</h1>
                  <p>
                    Lorem ipsum dolor sit amet, consectetur cing elit. Suspe
                    ndisse suscipit sagittis leo sit met condimentum estibulum
                    issim Lorem ipsum dolor sit amet, consectetur cing elit.
                  </p>
                  <Link
                    href="/other/about"
                    as={process.env.PUBLIC_URL + "/other/about"}
                  >
                    <a>LEARN MORE</a>
                  </Link>
                </div>
              </Col>
            </Row>
          </Container>
        </div>
      </div>
    </LayoutTwo>
  );
};

export default AboutTwo;
