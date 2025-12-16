import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/router";
import { auth } from "../api/register"; // Import Firebase auth
import { onAuthStateChanged, signOut, updatePassword } from "firebase/auth";
import { getDatabase, ref, set, get, update, remove } from "firebase/database";
import Link from "next/link";
import Tab from "react-bootstrap/Tab";
import Nav from "react-bootstrap/Nav";
import { Container, Row, Col, Spinner, Modal, Button } from "react-bootstrap";
import {
  PDFDownloadLink,
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";
import { AiOutlineEyeInvisible, AiOutlineEye } from "react-icons/ai";
import { IoIosSearch } from "react-icons/io";
import { IoFilter } from "react-icons/io5";
import { TbReportAnalytics } from "react-icons/tb";
import { LayoutTwo } from "../../components/Layout";
import { BreadcrumbOne } from "../../components/Breadcrumb";
import { useLocalization } from "../../context/LocalizationContext";
import { useToasts } from "react-toast-notifications";
import { Badge } from "react-bootstrap";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from "recharts";
import Select, { components } from "react-select";
import { Country, City } from "country-state-city";
import { cities } from "../../context/CountryCityTranslations";
import { isoToMK } from "../../context/CountryIsoCode";

const getLocalizedTotal = (order, lang = "mk") => {
  if (!order) return 0;

  // Try explicit total first (handles objects and strings)
  const explicit = parseAmount(order?.total, lang);
  if (explicit > 0) return explicit;

  // Fallback: sum product prices (respect product.price object shape)
  if (!order?.products || !Array.isArray(order.products)) return 0;

  const subtotal = order.products.reduce((sum, p) => {
    let price = 0;
    if (typeof p.price === "object" && p.price !== null) {
      price = parseAmount(lang === "en" ? p.price.en : p.price.mk, lang);
      // fallback to any available
      if (!price) price = parseAmount(p.price.en ?? p.price.mk, lang);
    } else {
      price = parseAmount(p.price, lang);
    }
    return sum + price * (p.quantity || 1);
  }, 0);

  // DB discount appears to be an absolute amount in your examples (e.g. "5.69"/"350.00")
  const discountAmount = parseAmount(order?.discount, lang);
  if (discountAmount > 0) {
    return Math.max(subtotal - discountAmount, 0);
  }

  return subtotal;
};

const MyAccount = () => {
  const { t, currentLanguage } = useLocalization();
  const { addToast } = useToasts();
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [role, setRole] = useState("guest");

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [phone, setPhone] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [orders, setOrders] = useState([]);
  const [downloads, setDownloads] = useState([]);
  const [errors, setErrors] = useState({});
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [cityOptions, setCityOptions] = useState([]);
  const [downloadingOrderId, setDownloadingOrderId] = useState(null);

  // --- Password Visibility Toggle States ---
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState(null);

  const [nameOnCard, setNameOnCard] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiration, setExpiration] = useState("");
  const [cvc, setCvc] = useState("");

  const [initialFirstName, setInitialFirstName] = useState("");
  const [initialLastName, setInitialLastName] = useState("");
  const [initialDisplayName, setInitialDisplayName] = useState("");
  const [initialAddress, setInitialAddress] = useState("");
  const [initialPhone, setInitialPhone] = useState("");
  const [initialZip, setInitialZip] = useState("");
  const [initialCountry, setInitialCountry] = useState(null);
  const [initialCity, setInitialCity] = useState(null);
  const [initialNameOnCard, setInitialNameOnCard] = useState("");
  const [initialCardNumber, setInitialCardNumber] = useState("");
  const [initialExpiration, setInitialExpiration] = useState("");
  const [initialCvc, setInitialCvc] = useState("");
  // flag to indicate we've loaded initial values from DB/auth
  const [initialLoaded, setInitialLoaded] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [isCanceling, setIsCanceling] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPayment, setFilterPayment] = useState("all");
  const [filterYear, setFilterYear] = useState(
    new Date().getFullYear().toString()
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [currentPageDown, setCurrentPageDown] = useState(1);
  const itemsPerPageDown = 6;
  const startIndexDown = (currentPageDown - 1) * itemsPerPageDown;
  const endIndexDown = startIndexDown + itemsPerPageDown;
  const currentOrdersDown = orders.slice(startIndexDown, endIndexDown);
  const totalPagesDown = Math.ceil(orders.length / itemsPerPageDown);

  const ordersPerPage = 6;

  const [currentPagePayment, setCurrentPagePayment] = useState(1);
  const itemsPerPagePayment = 6;

  const startIndexPayment = (currentPagePayment - 1) * itemsPerPagePayment;
  const endIndexPayment = startIndexPayment + itemsPerPagePayment;

  const currentOrdersPayment = orders.slice(startIndexPayment, endIndexPayment);
  const totalPagesPayment = Math.ceil(orders.length / itemsPerPagePayment);
  const [dateRange, setDateRange] = useState("30days");

  const [allUsers, setAllUsers] = useState([]);
  const [userSearchQuery, setUserSearchQuery] = useState("");
  const [userFilterRole, setUserFilterRole] = useState("all");
  const [currentPageUsers, setCurrentPageUsers] = useState(1);
  const [showUserFilters, setShowUserFilters] = useState(false);
  const usersPerPage = 6;
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  // Styles to match your form-control inputs
  const customStyles = {
    control: (provided) => ({
      ...provided,
      minHeight: "50px",
      height: "50px",
      borderRadius: "4px",
      display: "flex",
      alignItems: "center", // vertically centers the text
    }),
    valueContainer: (provided) => ({
      ...provided,
      height: "50px",
      padding: "0 8px",
      display: "flex",
      alignItems: "center", // vertically centers selected value
    }),
    input: (provided) => ({
      ...provided,
      margin: "0px",
    }),
    singleValue: (provided) => ({
      ...provided,
      textAlign: "left",
      marginTop: "-5px",
      marginLeft: "12px",
    }),
    indicatorsContainer: (provided) => ({
      ...provided,
      height: "50px",
      display: "flex",
      alignItems: "center", // center the dropdown arrow
    }),
    menu: (provided) => ({
      ...provided,
      textAlign: "left",
    }),
    option: (provided) => ({
      ...provided,
      textAlign: "left",
    }),
  };

  // Country select with flags
  const countryOptions = Country.getAllCountries().map((c) => {
    const mkLabel = isoToMK[c.isoCode];
    return {
      value: c.isoCode,
      label: currentLanguage === "mk" ? mkLabel || c.name : c.name,
      flag: `https://flagcdn.com/24x18/${c.isoCode.toLowerCase()}.png`,
      // keep englishName for possible internal matching if needed
      englishName: c.name,
    };
  });

  const conversionRate = 61.5;

  const parseAmount = (val, lang = "mk") => {
    if (val == null) return 0;
    if (typeof val === "number") return val;
    if (typeof val === "object") {
      // prefer language-specific field, fallback to the other
      const preferred = lang === "en" ? (val.en ?? val.mk) : (val.mk ?? val.en);
      return parseAmount(preferred, lang);
    }
    // string: strip non-numeric chars (currency symbols, spaces, etc.)
    const cleaned = String(val).replace(/[^0-9.-]+/g, "");
    const n = Number(cleaned);
    return Number.isFinite(n) ? n : 0;
  };

  const formatTotal = (amount, lang) => {
    const isEnglish = lang === "en";
    const symbol = isEnglish ? "€" : "ден.";
    const formatted = parseFloat(amount || 0).toFixed(2);
    return `${formatted} ${symbol}`;
  };

  const filteredOrders = orders
    .filter(
      (order) =>
        order.orderNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.displayName?.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter((order) =>
      filterStatus === "all" ? true : order.status === filterStatus
    )
    .filter((order) =>
      filterPayment === "all" ? true : order.paymentMethod === filterPayment
    )
    .filter((order) => {
      const [day, month, year] = order.date.split("-");
      return Number(year) === Number(filterYear);
    });

  const grandTotalInDisplayCurrency = filteredOrders.reduce((sum, order) => {
    // prefer numeric total fields we set during fetch
    const mk = parseFloat(order.totalMK || 0);
    const en = parseFloat(order.totalEN || 0);

    if (currentLanguage === "mk") {
      // sum in MKD: use MK if available, otherwise convert from EUR
      return sum + (mk > 0 ? mk : en * conversionRate);
    } else {
      // sum in EUR: use EUR if available, otherwise convert from MKD
      return sum + (en > 0 ? en : mk / conversionRate);
    }
  }, 0);

  const db = getDatabase();

  // findCountryOption should consider iso->MK labels so saved DB objects match appropriately
  const findCountryOption = (countryFromDb) => {
    if (!countryFromDb) return null;

    // if already option-like object
    if (typeof countryFromDb === "object" && countryFromDb.value) {
      // try to find canonical object from countryOptions
      const found = countryOptions.find((c) => c.value === countryFromDb.value);
      if (found) return found;
      // fallback to recreate option (respect currentLanguage)
      return {
        value: countryFromDb.value,
        label:
          currentLanguage === "mk"
            ? isoToMK[countryFromDb.value] ||
              countryFromDb.label ||
              countryFromDb.value
            : countryFromDb.label || countryFromDb.value,
        flag:
          countryFromDb.flag ||
          `https://flagcdn.com/24x18/${String(countryFromDb.value).toLowerCase()}.png`,
      };
    }

    // if string, try isoCode match first (user might store iso), then label match
    const byIso = countryOptions.find((c) => c.value === countryFromDb);
    if (byIso) return byIso;

    const byLabel = countryOptions.find((c) => c.label === countryFromDb);
    if (byLabel) return byLabel;

    // lastly try match by englishName when DB stored english name
    const byEnglishName = countryOptions.find(
      (c) => c.englishName === countryFromDb
    );
    if (byEnglishName) return byEnglishName;

    return null;
  };

  const findCityOption = (cityFromDb, citiesArray = []) => {
    if (!cityFromDb) return null;
    if (typeof cityFromDb === "object" && cityFromDb.value) {
      return (
        citiesArray.find((c) => c.value === cityFromDb.value) || cityFromDb
      );
    }
    // string
    return (
      citiesArray.find((c) => c.value === cityFromDb) || {
        label: cityFromDb,
        value: cityFromDb,
      }
    );
  };

  const buildCityOptionsFromCountryValue = (countryIso) => {
    if (!countryIso) return [];

    if (currentLanguage === "mk") {
      const mkCountryName = isoToMK[countryIso];
      const mkCities = mkCountryName ? cities[mkCountryName] : null;

      if (Array.isArray(mkCities) && mkCities.length > 0) {
        return mkCities.map((name) => ({ value: name, label: name }));
      }
    }

    // fallback to English cities via country-state-city library
    try {
      return City.getCitiesOfCountry(countryIso).map((c) => ({
        value: c.name,
        label: c.name,
      }));
    } catch (err) {
      return [];
    }
  };

  // --- Toggle Functions for Each Password Field ---
  const toggleCurrentPasswordVisibility = () => {
    setShowCurrentPassword(!showCurrentPassword);
  };

  const toggleNewPasswordVisibility = () => {
    setShowNewPassword(!showNewPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleYearChange = (e) => {
    setFilterYear(e.target.value);
    setCurrentPage(1); // Reset pagination
  };

  const paymentData = (orders, currentLanguage) => {
    return orders.reduce((acc, order) => {
      const method = order.paymentMethod || "other";

      const amount =
        currentLanguage === "mk"
          ? order.totalMK ||
            (order.totalEN ? order.totalEN * conversionRate : 0)
          : order.totalEN ||
            (order.totalMK ? order.totalMK / conversionRate : 0);

      const existing = acc.find((d) => d.name === method);
      if (existing) existing.value += amount;
      else acc.push({ name: method, value: amount });
      return acc;
    }, []);
  };

  const filteredOrdersForCharts = orders.filter((order) => {
    if (!order.date) return false;

    const [day, month, year] = order.date.split("-");
    const orderYear = parseInt(year, 10);

    const targetYear = parseInt(filterYear, 10);
    return orderYear === targetYear;

    return orderYear === targetYear;
  });

  const statusData = (orders, filterYear) => {
    if (!Array.isArray(orders) || orders.length === 0) return [];

    const targetYear =
      filterYear === "all"
        ? new Date().getFullYear()
        : parseInt(filterYear, 10);

    return orders.reduce((acc, order) => {
      if (!order.date && !order.createdAt) return acc;

      // Parse year safely (supports both DD-MM-YYYY and YYYY-MM-DD)
      let orderYear;
      if (order.date) {
        const parts = order.date.split("-");
        orderYear =
          parts[0].length === 4
            ? parseInt(parts[0], 10)
            : parseInt(parts[2], 10);
      } else if (order.createdAt) {
        orderYear = new Date(order.createdAt).getFullYear();
      }

      if (!orderYear || orderYear !== targetYear) return acc;

      const status = order.status || "other";
      const existing = acc.find((d) => d.status === status);

      // Prefer explicit numeric fields (totalMK / totalEN)
      const mkRaw = order.totalMK ?? 0;
      const enRaw = order.totalEN ?? 0;
      const mk = Number.isFinite(Number(mkRaw)) ? Number(mkRaw) : 0;
      const en = Number.isFinite(Number(enRaw)) ? Number(enRaw) : 0;

      // Handle fallback if those don’t exist
      let mkdAmount = 0;
      let engAmount = 0;
      if (mk === 0 && en === 0) {
        const fallback = parseAmount(order.total ?? 0);
        const cur = (order.currency || "MKD").toString().toUpperCase();
        if (cur === "EUR") {
          engAmount = fallback;
          mkdAmount = fallback * conversionRate;
        } else {
          mkdAmount = fallback;
          engAmount = fallback / conversionRate;
        }
      } else {
        mkdAmount = mk > 0 ? mk : en * conversionRate;
        engAmount = en > 0 ? en : mk / conversionRate;
      }

      if (existing) {
        existing.count += 1;
        existing.mkd += mkdAmount;
        existing.eng += engAmount;
      } else {
        acc.push({
          status,
          count: 1,
          mkd: mkdAmount,
          eng: engAmount,
        });
      }

      return acc;
    }, []);
  };

  // Daily Revenue (last N days) - filtered by year

  const getDailyRevenue = (orders, days = 30) => {
    const targetYear = parseInt(filterYear, 10);

    // reference date (end) — preserve original behavior for non-current years
    const today = new Date();
    today.setFullYear(targetYear);
    if (targetYear !== new Date().getFullYear()) {
      today.setMonth(11, 31); // Dec 31 of target year
    }
    today.setHours(0, 0, 0, 0);

    const dailyData = {};
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      // Use local date formatting to avoid timezone issues
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      const dateKey = `${year}-${month}-${day}`;
      dailyData[dateKey] = { mkd: 0, eur: 0, count: 0 };
    }

    orders.forEach((order) => {
      // derive orderDate similar to your existing logic
      let orderDate = null;
      if (order.date) {
        if (order.date.includes("-")) {
          const parts = order.date.split("-");
          if (parts[0].length === 4) {
            // YYYY-MM-DD - use local date construction
            const [year, month, day] = parts.map(Number);
            orderDate = new Date(year, month - 1, day);
          } else {
            // DD-MM-YYYY - use local date construction
            const [day, month, year] = parts.map(Number);
            orderDate = new Date(year, month - 1, day);
          }
        } else {
          orderDate = new Date(order.date);
        }
      } else if (order.createdAt) {
        orderDate = new Date(order.createdAt);
      }

      if (!orderDate || isNaN(orderDate)) return;
      if (orderDate.getFullYear() !== targetYear) return;

      orderDate.setHours(0, 0, 0, 0);
      // Use local date string instead of ISO to avoid timezone shift
      const year = orderDate.getFullYear();
      const month = String(orderDate.getMonth() + 1).padStart(2, "0");
      const day = String(orderDate.getDate()).padStart(2, "0");
      const dateKey = `${year}-${month}-${day}`;
      if (!dailyData[dateKey]) return;

      const mk = parseFloat(order.totalMK || 0);
      const en = parseFloat(order.totalEN || 0);

      // fallback to legacy total (assume MKD unless order.currency says otherwise)
      if (!mk && !en) {
        const fallback = parseAmount(order.total || 0);
        const cur = (order.currency || "MKD").toUpperCase();
        if (cur === "EUR") {
          dailyData[dateKey].eur += fallback;
          dailyData[dateKey].mkd += fallback * conversionRate;
        } else {
          dailyData[dateKey].mkd += fallback;
          dailyData[dateKey].eur += fallback / conversionRate;
        }
      } else {
        dailyData[dateKey].mkd += mk > 0 ? mk : en * conversionRate;
        dailyData[dateKey].eur += en > 0 ? en : mk / conversionRate;
      }

      dailyData[dateKey].count += 1;
    });

    const monthNames = {
      en: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
      mk: [
        "Јан",
        "Фев",
        "Мар",
        "Апр",
        "Мај",
        "Јун",
        "Јул",
        "Авг",
        "Сеп",
        "Окт",
        "Ное",
        "Дек",
      ],
    };

    return Object.entries(dailyData).map(([date, data]) => {
      // Parse the local date string manually to avoid UTC conversion
      const [year, month, day] = date.split("-").map(Number);
      const dateObj = new Date(year, month - 1, day);
      const dayStr = String(dateObj.getDate()).padStart(2, "0");
      const monthIndex = dateObj.getMonth();
      const monthName =
        currentLanguage === "mk"
          ? monthNames.mk[monthIndex]
          : monthNames.en[monthIndex];
      return {
        date: `${dayStr} ${monthName}`,
        fullDate: date,
        revenue: currentLanguage === "mk" ? data.mkd : data.eur,
        orders: data.count,
      };
    });
  };

  // Monthly Revenue for a specific year
  const getMonthlyRevenue = (orders, year) => {
    const monthsLabelsEn = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const monthsLabelsMk = [
      "Јан",
      "Фев",
      "Мар",
      "Апр",
      "Мај",
      "Јун",
      "Јул",
      "Авг",
      "Сеп",
      "Окт",
      "Ное",
      "Дек",
    ];

    const monthlyData = Array.from({ length: 12 }, (_, i) => ({
      month: currentLanguage === "mk" ? monthsLabelsMk[i] : monthsLabelsEn[i],
      mkd: 0,
      eur: 0,
      orders: 0,
    }));

    orders.forEach((order) => {
      let orderDate = null;
      if (order.date) {
        const parts = order.date.split("-");
        if (parts[0].length === 4) orderDate = new Date(order.date);
        else orderDate = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
      } else if (order.createdAt) {
        orderDate = new Date(order.createdAt);
      }
      if (!orderDate || isNaN(orderDate)) return;
      if (orderDate.getFullYear() !== year) return;

      const idx = orderDate.getMonth();
      const mk = parseFloat(order.totalMK || 0);
      const en = parseFloat(order.totalEN || 0);

      if (!mk && !en) {
        const fallback = parseAmount(order.total || 0);
        const cur = (order.currency || "MKD").toUpperCase();
        if (cur === "EUR") {
          monthlyData[idx].eur += fallback;
          monthlyData[idx].mkd += fallback * conversionRate;
        } else {
          monthlyData[idx].mkd += fallback;
          monthlyData[idx].eur += fallback / conversionRate;
        }
      } else {
        monthlyData[idx].mkd += mk > 0 ? mk : en * conversionRate;
        monthlyData[idx].eur += en > 0 ? en : mk / conversionRate;
      }

      monthlyData[idx].orders += 1;
    });

    return monthlyData.map((m) => ({
      ...m,
      revenue: currentLanguage === "mk" ? m.mkd : m.eur,
    }));
  };

  // Yearly Revenue Comparison
  const getYearlyRevenue = (orders) => {
    if (!Array.isArray(orders) || orders.length === 0) return [];

    const yearly = {};

    orders.forEach((order) => {
      let orderDate = null;
      if (order.date) {
        const parts = order.date.split("-");
        if (parts[0].length === 4) orderDate = new Date(order.date);
        else orderDate = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
      } else if (order.createdAt) {
        orderDate = new Date(order.createdAt);
      }
      if (!orderDate || isNaN(orderDate)) return;

      const y = orderDate.getFullYear();
      if (!yearly[y]) yearly[y] = { mkd: 0, eur: 0, count: 0 };

      // prefer explicit numeric fields; coerce safely
      const mkRaw = order.totalMK ?? 0;
      const enRaw = order.totalEN ?? 0;
      const mk = Number.isFinite(Number(mkRaw)) ? Number(mkRaw) : 0;
      const en = Number.isFinite(Number(enRaw)) ? Number(enRaw) : 0;

      if (mk === 0 && en === 0) {
        // fallback to legacy string/number total
        const fallback = parseAmount(order.total ?? 0);
        const cur = (order.currency || "MKD").toString().toUpperCase();
        if (cur === "EUR") {
          yearly[y].eur += fallback;
          yearly[y].mkd += fallback * conversionRate;
        } else {
          yearly[y].mkd += fallback;
          yearly[y].eur += fallback / conversionRate;
        }
      } else {
        yearly[y].mkd += mk > 0 ? mk : en * conversionRate;
        yearly[y].eur += en > 0 ? en : mk / conversionRate;
      }

      yearly[y].count += 1;
    });

    return Object.entries(yearly)
      .map(([year, data]) => ({
        year: Number(year),
        // revenue is numeric and already converted to the display currency
        revenue: currentLanguage === "mk" ? Number(data.mkd) : Number(data.eur),
        orders: data.count,
      }))
      .sort((a, b) => a.year - b.year);
  };

  // Top Products/Services
  const getTopProducts = (orders, limit = 5, filterYear) => {
    const productStats = {};
    const targetYear = parseInt(filterYear, 10);

    orders.forEach((order) => {
      if (!order.date) return;

      // Parse year safely (handles YYYY-MM-DD or DD-MM-YYYY)
      const parts = order.date.split("-");
      const orderYear =
        parts[0].length === 4 ? parseInt(parts[0], 10) : parseInt(parts[2], 10);

      // Skip orders not in selected year
      if (orderYear !== targetYear) return;

      const orderCurrency = (order.currency || "MKD").toUpperCase();

      (order.products || []).forEach((product) => {
        let productName;
        if (typeof product.name === "object" && product.name !== null) {
          productName =
            currentLanguage === "mk" ? product.name.mk : product.name.en;
        } else {
          productName = product.name || "Unknown";
        }

        if (!productStats[productName]) {
          productStats[productName] = { count: 0, mkd: 0, eur: 0 };
        }

        const quantity = product.quantity || 1;
        productStats[productName].count += quantity;

        // Handle price in both currencies
        if (typeof product.price === "object" && product.price !== null) {
          const mkdPrice = parseFloat(product.price.mk || 0);
          const eurPrice = parseFloat(product.price.en || 0);

          productStats[productName].mkd += mkdPrice * quantity;
          productStats[productName].eur += eurPrice * quantity;
        } else {
          const price = parseFloat(product.price || 0);
          const total = price * quantity;

          if (orderCurrency === "MKD") {
            productStats[productName].mkd += total;
            productStats[productName].eur += total / conversionRate;
          } else {
            productStats[productName].eur += total;
            productStats[productName].mkd += total * conversionRate;
          }
        }
      });
    });

    return Object.entries(productStats)
      .map(([name, stats]) => ({
        name,
        count: stats.count,
        revenue: currentLanguage === "mk" ? stats.mkd : stats.eur,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, limit);
  };

  // Average Order Value
  const getAverageOrderValue = (orders) => {
    if (!orders || orders.length === 0) return 0;

    // sum in the display currency (based on currentLanguage)
    const total = orders.reduce((acc, order) => {
      const mk = parseFloat(order.totalMK || 0);
      const en = parseFloat(order.totalEN || 0);

      // fallback: use legacy order.total if neither numeric fields exist
      if (!mk && !en) {
        const fallback = parseAmount(order.total || 0);
        return currentLanguage === "mk"
          ? acc + fallback
          : acc + fallback / conversionRate;
      }

      return currentLanguage === "mk"
        ? acc + (mk > 0 ? mk : en * conversionRate)
        : acc + (en > 0 ? en : mk / conversionRate);
    }, 0);

    return total / orders.length;
  };

  // Order Success Rate (Confirmed vs Total)
  const getOrderSuccessStats = (orders) => {
    const stats = {
      total: orders.length,
      pending: orders.filter((o) => o.status === "pending").length,
      confirmed: orders.filter((o) => o.status === "confirmed").length,
      cancelled: orders.filter((o) => o.status === "cancelled").length,
    };

    stats.successRate =
      stats.total > 0 ? ((stats.confirmed / stats.total) * 100).toFixed(1) : 0;

    return stats;
  };

  const formattedPaymentData = paymentData(
    filteredOrdersForCharts,
    currentLanguage
  ).map((entry) => {
    let name = entry.name;

    if (name === "payment_bank") {
      name = currentLanguage === "mk" ? "Банка" : "Bank";
    } else if (name === "payment_cash") {
      name = currentLanguage === "mk" ? "Готовина" : "Cash";
    }

    return { ...entry, name };
  });

  const deleteOrder = async (orderId) => {
    if (!user) {
      addToast(t("delete_error"), { appearance: "error", autoDismiss: true });
      return;
    }
    const uid =
      role === "admin"
        ? orders.find((o) => o.id === orderId)?.userId
        : user.uid;
    if (!uid) {
      addToast(t("delete_error"), { appearance: "error", autoDismiss: true });
      return;
    }
    try {
      await remove(ref(db, `orders/${uid}/${orderId}`));
      setOrders((prev) => prev.filter((o) => o.id !== orderId));
      addToast(t("order_deleted"), {
        appearance: "success",
        autoDismiss: true,
      });
    } catch (err) {
      addToast(`${t("delete_error")}: ${err.message}`, {
        appearance: "error",
        autoDismiss: true,
      });
    }
  };

  const viewOrder = (orderId, orderUserId) => {
    // determine owner uid (same logic as deleteOrder/updateOrder)
    const uid =
      role === "admin"
        ? orderUserId || orders.find((o) => o.id === orderId)?.userId
        : user?.uid;

    if (!uid) {
      addToast(t("view_error") || "Could not determine order owner", {
        appearance: "error",
        autoDismiss: true,
      });
      return;
    }

    // navigate to cart page in view mode (Cart will fetch from Firebase)
    router.push({
      pathname: "/other/cart-details",
      query: { viewOrder: "true", userId: uid, orderId },
    });
  };

  const updateOrder = async (orderId, userId, newStatus) => {
    try {
      // Find the correct userId based on the current orders array
      const matchingOrder = orders.find((o) => o.id === orderId);
      if (!matchingOrder) throw new Error("Order not found");

      const {
        userId,
        orderNumber,
        date,
        reservationDate,
        reservationTime,
        totalMK,
        totalEN,
        products,
        customer,
        email,
        language,
        displayName,
        paymentText,
        paymentMethod,
        discountMK,
        discountEN,
        coupon,
      } = matchingOrder;

      // Update only the status field at the correct location
      await update(ref(db, `orders/${userId}/${orderId}`), {
        status: newStatus,
      });

      // Update local state
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );

      const toEmail = matchingOrder.email;
      const customerPhone = matchingOrder.customerPhone || "";
      const customerAddress = matchingOrder.customerAddress || "";
      const customerState = matchingOrder.customerState || "";
      const customerCity = matchingOrder.customerCity || "";
      const customerPostalCode = matchingOrder.customerPostalCode || "";

      // Determine which total to send based on order language or current language
      const orderLanguage = language || currentLanguage;
      const totalToSend =
        orderLanguage === "mk" ? Number(totalMK) || 0 : Number(totalEN) || 0;
      const discountToSend =
        orderLanguage === "mk"
          ? Number(discountMK) || 0
          : Number(discountEN) || 0;
      const currency = orderLanguage === "mk" ? "MKD" : "EUR";

      const payload = {
        to: toEmail,
        from: "confirmation@kikamakeupandbeautyacademy.com",
        orderNumber,
        status: newStatus,
        date: date,
        reservationDate: reservationDate,
        reservationTime,
        customerName: displayName,
        paymentText: paymentText,
        paymentMethod,
        total: totalToSend,
        products,
        discount: discountToSend, // Add discount
        couponCode: coupon?.code || null, // Add couponCode
        customerEmail: toEmail,
        customerPhone: customerPhone,
        customerAddress: customerAddress,
        customerState: customerState,
        customerCity: customerCity,
        customerPostalCode: customerPostalCode,
        language: language || currentLanguage,
      };

      await fetch("/api/send-order-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
        setDisplayName(user.displayName || "");
        setEmail(user.email || "");

        if (user.displayName) {
          const nameParts = user.displayName.split(" ");
          setFirstName(nameParts[0] || "");
          setLastName(nameParts[1] || "");
        }

        const userRef = ref(db, `users/${user.uid}`);

        try {
          const snapshot = await get(userRef);
          if (snapshot.exists()) {
            const userData = snapshot.val();
            setFirstName(userData.firstName || "");
            setLastName(userData.lastName || "");
            setDisplayName(userData.displayName || "");
            setAddress(userData.billingInfo?.address || "");
            setCity(userData.billingInfo?.city || "");
            setZipCode(userData.billingInfo?.zipCode || "");
            setPhone(userData.billingInfo?.phone || "");
            setSelectedCountry(
              userData.billingInfo?.country
                ? typeof userData.billingInfo.country === "object"
                  ? userData.billingInfo.country
                  : {
                      label: userData.billingInfo.country,
                      value: Country.getAllCountries().find(
                        (c) => c.name === userData.billingInfo.country
                      )?.isoCode,
                    }
                : null
            );
            setSelectedCity(
              userData.billingInfo?.city
                ? {
                    label: userData.billingInfo.city,
                    value: userData.billingInfo.city,
                  }
                : null
            );
            setCurrentPassword(userData.password || "");
            setNameOnCard(userData.billingInfo?.nameOnCard || "");
            setCardNumber(userData.billingInfo?.cardNumber || "");
            setExpiration(userData.billingInfo?.expiration || "");
            setCvc(userData.billingInfo?.cvc || "");
            setRole(userData.role || "guest");

            const countryFromDb = userData.billingInfo?.country || null;
            const countryOption = findCountryOption(countryFromDb);
            setSelectedCountry(countryOption);
            setInitialCountry(countryOption);

            if (countryOption?.value) {
              const cities = buildCityOptionsFromCountryValue(
                countryOption.value
              );
              setCityOptions(cities);

              const cityFromDb = userData.billingInfo?.city || null;
              const cityOption = findCityOption(cityFromDb, cities);
              setSelectedCity(cityOption);
              setInitialCity(cityOption);
              // plain text city input:
              setCity(
                (cityOption && cityOption.label) ||
                  userData.billingInfo?.city ||
                  ""
              );
            } else {
              setCityOptions([]);
              setSelectedCity(null);
              setInitialCity(null);
              setCity(userData.billingInfo?.city || "");
            }

            // initial primitives
            setInitialFirstName(userData.firstName || "");
            setInitialLastName(userData.lastName || "");
            setInitialDisplayName(userData.displayName || "");
            setInitialAddress(userData.billingInfo?.address || "");
            setInitialPhone(userData.billingInfo?.phone || "");
            setInitialZip(userData.billingInfo?.zipCode || "");
            setInitialNameOnCard(userData.billingInfo?.nameOnCard || "");
            setInitialCardNumber(userData.billingInfo?.cardNumber || "");
            setInitialExpiration(userData.billingInfo?.expiration || "");
            setInitialCvc(userData.billingInfo?.cvc || "");

            setInitialLoaded(true);
          } else {
            setInitialLoaded(true);
            console.log("No additional user data found in database.");
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }

        setDownloads([]);
      } else {
        setUser(null);
        router.push("/other/login-register");
      }
    });

    return () => unsubscribe();
  }, []);

  // Keep cityOptions in state as before. Rebuild whenever selectedCountry or language changes
  useEffect(() => {
    if (selectedCountry?.value) {
      const cities = buildCityOptionsFromCountryValue(selectedCountry.value);
      setCityOptions(cities);

      // maintain selectedCity when language toggles: try to find a matching value
      if (selectedCity) {
        // If value exists in new city list, keep it. If not, try to find by label.
        const existing =
          cities.find((c) => c.value === selectedCity.value) ||
          cities.find((c) => c.label === selectedCity.label);
        if (existing) setSelectedCity(existing);
        else setSelectedCity(null);
      } else if (initialCity) {
        // when initializing (first load), try to set from initialCity if present
        const cityFromDB = cities.find(
          (c) => c.value === initialCity.value || c.value === initialCity.label
        );
        if (cityFromDB) setSelectedCity(cityFromDB);
      }
    } else {
      setCityOptions([]);
      setSelectedCity(null);
    }
    // include currentLanguage so it refreshes on language change
  }, [selectedCountry, currentLanguage]);

  // Fetch all users for admin

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return;

      try {
        const ordersRef =
          role === "admin" ? ref(db, "orders") : ref(db, `orders/${user.uid}`);
        const snap = await get(ordersRef);
        if (!snap.exists()) {
          setOrders([]);
          return;
        }
        const raw = snap.val();

        // only fetch all users if admin
        let usersData = {};
        if (role === "admin") {
          const usersSnap = await get(ref(db, "users"));
          usersData = usersSnap.exists() ? usersSnap.val() : {};
        }

        const orderList = [];

        if (role === "admin") {
          Object.entries(raw).forEach(([uid, userOrders]) => {
            Object.entries(userOrders).forEach(([id, order]) => {
              // Parse amounts in both languages (handles object/string/number)
              const subtotalMK = parseAmount(order?.subtotal, "mk");
              const subtotalEN = parseAmount(order?.subtotal, "en");
              const explicitTotalMK = parseAmount(order?.total, "mk");
              const explicitTotalEN = parseAmount(order?.total, "en");

              // If explicit totals are missing, compute from products
              const computedTotalMK =
                explicitTotalMK || getLocalizedTotal(order, "mk");
              const computedTotalEN =
                explicitTotalEN || getLocalizedTotal(order, "en");

              const currencyHint =
                computedTotalMK > 0 && computedTotalEN > 0
                  ? "BOTH"
                  : computedTotalMK > 0
                    ? "MKD"
                    : "EUR";

              orderList.push({
                userId: uid,
                id,
                displayName: usersData[uid]?.displayName || "(no name)",
                email: usersData[uid]?.email || "",
                date: order.date || "",
                reservationDate: order.reservationDate,
                reservationTime: order.reservationTime,
                orderNumber: order.orderNumber,
                status: order.status,
                // store both numeric values for later calculations
                subtotalMK,
                subtotalEN,
                totalMK: computedTotalMK,
                totalEN: computedTotalEN,
                currency: currencyHint,
                products: order.products || [],
                paymentMethod: order.paymentMethod || "",
                paymentText: order.paymentText || "",

                discountMK: parseFloat(order.discount?.mk || 0),
                discountEN: parseFloat(order.discount?.en || 0),
                coupon: order.coupon || null,

                customerPhone: order.customer?.phone || "",
                customerAddress: order.customer?.address || "",
                customerState: order.customer?.state || "",
                customerCity: order.customer?.city || "",
                customerPostalCode: order.customer?.postalCode || "",
                createdAt: order.createdAt || 0,
                // displayTotal for UI convenience (depends on currentLanguage at fetch time)
                displayTotal:
                  currentLanguage === "mk" ? computedTotalMK : computedTotalEN,
              });
            });
          });
        } else {
          Object.entries(raw).forEach(([id, order]) => {
            const subtotalMK = parseAmount(order?.subtotal, "mk");
            const subtotalEN = parseAmount(order?.subtotal, "en");
            const explicitTotalMK = parseAmount(order?.total, "mk");
            const explicitTotalEN = parseAmount(order?.total, "en");
            const computedTotalMK =
              explicitTotalMK || getLocalizedTotal(order, "mk");
            const computedTotalEN =
              explicitTotalEN || getLocalizedTotal(order, "en");

            orderList.push({
              userId: user.uid,
              id,
              displayName: user.displayName || "",
              email: user.email || "",
              date: order.date || "",
              reservationDate: order.reservationDate,
              reservationTime: order.reservationTime,
              orderNumber: order.orderNumber,
              status: order.status,
              subtotalMK,
              subtotalEN,
              totalMK: computedTotalMK,
              totalEN: computedTotalEN,
              currency:
                computedTotalMK > 0 && computedTotalEN > 0
                  ? "BOTH"
                  : computedTotalMK > 0
                    ? "MKD"
                    : "EUR",
              products: order.products || [],
              paymentMethod: order.paymentMethod || "",
              paymentText: order.paymentText || "",
              discountMK: parseFloat(order.discount?.mk || 0),
              discountEN: parseFloat(order.discount?.en || 0),
              coupon: order.coupon || null,
              customerPhone: order.customer?.phone || "",
              customerAddress: order.customer?.address || "",
              customerState: order.customer?.state || "",
              customerCity: order.customer?.city || "",
              customerPostalCode: order.customer?.postalCode || "",
              createdAt: order.createdAt || 0,
              displayTotal:
                currentLanguage === "mk" ? computedTotalMK : computedTotalEN,
            });
          });
        }

        orderList.sort((a, b) => {
          if (a.status === "pending" && b.status !== "pending") return -1;
          if (a.status !== "pending" && b.status === "pending") return 1;
          return (b.createdAt || 0) - (a.createdAt || 0);
        });

        setOrders(orderList);
      } catch (err) {
        console.error("Error fetching/sorting orders:", err);
      }
    };

    fetchOrders();
  }, [user, role, currentLanguage]); // include currentLanguage so displayTotal reflects language changes

  useEffect(() => {
    const fetchUsers = async () => {
      if (!user || role !== "admin") return;

      try {
        const usersRef = ref(db, "users");
        const snapshot = await get(usersRef);

        if (!snapshot.exists()) {
          setAllUsers([]);
          return;
        }

        const usersData = snapshot.val();
        const usersList = Object.entries(usersData).map(([uid, userData]) => ({
          uid,
          firstName: userData.firstName || "",
          lastName: userData.lastName || "",
          displayName: userData.displayName || "",
          email: userData.email || "",
          role: userData.role || "guest",
          phone: userData.billingInfo?.phone || "",
          address: userData.billingInfo?.address || "",
          city: userData.billingInfo?.city || "",
          country:
            userData.billingInfo?.country?.label ||
            userData.billingInfo?.country ||
            "",
          zipCode: userData.billingInfo?.zipCode || "",
          coupon: userData.coupon || "",
        }));

        setAllUsers(usersList);
      } catch (err) {
        console.error("Error fetching users:", err);
      }
    };

    fetchUsers();
  }, [user, role]);

  // --- Logout Handler ---
  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await signOut(auth);
      setUser(null);
      addToast(t("logout_success"), {
        appearance: "info",
        autoDismiss: true,
      });
      setTimeout(() => {
        router.push("/other/login-register");
      }, 2000);
    } catch (error) {
      addToast(error.message, { appearance: "error", autoDismiss: true });
      console.error("Logout Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const isValidNameOnCard = (name) => {
    const trimmed = name.trim();
    return (
      trimmed.length >= 2 &&
      trimmed.length <= 30 &&
      /^[a-zA-Z\s]+$/.test(trimmed)
    );
  };

  const isValidCardNumber = (cardNum) => {
    const cleaned = cardNum.replace(/\D/g, "");
    if (cleaned.length < 13 || cleaned.length > 19) return false;
    let sum = 0;
    let shouldDouble = false;
    for (let i = cleaned.length - 1; i >= 0; i--) {
      let digit = parseInt(cleaned.charAt(i), 10);
      if (shouldDouble) {
        digit *= 2;
        if (digit > 9) {
          digit -= 9;
        }
      }
      sum += digit;
      shouldDouble = !shouldDouble;
    }
    return sum % 10 === 0;
  };

  const formatCardNumber = (value) => {
    const cleaned = value.replace(/\D/g, "");
    return cleaned.replace(/(.{4})/g, "$1 ").trim();
  };

  const isValidExpiration = (exp) => {
    if (exp.length !== 5 || !/^(0[1-9]|1[0-2])\/\d{2}$/.test(exp)) {
      return false;
    }
    const [monthStr, yearStr] = exp.split("/");
    const month = parseInt(monthStr, 10);
    const year = parseInt(yearStr, 10);
    const now = new Date();
    const currentYear = now.getFullYear() % 100; // two-digit year
    const currentMonth = now.getMonth() + 1; // JavaScript months are 0-indexed
    if (year < currentYear || (year === currentYear && month < currentMonth)) {
      return false;
    }
    return true;
  };

  const formatExpiration = (value) => {
    const cleaned = value.replace(/\D/g, "");
    if (cleaned.length === 0) return "";
    if (cleaned.length < 2) return cleaned;
    if (cleaned.length === 2) return cleaned + "/";
    return cleaned.slice(0, 2) + "/" + cleaned.slice(2, 4);
  };

  // Validate CVC: must be 3 or 4 digits.
  const isValidCVC = (value) => {
    return value.length >= 3 && value.length <= 4 && /^\d{3,4}$/.test(value);
  };

  const validatePaymentFields = () => {
    if (!nameOnCard && !cardNumber && !expiration && !cvc) {
      setErrors({});
      return true;
    }

    const newErrors = {};

    if (!isValidNameOnCard(nameOnCard)) {
      newErrors.nameOnCard = t("nameOnCard");
    }
    if (!isValidCardNumber(cardNumber)) {
      newErrors.cardNumber = t("cardNumber");
    }
    if (!isValidExpiration(expiration)) {
      newErrors.expiration = t("invalid_expiration");
    }
    if (!isValidCVC(cvc)) {
      newErrors.cvc = t("invalid_cvc");
    }

    // Display each error message as a toast
    if (Object.keys(newErrors).length > 0) {
      Object.values(newErrors).forEach((msg) => {
        addToast(msg, { appearance: "error", autoDismiss: true });
      });
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // --- Save Profile Handler ---
  const handleSave = async (e) => {
    e.preventDefault();
    if (!user) return;

    if (!validatePaymentFields()) {
      return;
    }

    setIsLoading(true);
    const userRef = ref(db, `users/${user.uid}`);

    try {
      // If new password is provided, update it in Auth and then save in the Realtime Database
      if (newPassword && confirmPassword) {
        if (newPassword !== confirmPassword) {
          addToast(t("password_mismatch"), {
            appearance: "error",
            autoDismiss: true,
          });
          setIsLoading(false);
          return;
        }
        if (newPassword.length < 6) {
          addToast(t("password_strength"), {
            appearance: "error",
            autoDismiss: true,
          });
          setIsLoading(false);
          return;
        }
        try {
          await updatePassword(user, newPassword);

          await set(userRef, {
            firstName,
            lastName,
            displayName,
            email,
            password: newPassword, // saving new password here
            billingInfo: {
              address,
              city: selectedCity || "",
              country: selectedCountry
                ? {
                    label: selectedCountry.label,
                    value: selectedCountry.value,
                    flag: selectedCountry.flag,
                  }
                : null,
              zipCode,
              phone,
              nameOnCard,
              cardNumber,
              expiration,
              cvc,
            },
            role: "guest",
          });
          addToast(t("password_changed_success"), {
            appearance: "success",
            autoDismiss: true,
          });
          // Clear password fields
          setCurrentPassword("");
          setNewPassword("");
          setConfirmPassword("");
        } catch (error) {
          addToast(error.message, { appearance: "error", autoDismiss: true });
          console.error("Password change error:", error);
          setIsLoading(false);
          return;
        }
      } else {
        // If no new password provided, update with the current password value
        await update(userRef, {
          firstName,
          lastName,
          displayName,
          email,
          password: currentPassword,
          billingInfo: {
            address,
            city: selectedCity.label || "",
            country: selectedCountry
              ? {
                  label: selectedCountry.label,
                  value: selectedCountry.value,
                  flag: selectedCountry.flag,
                }
              : null,
            zipCode,
            phone,
            nameOnCard,
            cardNumber,
            expiration,
            cvc,
          },
          role: "guest",
        });
      }

      addToast(t("profile_updated"), {
        appearance: "success",
        autoDismiss: true,
      });

      setTimeout(() => {
        router.reload();
      }, 1500);
    } catch (error) {
      addToast(error.message, { appearance: "error", autoDismiss: true });
      console.error("Error updating profile:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const downloadPdf = async (order) => {
    if (!order) return;
    setDownloadingOrderId(order.id);
    try {
      const paymentText =
        order.paymentMethod === "payment_cash"
          ? t("payment_cash")
          : t("payment_bank");

      const orderForPdf = {
        ...order,
        paymentText,
        date: order.date,
        reservationDate: order.reservationDate,
        displayName: order.displayName || displayName || null,
        customer: {
          ...(order.customer || {}),
          name:
            order.customer?.name || order.displayName || displayName || null,
          email: order.customer?.email || order.email || email || null,
          phone: order.customer?.phone || order.customerPhone || phone || null,
          address:
            order.customer?.address || order.customerAddress || address || null,
          city: order.customer?.city || order.customerCity || null,
          postalCode:
            order.customer?.postalCode || order.customerPostalCode || null,
          state: order.customer?.state || order.customerState || null,
        },
      };

      const resp = await fetch("/api/generate-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order: orderForPdf, language: currentLanguage }),
      });

      if (!resp.ok) {
        let errBody = null;
        try {
          errBody = await resp.json();
        } catch (e) {}
        throw new Error(
          errBody?.message || errBody?.error || `Server error ${resp.status}`
        );
      }

      const blob = await resp.blob();

      const filenamePrefix =
        order.paymentMethod === "payment_cash"
          ? currentLanguage === "mk"
            ? "Потврда"
            : "Confirmation"
          : currentLanguage === "mk"
            ? "Фактура"
            : "Invoice";
      const fileName = `${filenamePrefix}-${order.orderNumber || "order"}.pdf`;

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Download error:", err);
      addToast(err.message || "Download failed", {
        appearance: "error",
        autoDismiss: true,
      });
    } finally {
      setDownloadingOrderId(null);
    }
  };

  // --- change detection ---
  const checkForChanges = useCallback(() => {
    if (!initialLoaded) {
      setHasChanges(false);
      return;
    }

    const changed =
      firstName !== initialFirstName ||
      lastName !== initialLastName ||
      displayName !== initialDisplayName ||
      address !== initialAddress ||
      phone !== initialPhone ||
      zipCode !== initialZip ||
      selectedCountry?.value !== initialCountry?.value ||
      selectedCity?.value !== initialCity?.value ||
      nameOnCard !== initialNameOnCard ||
      cardNumber !== initialCardNumber ||
      expiration !== initialExpiration ||
      cvc !== initialCvc ||
      currentPassword !== "" ||
      newPassword !== "" ||
      confirmPassword !== "";

    setHasChanges(changed);
  }, [
    firstName,
    lastName,
    displayName,
    address,
    phone,
    zipCode,
    selectedCountry,
    selectedCity,
    nameOnCard,
    cardNumber,
    expiration,
    cvc,
    newPassword,
    confirmPassword,
    currentPassword,
    initialFirstName,
    initialLastName,
    initialDisplayName,
    initialAddress,
    initialPhone,
    initialZip,
    initialCountry,
    initialCity,
    initialNameOnCard,
    initialCardNumber,
    initialExpiration,
    initialCvc,
    initialLoaded,
  ]);

  const handleCancel = () => {
    if (!initialLoaded) return;

    // primitives
    setFirstName(initialFirstName);
    setLastName(initialLastName);
    setDisplayName(initialDisplayName);
    setAddress(initialAddress);
    setZipCode(initialZip);
    setPhone(initialPhone);
    setNameOnCard(initialNameOnCard);
    setCardNumber(initialCardNumber);
    setExpiration(initialExpiration);
    setCvc(initialCvc);

    // plain text city input (string)
    setCity(
      typeof initialCity === "object" ? initialCity.label : initialCity || ""
    );

    // restore country: ensure we provide the canonical option object or null
    let countryOption = null;
    if (initialCountry) {
      countryOption =
        typeof initialCountry === "object"
          ? countryOptions.find((c) => c.value === initialCountry.value) ||
            initialCountry
          : findCountryOption(initialCountry);
    }
    setSelectedCountry(countryOption);

    // restore city options & selectedCity (react-select expects option object)
    if (countryOption?.value) {
      const cities = buildCityOptionsFromCountryValue(countryOption.value);
      setCityOptions(cities);
      const cityOption = findCityOption(initialCity, cities);
      setSelectedCity(cityOption);
    } else {
      setCityOptions([]);
      setSelectedCity(null);
    }

    // clear passwords
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setHasChanges(false);
  };

  useEffect(() => {
    checkForChanges();
  }, [checkForChanges]);

  // Pagination logic
  const indexOfFirstOrder = (currentPage - 1) * ordersPerPage;
  const indexOfLastOrder = currentPage * ordersPerPage;
  const currentOrders = filteredOrders.slice(
    indexOfFirstOrder,
    indexOfLastOrder
  );

  const ordersOnCurrentPage = currentOrders.length;

  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handlePageChangeDown = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPagesDown) {
      setCurrentPageDown(pageNumber);
    }
  };

  const handlePageChangePayment = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPagesPayment) {
      setCurrentPagePayment(pageNumber);
    }
  };

  return (
    <LayoutTwo>
      <BreadcrumbOne
        pageTitle={t("my_account")}
        backgroundImage="/assets/images/backgrounds/breadcrumb-bg-2.webp"
      >
        <ul className="breadcrumb__list">
          <li>
            <Link
              href="/home/trending"
              as={process.env.PUBLIC_URL + "/home/trending"}
            >
              {t("home")}
            </Link>
          </li>
          <li>{t("my_account")}</li>
        </ul>
      </BreadcrumbOne>
      <div className="my-account-area space-mt--r130 space-mb--r130">
        <Container>
          <Tab.Container defaultActiveKey="dashboard">
            <Nav
              variant="pills"
              className="my-account-area__navigation space-mb--r60"
            >
              <Nav.Item>
                <Nav.Link eventKey="dashboard">{t("dashboard")}</Nav.Link>
              </Nav.Item>
              {role === "admin" && (
                <Nav.Item>
                  <Nav.Link eventKey="users">{t("users")}</Nav.Link>
                </Nav.Item>
              )}
              <Nav.Item>
                <Nav.Link eventKey="orders">{t("orders")}</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="download">{t("download")}</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="payment">{t("payment")}</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="accountDetails">
                  {t("account_details")}
                </Nav.Link>
              </Nav.Item>
            </Nav>
            <Tab.Content>
              <Tab.Pane eventKey="dashboard">

               <div className="my-account-area__content">
                  <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
                    <h3 className="mb-0">{t("dashboard")}</h3>
                    <button
                      onClick={() => setShowLogoutModal(true)}
                      className="btn btn-danger"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <Spinner
                          as="span"
                          animation="border"
                          size="sm"
                          role="status"
                          aria-hidden="true"
                        />
                      ) : (
                        <>
                          <i className="bi bi-box-arrow-right me-2"></i>
                          {t("logout")}
                        </>
                      )}
                    </button>
                  </div>

                  {/* Welcome Card */}
                  <div className="card mb-4 border-0 shadow-sm">
                    <div className="card-body p-4">
                      <div className="d-flex align-items-center mb-3">
                        <div 
                          className={`${role === "admin" ? "bg-danger" : "bg-primary"} text-white rounded-circle d-flex align-items-center justify-content-center me-3`} 
                          style={{ width: "60px", height: "60px", fontSize: "24px" }}
                        >
                          <i className={`bi ${role === "admin" ? "bi-shield-check" : "bi-person"}`}></i>
                        </div>
                        <div>
                          <h4 className="mb-1">
                            {t("hello_user")} {displayName || ""}!
                            {role === "admin" && (
                              <Badge bg="danger" className="ms-2">
                                <i className="bi bi-shield-check me-1"></i>
                                {t("admin")}
                              </Badge>
                            )}
                          </h4>
                          <p className="text-muted mb-0">{email}</p>
                        </div>
                      </div>
                      <p className="mb-0">
                        {role === "admin" 
                          ? t("admin_dashboard_welcome") || t("dashboard_welcome")
                          : t("dashboard_welcome")
                        }
                      </p>
                    </div>
                  </div>

                  {/* Quick Stats - Different for Admin vs Guest */}
                  <div className="row mb-4 g-3">
                    {role === "admin" ? (
                      <>
                        {/* Admin Stats */}
                        <div className="col-md-3 col-sm-6">
                          <div className="card border-0 shadow-sm h-100">
                            <div className="card-body text-center p-4">
                              <div className="text-primary mb-2">
                                <i className="bi bi-cart-check" style={{ fontSize: "2rem" }}></i>
                              </div>
                              <h3 className="mb-1">{orders.length}</h3>
                              <small className="text-muted">{t("all_orders")}</small>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-3 col-sm-6">
                          <div className="card border-0 shadow-sm h-100">
                            <div className="card-body text-center p-4">
                              <div className="text-warning mb-2">
                                <i className="bi bi-clock-history" style={{ fontSize: "2rem" }}></i>
                              </div>
                              <h3 className="mb-1">{orders.filter(o => o.status === "pending").length}</h3>
                              <small className="text-muted">{t("pending_review")}</small>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-3 col-sm-6">
                          <div className="card border-0 shadow-sm h-100">
                            <div className="card-body text-center p-4">
                              <div className="text-info mb-2">
                                <i className="bi bi-people" style={{ fontSize: "2rem" }}></i>
                              </div>
                              <h3 className="mb-1">{allUsers.length}</h3>
                              <small className="text-muted">{t("total_users")}</small>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-3 col-sm-6">
                          <div className="card border-0 shadow-sm h-100">
                            <div className="card-body text-center p-4">
                              <div className="text-success mb-2">
                                <i className="bi bi-currency-exchange" style={{ fontSize: "2rem" }}></i>
                              </div>
                              <h3 className="mb-1" style={{ fontSize: "1.3rem" }}>
                                {formatTotal(
                                  orders.reduce((sum, order) => {
                                    const mk = parseFloat(order.totalMK || 0);
                                    const en = parseFloat(order.totalEN || 0);
                                    return currentLanguage === "mk"
                                      ? sum + (mk > 0 ? mk : en * conversionRate)
                                      : sum + (en > 0 ? en : mk / conversionRate);
                                  }, 0),
                                  currentLanguage
                                )}
                              </h3>
                              <small className="text-muted">{t("total_revenue")}</small>
                            </div>
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        {/* Guest Stats */}
                        <div className="col-md-3 col-sm-6">
                          <div className="card border-0 shadow-sm h-100">
                            <div className="card-body text-center p-4">
                              <div className="text-primary mb-2">
                                <i className="bi bi-cart-check" style={{ fontSize: "2rem" }}></i>
                              </div>
                              <h3 className="mb-1">{orders.length}</h3>
                              <small className="text-muted">{t("my_orders")}</small>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-3 col-sm-6">
                          <div className="card border-0 shadow-sm h-100">
                            <div className="card-body text-center p-4">
                              <div className="text-warning mb-2">
                                <i className="bi bi-clock-history" style={{ fontSize: "2rem" }}></i>
                              </div>
                              <h3 className="mb-1">{orders.filter(o => o.status === "pending").length}</h3>
                              <small className="text-muted">{t("pending")}</small>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-3 col-sm-6">
                          <div className="card border-0 shadow-sm h-100">
                            <div className="card-body text-center p-4">
                              <div className="text-success mb-2">
                                <i className="bi bi-check-circle" style={{ fontSize: "2rem" }}></i>
                              </div>
                              <h3 className="mb-1">{orders.filter(o => o.status === "confirmed").length}</h3>
                              <small className="text-muted">{t("confirmed")}</small>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-3 col-sm-6">
                          <div className="card border-0 shadow-sm h-100">
                            <div className="card-body text-center p-4">
                              <div className="text-info mb-2">
                                <i className="bi bi-currency-exchange" style={{ fontSize: "2rem" }}></i>
                              </div>
                              <h3 className="mb-1" style={{ fontSize: "1.3rem" }}>
                                {formatTotal(
                                  orders.reduce((sum, order) => {
                                    const mk = parseFloat(order.totalMK || 0);
                                    const en = parseFloat(order.totalEN || 0);
                                    return currentLanguage === "mk"
                                      ? sum + (mk > 0 ? mk : en * conversionRate)
                                      : sum + (en > 0 ? en : mk / conversionRate);
                                  }, 0),
                                  currentLanguage
                                )}
                              </h3>
                              <small className="text-muted">{t("total_spent")}</small>
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Recent Orders - Different title for Admin */}
                  {orders.length > 0 && (
                    <div className="card border-0 shadow-sm mb-4">
                      <div className="card-header bg-white border-bottom">
                        <div className="d-flex justify-content-between align-items-center">
                          <h5 className="mb-0">
                            <i className="bi bi-clock-history me-2 text-primary"></i>
                            {role === "admin" ? t("recent_system_orders") : t("recent_orders")}
                          </h5>
                          <small className="text-muted">{t("last_5_orders")}</small>
                        </div>
                      </div>
                      <div className="card-body p-0">
                        <div className="table-responsive">
                          <table className="table table-hover mb-0">
                            <thead className="table-light">
                              <tr>
                                {role === "admin" && (
                                  <th className="ps-3">{t("user")}</th>
                                )}
                                <th className={role === "admin" ? "" : "ps-3"}>{t("order")}</th>
                                <th>{t("date")}</th>
                                <th className="text-center">{t("status")}</th>
                                <th className="text-end pe-3">{t("total")}</th>
                              </tr>
                            </thead>
                            <tbody>
                              {orders.slice(0, 5).map((order) => (
                                <tr key={order.id} className="align-middle">
                                  {role === "admin" && (
                                    <td className="ps-3">
                                      <small className="fw-bold">{order.displayName}</small>
                                    </td>
                                  )}
                                  <td className={role === "admin" ? "" : "ps-3"}>
                                    <span className="badge bg-secondary">
                                      {order.orderNumber}
                                    </span>
                                  </td>
                                  <td><small>{order.date}</small></td>
                                  <td className="text-center">
                                    <Badge
                                      pill
                                      bg={
                                        order.status === "pending"
                                          ? "warning"
                                          : order.status === "confirmed"
                                            ? "success"
                                            : "danger"
                                      }
                                      className="px-3 py-2"
                                    >
                                      {t(order.status)}
                                    </Badge>
                                  </td>
                                  <td className="text-end pe-3">
                                    <small>
                                      {formatTotal(
                                        order.displayTotal ??
                                          (currentLanguage === "mk"
                                            ? order.totalMK
                                            : order.totalEN),
                                        currentLanguage
                                      )}
                                    </small>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Quick Actions - Different for Admin vs Guest */}
                  <div className="card border-0 shadow-sm">
                    <div className="card-header bg-white border-bottom">
                      <h5 className="mb-0">
                        <i className="bi bi-lightning-charge me-2 text-warning"></i>
                        {t("quick_actions")}
                      </h5>
                    </div>
                    <div className="card-body">
                      {role === "admin" ? (
                        <div className="row g-3">
                          <div className="col-md-3 col-sm-6">
                            <button
                              className="btn btn-outline-primary w-100 py-3"
                              onClick={() => document.querySelector('[data-rr-ui-event-key="orders"]').click()}
                            >
                              <i className="bi bi-cart-check d-block mb-2" style={{ fontSize: "1.5rem" }}></i>
                              <small>{t("manage_orders")}</small>
                            </button>
                          </div>
                          <div className="col-md-3 col-sm-6">
                            <button
                              className="btn btn-outline-info w-100 py-3"
                              onClick={() => document.querySelector('[data-rr-ui-event-key="users"]').click()}
                            >
                              <i className="bi bi-people d-block mb-2" style={{ fontSize: "1.5rem" }}></i>
                              <small>{t("view_users")}</small>
                            </button>
                          </div>
                          <div className="col-md-3 col-sm-6">
                            <button
                              className="btn btn-outline-success w-100 py-3"
                              onClick={() => {
                                document.querySelector('[data-rr-ui-event-key="orders"]').click();
                                // Scroll to financial reports section
                                setTimeout(() => {
                                  const reportsSection = document.querySelector('.financial-reports');
                                  if (reportsSection) {
                                    reportsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                  }
                                }, 100);
                              }}
                            >
                              <i className="bi bi-graph-up d-block mb-2" style={{ fontSize: "1.5rem" }}></i>
                              <small>{t("view_reports")}</small>
                            </button>
                          </div>
                          <div className="col-md-3 col-sm-6">
                            <button
                              className="btn btn-outline-secondary w-100 py-3"
                              onClick={() => document.querySelector('[data-rr-ui-event-key="accountDetails"]').click()}
                            >
                              <i className="bi bi-person-gear d-block mb-2" style={{ fontSize: "1.5rem" }}></i>
                              <small>{t("edit_profile")}</small>
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="row g-3">
                          <div className="col-md-4 col-sm-6">
                            <button
                              className="btn btn-outline-primary w-100 py-3"
                              onClick={() => document.querySelector('[data-rr-ui-event-key="orders"]').click()}
                            >
                              <i className="bi bi-cart-check d-block mb-2" style={{ fontSize: "1.5rem" }}></i>
                              <small>{t("view_orders")}</small>
                            </button>
                          </div>
                          <div className="col-md-4 col-sm-6">
                            <button
                              className="btn btn-outline-success w-100 py-3"
                              onClick={() => document.querySelector('[data-rr-ui-event-key="accountDetails"]').click()}
                            >
                              <i className="bi bi-person-gear d-block mb-2" style={{ fontSize: "1.5rem" }}></i>
                              <small>{t("edit_profile")}</small>
                            </button>
                          </div>
                          <div className="col-md-4 col-sm-6">
                            <button
                              className="btn btn-outline-info w-100 py-3"
                              onClick={() => document.querySelector('[data-rr-ui-event-key="download"]').click()}
                            >
                              <i className="bi bi-download d-block mb-2" style={{ fontSize: "1.5rem" }}></i>
                              <small>{t("download_invoices")}</small>
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

              </Tab.Pane>
              <Tab.Pane eventKey="orders">
                <div className="my-account-area__content">
                  <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
                    <h3 className="mb-0">{t("orders")}</h3>
                    {orders.length > 0 && (
                      <span
                        className="badge bg-primary"
                        style={{ fontSize: "1rem", padding: "0.5rem 1rem" }}
                      >
                        {orders.length} {t("total_orders")}
                      </span>
                    )}
                  </div>

                  {orders.length === 0 ? (
                    <div className="card">
                      <div className="card-body text-center py-5">
                        <i
                          className="bi bi-cart-x"
                          style={{ fontSize: "3rem", color: "#ccc" }}
                        ></i>
                        <p className="mt-3 mb-0 text-muted">
                          {t("you_have_not_made_any_order_yet")}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="card">
                      <div className="card-body">
                        {/* Filters Section */}
                        <div className="filter-section mb-4">
                          {/* Toggle Button */}
                          <div className="d-flex align-items-center mb-3">
                            <button
                              type="button"
                              className={`btn btn-outline-secondary d-flex align-items-center justify-content-center me-3 filter-toggle ${
                                showFilters ? "active" : ""
                              }`}
                              onClick={() => setShowFilters((prev) => !prev)}
                              title={
                                showFilters
                                  ? t("hide_filters")
                                  : t("show_filters")
                              }
                              style={{
                                width: "45px",
                                height: "45px",
                                borderRadius: "50%",
                                padding: 0,
                              }}
                            >
                              <IoFilter size={22} className="filter-icon" />
                            </button>
                            <span>{t("filter")}</span>
                          </div>

                          {/* Filters Section */}
                          {showFilters && (
                            <div className="row mb-3 g-3">
                              {/* Search Input */}
                              <div className="col-md-4">
                                <label className="form-label">
                                  {t("search")}
                                </label>
                                <div style={{ position: "relative" }}>
                                  <input
                                    type="text"
                                    className="form-control"
                                    placeholder={t("search_order_or_user")}
                                    value={searchQuery}
                                    onChange={(e) => {
                                      const newValue = e.target.value;
                                      setSearchQuery(newValue);
                                      // Only reset pagination when user is typing (adding text)
                                      if (
                                        newValue.length > searchQuery.length
                                      ) {
                                        setCurrentPage(1);
                                      }
                                    }}
                                    style={{
                                      paddingLeft: "40px",
                                      paddingRight: searchQuery
                                        ? "40px"
                                        : "12px",
                                      fontSize: "12px",
                                    }}
                                  />
                                  <IoIosSearch
                                    style={{
                                      position: "absolute",
                                      left: "12px",
                                      top: "50%",
                                      transform: "translateY(-50%)",
                                      fontSize: "20px",
                                      color: "#6c757d",
                                      pointerEvents: "none",
                                    }}
                                  />
                                  {searchQuery && (
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setSearchQuery("");
                                        setCurrentPage(1);
                                      }}
                                      style={{
                                        position: "absolute",
                                        right: "8px",
                                        top: "50%",
                                        transform: "translateY(-50%)",
                                        background: "transparent",
                                        border: "none",
                                        cursor: "pointer",
                                        padding: "4px",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        color: "#dc3545",
                                        transition: "color 0.2s",
                                      }}
                                      onMouseEnter={(e) =>
                                        (e.currentTarget.style.color =
                                          "#bb2d3b")
                                      }
                                      onMouseLeave={(e) =>
                                        (e.currentTarget.style.color =
                                          "#dc3545")
                                      }
                                      title={t("clear")}
                                    >
                                      ✕
                                    </button>
                                  )}
                                </div>
                              </div>
                              {/* Filter by Status */}
                              <div className="col-md-4">
                                <label className="form-label">
                                  <i className="bi bi-funnel me-1"></i>
                                  {t("filter_by_status")}
                                </label>
                                <select
                                  className="form-select"
                                  value={filterStatus}
                                  onChange={(e) => {
                                    setFilterStatus(e.target.value);
                                    setCurrentPage(1); // reset pagination
                                  }}
                                  style={{ fontSize: "12px" }}
                                >
                                  <option value="all">
                                    {t("all_statuses")}
                                  </option>
                                  <option value="pending">
                                    {t("pending")}
                                  </option>
                                  <option value="confirmed">
                                    {t("confirmed")}
                                  </option>
                                  <option value="cancelled">
                                    {t("cancelled")}
                                  </option>
                                </select>
                              </div>

                              {/* Filter by Payment */}
                              <div className="col-md-4">
                                <label className="form-label">
                                  <i className="bi bi-credit-card me-1"></i>
                                  {t("filter_by_payment")}
                                </label>
                                <select
                                  className="form-select"
                                  value={filterPayment}
                                  onChange={(e) => {
                                    setFilterPayment(e.target.value);
                                    setCurrentPage(1); // reset pagination
                                  }}
                                  style={{ fontSize: "12px" }}
                                >
                                  <option value="all">
                                    {t("all_payments")}
                                  </option>
                                  <option value="payment_cash">
                                    {t("payment_cash")}
                                  </option>
                                  <option value="payment_bank">
                                    {t("payment_bank")}
                                  </option>
                                </select>
                              </div>

                              {/* Year Filter */}
                              <div className="col-md-4">
                                <label className="form-label">
                                  <i className="bi bi-calendar-year me-1"></i>
                                  {t("filter_by_year")}
                                </label>
                                <select
                                  className="form-select"
                                  value={filterYear}
                                  onChange={(e) => {
                                    setFilterYear(e.target.value);
                                    setCurrentPage(1); // reset pagination
                                  }}
                                  style={{ fontSize: "12px" }}
                                >
                                  {[...Array(5)].map((_, idx) => {
                                    const year = new Date().getFullYear() - idx;
                                    return (
                                      <option
                                        key={year}
                                        value={year.toString()}
                                      >
                                        {year}
                                      </option>
                                    );
                                  })}
                                </select>
                              </div>
                            </div>
                          )}
                        </div>
                        <div
                          className="table-responsive"
                          style={{
                            maxHeight: "350px",
                            overflowY: "auto",
                            border: "1px solid #dee2e6",
                            borderRadius: "8px",
                            position: "relative",
                          }}
                        >
                          <table className="table table-hover table-striped mb-0">
                            <thead
                              className="table-primary"
                              style={{
                                position: "sticky",
                                top: 0,
                                zIndex: 1,
                              }}
                            >
                              <tr>
                                {role === "admin" && (
                                  <th
                                    className="ps-3 text-start"
                                    style={{ minWidth: "180px" }}
                                  >
                                    <i className="bi bi-person me-2"></i>
                                    {t("user")}
                                  </th>
                                )}
                                <th
                                  className="text-start"
                                  style={{ minWidth: "110px" }}
                                >
                                  <i className="bi bi-receipt me-2"></i>
                                  {t("order")}
                                </th>
                                <th
                                  className="text-start"
                                  style={{ minWidth: "110px" }}
                                >
                                  <i className="bi bi-calendar-date me-2"></i>
                                  {t("date")}
                                </th>
                                <th
                                  className="text-start"
                                  style={{ minWidth: "120px" }}
                                >
                                  <i className="bi bi-calendar-check me-2"></i>
                                  {t("date_of_reservation")}
                                </th>
                                <th
                                  className="text-start pe-3"
                                  style={{ minWidth: "60px" }}
                                >
                                  <i className="bi bi-clock me-2"></i>
                                  {t("time_of_reservation")}
                                </th>
                                <th
                                  className="text-center pe-3"
                                  style={{ minWidth: "90px" }}
                                >
                                  <i className="bi bi-info-circle me-2"></i>
                                  {t("status")}
                                </th>
                                <th
                                  className="text-end"
                                  style={{ minWidth: "130px" }}
                                >
                                  <i className="bi bi-currency-exchange me-2"></i>
                                  {t("total")}
                                </th>
                                {/* Only Action stays centered */}
                                <th
                                  className="text-center pe-3"
                                  style={{ minWidth: "180px" }}
                                >
                                  <i className="bi bi-gear me-2"></i>
                                  {t("action")}
                                </th>
                              </tr>
                            </thead>

                            <tbody>
                              {currentOrders.map((order) => (
                                <tr key={order.id} className="align-middle">
                                  {role === "admin" && (
                                    <td className="ps-3">
                                      <small>{order.displayName}</small>
                                    </td>
                                  )}
                                  <td>
                                    <span className="badge bg-secondary">
                                      {order.orderNumber}
                                    </span>
                                  </td>
                                  <td className="text-start pe-3">
                                    <small>{order.date}</small>
                                  </td>
                                  <td className="text-center pe-3">
                                    <small>{order.reservationDate}</small>
                                  </td>
                                  <td className="text-center pe-3">
                                    <small>{order.reservationTime}</small>
                                  </td>
                                  <td className="text-center">
                                    {role === "admin" &&
                                    order.status === "pending" ? (
                                      <select
                                        value={order.status}
                                        onChange={(e) =>
                                          updateOrder(
                                            order.id,
                                            user.uid,
                                            e.target.value
                                          )
                                        }
                                        className="form-select form-select-sm"
                                        style={{
                                          maxWidth: "130px",
                                          margin: "0 auto",
                                        }}
                                      >
                                        <option value="pending">
                                          {t("pending")}
                                        </option>
                                        <option value="confirmed">
                                          {t("confirmed")}
                                        </option>
                                        <option value="cancelled">
                                          {t("cancelled")}
                                        </option>
                                      </select>
                                    ) : (
                                      <Badge
                                        pill
                                        bg={
                                          order.status === "pending"
                                            ? "warning"
                                            : order.status === "confirmed"
                                              ? "success"
                                              : order.status === "cancelled"
                                                ? "danger"
                                                : "secondary"
                                        }
                                        className="px-3 py-2"
                                      >
                                        {t(order.status)}
                                      </Badge>
                                    )}
                                  </td>
                                  <td className="text-end">
                                    <small>
                                      {formatTotal(
                                        // prefer precomputed displayTotal, fallback to language-specific numeric fields
                                        order.displayTotal ??
                                          (currentLanguage === "mk"
                                            ? order.totalMK
                                            : order.totalEN),
                                        currentLanguage
                                      )}
                                    </small>
                                  </td>
                                  <td className="text-center pe-3">
                                    <div className="d-flex gap-2 justify-content-center">
                                      <button
                                        type="button"
                                        className="btn btn-sm btn-primary"
                                        onClick={() =>
                                          viewOrder(order.id, order.userId)
                                        }
                                      >
                                        <i className="bi bi-eye me-1"></i>
                                        {t("view")}
                                      </button>
                                      {role === "admin" && ( // <-- Only shows for admins
                                        <button
                                          onClick={() => {
                                            setPendingDeleteId(order.id);
                                            setShowDeleteModal(true);
                                          }}
                                          className="btn btn-sm btn-outline-danger"
                                        >
                                          <i className="bi bi-trash me-1"></i>
                                          {t("delete")}
                                        </button>
                                      )}
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>

                            <tfoot
                              className="table-secondary"
                              style={{
                                position: "sticky",
                                bottom: 0,
                                zIndex: 1,
                              }}
                            >
                              <tr className="fw-bold">
                                <td
                                  colSpan={role === "admin" ? 6 : 5}
                                  className={role === "admin" ? "ps-3" : ""}
                                >
                                  <i className="bi bi-calculator me-2"></i>
                                  {t("grand_total_label")}
                                </td>
                                <td className="text-end text-primary">
                                  <small>
                                    {formatTotal(
                                      grandTotalInDisplayCurrency,
                                      currentLanguage
                                    )}
                                  </small>
                                </td>
                                <td className="pe-3" />
                              </tr>
                            </tfoot>
                          </table>
                        </div>

                        {totalPages > 1 && (
                          <div className="d-flex justify-content-between align-items-center mt-4 flex-wrap gap-3">
                            {/* Pagination summary (left side) */}
                            <div className="text-muted">
                              <small>
                                {t("showing")} {ordersOnCurrentPage} {t("of")}{" "}
                                {filteredOrders.length} {t("orders")}
                              </small>
                            </div>

                            {/* Pagination navigation */}
                            <nav>
                              <ul className="pagination mb-0">
                                {/* Previous Button */}
                                <li
                                  className={`page-item ${currentPage === 1 ? "disabled" : ""}`}
                                >
                                  <button
                                    type="button"
                                    className="page-link py-1 px-2" // smaller padding
                                    onClick={() => paginate(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    aria-label="Previous"
                                  >
                                    {t("previous")}
                                  </button>
                                </li>

                                {/* Page Numbers */}
                                {[...Array(totalPages)].map((_, index) => {
                                  const pageNumber = index + 1;

                                  if (
                                    pageNumber === 1 ||
                                    pageNumber === totalPages ||
                                    (pageNumber >= currentPage - 1 &&
                                      pageNumber <= currentPage + 1)
                                  ) {
                                    return (
                                      <li
                                        key={pageNumber}
                                        className={`page-item ${
                                          currentPage === pageNumber
                                            ? "active"
                                            : ""
                                        }`}
                                      >
                                        <button
                                          type="button"
                                          className="page-link py-1 px-2"
                                          onClick={() => paginate(pageNumber)}
                                        >
                                          {pageNumber}
                                        </button>
                                      </li>
                                    );
                                  } else if (
                                    pageNumber === currentPage - 2 ||
                                    pageNumber === currentPage + 2
                                  ) {
                                    return (
                                      <li
                                        key={`ellipsis-${pageNumber}`}
                                        className="page-item disabled"
                                      >
                                        <span className="page-link py-1 px-2">
                                          ...
                                        </span>
                                      </li>
                                    );
                                  }
                                  return null;
                                })}

                                {/* Next Button */}
                                <li
                                  className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}
                                >
                                  <button
                                    type="button"
                                    className="page-link py-1 px-2"
                                    onClick={() => paginate(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                    aria-label="Next"
                                  >
                                    {t("next")}
                                  </button>
                                </li>
                              </ul>
                            </nav>
                          </div>
                        )}

                        {/* Summary Stats */}
                        <div className="row mt-4 g-3">
                          <div className="col-md-3">
                            <div className="card border-primary">
                              <div className="card-body text-center py-3">
                                <small className="text-muted d-block">
                                  {t("total_orders")}
                                </small>
                                <h4 className="mb-0 text-primary">
                                  {filteredOrdersForCharts.length}
                                </h4>
                              </div>
                            </div>
                          </div>
                          <div className="col-md-3">
                            <div className="card border-warning">
                              <div className="card-body text-center py-3">
                                <small className="text-muted d-block">
                                  {t("pending")}
                                </small>
                                <h4 className="mb-0 text-warning">
                                  {
                                    filteredOrders.filter(
                                      (o) => o.status === "pending"
                                    ).length
                                  }
                                </h4>
                              </div>
                            </div>
                          </div>
                          <div className="col-md-3">
                            <div className="card border-success">
                              <div className="card-body text-center py-3">
                                <small className="text-muted d-block">
                                  {t("confirmed")}
                                </small>
                                <h4 className="mb-0 text-success">
                                  {
                                    filteredOrders.filter(
                                      (o) => o.status === "confirmed"
                                    ).length
                                  }
                                </h4>
                              </div>
                            </div>
                          </div>
                          <div className="col-md-3">
                            <div className="card border-danger">
                              <div className="card-body text-center py-3">
                                <small className="text-muted d-block">
                                  {t("cancelled")}
                                </small>
                                <h4 className="mb-0 text-danger">
                                  {
                                    filteredOrders.filter(
                                      (o) => o.status === "cancelled"
                                    ).length
                                  }
                                </h4>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {role === "admin" && orders.length > 0 && (
                    <div className="financial-reports mt-4">
                      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
                        <h4 className="mb-0 text-center text-md-start">
                          <TbReportAnalytics size={24} className="me-2" />
                          {t("financial_reports")}
                        </h4>
                        <PDFDownloadLink
                          //</div>document={
                          // <FinancialReportPDF
                          //   orders={orders}
                          //   t={t}
                          //   currentLanguage={currentLanguage}
                          //   grandTotalInDisplayCurrency={grandTotalInDisplayCurrency}
                          //   getAverageOrderValue={getAverageOrderValue}
                          //   getOrderSuccessStats={getOrderSuccessStats}
                          //   getTopProducts={getTopProducts}
                          //   formattedPaymentData={formattedPaymentData}
                          //   statusData={statusData}
                          //   formatTotal={formatTotal}
                          // />
                          // }
                          fileName={`financial-report-${new Date().toISOString().split("T")[0]}.pdf`}
                          className="btn btn-danger"
                        >
                          {({ loading }) => (
                            <>
                              <i className="bi bi-file-pdf me-2"></i>
                              {loading ? t("preparing_pdf") : t("download_pdf")}
                            </>
                          )}
                        </PDFDownloadLink>
                      </div>

                      {/* Key Metrics Cards */}
                      <div className="row mb-4">
                        <div className="col-12 col-md-3 mb-3">
                          <div className="card text-center">
                            <div className="card-body">
                              <h6 className="text-muted">
                                {t("total_orders")}
                              </h6>
                              <h3>{filteredOrdersForCharts.length}</h3>
                              <small className="text-muted d-block mt-2">
                                {t("all_time_orders")}
                              </small>
                            </div>
                          </div>
                        </div>
                        <div className="col-12 col-md-3 mb-3">
                          <div className="card text-center">
                            <div className="card-body">
                              <h6 className="text-muted">
                                {t("total_revenue")}
                              </h6>
                              <h3>
                                {formatTotal(
                                  filteredOrdersForCharts.reduce(
                                    (sum, order) => {
                                      // prefer explicit numeric fields added at fetch time
                                      const mk = parseFloat(order.totalMK || 0);
                                      const en = parseFloat(order.totalEN || 0);

                                      // fallback: if neither exists, try parsing legacy order.total
                                      const fallback = parseAmount(
                                        order.total || 0
                                      );
                                      if (!mk && !en) {
                                        // try to guess currency from order.currency (backwards-compat)
                                        const cur = (
                                          order.currency || "MKD"
                                        ).toUpperCase();
                                        if (currentLanguage === "mk") {
                                          return (
                                            sum +
                                            (cur === "MKD"
                                              ? fallback
                                              : fallback * conversionRate)
                                          );
                                        } else {
                                          return (
                                            sum +
                                            (cur === "EUR"
                                              ? fallback
                                              : fallback / conversionRate)
                                          );
                                        }
                                      }

                                      // use the numeric fields (convert if one is missing)
                                      if (currentLanguage === "mk") {
                                        return (
                                          sum +
                                          (mk > 0 ? mk : en * conversionRate)
                                        );
                                      } else {
                                        return (
                                          sum +
                                          (en > 0 ? en : mk / conversionRate)
                                        );
                                      }
                                    },
                                    0
                                  ),
                                  currentLanguage
                                )}
                              </h3>
                              <small className="text-muted d-block mt-2">
                                {t("gross_revenue")}
                              </small>
                            </div>
                          </div>
                        </div>
                        <div className="col-12 col-md-3 mb-3">
                          <div className="card text-center">
                            <div className="card-body">
                              <h6 className="text-muted">
                                {t("avg_order_value")}
                              </h6>
                              <h3>
                                {formatTotal(
                                  getAverageOrderValue(filteredOrdersForCharts),
                                  currentLanguage
                                )}
                              </h3>
                              <small className="text-muted d-block mt-2">
                                {t("per_order_average")}
                              </small>
                            </div>
                          </div>
                        </div>
                        <div className="col-12 col-md-3 mb-3">
                          <div className="card text-center">
                            <div className="card-body">
                              <h6 className="text-muted">
                                {t("order_success_rate")}
                              </h6>
                              <h3>
                                {
                                  getOrderSuccessStats(filteredOrdersForCharts)
                                    .successRate
                                }
                                %
                              </h3>
                              <small className="text-muted d-block mt-2">
                                {
                                  getOrderSuccessStats(filteredOrdersForCharts)
                                    .confirmed
                                }{" "}
                                {t("confirmed_analysis")} /{" "}
                                {
                                  getOrderSuccessStats(filteredOrdersForCharts)
                                    .total
                                }{" "}
                                {t("total")}
                              </small>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Daily Revenue Chart */}
                      <div className="row mb-4">
                        <div className="col-12">
                          <div className="card">
                            <div className="card-body">
                              <div className="d-flex justify-content-between align-items-center mb-3">
                                <TbReportAnalytics size={24} className="me-2" />
                                <h5>{t("daily_revenue_trend")}</h5>
                                <select
                                  className="form-select"
                                  style={{ width: "auto" }}
                                  value={dateRange}
                                  onChange={(e) => setDateRange(e.target.value)}
                                >
                                  <option value="7days">
                                    {t("last_7_days")}
                                  </option>
                                  <option value="30days">
                                    {t("last_30_days")}
                                  </option>
                                  <option value="90days">
                                    {t("last_90_days")}
                                  </option>
                                </select>
                              </div>
                              <div className="chart-container">
                                <ResponsiveContainer>
                                  <BarChart
                                    data={getDailyRevenue(
                                      filteredOrdersForCharts,
                                      dateRange === "7days"
                                        ? 7
                                        : dateRange === "30days"
                                          ? 30
                                          : 90
                                    )}
                                    margin={{
                                      top: 10,
                                      right: 10,
                                      left: 0,
                                      bottom: 0,
                                    }}
                                  >
                                    <XAxis
                                      dataKey="date"
                                      tick={{ fontSize: 10 }}
                                      angle={-45}
                                      textAnchor="end"
                                      interval={4}
                                      height={50}
                                    />
                                    <YAxis />
                                    <Tooltip
                                      formatter={(value, name) => [
                                        value.toLocaleString(undefined, {
                                          minimumFractionDigits: 2,
                                          maximumFractionDigits: 2,
                                        }),
                                        name === "revenue"
                                          ? currentLanguage === "mk"
                                            ? "Приход"
                                            : "Revenue"
                                          : currentLanguage === "mk"
                                            ? "Нарачки"
                                            : "Orders",
                                      ]}
                                    />
                                    <Bar dataKey="revenue" fill="#0088FE" />
                                  </BarChart>
                                </ResponsiveContainer>

                                {/* Daily Revenue Table */}
                                <div className="mt-4">
                                  <div className="d-flex justify-content-between align-items-center mb-3">
                                    <h6 className="mb-0">
                                      <i className="bi bi-table me-2 text-primary"></i>
                                      {t("detailed_daily_breakdown")}
                                    </h6>
                                    <span className="badge bg-primary">
                                      {
                                        getDailyRevenue(
                                          filteredOrdersForCharts,
                                          dateRange === "7days"
                                            ? 7
                                            : dateRange === "30days"
                                              ? 30
                                              : 90
                                        ).length
                                      }{" "}
                                      {t("days")}
                                    </span>
                                  </div>

                                  <div
                                    className="table-responsive"
                                    style={{
                                      maxHeight: "250px",
                                      overflowY: "auto",
                                      border: "1px solid #dee2e6",
                                      borderRadius: "8px",
                                      position: "relative",
                                    }}
                                  >
                                    <table className="table table-hover table-striped mb-0">
                                      <thead
                                        className="table-primary"
                                        style={{
                                          position: "sticky",
                                          top: 0,
                                          zIndex: 1,
                                        }}
                                      >
                                        <tr>
                                          <th className="ps-3">
                                            <i className="bi bi-calendar-date me-2"></i>
                                            {t("date")}
                                          </th>
                                          <th className="text-center">
                                            <i className="bi bi-cart-check me-2"></i>
                                            {t("orders")}
                                          </th>
                                          <th className="text-end pe-3">
                                            <i className="bi bi-currency-exchange me-2"></i>
                                            {t("revenue")}
                                          </th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {getDailyRevenue(
                                          filteredOrdersForCharts,
                                          dateRange === "7days"
                                            ? 7
                                            : dateRange === "30days"
                                              ? 30
                                              : 90
                                        ).map((day, index) => (
                                          <tr
                                            key={index}
                                            className="align-middle"
                                          >
                                            <td className="ps-3">
                                              <small className="text-dark">
                                                {day.date}
                                              </small>
                                            </td>
                                            <td className="text-center">
                                              <span className="badge bg-info text-dark">
                                                <small>{day.orders || 0}</small>
                                              </span>
                                            </td>
                                            <td className="text-end pe-3">
                                              <small className="text-success">
                                                {day.revenue.toLocaleString(
                                                  undefined,
                                                  {
                                                    minimumFractionDigits: 2,
                                                    maximumFractionDigits: 2,
                                                  }
                                                )}
                                              </small>
                                            </td>
                                          </tr>
                                        ))}
                                      </tbody>
                                      <tfoot
                                        className="table-secondary"
                                        style={{
                                          position: "sticky",
                                          bottom: 0,
                                          zIndex: 1,
                                        }}
                                      >
                                        <tr className="fw-bold">
                                          <td className="ps-3">
                                            <i className="bi bi-calculator me-2"></i>
                                            {t("total")}
                                          </td>
                                          <td className="text-center">
                                            <span className="badge bg-dark">
                                              {getDailyRevenue(
                                                filteredOrdersForCharts,
                                                dateRange === "7days"
                                                  ? 7
                                                  : dateRange === "30days"
                                                    ? 30
                                                    : 90
                                              ).reduce(
                                                (sum, day) =>
                                                  sum + (day.orders || 0),
                                                0
                                              )}
                                            </span>
                                          </td>
                                          <td className="text-end pe-3 text-primary">
                                            <small
                                              style={{ fontSize: "0.9rem" }}
                                            >
                                              {getDailyRevenue(
                                                filteredOrdersForCharts,
                                                dateRange === "7days"
                                                  ? 7
                                                  : dateRange === "30days"
                                                    ? 30
                                                    : 90
                                              )
                                                .reduce(
                                                  (sum, day) =>
                                                    sum + day.revenue,
                                                  0
                                                )
                                                .toLocaleString(undefined, {
                                                  minimumFractionDigits: 2,
                                                  maximumFractionDigits: 2,
                                                })}
                                            </small>
                                          </td>
                                        </tr>
                                      </tfoot>
                                    </table>
                                  </div>

                                  {/* Summary Stats */}
                                  <div className="row mt-3 g-2">
                                    <div className="col-md-4">
                                      <div className="card border-primary">
                                        <div className="card-body text-center py-2">
                                          <small className="text-muted d-block">
                                            {t("avg_daily_revenue")}
                                          </small>
                                          <strong className="text-primary">
                                            {(
                                              getDailyRevenue(
                                                filteredOrdersForCharts,
                                                dateRange === "7days"
                                                  ? 7
                                                  : dateRange === "30days"
                                                    ? 30
                                                    : 90
                                              ).reduce(
                                                (sum, day) => sum + day.revenue,
                                                0
                                              ) /
                                              getDailyRevenue(
                                                filteredOrdersForCharts,
                                                dateRange === "7days"
                                                  ? 7
                                                  : dateRange === "30days"
                                                    ? 30
                                                    : 90
                                              ).length
                                            ).toLocaleString(undefined, {
                                              minimumFractionDigits: 2,
                                              maximumFractionDigits: 2,
                                            })}
                                          </strong>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="col-md-4">
                                      <div className="card border-success">
                                        <div className="card-body text-center py-2">
                                          <small className="text-muted d-block">
                                            {t("best_day")}
                                          </small>
                                          <strong className="text-success">
                                            {(() => {
                                              const dailyData = getDailyRevenue(
                                                filteredOrdersForCharts,
                                                dateRange === "7days"
                                                  ? 7
                                                  : dateRange === "30days"
                                                    ? 30
                                                    : 90
                                              );
                                              const bestDay = dailyData.reduce(
                                                (max, day) =>
                                                  day.revenue > max.revenue
                                                    ? day
                                                    : max,
                                                dailyData[0]
                                              );
                                              return bestDay.revenue.toLocaleString(
                                                undefined,
                                                {
                                                  minimumFractionDigits: 2,
                                                  maximumFractionDigits: 2,
                                                }
                                              );
                                            })()}
                                          </strong>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="col-md-4">
                                      <div className="card border-info">
                                        <div className="card-body text-center py-2">
                                          <small className="text-muted d-block">
                                            {t("avg_orders_per_day")}
                                          </small>
                                          <strong className="text-info">
                                            {(
                                              getDailyRevenue(
                                                filteredOrdersForCharts,
                                                dateRange === "7days"
                                                  ? 7
                                                  : dateRange === "30days"
                                                    ? 30
                                                    : 90
                                              ).reduce(
                                                (sum, day) =>
                                                  sum + (day.orders || 0),
                                                0
                                              ) /
                                              getDailyRevenue(
                                                filteredOrdersForCharts,
                                                dateRange === "7days"
                                                  ? 7
                                                  : dateRange === "30days"
                                                    ? 30
                                                    : 90
                                              ).length
                                            ).toFixed(1)}
                                          </strong>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="mt-3 p-3 bg-light rounded">
                                <small className="text-muted">
                                  <i className="bi bi-info-circle me-2"></i>
                                  <strong>{t("analysis")}:</strong>{" "}
                                  {t("daily_revenue_description")}
                                </small>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Monthly Revenue Chart */}
                      <div className="row mb-4">
                        <div className="col-12">
                          <div className="card">
                            <div className="card-body">
                              <div className="d-flex justify-content-between align-items-center mb-3">
                                <TbReportAnalytics size={24} className="me-2" />
                                <h5>{t("monthly_revenue")}</h5>
                                <span
                                  className="badge bg-secondary"
                                  style={{
                                    fontSize: "1rem",
                                    padding: "0.5rem 1rem",
                                  }}
                                >
                                  {filterYear === "all"
                                    ? t("all_years")
                                    : filterYear}
                                </span>
                              </div>
                              <div className="chart-container">
                                <ResponsiveContainer>
                                  <BarChart
                                    data={getMonthlyRevenue(
                                      filteredOrdersForCharts,
                                      filterYear === "all"
                                        ? new Date().getFullYear()
                                        : parseInt(filterYear, 10)
                                    )}
                                    margin={{
                                      top: 10,
                                      right: 10,
                                      left: 0,
                                      bottom: 0,
                                    }}
                                  >
                                    <XAxis dataKey="month" />
                                    <YAxis />
                                    <Tooltip
                                      formatter={(value) => [
                                        value.toLocaleString(undefined, {
                                          minimumFractionDigits: 2,
                                          maximumFractionDigits: 2,
                                        }),
                                        currentLanguage === "mk"
                                          ? "Приход"
                                          : "Revenue",
                                      ]}
                                    />
                                    <Bar dataKey="revenue" fill="#00C49F" />
                                  </BarChart>
                                </ResponsiveContainer>

                                {/* Monthly Revenue Table */}
                                <div className="mt-4">
                                  <div className="d-flex justify-content-between align-items-center mb-3">
                                    <h6 className="mb-0">
                                      <i className="bi bi-table me-2 text-success"></i>
                                      {t("detailed_monthly_breakdown")}
                                    </h6>
                                    <span className="badge bg-success">
                                      {
                                        getMonthlyRevenue(
                                          filteredOrdersForCharts,
                                          filterYear === "all"
                                            ? new Date().getFullYear()
                                            : parseInt(filterYear, 10)
                                        ).length
                                      }{" "}
                                      {t("months")}
                                    </span>
                                  </div>

                                  <div
                                    className="table-responsive"
                                    style={{
                                      maxHeight: "300px",
                                      overflowY: "auto",
                                      border: "1px solid #dee2e6",
                                      borderRadius: "8px",
                                      position: "relative",
                                    }}
                                  >
                                    <table className="table table-hover table-striped mb-0">
                                      <thead
                                        className="table-success"
                                        style={{
                                          position: "sticky",
                                          top: 0,
                                          zIndex: 1,
                                        }}
                                      >
                                        <tr>
                                          <th
                                            className="ps-3"
                                            style={{ minWidth: "150px" }}
                                          >
                                            <i className="bi bi-calendar3 me-2"></i>
                                            {t("month")}
                                          </th>
                                          <th
                                            className="text-center"
                                            style={{ minWidth: "100px" }}
                                          >
                                            <i className="bi bi-cart-check me-2"></i>
                                            {t("orders")}
                                          </th>
                                          <th
                                            className="text-end"
                                            style={{ minWidth: "140px" }}
                                          >
                                            <i className="bi bi-currency-exchange me-2"></i>
                                            {t("revenue")}
                                          </th>
                                          <th
                                            className="text-end pe-3"
                                            style={{ minWidth: "140px" }}
                                          >
                                            <i className="bi bi-graph-up me-2"></i>
                                            {t("avg_per_day")}
                                          </th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {getMonthlyRevenue(
                                          filteredOrdersForCharts,
                                          filterYear === "all"
                                            ? new Date().getFullYear()
                                            : parseInt(filterYear, 10)
                                        ).map((month, index) => (
                                          <tr
                                            key={index}
                                            className="align-middle"
                                          >
                                            <td className="ps-3">
                                              <div className="d-flex align-items-center">
                                                <span
                                                  className="badge bg-secondary me-2"
                                                  style={{ minWidth: "30px" }}
                                                >
                                                  {index + 1}
                                                </span>
                                                <small className="text-dark">
                                                  {month.month}
                                                </small>
                                              </div>
                                            </td>
                                            <td className="text-center">
                                              <span className="badge bg-info text-dark">
                                                <small>
                                                  {month.orders || 0}
                                                </small>
                                              </span>
                                            </td>
                                            <td className="text-end">
                                              <small className="text-success">
                                                {month.revenue.toLocaleString(
                                                  undefined,
                                                  {
                                                    minimumFractionDigits: 2,
                                                    maximumFractionDigits: 2,
                                                  }
                                                )}
                                              </small>
                                            </td>
                                            <td className="text-end pe-3 text-muted">
                                              <small>
                                                {(
                                                  month.revenue / 30
                                                ).toLocaleString(undefined, {
                                                  minimumFractionDigits: 2,
                                                  maximumFractionDigits: 2,
                                                })}
                                              </small>
                                            </td>
                                          </tr>
                                        ))}
                                      </tbody>
                                      <tfoot
                                        className="table-secondary"
                                        style={{
                                          position: "sticky",
                                          bottom: 0,
                                          zIndex: 1,
                                        }}
                                      >
                                        <tr className="fw-bold">
                                          <td className="ps-3">
                                            <i className="bi bi-calculator me-2"></i>
                                            {t("total")}
                                          </td>
                                          <td className="text-center">
                                            <span className="badge bg-dark">
                                              {getMonthlyRevenue(
                                                filteredOrdersForCharts,
                                                filterYear === "all"
                                                  ? new Date().getFullYear()
                                                  : parseInt(filterYear, 10)
                                              ).reduce(
                                                (sum, month) =>
                                                  sum + (month.orders || 0),
                                                0
                                              )}
                                            </span>
                                          </td>
                                          <td className="text-end text-primary">
                                            <strong
                                              style={{ fontSize: "1rem" }}
                                            >
                                              {getMonthlyRevenue(
                                                filteredOrdersForCharts,
                                                filterYear === "all"
                                                  ? new Date().getFullYear()
                                                  : parseInt(filterYear, 10)
                                              )
                                                .reduce(
                                                  (sum, month) =>
                                                    sum + month.revenue,
                                                  0
                                                )
                                                .toLocaleString(undefined, {
                                                  minimumFractionDigits: 2,
                                                  maximumFractionDigits: 2,
                                                })}
                                            </strong>
                                          </td>
                                          <td className="text-end pe-3 text-primary">
                                            <strong>
                                              {(
                                                getMonthlyRevenue(
                                                  filteredOrdersForCharts,
                                                  filterYear === "all"
                                                    ? new Date().getFullYear()
                                                    : parseInt(filterYear, 10)
                                                ).reduce(
                                                  (sum, month) =>
                                                    sum + month.revenue,
                                                  0
                                                ) / 365
                                              ).toLocaleString(undefined, {
                                                minimumFractionDigits: 2,
                                                maximumFractionDigits: 2,
                                              })}
                                            </strong>
                                          </td>
                                        </tr>
                                      </tfoot>
                                    </table>
                                  </div>

                                  {/* Summary Stats */}
                                  <div className="row mt-3 g-2">
                                    <div className="col-md-3">
                                      <div className="card border-success">
                                        <div className="card-body text-center py-2">
                                          <small className="text-muted d-block">
                                            {t("avg_monthly_revenue")}
                                          </small>
                                          <strong className="text-success">
                                            {(
                                              getMonthlyRevenue(
                                                filteredOrdersForCharts,
                                                filterYear === "all"
                                                  ? new Date().getFullYear()
                                                  : parseInt(filterYear, 10)
                                              ).reduce(
                                                (sum, month) =>
                                                  sum + month.revenue,
                                                0
                                              ) /
                                              getMonthlyRevenue(
                                                filteredOrdersForCharts,
                                                filterYear === "all"
                                                  ? new Date().getFullYear()
                                                  : parseInt(filterYear, 10)
                                              ).length
                                            ).toLocaleString(undefined, {
                                              minimumFractionDigits: 2,
                                              maximumFractionDigits: 2,
                                            })}
                                          </strong>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="col-md-3">
                                      <div className="card border-primary">
                                        <div className="card-body text-center py-2">
                                          <small className="text-muted d-block">
                                            {t("best_month")}
                                          </small>
                                          <strong className="text-primary">
                                            {(() => {
                                              const monthlyData =
                                                getMonthlyRevenue(
                                                  filteredOrdersForCharts,
                                                  filterYear === "all"
                                                    ? new Date().getFullYear()
                                                    : parseInt(filterYear, 10)
                                                );
                                              const bestMonth =
                                                monthlyData.reduce(
                                                  (max, month) =>
                                                    month.revenue > max.revenue
                                                      ? month
                                                      : max,
                                                  monthlyData[0]
                                                );
                                              return bestMonth.month;
                                            })()}
                                          </strong>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="col-md-3">
                                      <div className="card border-warning">
                                        <div className="card-body text-center py-2">
                                          <small className="text-muted d-block">
                                            {t("total_orders_year")}
                                          </small>
                                          <strong className="text-warning">
                                            {getMonthlyRevenue(
                                              filteredOrdersForCharts,
                                              filterYear === "all"
                                                ? new Date().getFullYear()
                                                : parseInt(filterYear, 10)
                                            ).reduce(
                                              (sum, month) =>
                                                sum + (month.orders || 0),
                                              0
                                            )}
                                          </strong>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="col-md-3">
                                      <div className="card border-info">
                                        <div className="card-body text-center py-2">
                                          <small className="text-muted d-block">
                                            {t("avg_monthly_orders")}
                                          </small>
                                          <strong className="text-info">
                                            {(
                                              getMonthlyRevenue(
                                                filteredOrdersForCharts,
                                                filterYear === "all"
                                                  ? new Date().getFullYear()
                                                  : parseInt(filterYear, 10)
                                              ).reduce(
                                                (sum, month) =>
                                                  sum + (month.orders || 0),
                                                0
                                              ) /
                                              getMonthlyRevenue(
                                                filteredOrdersForCharts,
                                                filterYear === "all"
                                                  ? new Date().getFullYear()
                                                  : parseInt(filterYear, 10)
                                              ).length
                                            ).toFixed(1)}
                                          </strong>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="mt-3 p-3 bg-light rounded">
                                <small className="text-muted">
                                  <i className="bi bi-info-circle me-2"></i>
                                  <strong>{t("analysis")}:</strong>{" "}
                                  {t("monthly_revenue_description")}
                                </small>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Yearly Comparison */}
                      {getYearlyRevenue(orders).length > 1 && (
                        <div className="row mb-4">
                          <div className="col-12">
                            <div className="card">
                              <div className="card-body">
                                <h5 className="mb-3">
                                  <TbReportAnalytics
                                    size={24}
                                    className="me-2"
                                  />
                                  {t("yearly_comparison")}
                                </h5>
                                <div className="chart-container">
                                  <ResponsiveContainer>
                                    <BarChart
                                      data={getYearlyRevenue(orders)}
                                      margin={{
                                        top: 10,
                                        right: 10,
                                        left: 0,
                                        bottom: 0,
                                      }}
                                    >
                                      <XAxis dataKey="year" />
                                      <YAxis />
                                      <Tooltip
                                        formatter={(value) => [
                                          value.toLocaleString(undefined, {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2,
                                          }),
                                          currentLanguage === "mk"
                                            ? "Приход"
                                            : "Revenue",
                                        ]}
                                      />
                                      <Bar dataKey="revenue" fill="#FFBB28" />
                                    </BarChart>
                                  </ResponsiveContainer>
                                </div>
                                {/* Yearly Comparison Table */}
                                <div className="mt-4">
                                  <div className="d-flex justify-content-between align-items-center mb-3">
                                    <h6 className="mb-0">
                                      <i className="bi bi-table me-2 text-warning"></i>
                                      {t("detailed_yearly_breakdown")}
                                    </h6>
                                    <span className="badge bg-warning text-dark">
                                      {getYearlyRevenue(orders).length}{" "}
                                      {t("years")}
                                    </span>
                                  </div>

                                  <div
                                    className="table-responsive"
                                    style={{
                                      maxHeight: "300px",
                                      overflowY: "auto",
                                      border: "1px solid #dee2e6",
                                      borderRadius: "8px",
                                      position: "relative",
                                    }}
                                  >
                                    <table className="table table-hover table-striped mb-0">
                                      <thead
                                        className="table-warning"
                                        style={{
                                          position: "sticky",
                                          top: 0,
                                          zIndex: 1,
                                        }}
                                      >
                                        <tr>
                                          <th
                                            className="ps-3"
                                            style={{ minWidth: "100px" }}
                                          >
                                            <i className="bi bi-calendar4-week me-2"></i>
                                            {t("year")}
                                          </th>
                                          <th
                                            className="text-center"
                                            style={{ minWidth: "100px" }}
                                          >
                                            <i className="bi bi-cart-check me-2"></i>
                                            {t("orders")}
                                          </th>
                                          <th
                                            className="text-end"
                                            style={{ minWidth: "140px" }}
                                          >
                                            <i className="bi bi-currency-exchange me-2"></i>
                                            {t("revenue")}
                                          </th>
                                          <th
                                            className="text-end"
                                            style={{ minWidth: "120px" }}
                                          >
                                            <i className="bi bi-graph-up-arrow me-2"></i>
                                            {t("growth")}
                                          </th>
                                          <th
                                            className="text-end pe-3"
                                            style={{ minWidth: "140px" }}
                                          >
                                            <i className="bi bi-calculator me-2"></i>
                                            {t("avg_monthly")}
                                          </th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {getYearlyRevenue(orders).map(
                                          (year, index) => {
                                            const previousYear =
                                              index > 0
                                                ? getYearlyRevenue(orders)[
                                                    index - 1
                                                  ]
                                                : null;
                                            const growth = previousYear
                                              ? (
                                                  ((year.revenue -
                                                    previousYear.revenue) /
                                                    previousYear.revenue) *
                                                  100
                                                ).toFixed(1)
                                              : 0;

                                            return (
                                              <tr
                                                key={index}
                                                className="align-middle"
                                              >
                                                <td className="ps-3">
                                                  <div className="d-flex align-items-center">
                                                    <span
                                                      className="badge bg-secondary me-2"
                                                      style={{
                                                        minWidth: "30px",
                                                      }}
                                                    >
                                                      {index + 1}
                                                    </span>
                                                    <small className="text-dark">
                                                      {year.year}
                                                    </small>
                                                  </div>
                                                </td>
                                                <td className="text-center">
                                                  <span className="badge bg-info text-dark">
                                                    <small>
                                                      {year.orders || 0}
                                                    </small>
                                                  </span>
                                                </td>
                                                <td className="text-end">
                                                  <small className="text-warning">
                                                    {year.revenue.toLocaleString(
                                                      undefined,
                                                      {
                                                        minimumFractionDigits: 2,
                                                        maximumFractionDigits: 2,
                                                      }
                                                    )}
                                                  </small>
                                                </td>
                                                <td className="text-end">
                                                  <small>
                                                    {index > 0 ? (
                                                      <span
                                                        className={`badge ${growth >= 0 ? "bg-success" : "bg-danger"}`}
                                                      >
                                                        {growth >= 0
                                                          ? "↑"
                                                          : "↓"}{" "}
                                                        {Math.abs(growth)}%
                                                      </span>
                                                    ) : (
                                                      <span className="badge bg-secondary">
                                                        -
                                                      </span>
                                                    )}
                                                  </small>
                                                </td>
                                                <td className="text-end pe-3 text-muted">
                                                  <small>
                                                    {(
                                                      year.revenue / 12
                                                    ).toLocaleString(
                                                      undefined,
                                                      {
                                                        minimumFractionDigits: 2,
                                                        maximumFractionDigits: 2,
                                                      }
                                                    )}
                                                  </small>
                                                </td>
                                              </tr>
                                            );
                                          }
                                        )}
                                      </tbody>
                                      <tfoot
                                        className="table-secondary"
                                        style={{
                                          position: "sticky",
                                          bottom: 0,
                                          zIndex: 1,
                                        }}
                                      >
                                        <tr className="fw-bold">
                                          <td className="ps-3">
                                            <i className="bi bi-calculator me-2"></i>
                                            {t("total")}
                                          </td>
                                          <td className="text-center">
                                            <span className="badge bg-dark">
                                              {getYearlyRevenue(orders).reduce(
                                                (sum, year) =>
                                                  sum + (year.orders || 0),
                                                0
                                              )}
                                            </span>
                                          </td>
                                          <td className="text-end text-primary">
                                            <strong
                                              style={{ fontSize: "1rem" }}
                                            >
                                              {getYearlyRevenue(orders)
                                                .reduce(
                                                  (sum, year) =>
                                                    sum + year.revenue,
                                                  0
                                                )
                                                .toLocaleString(undefined, {
                                                  minimumFractionDigits: 2,
                                                  maximumFractionDigits: 2,
                                                })}
                                            </strong>
                                          </td>
                                          <td className="text-end">
                                            {(() => {
                                              const years =
                                                getYearlyRevenue(orders);
                                              if (years.length > 1) {
                                                const firstYear = years[0];
                                                const lastYear =
                                                  years[years.length - 1];
                                                const totalGrowth = (
                                                  ((lastYear.revenue -
                                                    firstYear.revenue) /
                                                    firstYear.revenue) *
                                                  100
                                                ).toFixed(1);
                                                return (
                                                  <span
                                                    className={`badge ${totalGrowth >= 0 ? "bg-success" : "bg-danger"}`}
                                                  >
                                                    {totalGrowth >= 0
                                                      ? "↑"
                                                      : "↓"}{" "}
                                                    {Math.abs(totalGrowth)}%
                                                  </span>
                                                );
                                              }
                                              return (
                                                <span className="badge bg-secondary">
                                                  -
                                                </span>
                                              );
                                            })()}
                                          </td>
                                          <td className="text-end pe-3 text-primary">
                                            <strong>
                                              {(
                                                getYearlyRevenue(orders).reduce(
                                                  (sum, year) =>
                                                    sum + year.revenue,
                                                  0
                                                ) /
                                                (getYearlyRevenue(orders)
                                                  .length *
                                                  12)
                                              ).toLocaleString(undefined, {
                                                minimumFractionDigits: 2,
                                                maximumFractionDigits: 2,
                                              })}
                                            </strong>
                                          </td>
                                        </tr>
                                      </tfoot>
                                    </table>
                                  </div>

                                  {/* Summary Stats */}
                                  <div className="row mt-3 g-2">
                                    <div className="col-md-3">
                                      <div className="card border-warning">
                                        <div className="card-body text-center py-2">
                                          <small className="text-muted d-block">
                                            {t("total_years")}
                                          </small>
                                          <strong
                                            className="text-warning"
                                            style={{ fontSize: "1.1rem" }}
                                          >
                                            {getYearlyRevenue(orders).length}
                                          </strong>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="col-md-3">
                                      <div className="card border-success">
                                        <div className="card-body text-center py-2">
                                          <small className="text-muted d-block">
                                            {t("best_year")}
                                          </small>
                                          <strong className="text-success">
                                            {(() => {
                                              const yearlyData =
                                                getYearlyRevenue(orders);
                                              const bestYear =
                                                yearlyData.reduce(
                                                  (max, year) =>
                                                    year.revenue > max.revenue
                                                      ? year
                                                      : max,
                                                  yearlyData[0]
                                                );
                                              return bestYear.year;
                                            })()}
                                          </strong>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="col-md-3">
                                      <div className="card border-primary">
                                        <div className="card-body text-center py-2">
                                          <small className="text-muted d-block">
                                            {t("avg_yearly_revenue")}
                                          </small>
                                          <small className="text-primary">
                                            {(
                                              getYearlyRevenue(orders).reduce(
                                                (sum, year) =>
                                                  sum + year.revenue,
                                                0
                                              ) /
                                              getYearlyRevenue(orders).length
                                            ).toLocaleString(undefined, {
                                              minimumFractionDigits: 0,
                                              maximumFractionDigits: 0,
                                            })}
                                          </small>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="col-md-3">
                                      <div className="card border-info">
                                        <div className="card-body text-center py-2">
                                          <small className="text-muted d-block">
                                            {t("overall_growth")}
                                          </small>
                                          <strong className="text-info">
                                            {(() => {
                                              const years =
                                                getYearlyRevenue(orders);
                                              if (years.length > 1) {
                                                const firstYear = years[0];
                                                const lastYear =
                                                  years[years.length - 1];
                                                const totalGrowth = (
                                                  ((lastYear.revenue -
                                                    firstYear.revenue) /
                                                    firstYear.revenue) *
                                                  100
                                                ).toFixed(1);
                                                return `${totalGrowth >= 0 ? "+" : ""}${totalGrowth}%`;
                                              }
                                              return "-";
                                            })()}
                                          </strong>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="mt-3 p-3 bg-light rounded">
                                  <small className="text-muted">
                                    <i className="bi bi-info-circle me-2"></i>
                                    <strong>{t("analysis")}:</strong>{" "}
                                    {t("yearly_comparison_description")}
                                  </small>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="row">
                        <div className="col-12 col-md-6 mb-4">
                          <div className="card">
                            <div className="card-body">
                              <h5 className="mb-3">
                                <TbReportAnalytics size={24} className="me-2" />
                                {t("revenue_by_payment_method")}
                              </h5>
                              <div className="chart-container">
                                <ResponsiveContainer>
                                  <PieChart>
                                    <Pie
                                      data={formattedPaymentData}
                                      dataKey="value"
                                      nameKey="name"
                                      cx="50%"
                                      cy="50%"
                                      outerRadius="80%"
                                      label={(entry) =>
                                        `${entry.name} (${entry.value.toLocaleString(
                                          undefined,
                                          {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2,
                                          }
                                        )})`
                                      }
                                    >
                                      {formattedPaymentData.map(
                                        (entry, index) => (
                                          <Cell
                                            key={index}
                                            fill={COLORS[index % COLORS.length]}
                                          />
                                        )
                                      )}
                                    </Pie>
                                    <Tooltip
                                      formatter={(value) =>
                                        value.toLocaleString(undefined, {
                                          minimumFractionDigits: 2,
                                          maximumFractionDigits: 2,
                                        })
                                      }
                                    />
                                  </PieChart>
                                </ResponsiveContainer>
                              </div>
                              <div className="mt-3">
                                <table className="table table-sm">
                                  <thead>
                                    <tr>
                                      <th>{t("payment_method")}</th>
                                      <th className="text-end">
                                        {t("amount")}
                                      </th>
                                      <th className="text-end">%</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {formattedPaymentData.map(
                                      (entry, index) => (
                                        <tr key={index}>
                                          <td>
                                            <span
                                              className="badge me-2"
                                              style={{
                                                backgroundColor:
                                                  COLORS[index % COLORS.length],
                                                width: "12px",
                                                height: "12px",
                                                display: "inline-block",
                                              }}
                                            ></span>
                                            {entry.name}
                                          </td>
                                          <td className="text-end">
                                            {entry.value.toLocaleString(
                                              undefined,
                                              {
                                                minimumFractionDigits: 2,
                                                maximumFractionDigits: 2,
                                              }
                                            )}
                                          </td>
                                          <td className="text-end">
                                            {(
                                              (entry.value /
                                                grandTotalInDisplayCurrency) *
                                              100
                                            ).toFixed(1)}
                                            %
                                          </td>
                                        </tr>
                                      )
                                    )}
                                  </tbody>
                                </table>
                              </div>
                              <div className="mt-3 p-3 bg-light rounded">
                                <small className="text-muted">
                                  <i className="bi bi-info-circle me-2"></i>
                                  <strong>{t("analysis")}:</strong>{" "}
                                  {t("revenue_by_payment_method_description")}
                                </small>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="col-12 col-md-6 mb-4">
                          <div className="card">
                            <div className="card-body">
                              <h5 className="mb-3">
                                <TbReportAnalytics size={24} className="me-2" />
                                {t("revenue_by_status")}
                              </h5>
                              <div className="chart-container">
                                <ResponsiveContainer>
                                  <BarChart
                                    data={statusData(orders, filterYear).map(
                                      (entry) => {
                                        let status = entry.status;
                                        if (status === "pending")
                                          status =
                                            currentLanguage === "mk"
                                              ? "Во тек"
                                              : "Pending";
                                        else if (status === "confirmed")
                                          status =
                                            currentLanguage === "mk"
                                              ? "Потврдено"
                                              : "Confirmed";
                                        else if (status === "cancelled")
                                          status =
                                            currentLanguage === "mk"
                                              ? "Откажано"
                                              : "Cancelled";

                                        return {
                                          status,
                                          Total:
                                            currentLanguage === "mk"
                                              ? entry.mkd
                                              : entry.eng,
                                        };
                                      }
                                    )}
                                    margin={{
                                      top: 10,
                                      right: 10,
                                      left: 0,
                                      bottom: 0,
                                    }}
                                  >
                                    <XAxis dataKey="status" />
                                    <YAxis />
                                    <Tooltip
                                      formatter={(value) => [
                                        value.toLocaleString(undefined, {
                                          minimumFractionDigits: 2,
                                          maximumFractionDigits: 2,
                                        }),
                                        currentLanguage === "mk"
                                          ? "Вкупно"
                                          : "Total",
                                      ]}
                                    />
                                    <Bar dataKey="Total">
                                      {statusData(orders, filterYear).map(
                                        (entry, index) => (
                                          <Cell
                                            key={index}
                                            fill={COLORS[index % COLORS.length]}
                                          />
                                        )
                                      )}
                                    </Bar>
                                  </BarChart>
                                </ResponsiveContainer>
                              </div>
                              <div className="mt-3">
                                <table className="table table-sm">
                                  <thead>
                                    <tr>
                                      <th>{t("status")}</th>
                                      <th className="text-end">{t("count")}</th>
                                      <th className="text-end">
                                        {t("revenue")}
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {statusData(orders, filterYear).map(
                                      (entry, index) => {
                                        let statusLabel = entry.status;
                                        if (statusLabel === "pending")
                                          statusLabel =
                                            currentLanguage === "mk"
                                              ? "Во тек"
                                              : "Pending";
                                        else if (statusLabel === "confirmed")
                                          statusLabel =
                                            currentLanguage === "mk"
                                              ? "Потврдено"
                                              : "Confirmed";
                                        else if (statusLabel === "cancelled")
                                          statusLabel =
                                            currentLanguage === "mk"
                                              ? "Откажано"
                                              : "Cancelled";

                                        return (
                                          <tr key={index}>
                                            <td>
                                              <span
                                                className="badge me-2"
                                                style={{
                                                  backgroundColor:
                                                    COLORS[
                                                      index % COLORS.length
                                                    ],
                                                  width: "12px",
                                                  height: "12px",
                                                  display: "inline-block",
                                                }}
                                              ></span>
                                              {statusLabel}
                                            </td>
                                            <td className="text-end">
                                              {entry.count}
                                            </td>
                                            <td className="text-end">
                                              {(currentLanguage === "mk"
                                                ? entry.mkd
                                                : entry.eng
                                              ).toLocaleString(undefined, {
                                                minimumFractionDigits: 2,
                                                maximumFractionDigits: 2,
                                              })}
                                            </td>
                                          </tr>
                                        );
                                      }
                                    )}
                                  </tbody>
                                </table>
                              </div>
                              <div className="mt-3 p-3 bg-light rounded">
                                <small className="text-muted">
                                  <i className="bi bi-info-circle me-2"></i>
                                  <strong>{t("analysis")}:</strong>{" "}
                                  {t("revenue_by_status_description")}
                                </small>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Top Services */}
                      <div className="row mb-4">
                        <div className="col-12">
                          <div className="card">
                            <div className="card-body">
                              <h5 className="mb-3">{t("top_products")}</h5>
                              {getTopProducts(orders, 5, filterYear).length >
                              0 ? (
                                <>
                                  <div className="table-responsive">
                                    <table className="table table-hover">
                                      <thead className="table-light">
                                        <tr>
                                          <th>#</th>
                                          <th>{t("product_name")}</th>
                                          <th className="text-center">
                                            {t("quantity_sold")}
                                          </th>
                                          <th className="text-end">
                                            {t("revenue")}
                                          </th>
                                          <th className="text-end">
                                            {t("avg_price")}
                                          </th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {getTopProducts(
                                          orders,
                                          5,
                                          filterYear
                                        ).map((product, index) => (
                                          <tr key={index}>
                                            <td>
                                              <span className="badge bg-primary">
                                                {index + 1}
                                              </span>
                                            </td>
                                            <td>
                                              <small>{product.name}</small>
                                            </td>
                                            <td className="text-center">
                                              <small>{product.count}</small>
                                            </td>
                                            <td className="text-end">
                                              <small>
                                                {formatTotal(
                                                  product.revenue,
                                                  currentLanguage
                                                )}
                                              </small>
                                            </td>
                                            <td className="text-end text-muted">
                                              <small>
                                                {formatTotal(
                                                  product.revenue /
                                                    product.count,
                                                  currentLanguage
                                                )}
                                              </small>
                                            </td>
                                          </tr>
                                        ))}
                                      </tbody>
                                    </table>
                                  </div>
                                  <div className="mt-3 p-3 bg-light rounded">
                                    <small className="text-muted">
                                      <i className="bi bi-info-circle me-2"></i>
                                      <strong>{t("analysis")}:</strong>{" "}
                                      {t("top_products_description")}
                                    </small>
                                  </div>
                                </>
                              ) : (
                                <p className="text-muted">
                                  {t("no_products_found")}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </Tab.Pane>
              <Tab.Pane eventKey="download">
                <div className="my-account-area__content">
                  <h3 className="mb-4">{t("download")}</h3>

                  {orders.length === 0 ? (
                    <div className="card">
                      <div className="card-body text-center">
                        <p className="text-muted mb-0">
                          {t("you_have_not_downloaded_any_file_yet")}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="card">
                      <div className="card-body">
                        <div className="table-responsive">
                          <table className="table table-hover align-middle">
                            <thead className="table-light">
                              <tr>
                                {role === "admin" && (
                                  <th>
                                    <small>{t("user")}</small>
                                  </th>
                                )}
                                <th>
                                  <small>{t("order")}</small>
                                </th>
                                <th>
                                  <small>{t("date")}</small>
                                </th>
                                <th>
                                  <small>{t("payment_method")}</small>
                                </th>
                                <th className="text-center">
                                  <small>{t("download")}</small>
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {currentOrdersDown.map((order) => (
                                <tr key={order.id}>
                                  {role === "admin" && (
                                    <td style={{ minWidth: "140px" }}>
                                      <small>{order.displayName}</small>
                                    </td>
                                  )}
                                  <td>
                                    <span className="badge bg-light text-dark border">
                                      <small>{order.orderNumber}</small>
                                    </span>
                                  </td>
                                  <td style={{ minWidth: "100px" }}>
                                    <small>{order.date}</small>
                                  </td>
                                  <td>
                                    <span className="badge bg-light text-dark border">
                                      <small>
                                        {order.paymentMethod === "payment_cash"
                                          ? t("payment_cash")
                                          : t("payment_bank")}
                                      </small>
                                    </span>
                                  </td>
                                  <td className="text-center">
                                    <button
                                      className="btn btn-sm btn-outline-primary rounded-pill d-flex justify-content-center align-items-center mx-auto"
                                      onClick={() => downloadPdf(order)}
                                      disabled={downloadingOrderId === order.id}
                                      style={{ minWidth: "100px" }}
                                    >
                                      {downloadingOrderId === order.id ? (
                                        <div className="d-flex justify-content-center align-items-center w-100">
                                          <Spinner
                                            as="span"
                                            animation="border"
                                            size="sm"
                                            role="status"
                                            aria-hidden="true"
                                          />
                                        </div>
                                      ) : (
                                        <>
                                          <i className="bi bi-download me-1"></i>
                                          <small>{t("download")}</small>
                                        </>
                                      )}
                                    </button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                        {totalPagesDown > 1 && (
                          <div className="d-flex justify-content-between align-items-center mt-3 flex-wrap gap-3">
                            <div className="text-muted">
                              <small>
                                {t("showing")} {currentOrdersDown.length}{" "}
                                {t("of")} {orders.length} {t("orders")}
                              </small>
                            </div>

                            <nav>
                              <ul className="pagination mb-0">
                                <li
                                  className={`page-item ${currentPageDown === 1 ? "disabled" : ""}`}
                                >
                                  <button
                                    type="button"
                                    className="page-link py-1 px-2"
                                    onClick={() =>
                                      handlePageChangeDown(currentPageDown - 1)
                                    }
                                    disabled={currentPageDown === 1}
                                    aria-label="Previous"
                                  >
                                    {t("previous")}
                                  </button>
                                </li>

                                {[...Array(totalPagesDown)].map((_, index) => {
                                  const pageNumber = index + 1;

                                  if (
                                    pageNumber === 1 ||
                                    pageNumber === totalPagesDown ||
                                    (pageNumber >= currentPageDown - 1 &&
                                      pageNumber <= currentPageDown + 1)
                                  ) {
                                    return (
                                      <li
                                        key={pageNumber}
                                        className={`page-item ${
                                          currentPageDown === pageNumber
                                            ? "active"
                                            : ""
                                        }`}
                                      >
                                        <button
                                          type="button"
                                          className="page-link py-1 px-2"
                                          onClick={() =>
                                            handlePageChangeDown(pageNumber)
                                          }
                                        >
                                          {pageNumber}
                                        </button>
                                      </li>
                                    );
                                  } else if (
                                    pageNumber === currentPageDown - 2 ||
                                    pageNumber === currentPageDown + 2
                                  ) {
                                    return (
                                      <li
                                        key={`ellipsis-${pageNumber}`}
                                        className="page-item disabled"
                                      >
                                        <span className="page-link py-1 px-2">
                                          ...
                                        </span>
                                      </li>
                                    );
                                  }
                                  return null;
                                })}

                                <li
                                  className={`page-item ${currentPageDown === totalPagesDown ? "disabled" : ""}`}
                                >
                                  <button
                                    type="button"
                                    className="page-link py-1 px-2"
                                    onClick={() =>
                                      handlePageChangeDown(currentPageDown + 1)
                                    }
                                    disabled={
                                      currentPageDown === totalPagesDown
                                    }
                                    aria-label="Next"
                                  >
                                    {t("next")}
                                  </button>
                                </li>
                              </ul>
                            </nav>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </Tab.Pane>

              <Tab.Pane eventKey="payment">
                <div className="my-account-area__content">
                  <h3>{t("payment_method")}</h3>

                  {orders.length > 0 ? (
                    <div className="myaccount-table table-responsive text-center">
                      <table className="table table-bordered">
                        <thead className="thead-light">
                          <tr>
                            <th>{t("order")}</th>
                            <th>{t("payment_method")}</th>
                          </tr>
                        </thead>
                        <tbody>
                          {currentOrdersPayment.map((order, index) => (
                            <tr key={index}>
                              <td>{order.orderNumber}</td>
                              <td>{t(order.paymentMethod)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="saved-message">{t("no_payment_saved")}</p>
                  )}

                  {totalPagesPayment > 1 && (
                    <div className="d-flex justify-content-between align-items-center mt-3 flex-wrap gap-3">
                      <span className="text-muted small">
                        {t("showing")} {currentOrdersPayment.length} {t("of")}{" "}
                        {orders.length} {t("orders")}
                      </span>

                      <nav>
                        <ul className="pagination mb-0">
                          {/* Previous button */}
                          <li
                            className={`page-item ${currentPagePayment === 1 ? "disabled" : ""}`}
                          >
                            <button
                              type="button"
                              className="page-link py-1 px-2"
                              onClick={() =>
                                handlePageChangePayment(currentPagePayment - 1)
                              }
                              disabled={currentPagePayment === 1}
                            >
                              {t("previous")}
                            </button>
                          </li>

                          {/* Page numbers + ellipses */}
                          {[...Array(totalPagesPayment)].map((_, index) => {
                            const pageNumber = index + 1;

                            if (
                              pageNumber === 1 ||
                              pageNumber === totalPagesPayment ||
                              (pageNumber >= currentPagePayment - 1 &&
                                pageNumber <= currentPagePayment + 1)
                            ) {
                              return (
                                <li
                                  key={pageNumber}
                                  className={`page-item ${
                                    currentPagePayment === pageNumber
                                      ? "active"
                                      : ""
                                  }`}
                                >
                                  <button
                                    type="button"
                                    className="page-link py-1 px-2"
                                    onClick={() =>
                                      handlePageChangePayment(pageNumber)
                                    }
                                  >
                                    {pageNumber}
                                  </button>
                                </li>
                              );
                            } else if (
                              pageNumber === currentPagePayment - 2 ||
                              pageNumber === currentPagePayment + 2
                            ) {
                              return (
                                <li
                                  key={`ellipsis-${pageNumber}`}
                                  className="page-item disabled"
                                >
                                  <span className="page-link py-1 px-2">
                                    ...
                                  </span>
                                </li>
                              );
                            }

                            return null;
                          })}

                          {/* Next button */}
                          <li
                            className={`page-item ${
                              currentPagePayment === totalPagesPayment
                                ? "disabled"
                                : ""
                            }`}
                          >
                            <button
                              type="button"
                              className="page-link py-1 px-2"
                              onClick={() =>
                                handlePageChangePayment(currentPagePayment + 1)
                              }
                              disabled={
                                currentPagePayment === totalPagesPayment
                              }
                            >
                              {t("next")}
                            </button>
                          </li>
                        </ul>
                      </nav>
                    </div>
                  )}
                </div>
              </Tab.Pane>

              <Tab.Pane eventKey="accountDetails">
                <div className="my-account-area__content">
                  <h3>{t("account_details")}</h3>
                  <div className="account-details-form">
                    <form onSubmit={handleSave}>
                      <Row>
                        <Col lg={6}>
                          <div className="single-input-item">
                            <label htmlFor="first-name" className="required">
                              {t("first_name")}
                            </label>
                            <input
                              type="text"
                              id="first-name"
                              value={firstName}
                              onChange={(e) => setFirstName(e.target.value)}
                            />
                          </div>
                        </Col>
                        <Col lg={6}>
                          <div className="single-input-item">
                            <label htmlFor="last-name" className="required">
                              {t("last_name")}
                            </label>
                            <input
                              type="text"
                              id="last-name"
                              value={lastName}
                              onChange={(e) => setLastName(e.target.value)}
                            />
                          </div>
                        </Col>
                      </Row>
                      <div className="single-input-item">
                        <label htmlFor="display-name" className="required">
                          {t("display_name")}
                        </label>
                        <input
                          type="text"
                          id="display-name"
                          value={displayName}
                          onChange={(e) => setDisplayName(e.target.value)}
                        />
                      </div>
                      <div className="single-input-item">
                        <label htmlFor="email" className="required">
                          {t("email_address")}
                        </label>
                        <input type="email" id="email" value={email} readOnly />
                      </div>
                      <div className="my-account-area__content">
                        <h3>{t("billing_address")}</h3>
                        <div className="account-details-form">
                          <Row>
                            <Col lg={6}>
                              <div className="single-input-item">
                                <label className="required">
                                  {t("country_label")}
                                </label>
                                <Select
                                  options={countryOptions}
                                  value={selectedCountry ?? null}
                                  onChange={setSelectedCountry}
                                  placeholder={t("select_country")}
                                  styles={customStyles}
                                  components={{
                                    Option: ({ data, ...props }) => (
                                      <components.Option {...props}>
                                        <img
                                          src={data.flag}
                                          alt=""
                                          style={{
                                            marginRight: 8,
                                            verticalAlign: "middle",
                                          }}
                                        />
                                        {data.label}
                                      </components.Option>
                                    ),
                                    SingleValue: ({ data, ...props }) => (
                                      <components.SingleValue {...props}>
                                        <img
                                          src={data.flag}
                                          alt=""
                                          style={{
                                            marginRight: 8,
                                            verticalAlign: "middle",
                                          }}
                                        />
                                        {data.label}
                                      </components.SingleValue>
                                    ),
                                  }}
                                />
                              </div>
                            </Col>

                            <Col lg={6}>
                              <div className="single-input-item">
                                <label htmlFor="city" className="required">
                                  {t("city_label")}
                                </label>
                                <Select
                                  options={cityOptions}
                                  value={selectedCity}
                                  onChange={setSelectedCity}
                                  placeholder={t("select_city")}
                                  styles={customStyles}
                                  isDisabled={!selectedCountry}
                                />
                              </div>
                            </Col>

                            <Col lg={6}>
                              <div className="single-input-item">
                                <label htmlFor="zip-code" className="required">
                                  {t("zip_label")}
                                </label>
                                <input
                                  type="text"
                                  id="zip-code"
                                  className="form-control"
                                  value={zipCode}
                                  onChange={(e) => setZipCode(e.target.value)}
                                />
                              </div>
                            </Col>

                            <Col lg={6}>
                              <div className="single-input-item">
                                <label htmlFor="address" className="required">
                                  {t("address")}
                                </label>
                                <input
                                  type="text"
                                  id="address"
                                  className="form-control"
                                  value={address}
                                  onChange={(e) => setAddress(e.target.value)}
                                />
                              </div>
                            </Col>
                          </Row>
                          <div className="single-input-item">
                            <label htmlFor="phone">{t("mobile")}</label>
                            <input
                              type="text"
                              id="phone"
                              className="form-control"
                              value={phone}
                              onChange={(e) => setPhone(e.target.value)}
                            />
                          </div>
                          <div className="single-input-item">
                            <h3>{t("payment_information")}</h3>
                            <label>{t("name_on_card")}</label>
                            <input
                              type="text"
                              value={nameOnCard}
                              onChange={(e) => setNameOnCard(e.target.value)}
                              placeholder={t("enter_name_on_card")}
                            />
                          </div>
                          <div className="single-input-item">
                            <label>{t("card_number")}</label>
                            <input
                              type="text"
                              value={cardNumber}
                              onChange={(e) => {
                                const formatted = formatCardNumber(
                                  e.target.value
                                );
                                setCardNumber(formatted);
                              }}
                              placeholder="**** **** **** ****"
                              maxLength="19"
                            />
                          </div>
                          <Row>
                            <Col md={6}>
                              <div className="single-input-item">
                                <label>{t("expiration")}</label>
                                <input
                                  type="text"
                                  value={expiration}
                                  onChange={(e) => {
                                    const formatted = formatExpiration(
                                      e.target.value
                                    );
                                    setExpiration(formatted);
                                  }}
                                  placeholder={t("MM_YY")}
                                  maxLength="5"
                                />
                              </div>
                            </Col>
                            <Col md={6}>
                              <div className="single-input-item">
                                <label>{t("cvc").toUpperCase()}</label>
                                <input
                                  type="text"
                                  value={cvc}
                                  onChange={(e) => setCvc(e.target.value)}
                                  placeholder={t("enter_cvc")}
                                  maxLength="3"
                                />
                              </div>
                            </Col>
                          </Row>
                        </div>
                      </div>
                      <fieldset>
                        <legend>{t("password_change")}</legend>
                        {/* Current Password Field with Toggle */}
                        <div
                          className="single-input-item"
                          style={{ position: "relative" }}
                        >
                          <label htmlFor="current-pwd" className="required">
                            {t("current_password")}
                          </label>
                          <input
                            type={showCurrentPassword ? "text" : "password"}
                            id="current-pwd"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                          />
                          <span
                            onClick={toggleCurrentPasswordVisibility}
                            style={{
                              position: "absolute",
                              right: "10px",
                              top: "35px",
                              cursor: "pointer",
                            }}
                          >
                            {showCurrentPassword ? (
                              <AiOutlineEye size={20} color="#000" />
                            ) : (
                              <AiOutlineEyeInvisible size={20} color="#000" />
                            )}
                          </span>
                        </div>
                        <div className="row">
                          <div className="col-lg-6">
                            {/* New Password Field with Toggle */}
                            <div
                              className="single-input-item"
                              style={{ position: "relative" }}
                            >
                              <label htmlFor="new-pwd" className="required">
                                {t("new_password")}
                              </label>
                              <input
                                type={showNewPassword ? "text" : "password"}
                                id="new-pwd"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                              />
                              <span
                                onClick={toggleNewPasswordVisibility}
                                style={{
                                  position: "absolute",
                                  right: "10px",
                                  top: "35px",
                                  cursor: "pointer",
                                }}
                              >
                                {showNewPassword ? (
                                  <AiOutlineEye size={20} color="#000" />
                                ) : (
                                  <AiOutlineEyeInvisible
                                    size={20}
                                    color="#000"
                                  />
                                )}
                              </span>
                            </div>
                          </div>
                          <div className="col-lg-6">
                            {/* Confirm Password Field with Toggle */}
                            <div
                              className="single-input-item"
                              style={{ position: "relative" }}
                            >
                              <label htmlFor="confirm-pwd" className="required">
                                {t("confirm_password")}
                              </label>
                              <input
                                type={showConfirmPassword ? "text" : "password"}
                                id="confirm-pwd"
                                value={confirmPassword}
                                onChange={(e) =>
                                  setConfirmPassword(e.target.value)
                                }
                              />
                              <span
                                onClick={toggleConfirmPasswordVisibility}
                                style={{
                                  position: "absolute",
                                  right: "10px",
                                  top: "35px",
                                  cursor: "pointer",
                                }}
                              >
                                {showConfirmPassword ? (
                                  <AiOutlineEye size={20} color="#000" />
                                ) : (
                                  <AiOutlineEyeInvisible
                                    size={20}
                                    color="#000"
                                  />
                                )}
                              </span>
                            </div>
                          </div>
                        </div>
                      </fieldset>
                      <p>{t("password_note")}</p>
                      <div className="single-input-item d-flex gap-3">
                        <button type="submit" disabled={isLoading}>
                          {isLoading ? (
                            <Spinner
                              as="span"
                              animation="border"
                              size="sm"
                              role="status"
                              aria-hidden="true"
                            />
                          ) : (
                            t("save_changes")
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={async () => {
                            setIsCanceling(true);
                            await new Promise((resolve) =>
                              setTimeout(resolve, 500)
                            );
                            handleCancel();
                            setIsCanceling(false);
                          }}
                          disabled={
                            !hasChanges ||
                            !initialLoaded ||
                            isCanceling ||
                            isLoading
                          }
                        >
                          {isCanceling ? (
                            <Spinner
                              as="span"
                              animation="border"
                              size="sm"
                              role="status"
                              aria-hidden="true"
                            />
                          ) : (
                            t("cancel")
                          )}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </Tab.Pane>
              {/* Users Tab */}
              {role === "admin" && (
                <Tab.Pane eventKey="users">
                  <div className="my-account-area__content">
                    <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
                      <h3 className="mb-0">{t("users")}</h3>
                      {allUsers.length > 0 && (
                        <span
                          className="badge bg-primary"
                          style={{ fontSize: "1rem", padding: "0.5rem 1rem" }}
                        >
                          {allUsers.length} {t("total_users")}
                        </span>
                      )}
                    </div>

                    {allUsers.length === 0 ? (
                      <div className="card">
                        <div className="card-body text-center py-5">
                          <i
                            className="bi bi-people"
                            style={{ fontSize: "3rem", color: "#ccc" }}
                          ></i>
                          <p className="mt-3 mb-0 text-muted">
                            {t("no_users_found")}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="card">
                        <div className="card-body">
                          {/* Filters Section */}
                          <div className="filter-section mb-4">
                            {/* Toggle Button */}
                            <div className="d-flex align-items-center mb-3">
                              <button
                                type="button"
                                className={`btn btn-outline-secondary d-flex align-items-center justify-content-center me-3 filter-toggle ${
                                  showUserFilters ? "active" : ""
                                }`}
                                onClick={() =>
                                  setShowUserFilters((prev) => !prev)
                                }
                                title={
                                  showUserFilters
                                    ? t("hide_filters")
                                    : t("show_filters")
                                }
                                style={{
                                  width: "45px",
                                  height: "45px",
                                  borderRadius: "50%",
                                  padding: 0,
                                }}
                              >
                                <IoFilter size={22} className="filter-icon" />
                              </button>
                              <span>{t("filter")}</span>
                            </div>

                            {/* Filters */}
                            {showUserFilters && (
                              <div className="row mb-3 g-3">
                                {/* Search Input */}
                                <div className="col-md-6">
                                  <label className="form-label">
                                    {t("search")}
                                  </label>
                                  <div style={{ position: "relative" }}>
                                    <input
                                      type="text"
                                      className="form-control"
                                      placeholder={t("search_user_name_email")}
                                      value={userSearchQuery}
                                      onChange={(e) => {
                                        const newValue = e.target.value;
                                        setUserSearchQuery(newValue);
                                        if (
                                          newValue.length >
                                          userSearchQuery.length
                                        ) {
                                          setCurrentPageUsers(1);
                                        }
                                      }}
                                      style={{
                                        paddingLeft: "40px",
                                        paddingRight: userSearchQuery
                                          ? "40px"
                                          : "12px",
                                        fontSize: "12px",
                                      }}
                                    />
                                    <IoIosSearch
                                      style={{
                                        position: "absolute",
                                        left: "12px",
                                        top: "50%",
                                        transform: "translateY(-50%)",
                                        fontSize: "20px",
                                        color: "#6c757d",
                                        pointerEvents: "none",
                                      }}
                                    />
                                    {userSearchQuery && (
                                      <button
                                        type="button"
                                        onClick={() => {
                                          setUserSearchQuery("");
                                          setCurrentPageUsers(1);
                                        }}
                                        style={{
                                          position: "absolute",
                                          right: "8px",
                                          top: "50%",
                                          transform: "translateY(-50%)",
                                          background: "transparent",
                                          border: "none",
                                          cursor: "pointer",
                                          padding: "4px",
                                          display: "flex",
                                          alignItems: "center",
                                          justifyContent: "center",
                                          color: "#dc3545",
                                          transition: "color 0.2s",
                                        }}
                                        onMouseEnter={(e) =>
                                          (e.currentTarget.style.color =
                                            "#bb2d3b")
                                        }
                                        onMouseLeave={(e) =>
                                          (e.currentTarget.style.color =
                                            "#dc3545")
                                        }
                                        title={t("clear")}
                                      >
                                        ✕
                                      </button>
                                    )}
                                  </div>
                                </div>

                                {/* Filter by Role */}
                                <div className="col-md-6">
                                  <label className="form-label">
                                    <i className="bi bi-funnel me-1"></i>
                                    {t("filter_by_role")}
                                  </label>
                                  <select
                                    className="form-select"
                                    value={userFilterRole}
                                    onChange={(e) => {
                                      setUserFilterRole(e.target.value);
                                      setCurrentPageUsers(1);
                                    }}
                                    style={{ fontSize: "12px" }}
                                  >
                                    <option value="all">
                                      {t("all_roles")}
                                    </option>
                                    <option value="admin">{t("admin")}</option>
                                    <option value="guest">{t("guest")}</option>
                                  </select>
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Users Table */}
                          <div
                            className="table-responsive"
                            style={{
                              maxHeight: "500px",
                              overflowY: "auto",
                              border: "1px solid #dee2e6",
                              borderRadius: "8px",
                              position: "relative",
                            }}
                          >
                            <table className="table table-hover table-striped mb-0">
                              <thead
                                className="table-primary"
                                style={{
                                  position: "sticky",
                                  top: 0,
                                  zIndex: 1,
                                }}
                              >
                                <tr>
                                  <th
                                    className="ps-3 text-start"
                                    style={{ minWidth: "200px" }}
                                  >
                                    <i className="bi bi-person me-2"></i>
                                    {t("name")}
                                  </th>
                                  <th
                                    className="text-start"
                                    style={{ minWidth: "200px" }}
                                  >
                                    <i className="bi bi-envelope me-2"></i>
                                    {t("email")}
                                  </th>
                                  <th
                                    className="text-start"
                                    style={{ minWidth: "120px" }}
                                  >
                                    <i className="bi bi-telephone me-2"></i>
                                    {t("phone")}
                                  </th>
                                  <th
                                    className="text-start"
                                    style={{ minWidth: "150px" }}
                                  >
                                    <i className="bi bi-geo-alt me-2"></i>
                                    {t("city")}
                                  </th>
                                  <th
                                    className="text-start"
                                    style={{ minWidth: "150px" }}
                                  >
                                    <i className="bi bi-flag me-2"></i>
                                    {t("country")}
                                  </th>
                                  <th
                                    className="text-center"
                                    style={{ minWidth: "100px" }}
                                  >
                                    <i className="bi bi-shield me-2"></i>
                                    {t("role")}
                                  </th>
                                  <th
                                    className="text-center pe-3"
                                    style={{ minWidth: "120px" }}
                                  >
                                    <i className="bi bi-ticket-perforated me-2"></i>
                                    {t("coupon")}
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                {(() => {
                                  // Filter users
                                  const filteredUsers = allUsers
                                    .filter((usr) => {
                                      const searchLower =
                                        userSearchQuery.toLowerCase();
                                      return (
                                        usr.displayName
                                          ?.toLowerCase()
                                          .includes(searchLower) ||
                                        usr.email
                                          ?.toLowerCase()
                                          .includes(searchLower) ||
                                        usr.firstName
                                          ?.toLowerCase()
                                          .includes(searchLower) ||
                                        usr.lastName
                                          ?.toLowerCase()
                                          .includes(searchLower)
                                      );
                                    })
                                    .filter((usr) =>
                                      userFilterRole === "all"
                                        ? true
                                        : usr.role === userFilterRole
                                    );

                                  // Pagination
                                  const indexOfLastUser =
                                    currentPageUsers * usersPerPage;
                                  const indexOfFirstUser =
                                    indexOfLastUser - usersPerPage;
                                  const currentUsers = filteredUsers.slice(
                                    indexOfFirstUser,
                                    indexOfLastUser
                                  );

                                  return currentUsers.map((usr) => (
                                    <tr key={usr.uid} className="align-middle">
                                      <td className="ps-3">
                                        <small className="fw-bold">
                                          {usr.displayName ||
                                            `${usr.firstName} ${usr.lastName}`.trim()}
                                        </small>
                                      </td>
                                      <td>
                                        <small>{usr.email}</small>
                                      </td>
                                      <td>
                                        <small>{usr.phone || "-"}</small>
                                      </td>
                                      <td>
                                        <small>{usr.city || "-"}</small>
                                      </td>
                                      <td>
                                        <small>{usr.country || "-"}</small>
                                      </td>
                                      <td className="text-center">
                                        <Badge
                                          pill
                                          bg={
                                            usr.role === "admin"
                                              ? "danger"
                                              : "secondary"
                                          }
                                          className="px-3 py-2"
                                        >
                                          {t(usr.role)}
                                        </Badge>
                                      </td>
                                      <td className="text-center pe-3">
                                        {usr.coupon ? (
                                          <span className="badge bg-success">
                                            <small>{usr.coupon}</small>
                                          </span>
                                        ) : (
                                          <small className="text-muted">
                                            -
                                          </small>
                                        )}
                                      </td>
                                    </tr>
                                  ));
                                })()}
                              </tbody>
                            </table>
                          </div>

                          {/* Pagination */}
                          {(() => {
                            const filteredUsers = allUsers
                              .filter((usr) => {
                                const searchLower =
                                  userSearchQuery.toLowerCase();
                                return (
                                  usr.displayName
                                    ?.toLowerCase()
                                    .includes(searchLower) ||
                                  usr.email
                                    ?.toLowerCase()
                                    .includes(searchLower) ||
                                  usr.firstName
                                    ?.toLowerCase()
                                    .includes(searchLower) ||
                                  usr.lastName
                                    ?.toLowerCase()
                                    .includes(searchLower)
                                );
                              })
                              .filter((usr) =>
                                userFilterRole === "all"
                                  ? true
                                  : usr.role === userFilterRole
                              );

                            const totalPagesUsers = Math.ceil(
                              filteredUsers.length / usersPerPage
                            );
                            const indexOfLastUser =
                              currentPageUsers * usersPerPage;
                            const indexOfFirstUser =
                              indexOfLastUser - usersPerPage;
                            const usersOnCurrentPage = filteredUsers.slice(
                              indexOfFirstUser,
                              indexOfLastUser
                            ).length;

                            if (totalPagesUsers > 1) {
                              return (
                                <div className="d-flex justify-content-between align-items-center mt-4 flex-wrap gap-3">
                                  <div className="text-muted">
                                    <small>
                                      {t("showing")} {usersOnCurrentPage}{" "}
                                      {t("of")} {filteredUsers.length}{" "}
                                      {t("users")}
                                    </small>
                                  </div>

                                  <nav>
                                    <ul className="pagination mb-0">
                                      <li
                                        className={`page-item ${currentPageUsers === 1 ? "disabled" : ""}`}
                                      >
                                        <button
                                          type="button"
                                          className="page-link py-1 px-2"
                                          onClick={() =>
                                            setCurrentPageUsers(
                                              currentPageUsers - 1
                                            )
                                          }
                                          disabled={currentPageUsers === 1}
                                        >
                                          {t("previous")}
                                        </button>
                                      </li>

                                      {[...Array(totalPagesUsers)].map(
                                        (_, index) => {
                                          const pageNumber = index + 1;
                                          if (
                                            pageNumber === 1 ||
                                            pageNumber === totalPagesUsers ||
                                            (pageNumber >=
                                              currentPageUsers - 1 &&
                                              pageNumber <=
                                                currentPageUsers + 1)
                                          ) {
                                            return (
                                              <li
                                                key={pageNumber}
                                                className={`page-item ${currentPageUsers === pageNumber ? "active" : ""}`}
                                              >
                                                <button
                                                  type="button"
                                                  className="page-link py-1 px-2"
                                                  onClick={() =>
                                                    setCurrentPageUsers(
                                                      pageNumber
                                                    )
                                                  }
                                                >
                                                  {pageNumber}
                                                </button>
                                              </li>
                                            );
                                          } else if (
                                            pageNumber ===
                                              currentPageUsers - 2 ||
                                            pageNumber === currentPageUsers + 2
                                          ) {
                                            return (
                                              <li
                                                key={`ellipsis-${pageNumber}`}
                                                className="page-item disabled"
                                              >
                                                <span className="page-link py-1 px-2">
                                                  ...
                                                </span>
                                              </li>
                                            );
                                          }
                                          return null;
                                        }
                                      )}

                                      <li
                                        className={`page-item ${currentPageUsers === totalPagesUsers ? "disabled" : ""}`}
                                      >
                                        <button
                                          type="button"
                                          className="page-link py-1 px-2"
                                          onClick={() =>
                                            setCurrentPageUsers(
                                              currentPageUsers + 1
                                            )
                                          }
                                          disabled={
                                            currentPageUsers === totalPagesUsers
                                          }
                                        >
                                          {t("next")}
                                        </button>
                                      </li>
                                    </ul>
                                  </nav>
                                </div>
                              );
                            }
                            return null;
                          })()}

                          {/* Summary Stats */}
                          <div className="row mt-4 g-3">
                            <div className="col-md-4">
                              <div className="card border-primary">
                                <div className="card-body text-center py-3">
                                  <small className="text-muted d-block">
                                    {t("total_users")}
                                  </small>
                                  <h4 className="mb-0 text-primary">
                                    {allUsers.length}
                                  </h4>
                                </div>
                              </div>
                            </div>
                            <div className="col-md-4">
                              <div className="card border-danger">
                                <div className="card-body text-center py-3">
                                  <small className="text-muted d-block">
                                    {t("admins")}
                                  </small>
                                  <h4 className="mb-0 text-danger">
                                    {
                                      allUsers.filter((u) => u.role === "admin")
                                        .length
                                    }
                                  </h4>
                                </div>
                              </div>
                            </div>
                            <div className="col-md-4">
                              <div className="card border-secondary">
                                <div className="card-body text-center py-3">
                                  <small className="text-muted d-block">
                                    {t("guests")}
                                  </small>
                                  <h4 className="mb-0 text-secondary">
                                    {
                                      allUsers.filter((u) => u.role === "guest")
                                        .length
                                    }
                                  </h4>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </Tab.Pane>
              )}
            </Tab.Content>
          </Tab.Container>
        </Container>
      </div>
      <Modal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>{t("confirm_deletion")}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>{t("are_you_sure_delete_order")}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            {t("cancel")}
          </Button>
          <Button
            variant="danger"
            onClick={() => {
              deleteOrder(pendingDeleteId);
              setShowDeleteModal(false);
              setCurrentPage(1); // reset pagination
            }}
          >
            {t("yes_delete")}
          </Button>
        </Modal.Footer>
      </Modal>
      {/* Logout Confirmation Modal */}
      <Modal
        show={showLogoutModal}
        onHide={() => setShowLogoutModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>{t("confirm_logout")}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>{t("are_you_sure_logout")}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowLogoutModal(false)}
            disabled={isLoading}
          >
            {t("cancel")}
          </Button>
          <Button
            variant="danger"
            onClick={() => {
              handleLogout();
              setShowLogoutModal(false);
            }}
            disabled={isLoading}
          >
            {isLoading ? (
              <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
              />
            ) : (
              t("yes_logout")
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </LayoutTwo>
  );
};

export default MyAccount;
