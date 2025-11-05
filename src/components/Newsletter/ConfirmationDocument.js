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
    { src: path.resolve(process.cwd(), 'public/fonts/NotoSans-Regular.ttf'), fontWeight: 400 },
    { src: path.resolve(process.cwd(), 'public/fonts/NotoSans-Bold.ttf'), fontWeight: 700 },
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

  title: { fontSize: 18, fontWeight: 700 },

  section: { marginBottom: 12 },

  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },

  label: {
    width: 80,
    fontWeight: 400,
    fontSize: 12,
  },

  value: {
    fontWeight: 400,
    fontSize: 12,
  },

  valueRight: {
    fontWeight: 400,
    fontSize: 12,
    flex: 1,
    textAlign: 'right',
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },

  productsTable: { marginVertical: 10 },
  tableRow: { flexDirection: 'row', alignItems: 'center' },

  tableColHeader: {
    borderBottomWidth: 1,
    borderColor: '#ccc',
    padding: 4,
    fontWeight: 700,
    fontSize: 11,
  },

  tableCol: {
    borderBottomWidth: 1,
    borderColor: '#f1f1f1',
    padding: 4,
    fontSize: 10.5,
  },

  firstColHeader: { textAlign: 'left', flex: 3 },
  firstCol: { textAlign: 'left', flex: 3 },

  quantityColHeader: { textAlign: 'center', flex: 1 },
  quantityCol: { textAlign: 'center', flex: 1 },

  priceColHeader: { textAlign: 'right', flex: 1 },
  priceCol: { textAlign: 'right', flex: 1 },

  totalColHeader: { textAlign: 'right', flex: 1 },
  totalCol: { textAlign: 'right', flex: 1 },

  qr: { width: 50, height: 50, marginLeft: 20 },

  footer: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30,
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

// Helper function to format numbers with thousand separators
const formatPrice = (num) => {
  return num.toLocaleString('en-US');
};

function ConfirmationDocument_EN(props) {
  const {
    orderNumber,
    date,
    reservationDate,
    reservationTime,
    total,
    paymentText,
    normalizedProducts = [],
    customerName,
    customerPhone,
    customerEmail,
    qrCodeUrl,
  } = props;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Reservation Confirmation</Text>
          <Text>#{orderNumber}</Text>
          {qrCodeUrl && <Image style={styles.qr} src={qrCodeUrl} />}
        </View>

        {/* Customer Info */}
        <View style={styles.section}>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Customer:</Text>
            <Text style={styles.value}>{customerName}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>E-mail:</Text>
            <Text style={styles.value}>{customerEmail}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Phone:</Text>
            <Text style={styles.value}>{customerPhone}</Text>
          </View>
        </View>

        {/* Reservation Info */}
        <View style={styles.section}>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Date:</Text>
            <Text style={styles.valueRight}>{date}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Reservation:</Text>
            <Text style={styles.valueRight}>
              {`${formatDate(reservationDate)} at ${reservationTime}`}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={[styles.label, { width: 120 }]}>Payment Method:</Text>
            <Text style={styles.valueRight}>{paymentText}</Text>
          </View>
        </View>

        {/* Products Table */}
        {normalizedProducts.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.label, { fontWeight: 600 }]}>Services:</Text>

            <View style={styles.productsTable}>
              {/* Table Header */}
              <View style={styles.tableRow}>
                <Text style={[styles.tableColHeader, styles.firstColHeader]}>Service</Text>
                <Text style={[styles.tableColHeader, styles.quantityColHeader]}>Quantity</Text>
                <Text style={[styles.tableColHeader, styles.priceColHeader]}>Unit Price</Text>
                <Text style={[styles.tableColHeader, styles.totalColHeader]}>Total</Text>
              </View>

              {/* Table Rows */}
              {normalizedProducts.map((item, idx) => (
                <View key={idx} style={styles.tableRow}>
                  <Text style={[styles.tableCol, styles.firstCol]}>{item.name}</Text>
                  <Text style={[styles.tableCol, styles.quantityCol]}>{item.quantity}</Text>
                  <Text style={[styles.tableCol, styles.priceCol]}>{formatPrice(item.price)} €</Text>
                  <Text style={[styles.tableCol, styles.totalCol]}>
                    {formatPrice(item.price * item.quantity)} €
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Total */}
        <View style={styles.section}>
          <View style={[styles.row, { marginTop: 6 }]}>
            <Text style={[styles.label, { fontWeight: 700, width: 120 }]}>Total Amount:</Text>
            <Text style={[styles.value, { fontWeight: 700 }]}>{formatPrice(total)} €</Text>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.section}>
          <Text style={[styles.value, { fontWeight: 600 }]}>
            Thank you for choosing us!
          </Text>
          <Text style={{ fontSize: 10, marginTop: 4 }}>
            Questions? Contact makeupbykika@hotmail.com
          </Text>
        </View>
      </Page>
    </Document>
  );
}

export default ConfirmationDocument_EN;
