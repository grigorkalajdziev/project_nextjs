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
  title: { fontSize: 18, fontWeight: 700, fontFamily: 'NotoSans' },
  label: { fontWeight: 600, marginTop: 4, fontFamily: 'NotoSans' },
  section: { marginBottom: 12 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  productsTable: { marginVertical: 10 },
  tableRow: { flexDirection: 'row' },
  qr: { width: 50, height: 50, marginLeft: 20 },
  tableColHeader: {
    width: '25%',
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
  firstCol: { textAlign: 'left' },
  quantityCol: {
    width: '25%',
    padding: 4,
    borderBottomWidth: 1,
    borderColor: '#f1f1f1',
    fontFamily: 'NotoSans',
    textAlign: 'right',
  },
  priceCol: {
    width: '25%',
    padding: 4,
    borderBottomWidth: 1,
    borderColor: '#f1f1f1',
    fontFamily: 'NotoSans',
    textAlign: 'right',
  },
  totalCol: {
    width: '25%',
    padding: 4,
    borderBottomWidth: 1,
    borderColor: '#f1f1f1',
    fontFamily: 'NotoSans',
    textAlign: 'right',
  },
  footer: {
    marginTop: 40,
    textAlign: 'center',
    fontSize: 10,
    color: '#999',
    fontFamily: 'NotoSans',
  },
});

function InvoiceDocument(props) {
  const {
    orderNumber,
    date,
    paymentText,
    normalizedProducts = [],
    customerName,
    customerPhone,
    customerEmail,
    qrCodeUrl
  } = props;

  const subtotal = normalizedProducts.reduce((acc, item) => acc + item.price * item.quantity, 0);
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
    iban: 'MK07200002784531254'
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>Invoice</Text>
          <Text>#{orderNumber}</Text>
          {qrCodeUrl && <Image style={styles.qr} src={qrCodeUrl} />}
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>From:</Text>
          <Text>{company.name}</Text>
          <Text>{company.address}</Text>
          <Text>{company.email}</Text>
          <Text>Tax Number: {company.taxNumber}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Customer:</Text>
          <Text>{customerName}</Text>
          {customerEmail && <Text>{customerEmail}</Text>}
          {customerPhone && <Text>{customerPhone}</Text>}
        </View>

        <View style={styles.section}>
          <View style={styles.row}>
            <Text style={styles.label}>Date:</Text>
            <Text>{date}</Text>
          </View>
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

        {normalizedProducts.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.label}>Items:</Text>
            <View style={styles.productsTable}>
              <View style={styles.tableRow}>
                <Text style={[styles.tableColHeader, styles.firstColHeader]}>Item</Text>
                <Text style={styles.tableColHeader}>Quantity</Text>
                <Text style={styles.tableColHeader}>Unit Price</Text>
                <Text style={styles.tableColHeader}>Total</Text>
              </View>
              {normalizedProducts.map((item, idx) => (
                <View key={idx} style={styles.tableRow}>
                  <Text style={[styles.tableCol, styles.firstCol, styles.label]}>{item.name}</Text>
                  <Text style={styles.quantityCol}>{item.quantity}</Text>
                  <Text style={styles.priceCol}>{item.price}</Text>
                  <Text style={styles.totalCol}>{(item.price * item.quantity).toFixed(2)} €</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        <View style={styles.section}>
          <View style={styles.row}>
            <Text style={styles.label}>Total Amount:</Text>
            <Text style={styles.label}>{subtotal.toFixed(2)} €</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Bank Details:</Text>
          <Text>Bank: {bankDetails.bankName}</Text>
          <Text>IBAN: {bankDetails.iban}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Thank you for your purchase!</Text>
        </View>

        <Text style={styles.label}>Questions? Contact makeupbykika@hotmail.com</Text>
      </Page>
    </Document>
  );
}

export default InvoiceDocument;
