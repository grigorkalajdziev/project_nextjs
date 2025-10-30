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
    position: 'relative',
  },
  // Title NOT bold (only headers and total remain bold)
  title: { fontSize: 18, fontFamily: 'NotoSans' },
  label: { marginTop: 4, fontFamily: 'NotoSans' },
  labelBold: { marginTop: 4, fontFamily: 'NotoSans', fontWeight: 700 },
  section: { marginBottom: 12 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 2 },
  productsTable: { marginVertical: 10 },
  tableRow: { flexDirection: 'row' },
  qr: { width: 50, height: 50, marginLeft: 20 },

  // Table headers: keep bold
  tableColHeader: {
    borderBottomWidth: 1,
    borderColor: '#ccc',
    padding: 4,
    fontWeight: 700,
    fontFamily: 'NotoSans',
    textAlign: 'right',
  },
  tableCol: {
    width: '25%',
    padding: 4,
    borderBottomWidth: 1,
    borderColor: '#f1f1f1',
    fontFamily: 'NotoSans',
    textAlign: 'right',
  },

  firstColHeader: { textAlign: 'left' },
  firstCol: {
    width: '40%',
    textAlign: 'left',
    padding: 4,
    borderBottomWidth: 1,
    borderColor: '#f1f1f1',
    fontFamily: 'NotoSans',
  },
  tableCol: { width: '20%', padding: 4, borderBottomWidth: 1, borderColor: '#f1f1f1', textAlign: 'right' },
  quantityCol: {
    width: '20%',
    textAlign: 'right',
    padding: 4,
    borderBottomWidth: 1,
    borderColor: '#f1f1f1',
    fontFamily: 'NotoSans',
  },
  priceCol: {
    width: '20%',
    textAlign: 'right',
    padding: 4,
    borderBottomWidth: 1,
    borderColor: '#f1f1f1',
    fontFamily: 'NotoSans',
  },
  totalCol: {
    width: '20%',
    textAlign: 'right',
    padding: 4,
    borderBottomWidth: 1,
    borderColor: '#f1f1f1',
    fontFamily: 'NotoSans',
  },

  // Total row kept bold
  totalRowLabel: { fontFamily: 'NotoSans', fontWeight: 700 },
  totalRowValue: { fontFamily: 'NotoSans', fontWeight: 700 },

  footer: {
    marginTop: 40,
    textAlign: 'center',
    fontSize: 10,
    color: '#999',
    fontFamily: 'NotoSans',
  },
});

// Helper: format date as DD-MM-YYYY safely
const formatDate = (value) => {
  if (!value) return '-';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return String(value); // fallback to raw if invalid
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}-${month}-${year}`;
};

// Format price for en-GB with 2 decimals, safe fallback
const formatPrice = (num) => {
  const n = Number(num);
  if (Number.isNaN(n)) return '-';
  return n.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

function InvoiceDocument(props) {
  const {
    orderNumber,
    date,
    reservationDate,
    reservationTime,
    paymentText,
    normalizedProducts = [],
    customerName,
    customerPhone,
    customerEmail,
    qrCodeUrl,
  } = props;

  const subtotal = normalizedProducts.reduce((acc, item) => {
    const price = Number(item.price || 0);
    const qty = Number(item.quantity || 0);
    return acc + price * qty;
  }, 0);

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

  // Build a single reservation string (date and time combined)
  const reservationDisplay = (() => {
    const parts = [];
    if (reservationDate) parts.push(formatDate(reservationDate));
    if (reservationTime) parts.push(String(reservationTime));
    return parts.length ? parts.join(' in ') : null;
  })();

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Invoice</Text>
          <Text>#{orderNumber}</Text>
          {qrCodeUrl && <Image style={styles.qr} src={qrCodeUrl} />}
        </View>

        {/* From */}
        <View style={styles.section}>
          <Text style={styles.labelBold}>From:</Text>
          <Text>{company.name}</Text>
          <Text>{company.address}</Text>
          <Text>{company.email}</Text>
          <Text>Tax Number: {company.taxNumber}</Text>
        </View>

        {/* Customer */}
        <View style={styles.section}>
          <Text style={styles.labelBold}>Customer:</Text>
          <Text>{customerName}</Text>
          {customerEmail && <Text>{customerEmail}</Text>}
          {customerPhone && <Text>{customerPhone}</Text>}
        </View>

        {/* Dates & reservation (reservation date + time in one row) */}
        <View style={styles.section}>
          <View style={styles.row}>
            <Text style={styles.label}>Invoice Date:</Text>
            <Text>{formatDate(date)}</Text>
          </View>

          {reservationDisplay && (
            <View style={styles.row}>
              <Text style={styles.label}>Reservation Date & Time:</Text>
              <Text>{reservationDisplay}</Text>
            </View>
          )}

          <View style={styles.row}>
            <Text style={styles.label}>Due Date:</Text>
            <Text>{dueDate}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Status:</Text>
            <Text>{invoiceStatus}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Payment Method:</Text>
            <Text>{paymentText}</Text>
          </View>
        </View>

        {/* Products */}
        {normalizedProducts.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.label}>Items:</Text>
            <View style={styles.productsTable}>
              <View style={styles.tableRow}>
                <Text style={[styles.tableColHeader, styles.firstColHeader]}>Item</Text>
                <Text style={[styles.tableColHeader, { width: '20%' }]}>Quantity</Text>
                <Text style={[styles.tableColHeader, { width: '20%' }]}>Unit Price (€)</Text>
                <Text style={[styles.tableColHeader, { width: '20%' }]}>Total (€)</Text>
              </View>

              {normalizedProducts.map((item, idx) => {
                const qty = Number(item.quantity || 0);
                const price = Number(item.price || 0);
                return (
                  <View key={idx} style={styles.tableRow}>
                    <Text style={styles.firstCol}>{item.name}</Text>
                    <Text style={styles.quantityCol}>{qty}</Text>
                    <Text style={styles.priceCol}>{formatPrice(price)} €</Text>
                    <Text style={styles.totalCol}>{formatPrice(price * qty)} €</Text>
                  </View>
                );
              })}
            </View>
          </View>
        )}

        {/* Total */}
        <View style={styles.section}>
          <View style={styles.row}>
            <Text style={styles.totalRowLabel}>Total Amount:</Text>
            <Text style={styles.totalRowValue}>{formatPrice(subtotal)} €</Text>
          </View>
        </View>

        {/* Bank */}
        <View style={styles.section}>
          <Text style={styles.label}>Bank Details:</Text>
          <Text>Bank: {bankDetails.bankName}</Text>
          <Text>IBAN: {bankDetails.iban}</Text>
        </View>

        {/* Footer */}
        <View style={styles.section}>
          <Text style={styles.label}>Thank you for your reservation!</Text>
        </View>

        <Text style={styles.label}>Questions? Contact makeupbykika@hotmail.com</Text>
      </Page>
    </Document>
  );
}

export default InvoiceDocument;
