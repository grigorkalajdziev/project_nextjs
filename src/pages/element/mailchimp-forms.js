import Link from "next/link";
import { Container, Row, Col } from "react-bootstrap";
import { IoIosMail } from "react-icons/io";
import { FaRegEnvelopeOpen, FaRegEnvelope } from "react-icons/fa";
import { LayoutTwo } from "../../components/Layout";
import { BreadcrumbOne } from "../../components/Breadcrumb";
import { SubscribeEmail } from "../../components/Newsletter";

const MailchimpForms = () => {
  return (
    <LayoutTwo>
      {/* breadcrumb */}
      <BreadcrumbOne
        pageTitle="Mailchimp Forms"
        backgroundImage="/assets/images/backgrounds/breadcrumb-bg-2.jpg"
      >
        <ul className="breadcrumb__list">
          <li>
            <Link href="/" as={process.env.PUBLIC_URL + "/"}>
              <a>Home</a>
            </Link>
          </li>

          <li>Mailchimp Forms</li>
        </ul>
      </BreadcrumbOne>
      <div className="element-wrapper space-mt--r130 space-mb--r130">
        <div className="mailchimp-wrapper space-mb--r100">
          <Container>
            <Row>
              <Col lg={12}>
                <div className="mc-newsletter-content-container text-center space-pt--15 space-pb--15 space-pl--15 space-pr--15">
                  <div className="mc-newsletter-content space-pt--70 space-pb--70">
                    <div className="icon">
                      <IoIosMail />
                    </div>
                    <div className="title space-mb--30">
                      <h3 className="space-mb--20">Newsletter</h3>
                      <p>Get the latest news &amp; updates from lezada</p>
                    </div>
                    <div className="mc-newsletter-form">
                      <SubscribeEmail
                        mailchimpUrl="https://devitems.us11.list-manage.com/subscribe/post?u=6bbb9b6f5827bd842d9640c82&amp;id=05d85f18ef"
                        alertColor="#fff"
                      />
                    </div>
                    {/* mailchimp alerts end */}
                    <div className="link space-mt--50">
                      <a href="https://www.facebook.com" target="_blank">
                        Visit us on Facebook
                      </a>
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
          </Container>
        </div>

        <div className="mailchimp-wrapper border-top--grey border-bottom--grey space-mb--r100">
          <Container>
            <Row>
              <Col lg={12}>
                <div className="mc-newsletter-content-container no-bg text-center">
                  <div className="mc-newsletter-content mc-newsletter-content--big-icon space-pt--70 space-pb--70">
                    <div className="icon space-mb--30">
                      <FaRegEnvelopeOpen />
                    </div>
                    <div className="title space-mb--30">
                      <h3 className="space-mb--20">Newsletter</h3>
                      <p>Get the latest news &amp; updates from lezada</p>
                    </div>
                    <div className="mc-newsletter-form space-mb--50">
                      <SubscribeEmail
                        mailchimpUrl="https://devitems.us11.list-manage.com/subscribe/post?u=6bbb9b6f5827bd842d9640c82&amp;id=05d85f18ef"
                        alertColor="#333"
                      />
                    </div>
                    <div className="link space-mt--50">
                      <a href="http://www.facebook.com" target="_blank">
                        Visit us on Facebook
                      </a>
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
          </Container>
        </div>

        <div className="mailchimp-wrapper bg-color--blue space-mb--r100">
          <Container>
            <Row>
              <Col lg={12}>
                <div className="mc-newsletter-content-container no-bg text-center space-pt--15 space-pb--15 space-pl--15 space-pr--15">
                  <div className="mc-newsletter-content mc-newsletter-content--fullwidth space-pt--70 space-pb--70">
                    <div className="icon space-mb--20">
                      <FaRegEnvelope />
                    </div>
                    <div className="title space-mb--30">
                      <h3 className="space-mb--20">Join our newsletter</h3>
                      <p>Get the latest news updates from lezada</p>
                    </div>
                    <div className="mc-newsletter-form">
                      <SubscribeEmail
                        mailchimpUrl="https://devitems.us11.list-manage.com/subscribe/post?u=6bbb9b6f5827bd842d9640c82&amp;id=05d85f18ef"
                        alertColor="#fff"
                      />
                    </div>
                    <div className="link space-mt--50">
                      <a href="https://www.facebook.com">
                        Visit us on Facebook
                      </a>
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
          </Container>
        </div>

        <div className="mailchimp-wrapper bg-color--red">
          <Container>
            <Row>
              <Col lg={12}>
                <div className="mc-newsletter-content-container no-bg text-center space-pt--15 space-pb--15 space-pl--15 space-pr--15">
                  <div className="mc-newsletter-content mc-newsletter-content--fullwidth space-pt--70 space-pb--70">
                    <div className="icon space-mb--20">
                      <FaRegEnvelope />
                    </div>
                    <div className="title space-mb--30">
                      <h3 className="space-mb--20">Join our newsletter</h3>
                      <p>Get the latest news updates from lezada</p>
                    </div>
                    <div className="mc-newsletter-form">
                      <SubscribeEmail
                        mailchimpUrl="https://devitems.us11.list-manage.com/subscribe/post?u=6bbb9b6f5827bd842d9640c82&amp;id=05d85f18ef"
                        alertColor="#fff"
                      />
                    </div>
                    <div className="link space-mt--50">
                      <a href="https://www.facebook.com">
                        Visit us on Facebook
                      </a>
                    </div>
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

export default MailchimpForms;
