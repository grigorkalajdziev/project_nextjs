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
        "client-id": "AZANiUYepuj_-9bH87F3e55BPzs03ZUyAtY_tn5F0coPNfxG5VjqUD8Uvoz79X-X1t8tvVIUpbBHIDLC",        
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
