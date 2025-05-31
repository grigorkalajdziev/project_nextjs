import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 12,
    fontFamily: 'Helvetica',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    borderBottomWidth: 1,
    borderColor: '#eeeeee',
    paddingBottom: 10,
    fontFamily: 'Helvetica',
  },
  title: {
    fontSize: 18,
    fontWeight: 700,
    fontFamily: 'Helvetica',
  },
  orderNumber: {
    fontFamily: 'Helvetica',
  },
  section: {
    marginBottom: 12,
  },
  label: {
    fontWeight: 700,
    fontFamily: 'Helvetica',
    marginTop: 4,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  productsTable: {
    marginVertical: 10,
  },
  tableRow: {
    flexDirection: 'row',
  },
  tableColHeader: {
    width: '25%',
    borderBottomWidth: 1,
    borderColor: '#cccccc',
    padding: 4,
    fontWeight: 700,
    fontFamily: 'Helvetica',
    textAlign: 'right',
  },
  firstColHeader: {
    textAlign: 'left',
  },
  tableCol: {
    width: '25%',
    padding: 4,
    borderBottomWidth: 1,
    borderColor: '#f1f1f1',
    fontFamily: 'Helvetica',
    textAlign: 'right',
  },
  firstCol: {
    textAlign: 'left',
  },
  quantityCol: {
    width: '25%',
    padding: 4,
    borderBottomWidth: 1,
    borderColor: '#f1f1f1',
    fontFamily: 'Helvetica',
    textAlign: 'right',
  },
  priceCol: {
    width: '25%',
    padding: 4,
    borderBottomWidth: 1,
    borderColor: '#f1f1f1',
    fontFamily: 'Helvetica',
    textAlign: 'right',
  },
  totalCol: {
    width: '25%',
    padding: 4,
    borderBottomWidth: 1,
    borderColor: '#f1f1f1',
    fontFamily: 'Helvetica',
    textAlign: 'right',
  },
  qr: {
    width: 50,
    height: 50,
    position: 'absolute',
    bottom: 80,
    right: 30,
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30,
    textAlign: 'center',
    fontSize: 10,
    color: '#999999',
    fontFamily: 'Helvetica',
  },
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
  qrCodeUrl,
}) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Reservation Confirmation</Text>
        <Text style={styles.orderNumber}>#{orderNumber}</Text>
      </View>

      {/* Customer Info */}
      <View style={styles.section}>
        <Text style={styles.label}>Customer:</Text>
        <Text>{customerName}</Text>
        {customerEmail && <Text>{customerEmail}</Text>}
        {customerPhone && <Text>{customerPhone}</Text>}
      </View>

      {/* Reservation Details */}
      <View style={styles.section}>
        <View style={styles.row}>
          <Text style={styles.label}>Date Issued:</Text>
          <Text>{date}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Reservation:</Text>
          <Text>
            {reservationDate} at {reservationTime}
          </Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Payment Method:</Text>
          <Text>{paymentMethod}</Text>
        </View>
      </View>

      {/* Items Table */}
      {products.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.label}>Items:</Text>
          <View style={styles.productsTable}>
            {/* Table Header */}
            <View style={styles.tableRow}>
              <Text style={[styles.tableColHeader, styles.firstColHeader]}>Item</Text>
              <Text style={styles.tableColHeader}>Qty</Text>
              <Text style={styles.tableColHeader}>Unit Price</Text>
              <Text style={styles.tableColHeader}>Total</Text>
            </View>
            {/* Table Rows */}
            {products.map((item, idx) => (
              <View key={idx} style={styles.tableRow}>
                <Text style={[styles.tableCol, styles.firstCol, styles.label]}>
                  {item.name}
                </Text>
                <Text style={styles.quantityCol}>{item.quantity}</Text>
                <Text style={styles.priceCol}>{item.unitPrice}</Text>
                <Text style={styles.totalCol}>{item.totalPrice}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Grand Total */}
      <View style={styles.section}>
        <View style={styles.row}>
          <Text style={styles.label}>Grand Total:</Text>
          <Text>{total}</Text>
        </View>
      </View>

      {/* Thank You Note */}
      <View style={styles.section}>
        <Text>Thank you for choosing us. We look forward to serving you!</Text>
      </View>

      {/* QR Code */}
      {qrCodeUrl && <Image style={styles.qr} src={qrCodeUrl} />}

      {/* Footer */}
      <Text style={styles.footer}>
        Questions? Contact us at support@example.com | +1 234 567 890
      </Text>
    </Page>
  </Document>
);

export default ConfirmationDocument;
