import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image, Font } from '@react-pdf/renderer';

// PDF styles using built-in fonts
const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    borderBottomWidth: 1,
    borderColor: '#eeeeee',
    paddingBottom: 10,
    fontFamily: 'Helvetica'
  },
  logo: {
    width: 100,
    height: 40
  },
  title: {
    fontSize: 18,
    fontWeight: 700,
    fontFamily: 'Helvetica'
  },
  section: {
    marginBottom: 15
  },
  label: {
    fontWeight: 700,
    fontFamily: 'Helvetica'
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5
  },
  productsTable: {
    display: 'table',
    width: 'auto',
    marginVertical: 10
  },
  tableRow: {
    flexDirection: 'row'
  },
  tableColHeader: {
    width: '25%',
    borderBottomWidth: 1,
    borderColor: '#cccccc',
    padding: 4,
    fontWeight: 700,
    fontFamily: 'Helvetica'
  },
  tableCol: {
    width: '25%',
    padding: 4,
    borderBottomWidth: 1,
    borderColor: '#f1f1f1',
    fontFamily: 'Helvetica'
  },
  qr: {
    width: 60,
    height: 60,
    position: 'absolute',
    bottom: 80,
    right: 30
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30,
    textAlign: 'center',
    fontSize: 10,
    color: '#999999',
    fontFamily: 'Helvetica'
  }
});

const ConfirmationDocument = ({
  orderNumber,
  date,
  reservationDate,
  reservationTime,
  total,
  paymentMethod = 'Cash',
  products = [],
  customerName,
  customerPhone,
  customerEmail,
  qrCodeUrl
}) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Header with optional logo */}
      <View style={styles.header}>
       {/* {logoUrl && <Image style={styles.logo} src={logoUrl} />} */}
        <Text style={styles.title}>Reservation Confirmation</Text>
        <Text style={styles.label}>#{orderNumber}</Text>
      </View>

      {/* Customer info */}
      <View style={styles.section}>
        <Text style={styles.label}>Customer:</Text>
        <Text>{customerName}</Text>
        {customerEmail && <Text>{customerEmail}</Text>}
        {customerPhone && <Text>{customerPhone}</Text>}
      </View>

      {/* Reservation details */}
      <View style={styles.section}>
        <View style={styles.row}>
          <Text style={styles.label}>Date Issued:</Text>
          <Text>{date}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Reservation:</Text>
          <Text>{reservationDate} at {reservationTime}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Payment Method:</Text>
          <Text>{paymentMethod}</Text>
        </View>
      </View>

      {/* Items table */}
      {products.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.label}>Items:</Text>
          <View style={styles.productsTable}>
            <View style={styles.tableRow}>
              <Text style={styles.tableColHeader}>Item</Text>
              <Text style={styles.tableColHeader}>Qty</Text>
              <Text style={styles.tableColHeader}>Unit Price</Text>
              <Text style={styles.tableColHeader}>Total</Text>
            </View>
            {products.map((item, idx) => (
              <View style={styles.tableRow} key={idx}>
                <Text style={styles.tableCol}>{item.name}</Text>
                <Text style={styles.tableCol}>{item.quantity}</Text>
                <Text style={styles.tableCol}>{item.unitPrice}</Text>
                <Text style={styles.tableCol}>{item.totalPrice}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Total summary */}
      <View style={styles.section}>
        <View style={styles.row}>
          <Text style={styles.label}>Grand Total:</Text>
          <Text>{total}</Text>
        </View>
      </View>

      {/* Thank you note */}
      <View style={styles.section}>
        <Text>Thank you for choosing us. We look forward to serving you!</Text>
      </View>

       {qrCodeUrl && <Image style={styles.qr} src={qrCodeUrl} />}

      {/* Footer contact info */}
      <Text style={styles.footer}>
        Questions? Contact us at support@example.com | +1 234 567 890
      </Text>
    </Page>
  </Document>
);

export default ConfirmationDocument;
