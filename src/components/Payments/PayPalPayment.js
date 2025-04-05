// components/PayPalPayment.js
"use client";
import React from 'react';
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { useLocalization } from "../../context/LocalizationContext";
import { X } from "lucide-react"

const PayPalPayment = ({ amount, currency, onSuccess, onClose }) => {
  const { t } = useLocalization();

  return (
    <PayPalScriptProvider
      options={{
        "client-id": "AbUZoDFroE31T_VURYDQZ9pMC8wH-E4ANdQQsBJZxwMpC_-bVN-x9L3rJ1GnnsCwp7oq3phElpaWU7Oo",        
        intent: "capture",
        currency: currency,
      }}
    >
      <div className="paypal-container">
      <button className="close-btn" onClick={onClose}>
          <X size={24} color="white"/>
        </button>
        {/* <h3>{t("pay_with_paypal")}</h3> */}
        <div className="paypal-buttons-wrapper">
        <PayPalButtons
          style={{ layout: "vertical" }}
          fundingSource="paypal"
          createOrder={(data, actions) => {
            return actions.order.create({
              purchase_units: [
                {
                  amount: {
                    value: amount,
                    currency_code: "EUR",
                  },                  
                },
              ],
            });
          }}
          onApprove={(data, actions) => {
            return actions.order.capture().then((details) => {
              onSuccess(details);
            });
          }}
          onError={(err) => {
            console.error("PayPal Checkout onError", err);
          }}
        />
        </div>
      </div>
    </PayPalScriptProvider>
  );
};

export default PayPalPayment;
