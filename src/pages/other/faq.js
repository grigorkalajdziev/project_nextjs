import Link from "next/link";
import { Container, Row, Col, Card, Accordion } from "react-bootstrap";
import { LayoutTwo } from "../../components/Layout";
import { BreadcrumbOne } from "../../components/Breadcrumb";
import { useLocalization } from "../../context/LocalizationContext";

const Faq = () => {
  const { t } = useLocalization();

  return (
    <LayoutTwo>
      {/* breadcrumb */}
      <BreadcrumbOne
        pageTitle={t("faq")}
        backgroundImage="/assets/images/backgrounds/breadcrumb-bg-1.png"
      >
        <ul className="breadcrumb__list">
          <li>
            <Link href="/home/trending" as={process.env.PUBLIC_URL + "/home/trending"}>
              {t("home")}
            </Link>
          </li>
          <li>{t("faq")}</li>
        </ul>
      </BreadcrumbOne>

      <div className="element-wrapper space-mt--r130 space-mb--r130">
        <Container>
          <Row>
            <Col lg={12}>
              <div className="faq-wrapper">
                {/* Shipping Information */}
                <div className="single-faq space-mb--r100">
                  <h2 className="faq-title space-mb--20">
                    {t("shipping_information_title")}
                  </h2>
                  <Accordion defaultActiveKey="0">
                    <Accordion.Item eventKey="0">
                      <Accordion.Header>
                        {t("shipping_question_1")}
                      </Accordion.Header>
                      <Accordion.Body>
                        <p className="text-left">{t("shipping_answer_1")}</p>
                      </Accordion.Body>
                    </Accordion.Item>

                    <Accordion.Item eventKey="1">
                      <Accordion.Header>
                        {t("shipping_question_2")}
                      </Accordion.Header>
                      <Accordion.Body>
                        <p className="text-left">{t("shipping_answer_2")}</p>
                      </Accordion.Body>
                    </Accordion.Item>

                    {/* <Accordion.Item eventKey="2">
                      <Accordion.Header>
                        {t("shipping_question_3")}
                      </Accordion.Header>
                      <Accordion.Body>
                        <p className="text-left">{t("shipping_answer_3")}</p>
                      </Accordion.Body>
                    </Accordion.Item> */}

                    <Accordion.Item eventKey="3">
                      <Accordion.Header>
                        {t("shipping_question_4")}
                      </Accordion.Header>
                      <Accordion.Body>
                        <p className="text-left">{t("shipping_answer_4")}</p>
                      </Accordion.Body>
                    </Accordion.Item>
                  </Accordion>
                </div>

                {/* Payment Information */}
                <div className="single-faq space-mb--r100">
                  <h2 className="faq-title space-mb--20 text-left">
                    {t("payment_information_title")}
                  </h2>
                  <Accordion defaultActiveKey="0">
                    <Accordion.Item eventKey="0">
                      <Accordion.Header>
                        {t("payment_question_1")}
                      </Accordion.Header>
                      <Accordion.Body>
                        <p className="text-left">{t("payment_answer_1")}</p>
                      </Accordion.Body>
                    </Accordion.Item>

                    <Accordion.Item eventKey="1">
                      <Accordion.Header>
                        {t("payment_question_2")}
                      </Accordion.Header>
                      <Accordion.Body>
                        <p className="text-left">{t("payment_answer_2")}</p>
                      </Accordion.Body>
                    </Accordion.Item>

                    <Accordion.Item eventKey="2">
                      <Accordion.Header>
                        {t("payment_question_3")}
                      </Accordion.Header>
                      <Accordion.Body>
                        <p className="text-left">{t("payment_answer_3")}</p>
                      </Accordion.Body>
                    </Accordion.Item>
                  </Accordion>
                </div>

                {/* Orders and Returns */}
                <div className="single-faq">
                  <h2 className="faq-title space-mb--20 text-left">
                    {t("orders_and_returns_title")}
                  </h2>
                  <Accordion defaultActiveKey="0">
                    <Accordion.Item eventKey="0">
                      <Accordion.Header>
                        {t("orders_question_1")}
                      </Accordion.Header>
                      <Accordion.Body>
                        <p className="text-left">{t("orders_answer_1")}</p>
                      </Accordion.Body>
                    </Accordion.Item>

                    <Accordion.Item eventKey="1">
                      <Accordion.Header>
                        {t("orders_question_2")}
                      </Accordion.Header>
                      <Accordion.Body>
                        <p className="text-left">{t("orders_answer_2")}</p>
                      </Accordion.Body>
                    </Accordion.Item>

                    <Accordion.Item eventKey="2">
                      <Accordion.Header>
                        {t("orders_question_3")}
                      </Accordion.Header>
                      <Accordion.Body>
                        <p className="text-left">{t("orders_answer_3")}</p>
                      </Accordion.Body>
                    </Accordion.Item>
                  </Accordion>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </LayoutTwo>
  );
};

export default Faq;
