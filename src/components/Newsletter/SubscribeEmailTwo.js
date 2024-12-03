import { useContext } from "react";
import MailchimpSubscribe from "react-mailchimp-subscribe";
import { IoIosArrowRoundForward } from "react-icons/io";
import LocalizationContext from "../../context/LocalizationContext";

const CustomForm = ({ status, message, onValidated }) => {
  const { t } = useContext(LocalizationContext);
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
      <div className="mc-form">
        <input
          id="mc-form-email"
          className="email"
          ref={(node) => (email = node)}
          type="email"
          placeholder={t("email_placeholder")}
        />
        <button className="button" onClick={submit}>
          <IoIosArrowRoundForward />
        </button>
      </div>

      {status === "sending" && (
        <div style={{ color: "#3498db", fontSize: "14px", lineHeight: "1.3" }}>
          sending...
        </div>
      )}
      {status === "error" && (
        <div
          style={{ color: "#e74c3c", fontSize: "14px", lineHeight: "1.3" }}
          dangerouslySetInnerHTML={{ __html: message }}
        />
      )}
      {status === "success" && (
        <div
          style={{ color: "#2ecc71", fontSize: "14px", lineHeight: "1.3" }}
          dangerouslySetInnerHTML={{ __html: message }}
        />
      )}
    </div>
  );
};

const SubscribeEmailTwo = ({ mailchimpUrl }) => {
  return (
    <div>
      <MailchimpSubscribe
        url={mailchimpUrl}
        render={({ subscribe, status, message }) => (
          <CustomForm
            status={status}
            message={message}
            onValidated={(formData) => subscribe(formData)}
          />
        )}
      />
    </div>
  );
};

export default SubscribeEmailTwo;
