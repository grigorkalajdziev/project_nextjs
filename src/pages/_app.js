import { Libre_Baskerville, PT_Serif } from "next/font/google";
import { Fragment, useEffect } from "react";
import App from "next/app";
import Head from "next/head";
import { useRouter } from "next/router";
import withReduxStore from "../lib/with-redux-store";
import { Provider } from "react-redux";
import { ToastProvider, useToasts } from "react-toast-notifications";
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
        <Head />
        <div className={`${libreBaskerville.className} ${ptSerif.className}`}>
          <ToastProvider placement="bottom-left">
            <Provider store={reduxStore}>
              <PersistGate loading={<Preloader />} persistor={this.persistor}>
                <LocalizationProvider>
                  <LocalizedHead />
                  <SessionHandler />
                  <HeaderTop />
                  <CookieConsentToast />
                  <Component {...pageProps} />
                </LocalizationProvider>
              </PersistGate>
            </Provider>
          </ToastProvider>
        </div>
      </Fragment>
    );
  }
}

const SessionHandler = () => {
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {      
      }
    });
    return () => unsubscribe();
  }, [router]);

  return null;
}

const LocalizedHead = () => {
  const { t } = useLocalization();

  return (
    <Head>
      <title>{t("title")}</title>
      <link rel="icon" href={process.env.PUBLIC_URL + "/favicon.ico"} />
    </Head>
  );
};

export default withReduxStore(MyApp);
