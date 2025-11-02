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

// Wrapper to compute and render localized head with canonical URL
function CanonicalHeadWrapper() {
  const router = useRouter();
  const canonicalUrl = `https://kikamakeupandbeautyacademy.com${router.asPath.split("?")[0]}`;
  return <LocalizedHead canonicalUrl={canonicalUrl} />;
}

// Localized head component now accepts canonicalUrl prop
function LocalizedHead({ canonicalUrl }) {
  const { t } = useLocalization();

  return (
    <Head>
      <title>Кика - Академија за шминка и убавина</title>
      <meta
        name="description"
        content="Кика Академија за шминка и убавина нуди професионални курсеви, трендови и совети за шминка, нега и убавина."
      />
      <link rel="icon" href={process.env.PUBLIC_URL + "/favicon(1).ico"} />
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
    </Head>
  );
}

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
