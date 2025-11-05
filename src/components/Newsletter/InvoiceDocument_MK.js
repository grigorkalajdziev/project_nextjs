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
  },
  title: { fontSize: 18, fontWeight: 700 },
  label: { marginTop: 4 },
  boldLabel: { fontWeight: 700 },
  section: { marginBottom: 12 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },


  productsTable: { marginVertical: 10 },
  tableRow: { flexDirection: 'row' },
  qr: { width: 50, height: 50, marginLeft: 20 },

  tableColHeader: {
      borderBottomWidth: 1,
      borderColor: '#ccc',
      padding: 4,
      fontWeight: 700,
      textAlign: 'right',
    },
  tableCol: {
    width: '25%',
    padding: 4,
    borderBottomWidth: 1,
    borderColor: '#f1f1f1',
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
  tableCol: { width: '20%', padding: 4, borderBottomWidth: 1, borderColor: '#f1f1f1', textAlign: 'right' },
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

// Helper function to format date as DD-MM-YYYY
const formatDate = (date) => {
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}-${month}-${year}`;
};

const formatPrice = (num) => {
  return num.toLocaleString('mk-MK');
};

const DENAR_TO_EUR = 61.5;
function toEUR(mkd) {
  return (Number(mkd) / DENAR_TO_EUR).toFixed(2);
}

function InvoiceDocument_MK(props) {
  const {
    orderNumber,
    date,
    paymentText,
    reservationDate,
    reservationTime,
    total,
    normalizedProducts = [],
    customerName,
    customerPhone,
    customerEmail,
    qrCodeUrl
  } = props;
  
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
          <Text style={styles.boldLabel}>Испраќач:</Text>
          <Text>{company.name}</Text>
          <Text>{company.address}</Text>
          <Text>{company.email}</Text>
          <Text>Даночен број: {company.taxNumber}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.boldLabel}>Купувач:</Text>
          <Text>{customerName}</Text>
          {customerEmail && <Text>{customerEmail}</Text>}
          {customerPhone && <Text>{customerPhone}</Text>}
        </View>

        <View style={styles.section}>
          <View style={styles.row}>
            <Text>Датум:</Text>
            <Text>{formatDate(date)}</Text>
          </View>
          {reservationDate && (
            <View style={styles.row}>
              <Text>Датум и време на резервација:</Text>
              <Text>{formatDate(reservationDate)} во {reservationTime}</Text>
            </View>
          )}         
          <View style={styles.row}>
            <Text>Рок на плаќање </Text>
            <Text>{dueDate}</Text>
          </View>
          <View style={styles.row}>
            <Text>Статус:</Text>
            <Text>{invoiceStatus}</Text>
          </View>
          <View style={styles.row}>
            <Text>Начин на плаќање:</Text>
            <Text>{paymentText}</Text>
          </View>
        </View>

        {normalizedProducts.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.boldLabel}>Услуги:</Text>
            <View style={styles.productsTable}>
              <View style={styles.tableRow}>
                <Text style={[styles.tableColHeader, styles.firstColHeader]}>Услуга</Text>
                <Text style={[styles.tableColHeader, { width: '20%' }]}>Кол.</Text>
                <Text style={[styles.tableColHeader, { width: '20%' }]}>Цена</Text>
                <Text style={[styles.tableColHeader, { width: '20%' }]}>Вкупно</Text>
              </View>
              {normalizedProducts.map((item, idx) => (
                <View key={idx} style={styles.tableRow}>
                  <Text style={styles.firstCol}>{item.name}</Text>
                  <Text style={styles.quantityCol}>{item.quantity}</Text>
                  <Text style={styles.priceCol}>{formatPrice(item.price)} ден.</Text>
                  <Text style={styles.totalCol}>{formatPrice(item.price * item.quantity)} ден.</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        <View style={styles.section}>
          <View style={styles.row}>
            <Text style={styles.boldLabel}>Вкупен износ:</Text>
            <Text style={styles.boldLabel}>{formatPrice(total)} денари</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.boldLabel}>Банкарски детали:</Text>
          <Text>Банка: {bankDetails.bankName}</Text>
          <Text>ИБАН: {bankDetails.iban}</Text>
        </View>

        <View style={styles.section}>
          <Text>Ви благодариме за вашата нарачка!</Text>
        </View>

        <Text>Прашања? Контактирајте не на makeupbykika@hotmail.com</Text>
      </Page>
    </Document>
  );
}

export default InvoiceDocument_MK;
