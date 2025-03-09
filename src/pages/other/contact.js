import { useContext, useState } from "react";
import Link from "next/link";
import { Container, Row, Col } from "react-bootstrap";
import { IoIosPin, IoIosCall, IoIosMail, IoIosClock } from "react-icons/io";
import { LayoutTwo } from "../../components/Layout";
import { BreadcrumbOne } from "../../components/Breadcrumb";
import {
  SectionTitleOne,
  SectionTitleTwo,
} from "../../components/SectionTitle";
import { useToasts } from "react-toast-notifications";
import LocalizationContext from "../../context/LocalizationContext";
import { renderToStaticMarkup } from "react-dom/server";
import EmailTemplate from "../../components/Newsletter/EmailTemplate";

const Contact = () => {
  const { t } = useContext(LocalizationContext);
  const { addToast } = useToasts();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  // State for validation errors
  const [contactErrors, setContactErrors] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  // --- Validation Functions ---
  const validateName = (name) => {
    if (!name) return t("please_enter_your_name");
    return "";
  };

  const validateEmail = (email) => {
    if (!email) return t("please_enter_your_email");
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return t("invalid_email_format");
    return "";
  };

  const validateSubject = (subject) => {
    if (!subject) return t("please_enter_a_subject");
    return "";
  };

  const validateMessage = (message) => {
    if (!message) return t("please_enter_a_message");
    if (message.length < 10) return t("message_too_short");
    return "";
  };

  // --- Input Change Handler ---
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // --- onBlur Handlers for Validation ---
  const handleNameBlur = (e) => {
    const errorMsg = validateName(e.target.value);
    setContactErrors((prev) => ({ ...prev, name: errorMsg }));
  };

  const handleEmailBlur = (e) => {
    const errorMsg = validateEmail(e.target.value);
    setContactErrors((prev) => ({ ...prev, email: errorMsg }));
  };

  const handleSubjectBlur = (e) => {
    const errorMsg = validateSubject(e.target.value);
    setContactErrors((prev) => ({ ...prev, subject: errorMsg }));
  };

  const handleMessageBlur = (e) => {
    const errorMsg = validateMessage(e.target.value);
    setContactErrors((prev) => ({ ...prev, message: errorMsg }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

     // Validate all fields on submit
     const nameError = validateName(formData.name);
     const emailError = validateEmail(formData.email);
     const subjectError = validateSubject(formData.subject);
     const messageError = validateMessage(formData.message);
     setContactErrors({
       name: nameError,
       email: emailError,
       subject: subjectError,
       message: messageError,
     });
     if (nameError || emailError || subjectError || messageError) return;
  
    const emailHtml = renderToStaticMarkup(
      <EmailTemplate
        name={formData.name}
        email={formData.email}
        subject={formData.subject}
        message={formData.message}
      />
    );
  
    const response = await fetch("/api/send-email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        to: ["grigorkalajdziev@gmail.com", "makeupbykika@hotmail.com"],
        from: "contact@kikamakeupandbeautyacademy.com",
        subject: formData.subject,
        message: formData.message,
        name: formData.name,
        email: formData.email, 
      }),
    });
  
    const textResponse = await response.text();
  
    try {
      const result = JSON.parse(textResponse);
      if (response.ok) {
        addToast(t("email_sending"), {
          appearance: "success",
          autoDismiss: true,
        });
        setFormData({ name: "", email: "", subject: "", message: "" });
      } else {
        addToast(
          t(`Failed to send email: ${result.error || "Unknown error"}`),
          {
            appearance: "error",
            autoDismiss: true,
          }
        );
      }
    } catch (err) {
      addToast(t("Failed to parse the server response."), {
        appearance: "error",
        autoDismiss: true,
      });
    }
  };
  

  return (
    <LayoutTwo>
      {/* breadcrumb */}
      <BreadcrumbOne
        pageTitle={t("contact_title")}
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
          <li>{t("contact")}</li>
        </ul>
      </BreadcrumbOne>
      <div className="contact-page-content-wrapper space-mt--r130 space-mb--r130">
        <div className="contact-page-top-info space-mb--r100">
          <Container>
            <Row>
              <Col lg={12}>
                <SectionTitleTwo
                  title={t("contact_detail")}
                  subtitle={t("come_have_a_look")}
                />
              </Col>
            </Row>
            <Row className="space-mb-mobile-only--m50">
              <Col md={4} className="space-mb-mobile-only--50">
                <div className="icon-box">
                  <div className="icon-box__icon">
                    <IoIosPin />
                  </div>
                  <div className="icon-box__content">
                    <h3 className="title">{t("address")}</h3>
                    <p className="content">{t("address_details")}</p>
                  </div>
                </div>
              </Col>
              <Col md={4} className="space-mb-mobile-only--50">
                <div className="icon-box">
                  <div className="icon-box__icon">
                    <IoIosCall />
                  </div>
                  <div className="icon-box__content">
                    <h3 className="title">{t("contact")}</h3>
                    <p className="content">
                      {t("mobile")}: (+389) 78 / 343 – 377{" "}
                      <span>{t("phone")}: (+389) 46 / 207 – 770</span>
                    </p>
                  </div>
                </div>
                <div className="icon-box">
                  <div className="icon-box__icon">
                    <IoIosMail />
                  </div>
                  <div className="icon-box__content">
                    <p className="content">
                      {t("mail")}: makeupbykika@hotmail.com
                    </p>
                  </div>
                </div>
              </Col>
              <Col md={4} className="space-mb-mobile-only--50">
                <div className="icon-box">
                  <div className="icon-box__icon">
                    <IoIosClock />
                  </div>
                  <div className="icon-box__content">
                    <h3 className="title">{t("hours_of_operation")}</h3>
                    <p className="content">
                      {t("monday_to_friday")}: 09:00 – 20:00
                      <span>{t("weekend_hours")}: 10:30 – 22:00</span>
                    </p>
                  </div>
                </div>
              </Col>
            </Row>
          </Container>
        </div>

        {/* Google Map */}
        <div className="contact-page-map space-mb--r100">
          <Container>
            <Row>
              <Col lg={12}>
                <div className="google-map">
                  <iframe
                    title="map"
                    src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d728.0959768767224!2d20.80535883327269!3d41.11575098866173!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1350dca0b53ff41b%3A0x474263a97198a028!2sKika%20makeup%20and%20beauty%20academy!5e1!3m2!1smk!2smk!4v1732701744906!5m2!1smk!2smk"
                    allowFullScreen
                  />
                </div>
              </Col>
            </Row>
          </Container>
        </div>

        {/* Contact Form */}
        <div className="contact-page-form">
          <Container>
            <Row>
              <Col lg={12}>
                <SectionTitleOne title={t("get_in_touch")} />
              </Col>
            </Row>
            <Row className="justify-content-center">
              <Col lg={8} className="mx-auto">
                <div className="lezada-form contact-form">
                  <form onSubmit={handleSubmit}>
                    <Row>
                      <Col md={6} className="space-mb--40">
                        <input
                          type="text"
                          placeholder={t("first_name")}
                          name="name"
                          id="customerName"
                          value={formData.name}
                          onChange={handleChange}
                          onBlur={handleNameBlur}                          
                        />
                        {contactErrors.name && (
                          <div style={{ color: "red", fontSize: "0.9rem", marginTop: "4px" }}>
                            {contactErrors.name}
                          </div>
                        )}
                      </Col>
                      <Col md={6} className="space-mb--40">
                        <input
                          type="email"
                          placeholder={t("email")}
                          name="email"
                          id="customerEmail"
                          value={formData.email}
                          onChange={handleChange}
                          onBlur={handleEmailBlur}                          
                        />
                        {contactErrors.email && (
                          <div style={{ color: "red", fontSize: "0.9rem", marginTop: "4px" }}>
                            {contactErrors.email}
                          </div>
                        )}
                      </Col>
                      <Col md={12} className="space-mb--40">
                        <input
                          type="text"
                          placeholder={t("subject")}
                          name="subject"
                          id="contactSubject"
                          value={formData.subject}
                          onChange={handleChange}
                          onBlur={handleSubjectBlur}                          
                        />
                        {contactErrors.subject && (
                          <div style={{ color: "red", fontSize: "0.9rem", marginTop: "4px" }}>
                            {contactErrors.subject}
                          </div>
                        )}
                      </Col>
                      <Col md={12} className="space-mb--40">
                        <textarea
                          cols={30}
                          rows={10}
                          placeholder={t("message")}
                          name="message"
                          id="contactMessage"
                          value={formData.message}
                          onChange={handleChange}
                          onBlur={handleMessageBlur}
                        />
                        {contactErrors.message && (
                          <div style={{ color: "red", fontSize: "0.9rem", marginTop: "4px" }}>
                            {contactErrors.message}
                          </div>
                        )}
                      </Col>
                      <Col md={12} className="text-center">
                        <button
                          type="submit"
                          value="submit"
                          id="submit"
                          className="lezada-button lezada-button--medium"
                        >
                          {t("submit")}
                        </button>
                      </Col>
                    </Row>
                  </form>
                </div>
              </Col>
            </Row>
          </Container>
        </div>
      </div>
    </LayoutTwo>
  );
};

export default Contact;
