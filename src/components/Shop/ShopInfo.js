import { Container, Row, Col } from "react-bootstrap";
import { useLocalization } from "../../context/LocalizationContext";

const ShopInfo = () => {
  const { t } = useLocalization(); 

  return (
    <div className="shop-info-wrapper space-mb--50">
      <Container>
        <Row>
          <Col lg={12}>
            <div className="shop-info-container">
              <div className="shop-info-single">
                <h4 className="title">{t("free_shipping")}</h4>
                <div className="content">
                  <p>{t("free_shipping_description")}</p>
                </div>
              </div>
              <div className="shop-info-single">
                <h4 className="title">{t("free_returns")}</h4>
                <div className="content">
                  <p>{t("free_returns_description")}</p>
                </div>
              </div>
              <div className="shop-info-single">
                <div>
                  <h4 className="title">{t("secure_payment")}</h4>
                  <div className="content">
                    <img
                      src={
                        process.env.PUBLIC_URL + "/assets/images/icon/pay.svg"
                      }
                      className="img-fluid"
                      alt=""
                    />
                  </div>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default ShopInfo;
