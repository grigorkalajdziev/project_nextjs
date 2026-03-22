import { Row, Col, Spinner } from "react-bootstrap";
import Select, { components } from "react-select";
import { AiOutlineEyeInvisible, AiOutlineEye } from "react-icons/ai";

const AccountDetailsTab = ({
  t,
  firstName, setFirstName,
  lastName, setLastName,
  displayName, setDisplayName,
  email,
  address, setAddress,
  zipCode, setZipCode,
  phone, setPhone,
  currentPassword, setCurrentPassword,
  newPassword, setNewPassword,
  confirmPassword, setConfirmPassword,
  isLoading,
  selectedCountry, setSelectedCountry,
  selectedCity, setSelectedCity,
  cityOptions,
  nameOnCard, setNameOnCard,
  cardNumber, setCardNumber,
  expiration, setExpiration,
  cvc, setCvc,
  hasChanges,
  initialLoaded,
  isCanceling, setIsCanceling,
  handleSave,
  handleCancel,
  countryOptions,
  customStyles,
  showCurrentPassword, toggleCurrentPasswordVisibility,
  showNewPassword, toggleNewPasswordVisibility,
  showConfirmPassword, toggleConfirmPasswordVisibility,
  formatCardNumber,
  formatExpiration,
}) => {
  return (
    <div className="my-account-area__content">
      <h3>{t("account_details")}</h3>
      <div className="account-details-form">
        <form onSubmit={handleSave}>
          <Row>
            <Col lg={6}>
              <div className="single-input-item">
                <label htmlFor="first-name" className="required">{t("first_name")}</label>
                <input type="text" id="first-name" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
              </div>
            </Col>
            <Col lg={6}>
              <div className="single-input-item">
                <label htmlFor="last-name" className="required">{t("last_name")}</label>
                <input type="text" id="last-name" value={lastName} onChange={(e) => setLastName(e.target.value)} />
              </div>
            </Col>
          </Row>

          <div className="single-input-item">
            <label htmlFor="display-name" className="required">{t("display_name")}</label>
            <input type="text" id="display-name" value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
          </div>

          <div className="single-input-item">
            <label htmlFor="email" className="required">{t("email_address")}</label>
            <input type="email" id="email" value={email} readOnly />
          </div>

          {/* Billing Address */}
          <div className="my-account-area__content">
            <h3>{t("billing_address")}</h3>
            <div className="account-details-form">
              <Row>
                <Col lg={6}>
                  <div className="single-input-item">
                    <label className="required">{t("country_label")}</label>
                    <Select
                      options={countryOptions}
                      value={selectedCountry ?? null}
                      onChange={setSelectedCountry}
                      placeholder={t("select_country")}
                      styles={customStyles}
                      components={{
                        Option: ({ data, ...props }) => (
                          <components.Option {...props}>
                            <img src={data.flag} alt="" style={{ marginRight: 8, verticalAlign: "middle" }} />
                            {data.label}
                          </components.Option>
                        ),
                        SingleValue: ({ data, ...props }) => (
                          <components.SingleValue {...props}>
                            <img src={data.flag} alt="" style={{ marginRight: 8, verticalAlign: "middle" }} />
                            {data.label}
                          </components.SingleValue>
                        ),
                      }}
                    />
                  </div>
                </Col>
                <Col lg={6}>
                  <div className="single-input-item">
                    <label htmlFor="city" className="required">{t("city_label")}</label>
                    <Select
                      options={cityOptions}
                      value={selectedCity}
                      onChange={setSelectedCity}
                      placeholder={t("select_city")}
                      styles={customStyles}
                      isDisabled={!selectedCountry}
                    />
                  </div>
                </Col>
                <Col lg={6}>
                  <div className="single-input-item">
                    <label htmlFor="zip-code" className="required">{t("zip_label")}</label>
                    <input type="text" id="zip-code" className="form-control" value={zipCode} onChange={(e) => setZipCode(e.target.value)} />
                  </div>
                </Col>
                <Col lg={6}>
                  <div className="single-input-item">
                    <label htmlFor="address" className="required">{t("address")}</label>
                    <input type="text" id="address" className="form-control" value={address} onChange={(e) => setAddress(e.target.value)} />
                  </div>
                </Col>
              </Row>

              <div className="single-input-item">
                <label htmlFor="phone">{t("mobile")}</label>
                <input type="text" id="phone" className="form-control" value={phone} onChange={(e) => setPhone(e.target.value)} />
              </div>

              {/* Payment Information */}
              <div className="single-input-item">
                <h3>{t("payment_information")}</h3>
                <label>{t("name_on_card")}</label>
                <input type="text" value={nameOnCard} onChange={(e) => setNameOnCard(e.target.value)} placeholder={t("enter_name_on_card")} />
              </div>

              <div className="single-input-item">
                <label>{t("card_number")}</label>
                <input
                  type="text"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                  placeholder="**** **** **** ****"
                  maxLength="19"
                />
              </div>

              <Row>
                <Col md={6}>
                  <div className="single-input-item">
                    <label>{t("expiration")}</label>
                    <input
                      type="text"
                      value={expiration}
                      onChange={(e) => setExpiration(formatExpiration(e.target.value))}
                      placeholder={t("MM_YY")}
                      maxLength="5"
                    />
                  </div>
                </Col>
                <Col md={6}>
                  <div className="single-input-item">
                    <label>{t("cvc").toUpperCase()}</label>
                    <input type="text" value={cvc} onChange={(e) => setCvc(e.target.value)} placeholder={t("enter_cvc")} maxLength="3" />
                  </div>
                </Col>
              </Row>
            </div>
          </div>

          {/* Password Change */}
          <fieldset>
            <legend>{t("password_change")}</legend>

            <div className="single-input-item" style={{ position: "relative" }}>
              <label htmlFor="current-pwd" className="required">{t("current_password")}</label>
              <input type={showCurrentPassword ? "text" : "password"} id="current-pwd" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
              <span onClick={toggleCurrentPasswordVisibility} style={{ position: "absolute", right: "10px", top: "35px", cursor: "pointer" }}>
                {showCurrentPassword ? <AiOutlineEye size={20} color="#000" /> : <AiOutlineEyeInvisible size={20} color="#000" />}
              </span>
            </div>

            <div className="row">
              <div className="col-lg-6">
                <div className="single-input-item" style={{ position: "relative" }}>
                  <label htmlFor="new-pwd" className="required">{t("new_password")}</label>
                  <input type={showNewPassword ? "text" : "password"} id="new-pwd" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                  <span onClick={toggleNewPasswordVisibility} style={{ position: "absolute", right: "10px", top: "35px", cursor: "pointer" }}>
                    {showNewPassword ? <AiOutlineEye size={20} color="#000" /> : <AiOutlineEyeInvisible size={20} color="#000" />}
                  </span>
                </div>
              </div>
              <div className="col-lg-6">
                <div className="single-input-item" style={{ position: "relative" }}>
                  <label htmlFor="confirm-pwd" className="required">{t("confirm_password")}</label>
                  <input type={showConfirmPassword ? "text" : "password"} id="confirm-pwd" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                  <span onClick={toggleConfirmPasswordVisibility} style={{ position: "absolute", right: "10px", top: "35px", cursor: "pointer" }}>
                    {showConfirmPassword ? <AiOutlineEye size={20} color="#000" /> : <AiOutlineEyeInvisible size={20} color="#000" />}
                  </span>
                </div>
              </div>
            </div>
          </fieldset>

          <p>{t("password_note")}</p>

          <div className="single-input-item d-flex gap-3">
            <button type="submit" disabled={isLoading}>
              {isLoading ? <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" /> : t("save_changes")}
            </button>
            <button
              type="button"
              onClick={async () => {
                setIsCanceling(true);
                await new Promise((resolve) => setTimeout(resolve, 500));
                handleCancel();
                setIsCanceling(false);
              }}
              disabled={!hasChanges || !initialLoaded || isCanceling || isLoading}
            >
              {isCanceling ? <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" /> : t("cancel")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AccountDetailsTab;
