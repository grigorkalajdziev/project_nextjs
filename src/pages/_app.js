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
        <Head>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "BreadcrumbList",
                "itemListElement": [
                  {
                    "@type": "ListItem",
                    "position": 1,
                    "name": "Кика - Академија за шминка и убавина",
                    "item": "https://www.kikamakeupandbeautyacademy.com/",
                    "description": "Кика - Академија за шминка и убавина © 2025 kikamakeupandbeautyacademy.com | Сите права се задржани.",
                  },
                  {
                    "@type": "ListItem",
                    "position": 2,
                    "name": "Најчесто поставувани прашања",
                    "item": "https://www.kikamakeupandbeautyacademy.com/faq",
                    "description": "Одговори на најчесто поставувани прашања за академијата и услугите.",
                  },
                  {
                    "@type": "ListItem",
                    "position": 3,
                    "name": "За нас",
                    "item": "https://www.kikamakeupandbeautyacademy.com/other/about",
                    "description": "Дознајте повеќе за нашата историја, тим и мисија.",
                  },
                  {
                    "@type": "ListItem",
                    "position": 4,
                    "name": "Продавница",
                    "item": "https://www.kikamakeupandbeautyacademy.com/shop/left-sidebar",
                    "description": "Разгледајте ги нашите производи и понуди во продавницата.",
                  },
                  {
                    "@type": "ListItem",
                    "position": 5,
                    "name": "Омилени",
                    "item": "https://www.kikamakeupandbeautyacademy.com/other/wishlist",
                    "description": "Вашата листа со омилени производи и услуги.",
                  },
                ],
              }),
            }}
          />
        </Head>
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
        // Handle user state change
      }
    });
    return () => unsubscribe();
  }, [router]);

  return null;
};

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
