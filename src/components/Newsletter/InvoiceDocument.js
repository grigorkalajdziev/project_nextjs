import React from 'react';
import path from 'path';
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
  Font
} from '@react-pdf/renderer';

// Register fonts
Font.register({
  family: 'NotoSans',
  fonts: [
    {
      src: path.resolve(process.cwd(), 'public/fonts/NotoSans-Regular.ttf'),
      fontWeight: 400,
    },
    {
      src: path.resolve(process.cwd(), 'public/fonts/NotoSans-Bold.ttf'),
      fontWeight: 700,
    },
  ],
});

const styles = StyleSheet.create({
  page: { padding: 30, fontSize: 12, fontFamily: 'NotoSans' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    borderBottomWidth: 1,
    borderColor: '#eee',
    paddingBottom: 10,
  },
  title: { fontSize: 18, fontWeight: 700 },
  label: { marginTop: 4 },
  boldLabel: { fontWeight: 700 },
  section: { marginBottom: 12 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },

  productsTable: { marginVertical: 10 },
  tableRow: { flexDirection: 'row' },
  qr: { width: 50, height: 50, marginLeft: 20 },

  // Matching MK design
  tableColHeader: {
    borderBottomWidth: 1,
    borderColor: '#ccc',
    padding: 4,
    fontWeight: 700,
    textAlign: 'right',
  },
  firstColHeader: {
    width: '40%',
    textAlign: 'left',
  },
  firstCol: {
    width: '40%',
    textAlign: 'left',
    padding: 4,
    borderBottomWidth: 1,
    borderColor: '#f1f1f1',
  },
  quantityCol: {
    width: '20%',
    textAlign: 'right',
    padding: 4,
    borderBottomWidth: 1,
    borderColor: '#f1f1f1',
  },
  priceCol: {
    width: '20%',
    textAlign: 'right',
    padding: 4,
    borderBottomWidth: 1,
    borderColor: '#f1f1f1',
  },
  totalCol: {
    width: '20%',
    textAlign: 'right',
    padding: 4,
    borderBottomWidth: 1,
    borderColor: '#f1f1f1',
  },

  footer: {
    marginTop: 40,
    textAlign: 'center',
    fontSize: 10,
    color: '#999',
  },
});

// Helper: format price
const formatPrice = (num) => {
  const n = Number(num);
  return n.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

function InvoiceDocument(props) {
  const {
    orderNumber,
    date,
    paymentText,
    reservationDate,
    reservationTime,
    total,
    normalizedProducts = [],
    discount = 0,
    couponCode = null,
    customerName,
    customerPhone,
    customerEmail,
    qrCodeUrl,
  } = props;

  const subtotal = normalizedProducts.reduce(
  (sum, item) => sum + item.price * item.quantity,
    0
  );

  const dueDate = 'Due in 7 days';
  const invoiceStatus = 'Unpaid';

  const company = {
    name: 'Kika Makeup and Beauty Academy',
    address: 'Bul. Turisticka 40, Ohrid - Macedonia 6000',
    email: 'makeupbykika@hotmail.com',
    taxNumber: 'MK123456789',
  };

  const bankDetails = {
    bankName: 'NLB Banka',
    iban: 'MK07200002784531254',
  };  

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Invoice</Text>
          <Text>#{orderNumber}</Text>
          {qrCodeUrl && <Image style={styles.qr} src={qrCodeUrl} />}
        </View>

        {/* Company Info */}
        <View style={styles.section}>
          <Text style={styles.boldLabel}>From:</Text>
          <Text>{company.name}</Text>
          <Text>{company.address}</Text>
          <Text>{company.email}</Text>
          <Text>Tax Number: {company.taxNumber}</Text>
        </View>

        {/* Customer Info */}
        <View style={styles.section}>
          <Text style={styles.boldLabel}>Customer:</Text>
          <Text>{customerName}</Text>
          {customerEmail && <Text>{customerEmail}</Text>}
          {customerPhone && <Text>{customerPhone}</Text>}
        </View>

        {/* Dates and Payment */}
        <View style={styles.section}>
          <View style={styles.row}>
            <Text>Date:</Text>
            <Text>{date}</Text>
          </View>
          {reservationDate && (
            <View style={styles.row}>
              <Text>Reservation Date & Time:</Text>
              <Text>{reservationDate} at {reservationTime}</Text>
            </View>
          )}
          <View style={styles.row}>
            <Text>Due Date:</Text>
            <Text>{dueDate}</Text>
          </View>
          <View style={styles.row}>
            <Text>Status:</Text>
            <Text>{invoiceStatus}</Text>
          </View>
          <View style={styles.row}>
            <Text>Payment Method:</Text>
            <Text>{paymentText}</Text>
          </View>
        </View>

        {/* Products Table */}
        {normalizedProducts.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.boldLabel}>Services:</Text>
            <View style={styles.productsTable}>
              {/* Header */}
              <View style={styles.tableRow}>
                <Text style={[styles.tableColHeader, styles.firstColHeader]}>Service</Text>
                <Text style={[styles.tableColHeader, { width: '20%' }]}>Qty</Text>
                <Text style={[styles.tableColHeader, { width: '20%' }]}>Price (€)</Text>
                <Text style={[styles.tableColHeader, { width: '20%' }]}>Total (€)</Text>
              </View>

              {/* Rows */}
              {normalizedProducts.map((item, idx) => (
                <View key={idx} style={styles.tableRow}>
                  <Text style={styles.firstCol}>{item.name}</Text>
                  <Text style={styles.quantityCol}>{item.quantity}</Text>
                  <Text style={styles.priceCol}>{formatPrice(item.price)} €</Text>
                  <Text style={styles.totalCol}>{formatPrice(item.price * item.quantity)} €</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Total */}
        <View style={styles.section}>
          <View style={styles.row}>
            <Text>Subtotal:</Text>
            <Text>{formatPrice(subtotal)} €</Text>
          </View>

          {discount > 0 && (
            <View style={styles.row}>
              <Text>
                Discount{couponCode ? ` (${couponCode})` : ""}:
              </Text>
              <Text>-{formatPrice(discount)} €</Text>
            </View>
          )}

          <View style={styles.row}>
            <Text style={styles.boldLabel}>Total Amount:</Text>
            <Text style={styles.boldLabel}>
              {formatPrice(total)} €
            </Text>
          </View>
        </View>

        {/* Bank Details */}
        <View style={styles.section}>
          <Text style={styles.boldLabel}>Bank Details:</Text>
          <Text>Bank: {bankDetails.bankName}</Text>
          <Text>IBAN: {bankDetails.iban}</Text>
        </View>

        {/* Footer */}
        <View style={styles.section}>
          <Text>Thank you for your order!</Text>
        </View>
        <Text>Questions? Contact makeupbykika@hotmail.com</Text>
      </Page>
    </Document>
  );
}

export default InvoiceDocument;
