import React from 'react';
import path from 'path';
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
  Font,
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
    position: 'relative'
  },
  title: { fontSize: 18, fontWeight: 700, fontFamily: 'NotoSans' },
  label: { fontWeight: 600, marginTop: 4, fontFamily: 'NotoSans' },
  section: { marginBottom: 12 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  productsTable: { marginVertical: 10 },
  tableRow: { flexDirection: 'row' },
  tableColHeader: {
    width: '25%',
    borderBottomWidth: 1,
    borderColor: '#ccc',
    padding: 4,
    fontWeight: 700,
    fontFamily: 'NotoSans',
    textAlign: 'right'
  },
  tableCol: {
    width: '25%',
    padding: 4,
    borderBottomWidth: 1,
    borderColor: '#f1f1f1',
    fontFamily: 'NotoSans',
    textAlign: 'right'
  },
  firstColHeader: { textAlign: 'left' },
  firstCol: { textAlign: 'left' },
  fixedWidth: { minWidth: 50, maxWidth: 50, textAlign: 'right' },
  qr: { width: 50, height: 50, marginLeft: 20 },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30,
    textAlign: 'center',
    fontSize: 10,
    color: '#999',
    fontFamily: 'NotoSans'
  },
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
  }
});

function ConfirmationDocument_MK(props) {
  const {
    orderNumber,
    date,
    reservationDate,
    reservationTime,
    total,
    paymentMethod,
    normalizedProducts = [],
    customerName,
    customerPhone,
    customerEmail,
    qrCodeUrl
  } = props;

  return React.createElement(
    Document,
    null,
    React.createElement(
      Page,
      { size: 'A4', style: styles.page },
      React.createElement(
        View,
        { style: styles.header },
        React.createElement(Text, { style: styles.title }, 'Потврда на резервација'),
        React.createElement(Text, null, `#${orderNumber}`),
        qrCodeUrl && React.createElement(Image, { style: styles.qr, src: qrCodeUrl })
      ),
      React.createElement(
        View,
        { style: styles.section },
       React.createElement(
          View,
          { style: { flexDirection: 'row', alignItems: 'center' } },
          React.createElement(Text, { style: styles.label }, 'Клиент: '),
          React.createElement(Text, { style: styles.label }, customerName)
        ),
        customerEmail && React.createElement(Text, { style: styles.label }, customerEmail),
        customerPhone && React.createElement(Text, { style: styles.label }, customerPhone)
      ),
      React.createElement(
        View,
        { style: styles.section },
        React.createElement(View, { style: styles.row },
          React.createElement(Text, { style: styles.label }, 'Датум:'),
          React.createElement(Text, null, date)
        ),
        React.createElement(View, { style: styles.row },
          React.createElement(Text, { style: styles.label }, 'Резервација:'),
          React.createElement(Text, { style: styles.label }, `${reservationDate} во ${reservationTime}`)
        ),
        React.createElement(View, { style: styles.row },
          React.createElement(Text, { style: styles.label }, 'Начин на плаќање:'),
          React.createElement(Text, null, paymentMethod)
        )
      ),
      normalizedProducts.length > 0 && React.createElement(
        View,
        { style: styles.section },
        React.createElement(Text, { style: styles.label }, 'Услуги:'),
        React.createElement(
          View,
          { style: styles.productsTable },
          React.createElement(
            View,
            { style: styles.tableRow },
            React.createElement(Text, { style: [styles.tableColHeader, styles.firstColHeader] }, 'Услуга'),
            React.createElement(Text, { style: styles.tableColHeader }, 'Количина'),
            React.createElement(Text, { style: styles.tableColHeader }, 'Цена по ед.'),
            React.createElement(Text, { style: styles.tableColHeader }, 'Вкупно')
          ),
          normalizedProducts.map((item, idx) => React.createElement(
            View,
            { key: idx, style: styles.tableRow },
            React.createElement(Text, { style: [styles.tableCol, styles.firstCol, styles.label]}, item.name),
            React.createElement(Text, { style: styles.quantityCol }, item.quantity),
            React.createElement(Text, { style: styles.priceCol }, item.price),
            React.createElement(Text, { style: styles.totalCol }, (item.price * item.quantity) + ' ден.')
          ))
        )
      ),
      React.createElement(
        View,
        { style: styles.section },
        React.createElement(View, { style: styles.row },
          React.createElement(Text, { style: styles.label }, 'Вкупен износ:'),
          React.createElement(Text, { style: styles.label }, total + ' денари')
        )
      ),
      React.createElement(
        View,
        { style: styles.section },
        React.createElement(Text, { style: styles.label }, 'Ви благодариме што не избравте!')
      ),      
      React.createElement(Text, { style: styles.label }, 'Прашања? Контактирајте makeupbykika@hotmail.com')
    )
  );
}

export default ConfirmationDocument_MK;
