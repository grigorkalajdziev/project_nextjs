import { Libre_Baskerville, PT_Serif } from "next/font/google";
import { Fragment, useEffect } from "react";
import App from "next/app";
import Head from "next/head";
import { useRouter } from "next/router";

import { Provider } from "react-redux";
import { ToastProvider } from "react-toast-notifications";
import { PersistGate } from "redux-persist/integration/react";

import "../assets/scss/styles.scss";

import { store, persistor } from "../redux/store";
import { fetchProducts } from "../redux/actions/productActions";

import { LocalizationProvider, useLocalization } from "../context/LocalizationContext";

import HeaderTop from "../components/Header/HeaderTop";
import CookieConsentToast from "../components/Cookies/CookieConsent";

import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../pages/api/register";

import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

// ── Fonts ─────────────────────────────────────────────────────
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

// ── Structured Data ────────────────────────────────────────────
const beautyBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "BeautyBusiness",
  name: "Кика - Академија за шминка и убавина",
  url: "https://www.kikamakeupandbeautyacademy.com",
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Кика - Академија за шминка и убавина",
  url: "https://www.kikamakeupandbeautyacademy.com/",
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Дома",
      item: "https://www.kikamakeupandbeautyacademy.com",
    },
  ],
};

// ───────────────────────────────────────────────────────────────

class MyApp extends App {
  constructor(props) {
    super(props);

    // persist store is already created in redux/store.js
    this.persistor = persistor;

    // fetch products once globally
    store.dispatch(fetchProducts());
  }

  render() {
    const { Component, pageProps } = this.props;

    return (
      <Fragment>
        <div className={`${libreBaskerville.variable} ${ptSerif.variable}`}>
          <ToastProvider placement="bottom-left">
            <Provider store={store}>
              <PersistGate loading={null} persistor={this.persistor}>
                <LocalizationProvider>
                  <FontSwitcher>
                    <CanonicalHeadWrapper />
                    <SessionHandler />
                    <HeaderTop />
                    <CookieConsentToast />

                    <Component {...pageProps} />

                    <Analytics />
                    <SpeedInsights />
                  </FontSwitcher>
                </LocalizationProvider>
              </PersistGate>
            </Provider>
          </ToastProvider>
        </div>
      </Fragment>
    );
  }
}

// ───────────────────────────────────────────────────────────────

function FontSwitcher({ children }) {
  const { currentLanguage } = useLocalization();

  const fontClass =
    currentLanguage === "en"
      ? libreBaskerville.className
      : ptSerif.className;

  return <div className={fontClass}>{children}</div>;
}

// ───────────────────────────────────────────────────────────────

function CanonicalHeadWrapper() {
  const router = useRouter();

  const canonicalUrl = `https://www.kikamakeupandbeautyacademy.com${
    router.asPath.split("?")[0]
  }`;

  return <LocalizedHead canonicalUrl={canonicalUrl} />;
}

// ───────────────────────────────────────────────────────────────

function LocalizedHead({ canonicalUrl }) {
  const siteName = "Кика - Академија за шминка и убавина";
  const description =
    "Кика Академија за шминка и убавина нуди професионални курсеви.";

  const ogImage =
    "https://www.kikamakeupandbeautyacademy.com/og-image.jpg";

  return (
    <Head>
      <title>{siteName}</title>

      <meta name="description" content={description} />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="icon" href="/favicon.ico" />

      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}

      <meta property="og:type" content="website" />
      <meta property="og:title" content={siteName} />
      <meta property="og:image" content={ogImage} />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(beautyBusinessSchema),
        }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteSchema),
        }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema),
        }}
      />
    </Head>
  );
}

// ───────────────────────────────────────────────────────────────

function SessionHandler() {
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      // handle auth state globally if needed
    });

    return () => unsubscribe();
  }, [router]);

  return null;
}

export default MyApp;