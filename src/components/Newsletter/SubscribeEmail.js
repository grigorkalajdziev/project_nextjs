import MailchimpSubscribe from "react-mailchimp-subscribe";
import { useLocalization } from "../../context/LocalizationContext";

const CustomForm = ({ status, message, onValidated, alertColor }) => {
  const { t } = useLocalization();  
  let email;

  const submit = () => {
    email &&
      email.value.indexOf("@") > -1 &&
      onValidated({
        EMAIL: email.value
      });

    let emailInput = document.getElementById("mc-form-email");
    emailInput.value = "";
  };

  return (
    <div className="subscribe-form">
      <div className="mc-form position-relative">
        <input
          id="mc-form-email"
          className="email"
          ref={(node) => (email = node)}
          type="email"
          placeholder="Your email address"
        />
        <button className="button" onClick={submit}>
          SUBSCRIBE
        </button>
      </div>

      {status === "sending" && (
        <div
          style={{
            color: alertColor,
            fontSize: "14px",
            marginTop: "15px",
            lineHeight: "1.3"
          }}
        >
          {t("sending")}         
        </div>
      )}
      {status === "error" && (
        <div
          style={{
            color: alertColor,
            fontSize: "14px",
            marginTop: "15px",
            lineHeight: "1.3"
          }}
          dangerouslySetInnerHTML={{ __html: message }}
        />
      )}
      {status === "success" && (
        <div
          style={{
            color: alertColor,
            fontSize: "14px",
            marginTop: "15px",
            lineHeight: "1.3"
          }}
          dangerouslySetInnerHTML={{ __html: message }}
        />
      )}
    </div>
  );
};

const SubscribeEmail = ({ mailchimpUrl, alertColor }) => {
  return (
    <div>
      <MailchimpSubscribe
        url={mailchimpUrl}
        render={({ subscribe, status, message }) => (
          <CustomForm
            status={status}
            message={message}
            onValidated={(formData) => subscribe(formData)}
            alertColor={alertColor}
          />
        )}
      />
    </div>
  );
};

export default SubscribeEmail;
