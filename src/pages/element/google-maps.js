import Link from "next/link";
import { Container, Row, Col } from "react-bootstrap";
import { LayoutTwo } from "../../components/Layout";
import { BreadcrumbOne } from "../../components/Breadcrumb";
import { SectionTitleOne } from "../../components/SectionTitle";

const GoogleMaps = () => {
  return (
    <LayoutTwo>
      {/* breadcrumb */}
      <BreadcrumbOne
        pageTitle="Google maps"
        backgroundImage="/assets/images/backgrounds/breadcrumb-bg-2.jpg"
      >
        <ul className="breadcrumb__list">
          <li>
            <Link href="/" as={process.env.PUBLIC_URL + "/"}>
              <a>Home</a>
            </Link>
          </li>

          <li>Google maps</li>
        </ul>
      </BreadcrumbOne>
      <div className="element-wrapper space-mt--r130 space-mb--r130">
        <div className="default-style space-mb--r100">
          <Container>
            <Row>
              <Col lg={12}>
                <SectionTitleOne title="Default Map" />
              </Col>
            </Row>
            <Row>
              <Col lg={12}>
                <div className="google-map">
                  <iframe
                    title="map"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d6777.000026107364!2d-74.08304414937152!3d40.83212940017352!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c2f866a80dcc27%3A0x3e3160910d4d5045!2sHoliday%20Inn%20Express%20%26%20Suites%20Meadowlands%20Area!5e0!3m2!1sen!2sbd!4v1581852597883!5m2!1sen!2sbd"
                    allowFullScreen
                  />
                </div>
              </Col>
            </Row>
          </Container>
        </div>
        <div className="full-width-style space-mb--r100">
          <Container>
            <Row>
              <Col lg={12}>
                <SectionTitleOne title="Full Width Map" />
              </Col>
            </Row>
          </Container>
          <div className="google-map">
            <iframe
              title="map"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d6777.000026107364!2d-74.08304414937152!3d40.83212940017352!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c2f866a80dcc27%3A0x3e3160910d4d5045!2sHoliday%20Inn%20Express%20%26%20Suites%20Meadowlands%20Area!5e0!3m2!1sen!2sbd!4v1581852597883!5m2!1sen!2sbd"
              allowFullScreen
            />
          </div>
        </div>

        <div className="group-style space-mb--r100">
          <Container>
            <Row>
              <Col lg={12}>
                <SectionTitleOne title="Group Map" />
              </Col>
            </Row>
          </Container>

          <div className="group-map-container space-mb-mobile-only--m30">
            <div className="single-map space-mb-mobile-only--30">
              <div className="google-map">
                <iframe
                  title="map"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d6777.000026107364!2d-74.08304414937152!3d40.83212940017352!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c2f866a80dcc27%3A0x3e3160910d4d5045!2sHoliday%20Inn%20Express%20%26%20Suites%20Meadowlands%20Area!5e0!3m2!1sen!2sbd!4v1581852597883!5m2!1sen!2sbd"
                  allowFullScreen
                />
              </div>
            </div>
            <div className="single-map space-mb-mobile-only--30">
              <div className="google-map">
                <iframe
                  title="map"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d6777.000026107364!2d-74.08304414937152!3d40.83212940017352!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c2f866a80dcc27%3A0x3e3160910d4d5045!2sHoliday%20Inn%20Express%20%26%20Suites%20Meadowlands%20Area!5e0!3m2!1sen!2sbd!4v1581852597883!5m2!1sen!2sbd"
                  allowFullScreen
                />
              </div>
            </div>
            <div className="single-map space-mb-mobile-only--30">
              <div className="google-map">
                <iframe
                  title="map"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d6777.000026107364!2d-74.08304414937152!3d40.83212940017352!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c2f866a80dcc27%3A0x3e3160910d4d5045!2sHoliday%20Inn%20Express%20%26%20Suites%20Meadowlands%20Area!5e0!3m2!1sen!2sbd!4v1581852597883!5m2!1sen!2sbd"
                  allowFullScreen
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </LayoutTwo>
  );
};

export default GoogleMaps;
