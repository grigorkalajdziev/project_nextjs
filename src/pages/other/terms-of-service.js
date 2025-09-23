import Link from "next/link";
import { Container, Row, Col, Accordion } from "react-bootstrap";
import { LayoutTwo } from "../../components/Layout";
import { BreadcrumbOne } from "../../components/Breadcrumb";
import { useLocalization } from "../../context/LocalizationContext";

const TermsOfService = () => {
  const { t } = useLocalization();

  return (
    <LayoutTwo>
      {/* breadcrumb */}
      <BreadcrumbOne
        pageTitle={t("terms_of_service")}
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
          <li>{t("terms_of_service")}</li>
        </ul>
      </BreadcrumbOne>

      <div className="element-wrapper space-mt--r130 space-mb--r130">
        <Container>
          <Row>
            <Col lg={12}>
              <div className="terms-of-service-wrapper">
                {/* Intro shown directly */}
                <h2 className="space-mb--20">{t("terms_of_service")}</h2>
                <p className="text-left">{t("tos_intro")}</p>

                {/* Accordion for the rest */}
                <Accordion defaultActiveKey="0">
                  {/* User Responsibilities */}
                  <Accordion.Item eventKey="0">
                    <Accordion.Header>
                      {t("user_responsibilities")}
                    </Accordion.Header>
                    <Accordion.Body>
                      <ul>
                        <li>{t("user_responsibility_1")}</li>
                        <li>{t("user_responsibility_2")}</li>
                        <li>{t("user_responsibility_3")}</li>
                      </ul>
                    </Accordion.Body>
                  </Accordion.Item>

                  {/* Account and Security */}
                  <Accordion.Item eventKey="1">
                    <Accordion.Header>{t("account_security")}</Accordion.Header>
                    <Accordion.Body>
                      <ul>
                        <li>{t("account_security_1")}</li>
                        <li>{t("account_security_2")}</li>
                      </ul>
                    </Accordion.Body>
                  </Accordion.Item>

                  {/* Orders and Payments */}
                  <Accordion.Item eventKey="2">
                    <Accordion.Header>{t("orders_payments")}</Accordion.Header>
                    <Accordion.Body>
                      <ul>
                        <li>{t("orders_payments_1")}</li>
                        <li>{t("orders_payments_2")}</li>
                        <li>{t("orders_payments_3")}</li>
                      </ul>
                    </Accordion.Body>
                  </Accordion.Item>

                  {/* Changes */}
                  <Accordion.Item eventKey="3">
                    <Accordion.Header>{t("changes")}</Accordion.Header>
                    <Accordion.Body>
                      <p className="text-left">{t("changes_text")}</p>
                    </Accordion.Body>
                  </Accordion.Item>

                  {/* Limitation of Liability */}
                  <Accordion.Item eventKey="4">
                    <Accordion.Header>
                      {t("limitation_of_liability")}
                    </Accordion.Header>
                    <Accordion.Body>
                      <p className="text-left">{t("limitation_text")}</p>
                    </Accordion.Body>
                  </Accordion.Item>

                  {/* Governing Law */}
                  <Accordion.Item eventKey="5">
                    <Accordion.Header>{t("governing_law")}</Accordion.Header>
                    <Accordion.Body>
                      <p className="text-left">{t("governing_law_text")}</p>
                    </Accordion.Body>
                  </Accordion.Item>

                  {/* Contact */}
                  <Accordion.Item eventKey="6">
                    <Accordion.Header>{t("contact")}</Accordion.Header>
                    <Accordion.Body>
                      <p className="text-left">
                        {t("contact_text")}{" "}
                        <a href="mailto:makeupbykika@hotmail.com">
                          makeupbykika@hotmail.com
                        </a>
                      </p>
                    </Accordion.Body>
                  </Accordion.Item>
                </Accordion>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </LayoutTwo>
  );
};

export default TermsOfService;
