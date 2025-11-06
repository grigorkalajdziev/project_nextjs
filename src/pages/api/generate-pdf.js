import { renderToStream } from "@react-pdf/renderer";
import getStreamBuffer from "../../lib/getStreamBurffer"; // adjust path if needed
import QRCode from "qrcode";
import ConfirmationDocument from "../../components/Newsletter/ConfirmationDocument";
import ConfirmationDocument_MK from "../../components/Newsletter/ConfirmationDocument_MK";
import InvoiceDocument from "../../components/Newsletter/InvoiceDocument";
import InvoiceDocument_MK from "../../components/Newsletter/InvoiceDocument_MK";

function asciiFallbackFilename(name) {
  if (!name) return "download.pdf";
  // Replace path separators and quotes just in case, then replace non-ASCII
  const cleaned = String(name)
    .replace(/[/\\"]/g, "_")
    .replace(/[^\x20-\x7E]/g, "_") // strip non-ASCII
    .trim();
  return cleaned.length ? cleaned : "download.pdf";
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).end("Method Not Allowed");
  }

  try {
    const { order, language = "en" } = req.body || {};
    
    if (!order) {
      return res.status(400).json({ error: "Missing order in request body" });
    }

    // Normalize products (same logic as in your email handler)
    const normalizedProducts = (order.products || []).map((p) => ({
      ...p,
      name:
        typeof p.name === "object"
          ? p.name[language] || p.name.en || Object.values(p.name)[0]
          : p.name,
      price:
        typeof p.price === "object"
          ? p.price[language] || p.price.en || Object.values(p.price)[0]
          : p.price,
    }));

    const pdfProps = {
      orderNumber: order.orderNumber,
      date: order.date,
      reservationDate: order.reservationDate,
      reservationTime: order.reservationTime,
      total:
        language === "mk"
          ? Number(order.totalMK ?? order.displayTotal ?? 0)
          : Number(order.totalEN ?? order.displayTotal ?? 0),
      normalizedProducts,
      paymentText: order.paymentText,
      customerName: order.customer?.name || order.customer?.displayName || "-", // fallback
      customerEmail: order.customer?.email || null, // use null instead of empty string
      customerPhone: order.customer?.phone || null, // use null instead of empty string
      customerAddress: order.customer?.address || null,
      qrCodeUrl: undefined,
      language,
    };
    
    // Try generate QR code (non-fatal)
    try {
      const qrPayload = JSON.stringify({
        orderNumber: order.orderNumber,
        reservationDate: order.reservationDate,
        reservationTime: order.reservationTime,
      });
      pdfProps.qrCodeUrl = await QRCode.toDataURL(qrPayload);
    } catch (e) {
      console.warn("QR generation failed:", e);
    }

    const isCash = order.paymentMethod === "payment_cash";

    const DocComponent =
      language === "mk"
        ? isCash
          ? ConfirmationDocument_MK
          : InvoiceDocument_MK
        : isCash
          ? ConfirmationDocument
          : InvoiceDocument;

    const stream = await renderToStream(<DocComponent {...pdfProps} />);
    const buffer = await getStreamBuffer(stream);
    const humanFilename = `${isCash ? (language === "mk" ? "Потврда" : "Confirmation") : language === "mk" ? "Фактура" : "Invoice"}-${order.orderNumber || "order"}.pdf`;
    const asciiName = asciiFallbackFilename(humanFilename);
    const encodedName = encodeURIComponent(humanFilename);
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${asciiName}"; filename*=UTF-8''${encodedName}`
    );
    res.setHeader("Content-Length", buffer.length);

    return res.status(200).end(buffer);
  } catch (err) {
    console.error("generate-pdf error:", err);
    return res.status(500).json({
      error: "Failed to generate PDF",
      message: err.message,
      stack:
        process.env.NODE_ENV === "development" ? String(err.stack) : undefined,
    });
  }
}
