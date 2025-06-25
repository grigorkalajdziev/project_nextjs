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

const DENAR_TO_EUR = 61.5;
function toEUR(mkd) {
  return (Number(mkd) / DENAR_TO_EUR).toFixed(2);
}

function InvoiceDocument_MK(props) {
  const {
    orderNumber,
    date,
    paymentMethod,
    products = [],
    customerName,
    customerPhone,
    customerEmail,
    qrCodeUrl
  } = props;

  const subtotal = products.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const dueDate = 'Рок на плаќање: 7 дена';
  const invoiceStatus = 'Неплатено';
  const company = {
    name: 'Kika Makeup and Beauty Academy',
    address: 'Бул. Туристичка 40, Охрид - Македонија 6000',
    email: 'makeupbykika@hotmail.com',
    taxNumber: 'МК123456789',
  };
  const bankDetails = {
    bankName: 'НЛБ Банка',
    iban: 'МК07200002784531254'
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>Фактура</Text>
          <Text>#{orderNumber}</Text>
          {qrCodeUrl && <Image style={styles.qr} src={qrCodeUrl} />}
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Испраќач:</Text>
          <Text>{company.name}</Text>
          <Text>{company.address}</Text>
          <Text>{company.email}</Text>
          <Text>Даночен број: {company.taxNumber}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Купувач:</Text>
          <Text>{customerName}</Text>
          {customerEmail && <Text>{customerEmail}</Text>}
          {customerPhone && <Text>{customerPhone}</Text>}
        </View>

        <View style={styles.section}>
          <View style={styles.row}>
            <Text style={styles.label}>Датум:</Text>
            <Text>{date}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Рок на плаќање:</Text>
            <Text>{dueDate}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Статус:</Text>
            <Text>{invoiceStatus}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Начин на плаќање:</Text>
            <Text>{paymentMethod}</Text>
          </View>
        </View>

        {products.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.label}>Артикли:</Text>
            <View style={styles.productsTable}>
              <View style={styles.tableRow}>
                <Text style={[styles.tableColHeader, styles.firstColHeader]}>Услуга</Text>
                <Text style={styles.tableColHeader}>Кол.</Text>
                <Text style={styles.tableColHeader}>Цена</Text>
                <Text style={styles.tableColHeader}>Вкупно</Text>
              </View>
              {products.map((item, idx) => (
                <View key={idx} style={styles.tableRow}>
                  <Text style={[styles.tableCol, styles.firstCol, styles.label]}>{item.name}</Text>
                  <Text style={styles.quantityCol}>{item.quantity}</Text>
                  <Text style={styles.priceCol}>{item.price}</Text>
                  <Text style={styles.totalCol}>{item.price * item.quantity} ден.</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        <View style={styles.section}>
          <View style={styles.row}>
            <Text style={styles.label}>Вкупен износ:</Text>
            <Text style={styles.label}>{subtotal} ден.</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Банкарски детали:</Text>
          <Text>Банка: {bankDetails.bankName}</Text>
          <Text>ИБАН: {bankDetails.iban}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Ви благодариме за вашата нарачка!</Text>
        </View>

        <Text style={styles.label}>Прашања? Контактирајте не на makeupbykika@hotmail.com</Text>
      </Page>
    </Document>
  );
}

export default InvoiceDocument_MK;
