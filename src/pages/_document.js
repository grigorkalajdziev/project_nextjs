import Document, { Html, Head, Main, NextScript } from "next/document";

export default class MyDocument extends Document {
  render() {
    const breadcrumbJSONLD = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Kika Makeup and Beauty Academy",
          "item": "https://www.kikamakeupandbeautyacademy.com"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "About Us",
          "item": "https://www.kikamakeupandbeautyacademy.com/about-us"
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": "Contact",
          "item": "https://www.kikamakeupandbeautyacademy.com/contact"
        },
        {
          "@type": "ListItem",
          "position": 4,
          "name": "Shop",
          "item": "https://www.kikamakeupandbeautyacademy.com/shop"
        }
      ]
    };

    return (
      <Html lang="en">
        <Head>
          {/* Inject breadcrumb structured data */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJSONLD) }}
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
