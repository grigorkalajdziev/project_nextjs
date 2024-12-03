import Link from "next/link";
import { FaAdjust } from "react-icons/fa";
import { Container, Row, Col } from "react-bootstrap";
import { LayoutTwo } from "../../components/Layout";
import { BreadcrumbOne } from "../../components/Breadcrumb";
import { SectionTitleThree } from "../../components/SectionTitle";

const Buttons = () => {
  return (
    <LayoutTwo>
      {/* breadcrumb */}
      <BreadcrumbOne
        pageTitle="Buttons"
        backgroundImage="/assets/images/backgrounds/breadcrumb-bg-2.jpg"
      >
        <ul className="breadcrumb__list">
          <li>
            <Link href="/" as={process.env.PUBLIC_URL + "/"}>
              <a>Home</a>
            </Link>
          </li>

          <li>Buttons</li>
        </ul>
      </BreadcrumbOne>
      <div className="element-wrapper space-mt--r130 space-mb--r130">
        <div className="button-container space-mb--r100">
          <SectionTitleThree
            title="Small buttons"
            subtitle="This is how small buttons look on your site."
          />
          <Container>
            <Row className="text-center space-mb-mobile-only--m30">
              <Col lg={3} md={6} className="space-mb-mobile-only--30">
                {/*=======  single button  =======*/}
                <button className="lezada-button lezada-button--small">
                  DEFAULT STYLE
                </button>
                {/*=======  End of single button  =======*/}
              </Col>
              <Col lg={3} md={6} className="space-mb-mobile-only--30">
                {/*=======  single button  =======*/}
                <button className="lezada-button lezada-button--small">
                  ALTERNATIVE STYLE
                </button>
                {/*=======  End of single button  =======*/}
              </Col>
              <Col lg={3} md={6} className="space-mb-mobile-only--30">
                {/*=======  single button  =======*/}
                <button className="lezada-button lezada-button--small lezada-button--custom ">
                  CUSTOM STYLE
                </button>
                {/*=======  End of single button  =======*/}
              </Col>
              <Col lg={3} md={6} className="space-mb-mobile-only--30">
                {/*=======  single button  =======*/}
                <button className="lezada-button lezada-button--small lezada-button--icon lezada-button--icon--left">
                  <FaAdjust /> ICON LEFT
                </button>
                {/*=======  End of single button  =======*/}
              </Col>
            </Row>
          </Container>
        </div>

        <div className="button-container space-mb--r100">
          <SectionTitleThree
            title="Medium buttons"
            subtitle="This is how medium buttons look on your site."
          />
          <Container>
            <Row className="text-center space-mb-mobile-only--m30">
              <Col lg={3} md={6} className="space-mb-mobile-only--30">
                {/*=======  single button  =======*/}
                <button className="lezada-button lezada-button--medium">
                  DEFAULT STYLE
                </button>
                {/*=======  End of single button  =======*/}
              </Col>
              <Col lg={3} md={6} className="space-mb-mobile-only--30">
                {/*=======  single button  =======*/}
                <button className="lezada-button lezada-button--medium">
                  ALTERNATIVE STYLE
                </button>
                {/*=======  End of single button  =======*/}
              </Col>
              <Col lg={3} md={6} className="space-mb-mobile-only--30">
                {/*=======  single button  =======*/}
                <button className="lezada-button lezada-button--medium lezada-button--custom ">
                  CUSTOM STYLE
                </button>
                {/*=======  End of single button  =======*/}
              </Col>
              <Col lg={3} md={6} className="space-mb-mobile-only--30">
                {/*=======  single button  =======*/}
                <button className="lezada-button lezada-button--medium lezada-button--icon lezada-button--icon--right">
                  ICON RIGHT <FaAdjust />
                </button>
                {/*=======  End of single button  =======*/}
              </Col>
            </Row>
          </Container>
        </div>

        <div className="button-container space-mb--r100">
          <SectionTitleThree
            title="Large buttons"
            subtitle="This is how large buttons look on your site."
          />
          <Container>
            <Row className="text-center space-mb-mobile-only--m30">
              <Col lg={3} md={6} className="space-mb-mobile-only--30">
                {/*=======  single button  =======*/}
                <button className="lezada-button lezada-button--large">
                  DEFAULT STYLE
                </button>
                {/*=======  End of single button  =======*/}
              </Col>
              <Col lg={3} md={6} className="space-mb-mobile-only--30">
                {/*=======  single button  =======*/}
                <button className="lezada-button lezada-button--large">
                  ALTERNATIVE STYLE
                </button>
                {/*=======  End of single button  =======*/}
              </Col>
              <Col lg={3} md={6} className="space-mb-mobile-only--30">
                {/*=======  single button  =======*/}
                <button className="lezada-button lezada-button--large lezada-button--custom ">
                  CUSTOM STYLE
                </button>
                {/*=======  End of single button  =======*/}
              </Col>
              <Col lg={3} md={6} className="space-mb-mobile-only--30">
                {/*=======  single button  =======*/}
                <button className="lezada-button lezada-button--large lezada-button--icon lezada-button--icon--left">
                  <FaAdjust /> ICON LEFT
                </button>
                {/*=======  End of single button  =======*/}
              </Col>
            </Row>
          </Container>
        </div>

        <div className="button-container">
          <SectionTitleThree
            title="Extra large buttons"
            subtitle="This is how extra large buttons look on your site."
          />
          <Container>
            <Row className="text-center space-mb-mobile-only--m30">
              <Col lg={3} md={6} className="space-mb-mobile-only--30">
                {/*=======  single button  =======*/}
                <button className="lezada-button lezada-button--xl">
                  DEFAULT STYLE
                </button>
                {/*=======  End of single button  =======*/}
              </Col>
              <Col lg={3} md={6} className="space-mb-mobile-only--30">
                {/*=======  single button  =======*/}
                <button className="lezada-button lezada-button--xl">
                  ALTERNATIVE STYLE
                </button>
                {/*=======  End of single button  =======*/}
              </Col>
              <Col lg={3} md={6} className="space-mb-mobile-only--30">
                {/*=======  single button  =======*/}
                <button className="lezada-button lezada-button--xl lezada-button--custom ">
                  CUSTOM STYLE
                </button>
                {/*=======  End of single button  =======*/}
              </Col>
              <Col lg={3} md={6} className="space-mb-mobile-only--30">
                {/*=======  single button  =======*/}
                <button className="lezada-button lezada-button--xl lezada-button--icon lezada-button--icon--right">
                  ICON RIGHT <FaAdjust />
                </button>
                {/*=======  End of single button  =======*/}
              </Col>
            </Row>
          </Container>
        </div>
      </div>
    </LayoutTwo>
  );
};

export default Buttons;
