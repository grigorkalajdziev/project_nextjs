import Link from "next/link";
import { Container, Row, Col, Accordion } from "react-bootstrap";
import { LayoutTwo } from "../../components/Layout";
import { BreadcrumbOne } from "../../components/Breadcrumb";
import { FaHome } from "react-icons/fa";
import { useLocalization } from "../../context/LocalizationContext";

const PrivacyPolicy = () => {
  const { t } = useLocalization();

  return (
    <LayoutTwo>
      {/* breadcrumb */}
      <BreadcrumbOne
        pageTitle={t("privacy_policy")}
        backgroundImage="/assets/images/backgrounds/breadcrumb-bg-1.webp"
      >
        <ul className="breadcrumb__list">
          <li>
            <Link href="/home/trending" aria-label={t("home")}>
              <FaHome size={16} />
            </Link>
          </li>
          <li>{t("privacy_policy")}</li>
        </ul>
      </BreadcrumbOne>

      <div className="element-wrapper space-mt--r130 space-mb--r130">
        <Container>
          <Row>
            <Col lg={12}>
              <h2 className="faq-title space-mb--20">
                    {t("privacy_policy")}
                  </h2>
              <div className="privacy-policy-wrapper">
                <Accordion defaultActiveKey="0">
                  <Accordion.Item eventKey="0">
                    <Accordion.Header>{t("information_we_collect")}</Accordion.Header>
                    <Accordion.Body>
                      <ul>
                        <li>{t("info_collect_name_email")}</li>
                        <li>{t("info_collect_payment_details")}</li>
                        <li>{t("info_collect_optional")}</li>
                      </ul>
                    </Accordion.Body>
                  </Accordion.Item>

                  <Accordion.Item eventKey="1">
                    <Accordion.Header>{t("how_we_use_your_information")}</Accordion.Header>
                    <Accordion.Body>
                      <ul>
                        <li>{t("use_order_processing")}</li>
                        <li>{t("use_communication")}</li>
                        <li>{t("use_improvement")}</li>
                      </ul>
                    </Accordion.Body>
                  </Accordion.Item>

                  <Accordion.Item eventKey="2">
                    <Accordion.Header>{t("how_we_protect_your_information")}</Accordion.Header>
                    <Accordion.Body>
                      <p>{t("protect_info_text")}</p>
                    </Accordion.Body>
                  </Accordion.Item>

                  <Accordion.Item eventKey="3">
                    <Accordion.Header>{t("your_rights")}</Accordion.Header>
                    <Accordion.Body>
                      <p>
                        {t("your_rights_text")}{" "}
                        <a href="mailto:makeupbykika@hotmail.com">makeupbykika@hotmail.com</a>
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

export default PrivacyPolicy;
