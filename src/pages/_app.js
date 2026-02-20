import { Libre_Baskerville, PT_Serif } from "next/font/google";
import { Fragment, useEffect } from "react";
import App from "next/app";
import Head from "next/head";
import { useRouter } from "next/router";
import withReduxStore from "../lib/with-redux-store";
import { Provider } from "react-redux";
import { ToastProvider } from "react-toast-notifications";
import { persistStore } from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";
import { fetchProducts } from "../redux/actions/productActions";
import products from "../data/products.json";
import "../assets/scss/styles.scss";
import Preloader from "../components/Preloader";
import { LocalizationProvider, useLocalization } from "../context/LocalizationContext";
import HeaderTop from "../components/Header/HeaderTop";
import CookieConsentToast from "../components/Cookies/CookieConsent";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../pages/api/register";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

const libreBaskerville = Libre_Baskerville({
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

const ptSerif = PT_Serif({
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

// ─── Structured Data (JSON-LD) ───────────────────────────────────────────────

const beautyBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "BeautyBusiness",
  "name": "Кика - Академија за шминка и убавина",
  "url": "https://www.kikamakeupandbeautyacademy.com",
  "logo": "https://www.kikamakeupandbeautyacademy.com/logo.png",
  "image": "https://www.kikamakeupandbeautyacademy.com/og-image.jpg",
  "description":
    "Кика Академија за шминка и убавина нуди професионални курсеви за шминкање, педикир, восочење и убавински третмани во Македонија.",
  "address": {
    "@type": "PostalAddress",
    "addressCountry": "MK"
  },
  "sameAs": [
    "https://www.facebook.com/kristina.iloski",
    "https://www.instagram.com/kikamakeup_and_beautyacademy/"
  ],
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "Услуги и Курсеви",
    "itemListElement": [
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Курс за шминкање"
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Педикир"
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Депилација"
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Обуки"
        }
      }
    ]
  }
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Кика - Академија за шминка и убавина",
  "url": "https://www.kikamakeupandbeautyacademy.com/",
  "potentialAction": {
    "@type": "SearchAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate":
        "https://www.kikamakeupandbeautyacademy.com/shop/left-sidebar?q={search_term_string}"
    },
    "query-input": "required name=search_term_string"
  }
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Дома",
      "item": "https://www.kikamakeupandbeautyacademy.com"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "Академија",
      "item": "https://www.kikamakeupandbeautyacademy.com/shop/left-sidebar"
    },
    {
      "@type": "ListItem",
      "position": 3,
      "name": "Обуки",
      "item": "https://www.kikamakeupandbeautyacademy.com/shop/left-sidebar?category=training"
    },
    {
      "@type": "ListItem",
      "position": 4,
      "name": "За Нас",
      "item": "https://www.kikamakeupandbeautyacademy.com/other/about"
    },
    {
      "@type": "ListItem",
      "position": 5,
      "name": "Контакт",
      "item": "https://www.kikamakeupandbeautyacademy.com/other/contact"
    }
  ]
};

// ─── App ─────────────────────────────────────────────────────────────────────

class MyApp extends App {
  constructor(props) {
    super(props);
    this.persistor = persistStore(props.reduxStore);
    props.reduxStore.dispatch(fetchProducts(products));
  }

  render() {
    const { Component, pageProps, reduxStore } = this.props;
    return (
      <Fragment>
        <div className={`${libreBaskerville.className} ${ptSerif.className}`}>
          <ToastProvider placement="bottom-left">
            <Provider store={reduxStore}>
              <PersistGate loading={<Preloader />} persistor={this.persistor}>
                <LocalizationProvider>
                  <CanonicalHeadWrapper />
                  <SessionHandler />
                  <HeaderTop />
                  <CookieConsentToast />
                  <Component {...pageProps} />
                  <Analytics />
                  <SpeedInsights />
                </LocalizationProvider>
              </PersistGate>
            </Provider>
          </ToastProvider>
        </div>
      </Fragment>
    );
  }
}

// ─── Canonical Head Wrapper ───────────────────────────────────────────────────

function CanonicalHeadWrapper() {
  const router = useRouter();
  const canonicalUrl = `https://www.kikamakeupandbeautyacademy.com${router.asPath.split("?")[0]}`;
  return <LocalizedHead canonicalUrl={canonicalUrl} />;
}

// ─── Localized Head ───────────────────────────────────────────────────────────

function LocalizedHead({ canonicalUrl }) {
  const { t } = useLocalization();

  const siteName = "Кика - Академија за шминка и убавина";
  const description =
    "Кика Академија за шминка и убавина нуди професионални курсеви за шминкање, педикир, восочење и убавински третмани во Македонија.";
  const ogImage = "https://www.kikamakeupandbeautyacademy.com/og-image.jpg";

  return (
    <Head>
      {/* ── Primary Meta ── */}
      <title>{siteName}</title>
      <meta name="description" content={description} />
      <meta
        name="keywords"
        content="шминка, убавина, академија, курсеви за шминкање, педикир, восочење, тренинзи, Македонија"
      />
      <meta name="author" content="Кика Академија" />
      <meta name="robots" content="index, follow" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="icon" href={process.env.PUBLIC_URL + "/favicon(1).ico"} />

      {/* ── Canonical ── */}
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}

      {/* ── Open Graph ── */}
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:title" content={siteName} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:locale" content="mk_MK" />

      {/* ── Twitter Card ── */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={siteName} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {/* ── Structured Data: BeautyBusiness ── */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(beautyBusinessSchema),
        }}
      />

      {/* ── Structured Data: WebSite + Sitelinks Search Box ── */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteSchema),
        }}
      />

      {/* ── Structured Data: BreadcrumbList (helps generate sitelinks) ── */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema),
        }}
      />
    </Head>
  );
}

// ─── Session Handler ──────────────────────────────────────────────────────────

function SessionHandler() {
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        // Handle user state change
      }
    });
    return () => unsubscribe();
  }, [router]);

  return null;
}

export default withReduxStore(MyApp);