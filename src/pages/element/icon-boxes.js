import Link from "next/link";
import { Container, Row, Col } from "react-bootstrap";
import { IoIosPhonePortrait, IoIosPin, IoIosMail } from "react-icons/io";
import {
  FaMoneyBillAlt,
  FaShoppingBasket,
  FaRegLifeRing
} from "react-icons/fa";
import { LayoutTwo } from "../../components/Layout";
import { BreadcrumbOne } from "../../components/Breadcrumb";

const IconBoxes = () => {
  return (
    <LayoutTwo>
      {/* breadcrumb */}
      <BreadcrumbOne
        pageTitle="IconBoxes"
        backgroundImage="/assets/images/backgrounds/breadcrumb-bg-2.jpg"
      >
        <ul className="breadcrumb__list">
          <li>
            <Link href="/" as={process.env.PUBLIC_URL + "/"}>
              <a>Home</a>
            </Link>
          </li>

          <li>IconBoxes</li>
        </ul>
      </BreadcrumbOne>
      <div className="element-wrapper space-mt--r130 space-mb--r130">
        <div className="icon-box-area space-mb--r100">
          <Container>
            <Row className="space-mb-mobile-only--m30">
              <Col md={4} className="space-mb-mobile-only--30">
                <div className="icon-box icon-box--grey-center">
                  <div className="icon-box--grey-center__icon">
                    <IoIosPhonePortrait />
                  </div>
                  <div className="icon-box--grey-center__content">
                    <h3 className="title">PHONE</h3>
                    <p className="content">Phone 01: +84 01122000</p>
                  </div>
                </div>
              </Col>
              <Col md={4} className="space-mb-mobile-only--30">
                <div className="icon-box icon-box--grey-center">
                  <div className="icon-box--grey-center__icon">
                    <IoIosPin />
                  </div>
                  <div className="icon-box--grey-center__content">
                    <h3 className="title">ADDRESS</h3>
                    <p className="content">
                      1800 Abbot Kinney Blvd. <br /> Unit D, Venice
                    </p>
                  </div>
                </div>
              </Col>
              <Col md={4} className="space-mb-mobile-only--30">
                <div className="icon-box icon-box--grey-center">
                  <div className="icon-box--grey-center__icon">
                    <IoIosMail />
                  </div>
                  <div className="icon-box--grey-center__content">
                    <h3 className="title">EMAIL</h3>
                    <p className="content">lezadastore@gmail.com</p>
                  </div>
                </div>
              </Col>
            </Row>
          </Container>
        </div>

        <div className="icon-box-area border-top--grey border-bottom--grey space-mb--r100 space-pt--30 space-pb--30">
          <Container>
            <Row className="space-mb-mobile-only--m30">
              <Col md={4} className="space-mb-mobile-only--30">
                <div className="icon-box icon-box--feature-icon">
                  <div className="icon-box--feature-icon__icon">
                    <FaMoneyBillAlt />
                  </div>
                  <div className="icon-box--feature-icon__content">
                    <h3 className="title">MONEY BACK</h3>
                    <p className="content">100% money back guarantee</p>
                  </div>
                </div>
              </Col>
              <Col md={4} className="space-mb-mobile-only--30">
                <div className="icon-box icon-box--feature-icon">
                  <div className="icon-box--feature-icon__icon">
                    <FaShoppingBasket />
                  </div>
                  <div className="icon-box--feature-icon__content">
                    <h3 className="title">FREE SHIPPING &amp; RETURN</h3>
                    <p className="content">
                      Free shipping on all orders over $99
                    </p>
                  </div>
                </div>
              </Col>
              <Col md={4} className="space-mb-mobile-only--30">
                <div className="icon-box icon-box--feature-icon">
                  <div className="icon-box--feature-icon__icon">
                    <FaRegLifeRing />
                  </div>
                  <div className="icon-box--feature-icon__content">
                    <h3 className="title">24/7 SUPPORT</h3>
                    <p className="content">Live fast and good support 24/7.</p>
                  </div>
                </div>
              </Col>
            </Row>
          </Container>
        </div>

        <div className="icon-box-area">
          <Container>
            <Row className="no-gutters">
              <Col md={4}>
                <div className="icon-box icon-box--color-center icon-box--color-center--green">
                  <div className="icon-box--color-center__icon icon-box--color-center--green__icon">
                    <IoIosPhonePortrait />
                  </div>
                  <div className="icon-box--color-center__content">
                    <h3 className="title">PHONE</h3>
                    <p className="content">Phone 01: +84 01122000</p>
                  </div>
                </div>
              </Col>
              <Col md={4}>
                <div className="icon-box icon-box--color-center icon-box--color-center--yellow">
                  <div className="icon-box--color-center__icon icon-box--color-center--yellow__icon">
                    <IoIosPin />
                  </div>
                  <div className="icon-box--color-center__content">
                    <h3 className="title">ADDRESS</h3>
                    <p className="content">
                      1800 Abbot Kinney Blvd. <br /> Unit D, Venice
                    </p>
                  </div>
                </div>
              </Col>
              <Col md={4}>
                <div className="icon-box icon-box--color-center icon-box--color-center--blue">
                  <div className="icon-box--color-center__icon icon-box--color-center--blue__icon">
                    <IoIosMail />
                  </div>
                  <div className="icon-box--color-center__content">
                    <h3 className="title">EMAIL</h3>
                    <p className="content">lezadastore@gmail.com</p>
                  </div>
                </div>
              </Col>
            </Row>
          </Container>
        </div>
      </div>
    </LayoutTwo>
  );
};

export default IconBoxes;
