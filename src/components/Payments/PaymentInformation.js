"use client";
import { useState, useEffect } from "react";
import { getDatabase, ref, get, set } from "firebase/database";
import { auth } from "../../pages/api/register"; // adjust the path as needed
import Tab from "react-bootstrap/Tab";
import Nav from "react-bootstrap/Nav";
import { useLocalization } from "../../context/LocalizationContext";
import { useToasts } from "react-toast-notifications";

const PaymentInformation = () => {
  const { t } = useLocalization();
  const { addToast } = useToasts();
  const [paymentInfo, setPaymentInfo] = useState({
    checkPayment: "",
    bankTransfer: "",
    cashOnDelivery: "",
    paypal: "",
  });
  const db = getDatabase();
  const user = auth.currentUser;

  useEffect(() => {
    if (user) {
      const paymentRef = ref(db, `users/${user.uid}/paymentMethods`);
      get(paymentRef)
        .then((snapshot) => {
          if (snapshot.exists()) {
            setPaymentInfo(snapshot.val());
          }
        })
        .catch((err) => console.error("Error fetching payment info:", err));
    }
  }, [user, db]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPaymentInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSavePaymentInfo = async () => {
    if (user) {
      try {
        await set(ref(db, `users/${user.uid}/paymentMethods`), paymentInfo);
        addToast(t("payment_info_saved"), { appearance: "success", autoDismiss: true });
      } catch (err) {
        console.error("Error saving payment info:", err);
        addToast(t("error_saving_payment_info"), { appearance: "error", autoDismiss: true });
      }
    }
  };

  return (
    <div className="payment-information">
      <h3>{t("payment_information")}</h3>
      <Tab.Container defaultActiveKey="checkPayment">
        <Nav variant="pills" className="mb-3">
          <Nav.Item>
            <Nav.Link eventKey="checkPayment">{t("check_payment")}</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="bankTransfer">{t("bank_transfer")}</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="cashOnDelivery">{t("cash_on_delivery")}</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="paypal">{t("paypal")}</Nav.Link>
          </Nav.Item>
        </Nav>
        <Tab.Content>
          <Tab.Pane eventKey="checkPayment">
            <div className="form-group">
              <label>{t("check_payment_details")}</label>
              <input 
                type="text" 
                name="checkPayment" 
                className="form-control"
                value={paymentInfo.checkPayment}
                onChange={handleChange}
                placeholder={t("enter_check_payment_details")}
              />
            </div>
          </Tab.Pane>
          <Tab.Pane eventKey="bankTransfer">
            <div className="form-group">
              <label>{t("bank_transfer_details")}</label>
              <input 
                type="text" 
                name="bankTransfer" 
                className="form-control"
                value={paymentInfo.bankTransfer}
                onChange={handleChange}
                placeholder={t("enter_bank_transfer_details")}
              />
            </div>
          </Tab.Pane>
          <Tab.Pane eventKey="cashOnDelivery">
            <div className="form-group">
              <label>{t("cash_on_delivery_details")}</label>
              <input 
                type="text" 
                name="cashOnDelivery" 
                className="form-control"
                value={paymentInfo.cashOnDelivery}
                onChange={handleChange}
                placeholder={t("enter_cash_on_delivery_details")}
              />
            </div>
          </Tab.Pane>
          <Tab.Pane eventKey="paypal">
            <div className="form-group">
              <label>{t("paypal_details")}</label>
              <input 
                type="text" 
                name="paypal" 
                className="form-control"
                value={paymentInfo.paypal}
                onChange={handleChange}
                placeholder={t("enter_paypal_details")}
              />
            </div>
          </Tab.Pane>
        </Tab.Content>
      </Tab.Container>
      <button className="btn btn-primary" onClick={handleSavePaymentInfo}>
        {t("save_payment_information")}
      </button>
    </div>
  );
};

export default PaymentInformation;
