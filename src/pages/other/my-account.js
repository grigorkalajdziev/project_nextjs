import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/router";
import { auth } from "../api/register";
import { onAuthStateChanged, signOut, updatePassword } from "firebase/auth";
import { getDatabase, ref, set, get, update, remove } from "firebase/database";
import Link from "next/link";
import Tab from "react-bootstrap/Tab";
import Nav from "react-bootstrap/Nav";
import { Container, Spinner, Modal, Button } from "react-bootstrap";
import { FaHome } from "react-icons/fa";
import { Country, City } from "country-state-city";
import { LayoutTwo } from "../../components/Layout";
import { BreadcrumbOne } from "../../components/Breadcrumb";
import { useLocalization } from "../../context/LocalizationContext";
import { useToasts } from "react-toast-notifications";
import { cities } from "../../context/CountryCityTranslations";
import { isoToMK } from "../../context/CountryIsoCode";

// Tab components
import DashboardTab from "../../components/Account/Tabs/DashboardTab";
import OrdersTab from "../../components/Account/Tabs/OrdersTab";
import DownloadTab from "../../components/Account/Tabs/DownloadTab";
import PaymentTab from "../../components/Account/Tabs/PaymentTab";
import AccountDetailsTab from "../../components/Account/Tabs/AccountDetailsTab";
import UsersTab from "../../components/Account/Tabs/UsersTab";
import LogsTab from "../../components/Account/Tabs/LogsTab";
import ProductsTab from "../../components/Account/Tabs/ProductsTab";

// Logger
import { logActivity } from "../lib/logActivity";

// ── Helpers ──────────────────────────────────────────────────────────────────

const parseAmount = (val, lang = "mk") => {
  if (val == null) return 0;
  if (typeof val === "number") return val;
  if (typeof val === "object") {
    const preferred = lang === "en" ? (val.en ?? val.mk) : (val.mk ?? val.en);
    return parseAmount(preferred, lang);
  }
  const cleaned = String(val).replace(/[^0-9.-]+/g, "");
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : 0;
};

const getLocalizedTotal = (order, lang = "mk") => {
  if (!order) return 0;
  const explicit = parseAmount(order?.total, lang);
  if (explicit > 0) return explicit;
  if (!order?.products || !Array.isArray(order.products)) return 0;
  const subtotal = order.products.reduce((sum, p) => {
    let price = 0;
    if (typeof p.price === "object" && p.price !== null) {
      price = parseAmount(lang === "en" ? p.price.en : p.price.mk, lang);
      if (!price) price = parseAmount(p.price.en ?? p.price.mk, lang);
    } else {
      price = parseAmount(p.price, lang);
    }
    return sum + price * (p.quantity || 1);
  }, 0);
  const discountAmount = parseAmount(order?.discount, lang);
  if (discountAmount > 0) return Math.max(subtotal - discountAmount, 0);
  return subtotal;
};

const conversionRate = 61.5;

const formatTotal = (amount, lang) => {
  const isEnglish = lang === "en";
  const formatter = new Intl.NumberFormat(isEnglish ? "en-US" : "mk-MK", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return `${formatter.format(amount || 0)} ${isEnglish ? "€" : "ден."}`;
};

const customStyles = {
  control: (p) => ({ ...p, minHeight: "50px", height: "50px", borderRadius: "4px", display: "flex", alignItems: "center" }),
  valueContainer: (p) => ({ ...p, height: "50px", padding: "0 8px", display: "flex", alignItems: "center" }),
  input: (p) => ({ ...p, margin: "0px" }),
  singleValue: (p) => ({ ...p, textAlign: "left", marginTop: "-5px", marginLeft: "12px" }),
  indicatorsContainer: (p) => ({ ...p, height: "50px", display: "flex", alignItems: "center" }),
  menu: (p) => ({ ...p, textAlign: "left" }),
  option: (p) => ({ ...p, textAlign: "left" }),
};

const COLORS = { pending: "#F4C430", confirmed: "#2EAD65", cancelled: "#E04545" };
const PAYMENT_COLORS = ["#2EAD65", "#0088FE"];

// ── Component ─────────────────────────────────────────────────────────────────

const MyAccount = () => {
  const { t, currentLanguage } = useLocalization();
  const { addToast } = useToasts();
  const router = useRouter();
  const db = getDatabase();

  // ── Auth / user ──────────────────────────────────────────────────────────
  const [user, setUser] = useState(null);
  const [role, setRole] = useState("guest");
  const [email, setEmail] = useState("");

  // ── Profile fields ───────────────────────────────────────────────────────
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [phone, setPhone] = useState("");
  const [nameOnCard, setNameOnCard] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiration, setExpiration] = useState("");
  const [cvc, setCvc] = useState("");

  // ── Password fields ──────────────────────────────────────────────────────
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // ── Password visibility ──────────────────────────────────────────────────
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const toggleCurrentPasswordVisibility = () => setShowCurrentPassword((v) => !v);
  const toggleNewPasswordVisibility = () => setShowNewPassword((v) => !v);
  const toggleConfirmPasswordVisibility = () => setShowConfirmPassword((v) => !v);

  // ── Country / city ───────────────────────────────────────────────────────
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [cityOptions, setCityOptions] = useState([]);

  // ── Initial snapshot (for change detection) ──────────────────────────────
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
  const [initialLoaded, setInitialLoaded] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // ── Loading / modals ─────────────────────────────────────────────────────
  const [isLoading, setIsLoading] = useState(false);
  const [isCanceling, setIsCanceling] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [errors, setErrors] = useState({});

  // ── Data ─────────────────────────────────────────────────────────────────
  const [orders, setOrders] = useState([]);
  const [allUsers, setAllUsers] = useState([]);

  // ── Orders filters / pagination ──────────────────────────────────────────
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPayment, setFilterPayment] = useState("all");
  const [filterYear, setFilterYear] = useState(new Date().getFullYear().toString());
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const ordersPerPage = 6;

  // ── Download tab ─────────────────────────────────────────────────────────
  const [currentPageDown, setCurrentPageDown] = useState(1);
  const itemsPerPageDown = 6;
  const [downloadingOrderId, setDownloadingOrderId] = useState(null);
  const [selectedOrdersForDownload, setSelectedOrdersForDownload] = useState([]);
  const [selectAllDownload, setSelectAllDownload] = useState(false);
  const [downloadSearchQuery, setDownloadSearchQuery] = useState("");
  const [downloadFilterPayment, setDownloadFilterPayment] = useState("all");
  const [downloadFilterStatus, setDownloadFilterStatus] = useState("all");
  const [showDownloadFilters, setShowDownloadFilters] = useState(false);
  const [downloadHistory, setDownloadHistory] = useState({});
  const [bulkDownloading, setBulkDownloading] = useState(false);

  // ── Payment tab ──────────────────────────────────────────────────────────
  const [currentPagePayment, setCurrentPagePayment] = useState(1);
  const itemsPerPagePayment = 6;
  const [dateRange, setDateRange] = useState("30days");

  // ── Users tab ────────────────────────────────────────────────────────────
  const [userSearchQuery, setUserSearchQuery] = useState("");
  const [userFilterRole, setUserFilterRole] = useState("all");
  const [currentPageUsers, setCurrentPageUsers] = useState(1);
  const [showUserFilters, setShowUserFilters] = useState(false);
  const usersPerPage = 6;

  // ── Newsletter modal ─────────────────────────────────────────────────────
  const [showBroadcastModal, setShowBroadcastModal] = useState(false);
  const [subscriberStats, setSubscriberStats] = useState(null);
  const [subscriberLoading, setSubscriberLoading] = useState(false);
  const [broadcastSchedule, setBroadcastSchedule] = useState(null);
  const [broadcastPeriod, setBroadcastPeriod] = useState("weekly");
  const [broadcastSubject, setBroadcastSubject] = useState("");
  const [broadcastSendTime, setBroadcastSendTime] = useState("12:00");
  const [broadcastLoading, setBroadcastLoading] = useState(false);
  const [scheduleLoading, setScheduleLoading] = useState(false);

  // ── Country options ──────────────────────────────────────────────────────
  const countryOptions = Country.getAllCountries().map((c) => {
    const mkLabel = isoToMK[c.isoCode];
    return {
      value: c.isoCode,
      label: currentLanguage === "mk" ? mkLabel || c.name : c.name,
      flag: `https://flagcdn.com/24x18/${c.isoCode.toLowerCase()}.png`,
      englishName: c.name,
    };
  });

  // ── Helpers ──────────────────────────────────────────────────────────────

  const findCountryOption = (countryFromDb) => {
    if (!countryFromDb) return null;
    if (typeof countryFromDb === "object" && countryFromDb.value) {
      const found = countryOptions.find((c) => c.value === countryFromDb.value);
      if (found) return found;
      return { value: countryFromDb.value, label: currentLanguage === "mk" ? isoToMK[countryFromDb.value] || countryFromDb.label || countryFromDb.value : countryFromDb.label || countryFromDb.value, flag: countryFromDb.flag || `https://flagcdn.com/24x18/${String(countryFromDb.value).toLowerCase()}.png` };
    }
    return countryOptions.find((c) => c.value === countryFromDb) || countryOptions.find((c) => c.label === countryFromDb) || countryOptions.find((c) => c.englishName === countryFromDb) || null;
  };

  const findCityOption = (cityFromDb, citiesArray = []) => {
    if (!cityFromDb) return null;
    if (typeof cityFromDb === "object" && cityFromDb.value) return citiesArray.find((c) => c.value === cityFromDb.value) || cityFromDb;
    return citiesArray.find((c) => c.value === cityFromDb) || { label: cityFromDb, value: cityFromDb };
  };

  const buildCityOptionsFromCountryValue = (countryIso) => {
    if (!countryIso) return [];
    if (currentLanguage === "mk") {
      const mkCountryName = isoToMK[countryIso];
      const mkCities = mkCountryName ? cities[mkCountryName] : null;
      if (Array.isArray(mkCities) && mkCities.length > 0) return mkCities.map((name) => ({ value: name, label: name }));
    }
    try { return City.getCitiesOfCountry(countryIso).map((c) => ({ value: c.name, label: c.name })); } catch { return []; }
  };

  const formatCardNumber = (value) => value.replace(/\D/g, "").replace(/(.{4})/g, "$1 ").trim();
  const formatExpiration = (value) => {
    const cleaned = value.replace(/\D/g, "");
    if (!cleaned.length) return "";
    if (cleaned.length < 2) return cleaned;
    if (cleaned.length === 2) return cleaned + "/";
    return cleaned.slice(0, 2) + "/" + cleaned.slice(2, 4);
  };

  // ── Derived filtered lists ────────────────────────────────────────────────

  const filteredOrders = orders
    .filter((o) => o.orderNumber?.toLowerCase().includes(searchQuery.toLowerCase()) || o.displayName?.toLowerCase().includes(searchQuery.toLowerCase()))
    .filter((o) => filterStatus === "all" ? true : o.status === filterStatus)
    .filter((o) => filterPayment === "all" ? true : o.paymentMethod === filterPayment)
    .filter((o) => { const [, , year] = o.date.split("-"); return Number(year) === Number(filterYear); });

  const grandTotalInDisplayCurrency = filteredOrders.reduce((sum, order) => {
    const mk = parseFloat(order.totalMK || 0);
    const en = parseFloat(order.totalEN || 0);
    return currentLanguage === "mk" ? sum + (mk > 0 ? mk : en * conversionRate) : sum + (en > 0 ? en : mk / conversionRate);
  }, 0);

  const filteredOrdersForCharts = orders.filter((order) => {
    if (!order.date) return false;
    const [, , year] = order.date.split("-");
    return parseInt(year, 10) === parseInt(filterYear, 10);
  });

  const filteredOrdersForPayment = orders.filter((order) => {
    if (!order.date) return false;
    const [, , year] = order.date.split("-");
    return Number(year) === Number(filterYear);
  });

  const filteredOrdersForDownload = orders
    .filter((order) => { if (!order.date) return false; const [, , year] = order.date.split("-"); return Number(year) === Number(filterYear); })
    .filter((order) => downloadSearchQuery ? order.orderNumber?.toLowerCase().includes(downloadSearchQuery.toLowerCase()) || order.displayName?.toLowerCase().includes(downloadSearchQuery.toLowerCase()) : true)
    .filter((order) => downloadFilterPayment === "all" ? true : order.paymentMethod === downloadFilterPayment)
    .filter((order) => downloadFilterStatus === "all" ? true : order.status === downloadFilterStatus);

  // ── Pagination ────────────────────────────────────────────────────────────
  const indexOfFirstOrder = (currentPage - 1) * ordersPerPage;
  const indexOfLastOrder = currentPage * ordersPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);
  const ordersOnCurrentPage = currentOrders.length;
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const totalPagesPayment = Math.ceil(filteredOrdersForPayment.length / itemsPerPagePayment);
  const startIndexPayment = (currentPagePayment - 1) * itemsPerPagePayment;
  const currentOrdersPayment = filteredOrdersForPayment.slice(startIndexPayment, startIndexPayment + itemsPerPagePayment);

  const handlePageChangePayment = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPagesPayment) setCurrentPagePayment(pageNumber);
  };

  const totalPagesDownload = Math.ceil(filteredOrdersForDownload.length / itemsPerPageDown);
  const startIndexDownload = (currentPageDown - 1) * itemsPerPageDown;
  const currentOrdersDownload = filteredOrdersForDownload.slice(startIndexDownload, startIndexDownload + itemsPerPageDown);

  const handlePageChangeDown = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPagesDownload) setCurrentPageDown(pageNumber);
  };

  // ── Analytics helpers ─────────────────────────────────────────────────────

  const paymentData = (orderList, lang) =>
    orderList.reduce((acc, order) => {
      const method = order.paymentMethod || "other";
      const amount = lang === "mk"
        ? order.totalMK || (order.totalEN ? order.totalEN * conversionRate : 0)
        : order.totalEN || (order.totalMK ? order.totalMK / conversionRate : 0);
      const existing = acc.find((d) => d.name === method);
      if (existing) existing.value += amount;
      else acc.push({ name: method, value: amount });
      return acc;
    }, []);

  const formattedPaymentData = paymentData(filteredOrdersForCharts, currentLanguage).map((entry) => {
    let name = entry.name;
    if (name === "payment_bank") name = currentLanguage === "mk" ? "Банка" : "Bank";
    else if (name === "payment_cash") name = currentLanguage === "mk" ? "Готовина" : "Cash";
    return { ...entry, name };
  });

  const statusData = (orderList, year) => {
    if (!Array.isArray(orderList) || !orderList.length) return [];
    const targetYear = year === "all" ? new Date().getFullYear() : parseInt(year, 10);
    return orderList.reduce((acc, order) => {
      if (!order.date && !order.createdAt) return acc;
      let orderYear;
      if (order.date) {
        const parts = order.date.split("-");
        orderYear = parts[0].length === 4 ? parseInt(parts[0], 10) : parseInt(parts[2], 10);
      } else {
        orderYear = new Date(order.createdAt).getFullYear();
      }
      if (!orderYear || orderYear !== targetYear) return acc;
      const status = order.status || "other";
      const existing = acc.find((d) => d.status === status);
      const mk = Number.isFinite(Number(order.totalMK)) ? Number(order.totalMK) : 0;
      const en = Number.isFinite(Number(order.totalEN)) ? Number(order.totalEN) : 0;
      let mkdAmount = 0, engAmount = 0;
      if (mk === 0 && en === 0) {
        const fallback = parseAmount(order.total ?? 0);
        const cur = (order.currency || "MKD").toUpperCase();
        if (cur === "EUR") { engAmount = fallback; mkdAmount = fallback * conversionRate; }
        else { mkdAmount = fallback; engAmount = fallback / conversionRate; }
      } else {
        mkdAmount = mk > 0 ? mk : en * conversionRate;
        engAmount = en > 0 ? en : mk / conversionRate;
      }
      if (existing) { existing.count += 1; existing.mkd += mkdAmount; existing.eng += engAmount; }
      else acc.push({ status, count: 1, mkd: mkdAmount, eng: engAmount });
      return acc;
    }, []);
  };

  const getDailyRevenue = (orderList, days = 30) => {
    const targetYear = parseInt(filterYear, 10);
    const today = new Date();
    today.setFullYear(targetYear);
    if (targetYear !== new Date().getFullYear()) today.setMonth(11, 31);
    today.setHours(0, 0, 0, 0);
    const dailyData = {};
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
      dailyData[key] = { mkd: 0, eur: 0, count: 0 };
    }
    orderList.forEach((order) => {
      let orderDate = null;
      if (order.date) {
        const parts = order.date.split("-");
        if (parts[0].length === 4) orderDate = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
        else orderDate = new Date(Number(parts[2]), Number(parts[1]) - 1, Number(parts[0]));
      } else if (order.createdAt) {
        orderDate = new Date(order.createdAt);
      }
      if (!orderDate || isNaN(orderDate)) return;
      if (orderDate.getFullYear() !== targetYear) return;
      orderDate.setHours(0, 0, 0, 0);
      const key = `${orderDate.getFullYear()}-${String(orderDate.getMonth() + 1).padStart(2, "0")}-${String(orderDate.getDate()).padStart(2, "0")}`;
      if (!dailyData[key]) return;
      const mk = parseFloat(order.totalMK || 0);
      const en = parseFloat(order.totalEN || 0);
      if (!mk && !en) {
        const fallback = parseAmount(order.total || 0);
        const cur = (order.currency || "MKD").toUpperCase();
        if (cur === "EUR") { dailyData[key].eur += fallback; dailyData[key].mkd += fallback * conversionRate; }
        else { dailyData[key].mkd += fallback; dailyData[key].eur += fallback / conversionRate; }
      } else {
        dailyData[key].mkd += mk > 0 ? mk : en * conversionRate;
        dailyData[key].eur += en > 0 ? en : mk / conversionRate;
      }
      dailyData[key].count += 1;
    });
    const monthNames = {
      en: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],
      mk: ["Јан","Фев","Мар","Апр","Мај","Јун","Јул","Авг","Сеп","Окт","Ное","Дек"],
    };
    return Object.entries(dailyData).map(([date, data]) => {
      const [y, m, d] = date.split("-").map(Number);
      const dateObj = new Date(y, m - 1, d);
      const monthName = currentLanguage === "mk" ? monthNames.mk[dateObj.getMonth()] : monthNames.en[dateObj.getMonth()];
      return { date: `${String(dateObj.getDate()).padStart(2, "0")} ${monthName}`, fullDate: date, revenue: currentLanguage === "mk" ? data.mkd : data.eur, orders: data.count };
    });
  };

  const getMonthlyRevenue = (orderList, year) => {
    const labelsEn = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    const labelsMk = ["Јан","Фев","Мар","Апр","Мај","Јун","Јул","Авг","Сеп","Окт","Ное","Дек"];
    const monthlyData = Array.from({ length: 12 }, (_, i) => ({
      month: currentLanguage === "mk" ? labelsMk[i] : labelsEn[i],
      mkd: 0, eur: 0, orders: 0,
    }));
    orderList.forEach((order) => {
      let orderDate = null;
      if (order.date) {
        const parts = order.date.split("-");
        orderDate = parts[0].length === 4 ? new Date(order.date) : new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
      } else if (order.createdAt) {
        orderDate = new Date(order.createdAt);
      }
      if (!orderDate || isNaN(orderDate) || orderDate.getFullYear() !== year) return;
      const idx = orderDate.getMonth();
      const mk = parseFloat(order.totalMK || 0);
      const en = parseFloat(order.totalEN || 0);
      if (!mk && !en) {
        const fallback = parseAmount(order.total || 0);
        const cur = (order.currency || "MKD").toUpperCase();
        if (cur === "EUR") { monthlyData[idx].eur += fallback; monthlyData[idx].mkd += fallback * conversionRate; }
        else { monthlyData[idx].mkd += fallback; monthlyData[idx].eur += fallback / conversionRate; }
      } else {
        monthlyData[idx].mkd += mk > 0 ? mk : en * conversionRate;
        monthlyData[idx].eur += en > 0 ? en : mk / conversionRate;
      }
      monthlyData[idx].orders += 1;
    });
    return monthlyData.map((m) => ({ ...m, revenue: currentLanguage === "mk" ? m.mkd : m.eur }));
  };

  const getYearlyRevenue = (orderList) => {
    if (!Array.isArray(orderList) || !orderList.length) return [];
    const yearly = {};
    orderList.forEach((order) => {
      let orderDate = null;
      if (order.date) {
        const parts = order.date.split("-");
        orderDate = parts[0].length === 4 ? new Date(order.date) : new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
      } else if (order.createdAt) {
        orderDate = new Date(order.createdAt);
      }
      if (!orderDate || isNaN(orderDate)) return;
      const y = orderDate.getFullYear();
      if (!yearly[y]) yearly[y] = { mkd: 0, eur: 0, count: 0 };
      const mk = Number.isFinite(Number(order.totalMK)) ? Number(order.totalMK) : 0;
      const en = Number.isFinite(Number(order.totalEN)) ? Number(order.totalEN) : 0;
      if (mk === 0 && en === 0) {
        const fallback = parseAmount(order.total ?? 0);
        const cur = (order.currency || "MKD").toUpperCase();
        if (cur === "EUR") { yearly[y].eur += fallback; yearly[y].mkd += fallback * conversionRate; }
        else { yearly[y].mkd += fallback; yearly[y].eur += fallback / conversionRate; }
      } else {
        yearly[y].mkd += mk > 0 ? mk : en * conversionRate;
        yearly[y].eur += en > 0 ? en : mk / conversionRate;
      }
      yearly[y].count += 1;
    });
    return Object.entries(yearly).map(([year, data]) => ({
      year: Number(year),
      revenue: currentLanguage === "mk" ? Number(data.mkd) : Number(data.eur),
      orders: data.count,
    })).sort((a, b) => a.year - b.year);
  };

  const getTopProducts = (orderList, limit = 5, year) => {
    const productStats = {};
    const targetYear = parseInt(year, 10);
    orderList.forEach((order) => {
      if (!order.date) return;
      const parts = order.date.split("-");
      const orderYear = parts[0].length === 4 ? parseInt(parts[0], 10) : parseInt(parts[2], 10);
      if (orderYear !== targetYear) return;
      const orderCurrency = (order.currency || "MKD").toUpperCase();
      (order.products || []).forEach((product) => {
        const productName = typeof product.name === "object" && product.name !== null
          ? (currentLanguage === "mk" ? product.name.mk : product.name.en)
          : product.name || "Unknown";
        if (!productStats[productName]) productStats[productName] = { count: 0, mkd: 0, eur: 0 };
        const quantity = product.quantity || 1;
        productStats[productName].count += quantity;
        if (typeof product.price === "object" && product.price !== null) {
          productStats[productName].mkd += parseFloat(product.price.mk || 0) * quantity;
          productStats[productName].eur += parseFloat(product.price.en || 0) * quantity;
        } else {
          const price = parseFloat(product.price || 0) * quantity;
          if (orderCurrency === "MKD") { productStats[productName].mkd += price; productStats[productName].eur += price / conversionRate; }
          else { productStats[productName].eur += price; productStats[productName].mkd += price * conversionRate; }
        }
      });
    });
    return Object.entries(productStats)
      .map(([name, stats]) => ({ name, count: stats.count, revenue: currentLanguage === "mk" ? stats.mkd : stats.eur }))
      .sort((a, b) => b.count - a.count)
      .slice(0, limit);
  };

  const getAverageOrderValue = (orderList) => {
    if (!orderList?.length) return 0;
    const total = orderList.reduce((acc, order) => {
      const mk = parseFloat(order.totalMK || 0);
      const en = parseFloat(order.totalEN || 0);
      if (!mk && !en) {
        const fallback = parseAmount(order.total || 0);
        return currentLanguage === "mk" ? acc + fallback : acc + fallback / conversionRate;
      }
      return currentLanguage === "mk" ? acc + (mk > 0 ? mk : en * conversionRate) : acc + (en > 0 ? en : mk / conversionRate);
    }, 0);
    return total / orderList.length;
  };

  const getOrderSuccessStats = (orderList) => {
    const stats = { total: orderList.length, pending: orderList.filter((o) => o.status === "pending").length, confirmed: orderList.filter((o) => o.status === "confirmed").length, cancelled: orderList.filter((o) => o.status === "cancelled").length };
    stats.successRate = stats.total > 0 ? ((stats.confirmed / stats.total) * 100).toFixed(1) : 0;
    return stats;
  };

  // ── Download helpers ──────────────────────────────────────────────────────

  const trackDownload = (orderId) => {
    setDownloadHistory((prev) => ({ ...prev, [orderId]: { count: (prev[orderId]?.count || 0) + 1, lastDownload: new Date().toISOString() } }));
  };

  const downloadPdf = async (order) => {
    if (!order) return;
    setDownloadingOrderId(order.id);
    try {
      const isMK = currentLanguage === "mk";
      const paymentText = order.paymentMethod === "payment_cash" ? t("payment_cash") : t("payment_bank");
      const discountValue = isMK ? Number(order.discountMK || 0) : Number(order.discountEN || 0);
      const orderForPdf = {
        orderNumber: order.orderNumber, date: order.date, reservationDate: order.reservationDate, reservationTime: order.reservationTime,
        paymentMethod: order.paymentMethod, paymentText, totalMK: order.totalMK, totalEN: order.totalEN, displayTotal: isMK ? order.totalMK : order.totalEN,
        discount: discountValue, couponCode: order.coupon?.code || null, products: order.products || [],
        customer: { name: order.displayName || displayName || `${firstName} ${lastName}`.trim() || null, email: order.email || null, phone: order.customerPhone || null, address: order.customerAddress || null, city: order.customerCity || null, postalCode: order.customerPostalCode || null, state: order.customerState || null },
      };
      const resp = await fetch("/api/generate-pdf", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ order: orderForPdf, language: currentLanguage }) });
      if (!resp.ok) { let errBody = null; try { errBody = await resp.json(); } catch {} throw new Error(errBody?.message || errBody?.error || `Server error ${resp.status}`); }
      const blob = await resp.blob();
      const filenamePrefix = order.paymentMethod === "payment_cash" ? (isMK ? "Потврда" : "Confirmation") : (isMK ? "Фактура" : "Invoice");
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url; a.download = `${filenamePrefix}-${order.orderNumber}.pdf`;
      document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);

      // ── LOG: PDF Download ─────────────────────────────────────────────
      await logActivity({
        username: user?.email || "",
        userId: user?.uid || "",
        action: "PDF_DOWNLOAD",
        details: `${filenamePrefix}-${order.orderNumber}.pdf`,
      });
    } catch (err) {
      addToast(err.message || "Download failed", { appearance: "error", autoDismiss: true });
    } finally {
      setDownloadingOrderId(null);
    }
  };

  const downloadPdfEnhanced = async (order) => { await downloadPdf(order); trackDownload(order.id); };

  const downloadBulkPdfs = async () => {
    if (!selectedOrdersForDownload.length) { addToast(t("no_orders_selected"), { appearance: "warning", autoDismiss: true }); return; }
    setBulkDownloading(true);
    let successCount = 0, failCount = 0;
    for (const orderId of selectedOrdersForDownload) {
      const order = filteredOrdersForDownload.find((o) => o.id === orderId);
      if (order) {
        try { await downloadPdf(order); trackDownload(order.id); successCount++; await new Promise((r) => setTimeout(r, 500)); }
        catch { failCount++; }
      }
    }
    setBulkDownloading(false); setSelectedOrdersForDownload([]); setSelectAllDownload(false);
    if (successCount) {
      addToast(`${t("successfully_downloaded")} ${successCount} ${t("invoices")}`, { appearance: "success", autoDismiss: true });
      // ── LOG: Bulk PDF Download ──────────────────────────────────────────
      await logActivity({
        username: user?.email || "",
        userId: user?.uid || "",
        action: "BULK_PDF_DOWNLOAD",
        details: `${successCount} PDF фајлови преземени`,
      });
    }
    if (failCount) addToast(`${t("failed_to_download")} ${failCount} ${t("invoices")}`, { appearance: "error", autoDismiss: true });
  };

  const toggleOrderSelection = (orderId) => setSelectedOrdersForDownload((prev) => prev.includes(orderId) ? prev.filter((id) => id !== orderId) : [...prev, orderId]);
  const toggleSelectAll = () => { if (selectAllDownload) setSelectedOrdersForDownload([]); else setSelectedOrdersForDownload(filteredOrdersForDownload.map((o) => o.id)); setSelectAllDownload(!selectAllDownload); };

  const downloadStats = {
    total: filteredOrdersForDownload.length,
    withHistory: Object.keys(downloadHistory).filter((id) => filteredOrdersForDownload.some((o) => o.id === id)).length,
    totalDownloads: Object.values(downloadHistory).reduce((sum, h) => sum + h.count, 0),
    avgDownloadsPerOrder: Object.keys(downloadHistory).length > 0 ? (Object.values(downloadHistory).reduce((sum, h) => sum + h.count, 0) / Object.keys(downloadHistory).length).toFixed(1) : 0,
  };

  // ── Order CRUD ────────────────────────────────────────────────────────────

  const deleteOrder = async (orderId) => {
    if (!user) { addToast(t("delete_error"), { appearance: "error", autoDismiss: true }); return; }
    const uid = role === "admin" ? orders.find((o) => o.id === orderId)?.userId : user.uid;
    if (!uid) { addToast(t("delete_error"), { appearance: "error", autoDismiss: true }); return; }
    try {
      await remove(ref(db, `orders/${uid}/${orderId}`));
      setOrders((prev) => prev.filter((o) => o.id !== orderId));
      // ── LOG: Order Deleted ────────────────────────────────────────────
      await logActivity({
        username: user.email,
        userId: user.uid,
        action: "ORDER_DELETED",
        details: `Нарачка ID: ${orderId}`,
      });
      addToast(t("order_deleted"), { appearance: "success", autoDismiss: true });
    } catch (err) {
      addToast(`${t("delete_error")}: ${err.message}`, { appearance: "error", autoDismiss: true });
    }
  };

  const viewOrder = (orderId, orderUserId) => {
    const uid = role === "admin" ? orderUserId || orders.find((o) => o.id === orderId)?.userId : user?.uid;
    if (!uid) { addToast(t("view_error") || "Could not determine order owner", { appearance: "error", autoDismiss: true }); return; }
    router.push({ pathname: "/other/cart-details", query: { viewOrder: "true", userId: uid, orderId } });
  };

  const updateOrder = async (orderId, _userId, newStatus) => {
    try {
      const matchingOrder = orders.find((o) => o.id === orderId);
      if (!matchingOrder) throw new Error("Order not found");
      const { userId, orderNumber, date, reservationDate, reservationTime, totalMK, totalEN, products, email: orderEmail, language, displayName: orderDisplayName, paymentText, paymentMethod, discountMK, discountEN, coupon } = matchingOrder;
      await update(ref(db, `orders/${userId}/${orderId}`), { status: newStatus });
      setOrders((prev) => prev.map((o) => o.id === orderId ? { ...o, status: newStatus } : o));
      // ── LOG: Order Status Changed ─────────────────────────────────────
      await logActivity({
        username: user?.email || "",
        userId: user?.uid || "",
        action: "ORDER_STATUS",
        details: `Нарачка #${orderNumber} → ${newStatus}`,
      });
      const orderLanguage = language || currentLanguage;
      const totalToSend = orderLanguage === "mk" ? Number(totalMK) || 0 : Number(totalEN) || 0;
      const discountToSend = orderLanguage === "mk" ? Number(discountMK) || 0 : Number(discountEN) || 0;
      await fetch("/api/send-order-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ to: orderEmail, from: "confirmation@kikamakeupandbeautyacademy.com", orderNumber, orderId, userId, status: newStatus, date, reservationDate, reservationTime, customerName: orderDisplayName, paymentText, paymentMethod, total: totalToSend, products, discount: discountToSend, couponCode: coupon?.code || null, customerEmail: orderEmail, customerPhone: matchingOrder.customerPhone || "", customerAddress: matchingOrder.customerAddress || "", customerState: matchingOrder.customerState || "", customerCity: matchingOrder.customerCity || "", customerPostalCode: matchingOrder.customerPostalCode || "", language: orderLanguage }),
      });
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  // ── Change detection ──────────────────────────────────────────────────────

  const checkForChanges = useCallback(() => {
    if (!initialLoaded) { setHasChanges(false); return; }
    setHasChanges(
      firstName !== initialFirstName || lastName !== initialLastName || displayName !== initialDisplayName ||
      address !== initialAddress || phone !== initialPhone || zipCode !== initialZip ||
      selectedCountry?.value !== initialCountry?.value || selectedCity?.value !== initialCity?.value ||
      nameOnCard !== initialNameOnCard || cardNumber !== initialCardNumber || expiration !== initialExpiration || cvc !== initialCvc ||
      currentPassword !== "" || newPassword !== "" || confirmPassword !== ""
    );
  }, [firstName, lastName, displayName, address, phone, zipCode, selectedCountry, selectedCity, nameOnCard, cardNumber, expiration, cvc, newPassword, confirmPassword, currentPassword, initialFirstName, initialLastName, initialDisplayName, initialAddress, initialPhone, initialZip, initialCountry, initialCity, initialNameOnCard, initialCardNumber, initialExpiration, initialCvc, initialLoaded]);

  const handleCancel = () => {
    if (!initialLoaded) return;
    setFirstName(initialFirstName); setLastName(initialLastName); setDisplayName(initialDisplayName);
    setAddress(initialAddress); setZipCode(initialZip); setPhone(initialPhone);
    setNameOnCard(initialNameOnCard); setCardNumber(initialCardNumber); setExpiration(initialExpiration); setCvc(initialCvc);
    setCity(typeof initialCity === "object" ? initialCity?.label : initialCity || "");
    let countryOption = null;
    if (initialCountry) countryOption = typeof initialCountry === "object" ? countryOptions.find((c) => c.value === initialCountry.value) || initialCountry : findCountryOption(initialCountry);
    setSelectedCountry(countryOption);
    if (countryOption?.value) {
      const builtCities = buildCityOptionsFromCountryValue(countryOption.value);
      setCityOptions(builtCities);
      setSelectedCity(findCityOption(initialCity, builtCities));
    } else { setCityOptions([]); setSelectedCity(null); }
    setCurrentPassword(""); setNewPassword(""); setConfirmPassword("");
    setHasChanges(false);
  };

  // ── Validation / save ─────────────────────────────────────────────────────

  const isValidNameOnCard = (name) => { const t2 = name.trim(); return t2.length >= 2 && t2.length <= 30 && /^[a-zA-Z\s]+$/.test(t2); };
  const isValidCardNumber = (cardNum) => {
    const cleaned = cardNum.replace(/\D/g, "");
    if (cleaned.length < 13 || cleaned.length > 19) return false;
    let sum = 0, shouldDouble = false;
    for (let i = cleaned.length - 1; i >= 0; i--) {
      let digit = parseInt(cleaned.charAt(i), 10);
      if (shouldDouble) { digit *= 2; if (digit > 9) digit -= 9; }
      sum += digit; shouldDouble = !shouldDouble;
    }
    return sum % 10 === 0;
  };
  const isValidExpiration = (exp) => {
    if (exp.length !== 5 || !/^(0[1-9]|1[0-2])\/\d{2}$/.test(exp)) return false;
    const [monthStr, yearStr] = exp.split("/");
    const month = parseInt(monthStr, 10), year = parseInt(yearStr, 10);
    const now = new Date();
    return !(year < now.getFullYear() % 100 || (year === now.getFullYear() % 100 && month < now.getMonth() + 1));
  };
  const isValidCVC = (value) => value.length >= 3 && value.length <= 4 && /^\d{3,4}$/.test(value);

  const validatePaymentFields = () => {
    if (!nameOnCard && !cardNumber && !expiration && !cvc) { setErrors({}); return true; }
    const newErrors = {};
    if (!isValidNameOnCard(nameOnCard)) newErrors.nameOnCard = t("nameOnCard");
    if (!isValidCardNumber(cardNumber)) newErrors.cardNumber = t("cardNumber");
    if (!isValidExpiration(expiration)) newErrors.expiration = t("invalid_expiration");
    if (!isValidCVC(cvc)) newErrors.cvc = t("invalid_cvc");
    if (Object.keys(newErrors).length) Object.values(newErrors).forEach((msg) => addToast(msg, { appearance: "error", autoDismiss: true }));
    setErrors(newErrors);
    return !Object.keys(newErrors).length;
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!user || !validatePaymentFields()) return;
    setIsLoading(true);
    const userRef = ref(db, `users/${user.uid}`);
    try {
      if (newPassword && confirmPassword) {
        if (newPassword !== confirmPassword) { addToast(t("password_mismatch"), { appearance: "error", autoDismiss: true }); setIsLoading(false); return; }
        if (newPassword.length < 6) { addToast(t("password_strength"), { appearance: "error", autoDismiss: true }); setIsLoading(false); return; }
        try {
          await updatePassword(user, newPassword);
          await set(userRef, { firstName, lastName, displayName, email, password: newPassword, billingInfo: { address, city: selectedCity || "", country: selectedCountry ? { label: selectedCountry.label, value: selectedCountry.value, flag: selectedCountry.flag } : null, zipCode, phone, nameOnCard, cardNumber, expiration, cvc }, role: "guest" });
          // ── LOG: Password Changed ───────────────────────────────────────
          await logActivity({
            username: user.email,
            userId: user.uid,
            action: "PASSWORD_CHANGED",
          });
          addToast(t("password_changed_success"), { appearance: "success", autoDismiss: true });
          setCurrentPassword(""); setNewPassword(""); setConfirmPassword("");
        } catch (error) { addToast(error.message, { appearance: "error", autoDismiss: true }); setIsLoading(false); return; }
      } else {
        await update(userRef, { firstName, lastName, displayName, email, password: currentPassword, billingInfo: { address, city: selectedCity?.label || "", country: selectedCountry ? { label: selectedCountry.label, value: selectedCountry.value, flag: selectedCountry.flag } : null, zipCode, phone, nameOnCard, cardNumber, expiration, cvc }, role: "guest" });
        // ── LOG: Profile Updated ──────────────────────────────────────────
        await logActivity({
          username: user.email,
          userId: user.uid,
          action: "PROFILE_UPDATED",
          details: `${firstName} ${lastName}`.trim(),
        });
      }
      addToast(t("profile_updated"), { appearance: "success", autoDismiss: true });
      setTimeout(() => router.reload(), 1500);
    } catch (error) {
      addToast(error.message, { appearance: "error", autoDismiss: true });
    } finally {
      setIsLoading(false);
    }
  };

  // ── Newsletter helpers ────────────────────────────────────────────────────

  const fetchSchedule = async () => {
    setScheduleLoading(true);
    try {
      const res = await fetch("/api/broadcast-schedule", { headers: { "x-admin-secret": process.env.NEXT_PUBLIC_ADMIN_SECRET } });
      const data = await res.json();
      if (data) { setBroadcastSchedule(data); setBroadcastPeriod(data.period); setBroadcastSubject(data.subject); setBroadcastSendTime(data.sendTime || "12:00"); }
    } finally { setScheduleLoading(false); }
  };

  const fetchSubscriberStats = async () => {
    setSubscriberLoading(true);
    try {
      const res = await fetch("/api/get-subscribers", { headers: { "x-admin-secret": process.env.NEXT_PUBLIC_ADMIN_SECRET } });
      const data = await res.json();
      if (res.ok) setSubscriberStats(data);
    } catch (err) { console.error("Failed to fetch subscriber stats:", err); }
    finally { setSubscriberLoading(false); }
  };

  const handleSaveSchedule = async () => {
    if (!broadcastSubject.trim()) { addToast(t("subject_required"), { appearance: "error", autoDismiss: true }); return; }
    setBroadcastLoading(true);
    try {
      const res = await fetch("/api/broadcast-schedule", { method: "POST", headers: { "Content-Type": "application/json", "x-admin-secret": process.env.NEXT_PUBLIC_ADMIN_SECRET }, body: JSON.stringify({ subject: broadcastSubject, period: broadcastPeriod, sendTime: broadcastSendTime }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setBroadcastSchedule((prev) => ({ ...prev, active: true, nextSendAt: data.nextSendAt }));
      // ── LOG: Schedule Saved ───────────────────────────────────────────
      await logActivity({
        username: user?.email || "",
        userId: user?.uid || "",
        action: "SCHEDULE_SAVED",
        details: `Период: ${broadcastPeriod} | Тема: ${broadcastSubject}`,
      });
      addToast(t("schedule_saved"), { appearance: "success", autoDismiss: true });
    } catch (err) { addToast(err.message, { appearance: "error", autoDismiss: true }); }
    finally { setBroadcastLoading(false); }
  };

  const handleToggleSchedule = async () => {
    const newActive = !broadcastSchedule?.active;
    try {
      await fetch("/api/broadcast-schedule", { method: "PATCH", headers: { "Content-Type": "application/json", "x-admin-secret": process.env.NEXT_PUBLIC_ADMIN_SECRET }, body: JSON.stringify({ active: newActive }) });
      setBroadcastSchedule((prev) => ({ ...prev, active: newActive }));
      // ── LOG: Schedule Toggled ─────────────────────────────────────────
      await logActivity({
        username: user?.email || "",
        userId: user?.uid || "",
        action: "SCHEDULE_TOGGLED",
        details: newActive ? "Распоредот е активиран" : "Распоредот е паузиран",
      });
      addToast(newActive ? t("schedule_resumed") : t("schedule_paused"), { appearance: "info", autoDismiss: true });
    } catch (err) { addToast(err.message, { appearance: "error", autoDismiss: true }); }
  };

  // ── Effects ───────────────────────────────────────────────────────────────

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        setDisplayName(firebaseUser.displayName || "");
        setEmail(firebaseUser.email || "");
        if (firebaseUser.displayName) {
          const parts = firebaseUser.displayName.split(" ");
          setFirstName(parts[0] || ""); setLastName(parts[1] || "");
        }       

        try {
          const snapshot = await get(ref(db, `users/${firebaseUser.uid}`));
          if (snapshot.exists()) {
            const data = snapshot.val();
            setFirstName(data.firstName || ""); setLastName(data.lastName || ""); setDisplayName(data.displayName || "");
            setAddress(data.billingInfo?.address || ""); setZipCode(data.billingInfo?.zipCode || ""); setPhone(data.billingInfo?.phone || "");
            setCurrentPassword(data.password || "");
            setNameOnCard(data.billingInfo?.nameOnCard || ""); setCardNumber(data.billingInfo?.cardNumber || ""); setExpiration(data.billingInfo?.expiration || ""); setCvc(data.billingInfo?.cvc || "");
            setRole(data.role || "guest");
            const countryOption = findCountryOption(data.billingInfo?.country || null);
            setSelectedCountry(countryOption); setInitialCountry(countryOption);
            if (countryOption?.value) {
              const builtCities = buildCityOptionsFromCountryValue(countryOption.value);
              setCityOptions(builtCities);
              const cityOption = findCityOption(data.billingInfo?.city || null, builtCities);
              setSelectedCity(cityOption); setInitialCity(cityOption);
              setCity((cityOption && cityOption.label) || data.billingInfo?.city || "");
            } else { setCityOptions([]); setSelectedCity(null); setInitialCity(null); setCity(data.billingInfo?.city || ""); }
            setInitialFirstName(data.firstName || ""); setInitialLastName(data.lastName || ""); setInitialDisplayName(data.displayName || "");
            setInitialAddress(data.billingInfo?.address || ""); setInitialPhone(data.billingInfo?.phone || ""); setInitialZip(data.billingInfo?.zipCode || "");
            setInitialNameOnCard(data.billingInfo?.nameOnCard || ""); setInitialCardNumber(data.billingInfo?.cardNumber || ""); setInitialExpiration(data.billingInfo?.expiration || ""); setInitialCvc(data.billingInfo?.cvc || "");
          }
        } catch (error) { console.error("Error fetching user data:", error); }
        finally { setInitialLoaded(true); }
      } else {
        setUser(null);
        router.push("/other/login-register");
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (selectedCountry?.value) {
      const builtCities = buildCityOptionsFromCountryValue(selectedCountry.value);
      setCityOptions(builtCities);
      if (selectedCity) {
        const existing = builtCities.find((c) => c.value === selectedCity.value) || builtCities.find((c) => c.label === selectedCity.label);
        setSelectedCity(existing || null);
      } else if (initialCity) {
        const cityFromDB = builtCities.find((c) => c.value === initialCity.value || c.value === initialCity.label);
        if (cityFromDB) setSelectedCity(cityFromDB);
      }
    } else { setCityOptions([]); setSelectedCity(null); }
  }, [selectedCountry, currentLanguage]);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return;
      try {
        const ordersRef = role === "admin" ? ref(db, "orders") : ref(db, `orders/${user.uid}`);
        const snap = await get(ordersRef);
        if (!snap.exists()) { setOrders([]); return; }
        const raw = snap.val();
        let usersData = {};
        if (role === "admin") { const us = await get(ref(db, "users")); usersData = us.exists() ? us.val() : {}; }
        const orderList = [];
        const mapOrder = (id, order, uid) => {
          const computedTotalMK = parseAmount(order?.total, "mk") || getLocalizedTotal(order, "mk");
          const computedTotalEN = parseAmount(order?.total, "en") || getLocalizedTotal(order, "en");
          return {
            userId: uid, id,
            displayName: usersData[uid]?.displayName || order.displayName || displayName || `${firstName} ${lastName}`.trim() || user.displayName || "",
            email: usersData[uid]?.email || order.customer?.email || order.email || email || "",
            date: order.date || "", reservationDate: order.reservationDate, reservationTime: order.reservationTime,
            orderNumber: order.orderNumber, status: order.status,
            subtotalMK: parseAmount(order?.subtotal, "mk"), subtotalEN: parseAmount(order?.subtotal, "en"),
            totalMK: computedTotalMK, totalEN: computedTotalEN,
            currency: computedTotalMK > 0 && computedTotalEN > 0 ? "BOTH" : computedTotalMK > 0 ? "MKD" : "EUR",
            products: order.products || [], paymentMethod: order.paymentMethod || "", paymentText: order.paymentText || "",
            discountMK: parseFloat(order.discount?.mk || 0), discountEN: parseFloat(order.discount?.en || 0), coupon: order.coupon || null,
            customerPhone: order.customer?.phone || "", customerAddress: order.customer?.address || "", customerState: order.customer?.state || "",
            customerCity: order.customer?.city || "", customerPostalCode: order.customer?.postalCode || "",
            createdAt: order.createdAt || 0,
            displayTotal: currentLanguage === "mk" ? computedTotalMK : computedTotalEN,
          };
        };
        if (role === "admin") {
          Object.entries(raw).forEach(([uid, userOrders]) => Object.entries(userOrders).forEach(([id, order]) => orderList.push(mapOrder(id, order, uid))));
        } else {
          Object.entries(raw).forEach(([id, order]) => orderList.push(mapOrder(id, order, user.uid)));
        }
        orderList.sort((a, b) => { if (a.status === "pending" && b.status !== "pending") return -1; if (a.status !== "pending" && b.status === "pending") return 1; return (b.createdAt || 0) - (a.createdAt || 0); });
        setOrders(orderList);
      } catch (err) { console.error("Error fetching orders:", err); }
    };
    fetchOrders();
  }, [user, role, currentLanguage, displayName]);

  useEffect(() => {
    const fetchUsers = async () => {
      if (!user || role !== "admin") return;
      try {
        const snapshot = await get(ref(db, "users"));
        if (!snapshot.exists()) { setAllUsers([]); return; }
        const data = snapshot.val();
        setAllUsers(Object.entries(data).map(([uid, u]) => ({
          uid, firstName: u.firstName || "", lastName: u.lastName || "", displayName: u.displayName || "",
          email: u.email || "", role: u.role || "guest", phone: u.billingInfo?.phone || "",
          address: u.billingInfo?.address || "", city: u.billingInfo?.city || "",
          country: u.billingInfo?.country?.label || u.billingInfo?.country || "",
          zipCode: u.billingInfo?.zipCode || "", coupon: u.coupon || "",
        })));
      } catch (err) { console.error("Error fetching users:", err); }
    };
    fetchUsers();
  }, [user, role]);

  useEffect(() => { checkForChanges(); }, [checkForChanges]);

  const handleLogout = async () => {
    setIsLoading(true);
    try {      
      sessionStorage.removeItem("logged_in_" + user?.uid);
      await signOut(auth);
      setUser(null);
      addToast(t("logout_success"), { appearance: "info", autoDismiss: true });
      setTimeout(() => router.push("/other/login-register"), 2000);
    } catch (error) { addToast(error.message, { appearance: "error", autoDismiss: true }); }
    finally { setIsLoading(false); }
  };

  // ── Render ────────────────────────────────────────────────────────────────

  const analyticsProps = { formatTotal, parseAmount, conversionRate, currentLanguage, getDailyRevenue, getMonthlyRevenue, getYearlyRevenue, getTopProducts, getAverageOrderValue, getOrderSuccessStats, formattedPaymentData, statusData, COLORS, PAYMENT_COLORS, filteredOrdersForCharts, filterYear, setFilterYear, dateRange, setDateRange };

  return (
    <LayoutTwo>
      <BreadcrumbOne pageTitle={t("my_account")} backgroundImage="/assets/images/backgrounds/breadcrumb-bg-2.webp">
        <ul className="breadcrumb__list">
          <li><Link href="/home/trending" aria-label={t("home")}><FaHome size={16} /></Link></li>
          <li>{t("my_account")}</li>
        </ul>
      </BreadcrumbOne>

      <div className="my-account-area space-mt--r130 space-mb--r130">
        <Container>
          <Tab.Container defaultActiveKey="dashboard">
            <Nav variant="pills" className="my-account-area__navigation space-mb--r60">
              <Nav.Item><Nav.Link eventKey="dashboard">{t("dashboard")}</Nav.Link></Nav.Item>
              {role === "admin" && <Nav.Item><Nav.Link eventKey="users">{t("users")}</Nav.Link></Nav.Item>}
              {role === "admin" && <Nav.Item><Nav.Link eventKey="logs">{t("logs")}</Nav.Link></Nav.Item>}
              {role === "admin" && <Nav.Item><Nav.Link eventKey="products">{t("products")}</Nav.Link></Nav.Item>}
              <Nav.Item><Nav.Link eventKey="orders">{t("orders")}</Nav.Link></Nav.Item>
              <Nav.Item><Nav.Link eventKey="download">{t("download")}</Nav.Link></Nav.Item>
              <Nav.Item><Nav.Link eventKey="payment">{t("payment")}</Nav.Link></Nav.Item>
              <Nav.Item><Nav.Link eventKey="accountDetails">{t("account_details")}</Nav.Link></Nav.Item>
            </Nav>

            <Tab.Content>
              <Tab.Pane eventKey="dashboard">
                <DashboardTab
                  t={t} role={role} displayName={displayName} email={email} orders={orders} allUsers={allUsers}
                  isLoading={isLoading} currentLanguage={currentLanguage} formatTotal={formatTotal}
                  parseAmount={parseAmount} conversionRate={conversionRate} userId={user?.uid}
                  setShowLogoutModal={setShowLogoutModal} setShowBroadcastModal={setShowBroadcastModal}
                  fetchSubscriberStats={fetchSubscriberStats} fetchSchedule={fetchSchedule}
                />
              </Tab.Pane>

              {role === "admin" && (
                <Tab.Pane eventKey="users">
                  <UsersTab
                    t={t} allUsers={allUsers} userSearchQuery={userSearchQuery} setUserSearchQuery={setUserSearchQuery}
                    userFilterRole={userFilterRole} setUserFilterRole={setUserFilterRole}
                    currentPageUsers={currentPageUsers} setCurrentPageUsers={setCurrentPageUsers}
                    usersPerPage={usersPerPage} showUserFilters={showUserFilters} setShowUserFilters={setShowUserFilters}
                  />
                </Tab.Pane>
              )}

              {role === "admin" && (
                <Tab.Pane eventKey="logs">
                  <LogsTab />
                </Tab.Pane>
              )}

              {role === "admin" && (
                <Tab.Pane eventKey="products">
                  <ProductsTab
                    t={t}
                    role={role}
                    currentLanguage={currentLanguage}
                    user={user}
                  />
                </Tab.Pane>
              )}

              <Tab.Pane eventKey="orders">
                <OrdersTab
                  t={t} role={role} orders={orders} filteredOrders={filteredOrders}
                  currentOrders={currentOrders} totalPages={totalPages} currentPage={currentPage}
                  paginate={paginate} ordersOnCurrentPage={ordersOnCurrentPage}
                  grandTotalInDisplayCurrency={grandTotalInDisplayCurrency}
                  showFilters={showFilters} setShowFilters={setShowFilters}
                  searchQuery={searchQuery} setSearchQuery={setSearchQuery}
                  filterStatus={filterStatus} setFilterStatus={setFilterStatus}
                  filterPayment={filterPayment} setFilterPayment={setFilterPayment}
                  setCurrentPage={setCurrentPage}
                  updateOrder={updateOrder} viewOrder={viewOrder}
                  setPendingDeleteId={setPendingDeleteId} setShowDeleteModal={setShowDeleteModal}
                  {...analyticsProps}
                />
              </Tab.Pane>

              <Tab.Pane eventKey="download">
                <DownloadTab
                  t={t} role={role} orders={orders} currentLanguage={currentLanguage}
                  downloadingOrderId={downloadingOrderId} selectedOrdersForDownload={selectedOrdersForDownload}
                  selectAllDownload={selectAllDownload} downloadSearchQuery={downloadSearchQuery}
                  setDownloadSearchQuery={setDownloadSearchQuery} downloadFilterPayment={downloadFilterPayment}
                  setDownloadFilterPayment={setDownloadFilterPayment} downloadFilterStatus={downloadFilterStatus}
                  setDownloadFilterStatus={setDownloadFilterStatus} showDownloadFilters={showDownloadFilters}
                  setShowDownloadFilters={setShowDownloadFilters} filteredOrdersForDownload={filteredOrdersForDownload}
                  currentOrdersDownload={currentOrdersDownload} totalPagesDownload={totalPagesDownload}
                  currentPageDown={currentPageDown} handlePageChangeDown={handlePageChangeDown}
                  downloadStats={downloadStats} downloadPdfEnhanced={downloadPdfEnhanced}
                  toggleOrderSelection={toggleOrderSelection} toggleSelectAll={toggleSelectAll}
                  bulkDownloading={bulkDownloading} downloadBulkPdfs={downloadBulkPdfs}
                  setSelectedOrdersForDownload={setSelectedOrdersForDownload}
                  setSelectAllDownload={setSelectAllDownload} setCurrentPageDown={setCurrentPageDown}
                />
              </Tab.Pane>

              <Tab.Pane eventKey="payment">
                <PaymentTab
                  t={t} role={role} filteredOrdersForPayment={filteredOrdersForPayment}
                  currentOrdersPayment={currentOrdersPayment} totalPagesPayment={totalPagesPayment}
                  currentPagePayment={currentPagePayment} handlePageChangePayment={handlePageChangePayment}
                  {...analyticsProps}
                />
              </Tab.Pane>

              <Tab.Pane eventKey="accountDetails">
                <AccountDetailsTab
                  t={t} user={user}
                  firstName={firstName} setFirstName={setFirstName}
                  lastName={lastName} setLastName={setLastName}
                  displayName={displayName} setDisplayName={setDisplayName}
                  email={email} address={address} setAddress={setAddress}
                  zipCode={zipCode} setZipCode={setZipCode}
                  phone={phone} setPhone={setPhone}
                  currentPassword={currentPassword} setCurrentPassword={setCurrentPassword}
                  newPassword={newPassword} setNewPassword={setNewPassword}
                  confirmPassword={confirmPassword} setConfirmPassword={setConfirmPassword}
                  isLoading={isLoading} selectedCountry={selectedCountry} setSelectedCountry={setSelectedCountry}
                  selectedCity={selectedCity} setSelectedCity={setSelectedCity} cityOptions={cityOptions}
                  nameOnCard={nameOnCard} setNameOnCard={setNameOnCard}
                  cardNumber={cardNumber} setCardNumber={setCardNumber}
                  expiration={expiration} setExpiration={setExpiration}
                  cvc={cvc} setCvc={setCvc}
                  hasChanges={hasChanges} initialLoaded={initialLoaded}
                  isCanceling={isCanceling} setIsCanceling={setIsCanceling}
                  handleSave={handleSave} handleCancel={handleCancel}
                  countryOptions={countryOptions} customStyles={customStyles}
                  showCurrentPassword={showCurrentPassword} toggleCurrentPasswordVisibility={toggleCurrentPasswordVisibility}
                  showNewPassword={showNewPassword} toggleNewPasswordVisibility={toggleNewPasswordVisibility}
                  showConfirmPassword={showConfirmPassword} toggleConfirmPasswordVisibility={toggleConfirmPasswordVisibility}
                  formatCardNumber={formatCardNumber} formatExpiration={formatExpiration}
                />
              </Tab.Pane>
            </Tab.Content>
          </Tab.Container>
        </Container>
      </div>

      {/* Delete Order Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton><Modal.Title>{t("confirm_deletion")}</Modal.Title></Modal.Header>
        <Modal.Body><p>{t("are_you_sure_delete_order")}</p></Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>{t("cancel")}</Button>
          <Button variant="danger" onClick={() => { deleteOrder(pendingDeleteId); setShowDeleteModal(false); setCurrentPage(1); }}>{t("yes_delete")}</Button>
        </Modal.Footer>
      </Modal>

      {/* Logout Modal */}
      <Modal show={showLogoutModal} onHide={() => setShowLogoutModal(false)} centered>
        <Modal.Header closeButton><Modal.Title>{t("confirm_logout")}</Modal.Title></Modal.Header>
        <Modal.Body><p>{t("are_you_sure_logout")}</p></Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowLogoutModal(false)} disabled={isLoading}>{t("cancel")}</Button>
          <Button variant="danger" onClick={() => { handleLogout(); setShowLogoutModal(false); }} disabled={isLoading}>
            {isLoading ? <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" /> : t("yes_logout")}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Newsletter Modal */}
      <Modal show={showBroadcastModal} onHide={() => setShowBroadcastModal(false)} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title><i className="bi bi-send me-2"></i>{t("newsletter_schedule")}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {broadcastSchedule && (
            <div className={`alert ${broadcastSchedule.active ? "alert-success" : "alert-secondary"} d-flex justify-content-between align-items-center mb-4`}>
              <div>
                <i className={`bi ${broadcastSchedule.active ? "bi-play-circle-fill" : "bi-pause-circle-fill"} me-2`}></i>
                <strong>{broadcastSchedule.active ? t("schedule_active") : t("schedule_paused")}</strong>
                {broadcastSchedule.nextSendAt && <div className="mt-1"><small className="text-muted">{t("next_send")}: <strong>{new Date(broadcastSchedule.nextSendAt).toLocaleString("en-GB", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false }).replace(/\//g, "-")}</strong></small></div>}
                {broadcastSchedule.lastSentAt && <div><small className="text-muted">{t("last_sent")}: {new Date(broadcastSchedule.lastSentAt).toLocaleString("en-GB", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false }).replace(/\//g, "-")}</small></div>}
              </div>
              <Button size="sm" variant={broadcastSchedule.active ? "outline-warning" : "outline-success"} onClick={handleToggleSchedule}>
                <i className={`bi ${broadcastSchedule.active ? "bi-pause-fill" : "bi-play-fill"} me-1`}></i>
                {broadcastSchedule.active ? t("pause") : t("resume")}
              </Button>
            </div>
          )}
          {subscriberStats && (
            <div className="alert alert-primary d-flex justify-content-between align-items-center mb-4 py-2">
              <span><i className="bi bi-people me-2"></i>{t("active_subscribers")}</span>
              <span className="badge bg-primary fs-6">{subscriberStats.total}</span>
            </div>
          )}
          <hr />
          <h6 className="fw-bold mb-3"><i className="bi bi-calendar-check me-2 text-primary"></i>{t("select_frequency")}</h6>
          <div className="row g-2 mb-4">
            {[
              { value: "daily", label: t("daily"), icon: "bi-calendar-day", color: "primary", desc: t("every_day") },
              { value: "weekly", label: t("weekly"), icon: "bi-calendar-week", color: "success", desc: t("every_7_days") },
              { value: "monthly", label: t("monthly"), icon: "bi-calendar-month", color: "info", desc: t("every_30_days") },
              { value: "3months", label: t("quarterly"), icon: "bi-calendar3", color: "warning", desc: t("every_90_days") },
            ].map((opt) => (
              <div className="col-md-3 col-sm-6" key={opt.value}>
                <div className={`card h-100 ${broadcastPeriod === opt.value ? `border-${opt.color} border-2` : "border"}`} onClick={() => setBroadcastPeriod(opt.value)} style={{ cursor: "pointer" }}>
                  <div className="card-body text-center py-3 position-relative">
                    {broadcastPeriod === opt.value && <i className={`bi bi-check-circle-fill text-${opt.color} position-absolute top-0 end-0 m-2`}></i>}
                    <i className={`bi ${opt.icon} text-${opt.color} d-block mb-2`} style={{ fontSize: "1.8rem" }}></i>
                    <h6 className={`mb-0 text-${opt.color}`}>{opt.label}</h6>
                    <small className="text-muted">{opt.desc}</small>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <hr />
          <h6 className="fw-bold mb-3"><i className="bi bi-pencil me-2 text-primary"></i>{t("compose")}</h6>
          <div className="mb-3">
            <label className="form-label fw-bold">{t("subject")}</label>
            <input type="text" className="form-control" placeholder={t("enter_subject")} value={broadcastSubject} onChange={(e) => setBroadcastSubject(e.target.value)} />
          </div>
          <div className="mb-3">
            <label className="form-label fw-bold"><i className="bi bi-clock me-2"></i>{t("send_time_utc")}</label>
            <input type="text" className="form-control" value={broadcastSendTime} readOnly style={{ pointerEvents: "none", backgroundColor: "#e9ecef", cursor: "not-allowed" }} />
            <small className="text-muted">{t("time_utc_note")}</small>
          </div>
          <div className="alert alert-warning d-flex align-items-center gap-2">
            <i className="bi bi-exclamation-triangle-fill flex-shrink-0"></i>
            <small>
              {t("schedule_will_send_to")} <strong>{subscriberStats?.total ?? "..."}</strong> {t("subscribers")}{" "}
              {broadcastPeriod === "daily" && t("every_day_auto")}
              {broadcastPeriod === "weekly" && t("every_monday")}
              {broadcastPeriod === "monthly" && t("every_month")}
              {broadcastPeriod === "3months" && t("every_3_months")}
              {t("automatically")}
            </small>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowBroadcastModal(false)} disabled={broadcastLoading}>{t("cancel")}</Button>
          <Button variant="primary" onClick={handleSaveSchedule} disabled={broadcastLoading || !broadcastSubject.trim()}>
            {broadcastLoading ? <Spinner as="span" animation="border" size="sm" className="me-2" /> : <i className="bi bi-calendar-check me-2"></i>}
            {t("save_schedule")}
          </Button>
        </Modal.Footer>
      </Modal>
    </LayoutTwo>
  );
};

export default MyAccount;