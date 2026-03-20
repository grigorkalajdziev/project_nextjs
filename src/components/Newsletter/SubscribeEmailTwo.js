// components/SubscribeEmailTwo.js
import { useState, useEffect } from "react";
import { IoIosArrowRoundForward } from "react-icons/io";
import { useLocalization } from "../../context/LocalizationContext";

const SubscribeEmailTwo = () => {
  const { t, currentLanguage } = useLocalization();
  const [email, setEmail] = useState("");  
  const [status, setStatus] = useState(""); // "", "sending", "success", "error"
  const [message, setMessage] = useState("");

const submit = async () => {
  if (email && email.indexOf("@") > -1) {
    setStatus("sending");

    try {
      // --- 1️⃣ Add subscriber ---
      const subscribeResponse = await fetch("/api/resend-subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, currentLanguage }),
      });

      if (!subscribeResponse.ok) {
        const data = await subscribeResponse.json();
        throw new Error(data.error || "Subscription failed");
      }

      // --- 2️⃣ Schedule broadcast welcome email ---
      const subject =
        currentLanguage === "mk"
          ? "Добредојдовте во нашиот Newsletter!"
          : "Welcome to our Newsletter!";
      const html = `<p>${
        currentLanguage === "mk"
          ? "Ви благодариме што се претплативте!"
          : "Thank you for subscribing!"
      }</p><p>${email}</p>`;     

      // ✅ Success
      setStatus("success");
      setMessage(t("thank_you_for_subscribing"));
      setEmail(""); // clear input
    } catch (error) {
      setStatus("error");
      setMessage(error.message);
    }
  }
};

  useEffect(() => {
    let timer;
    if (status === "success") {     
      timer = setTimeout(() => {
        setStatus("");
        setMessage("");
      }, 3000);
    }   
    return () => clearTimeout(timer);
  }, [status]);

  return (
    <div className="subscribe-form">
      <div className="mc-form">
        <input
          id="resend-form-email"
          className="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={t("email_placeholder")}
        />
        <button className="button" onClick={submit}>
          <IoIosArrowRoundForward />
        </button>
      </div>
      {status === "sending" && (
        <div style={{ color: "#3498db", fontSize: "14px", lineHeight: "1.3" }}>
          {t("sending")}...
        </div>
      )}
      {status === "error" && (
        <div style={{ color: "#e74c3c", fontSize: "14px", lineHeight: "1.3" }}>
          {message}
        </div>
      )}
      {status === "success" && (
        <div style={{ color: "#2ecc71", fontSize: "14px", lineHeight: "1.3" }}>
          {message}
        </div>
      )}
    </div>
  );
};

export default SubscribeEmailTwo;
