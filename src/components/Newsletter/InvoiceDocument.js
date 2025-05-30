// components/InvoiceDocument.js
import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

// PDF styles
const styles = StyleSheet.create({
  page: { padding: 30, fontSize: 12 },
  section: { marginBottom: 10 },
  header: { fontSize: 18, marginBottom: 20 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 },
  bold: { fontWeight: 'bold' }
});

/**
 * InvoiceDocument: a React-PDF document component for bank payments
 * @param {Object} props.order  Order object with fields:
 *   - orderNumber, date, reservationDate, reservationTime, status, total, products (array)
 */
const InvoiceDocument = ({
  orderNumber,
  date,
  reservationDate,
  reservationTime,
  status,
  total,
  products = [],
  paymentMethod,
}) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Text>Invoice: {orderNumber}</Text>
      </View>
      <View style={styles.section}>
        <Text>Date: {date}</Text>
        <Text>Reservation: {reservationDate} at {reservationTime}</Text>
        <Text>Status: {status}</Text>
        <Text>Payment: {paymentMethod}</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.bold}>Items:</Text>
        {products.map((item, idx) => (
          <View key={idx} style={styles.row}>
            <Text>{item.name}</Text>
            <Text>{item.quantity} × {item.price}</Text>
          </View>
        ))}
      </View>
      <View style={styles.row}>
        <Text style={styles.bold}>Total:</Text>
        <Text style={styles.bold}>{total}</Text>
      </View>
    </Page>
  </Document>
);

export default InvoiceDocument;