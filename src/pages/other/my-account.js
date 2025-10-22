import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/router";
import { auth } from "../api/register"; // Import Firebase auth
import { onAuthStateChanged, signOut, updatePassword } from "firebase/auth";
import { getDatabase, ref, set, get, update, remove } from "firebase/database";
import Link from "next/link";
import Tab from "react-bootstrap/Tab";
import Nav from "react-bootstrap/Nav";
import { Container, Row, Col, Spinner, Modal, Button } from "react-bootstrap";
import { AiOutlineEyeInvisible, AiOutlineEye } from "react-icons/ai";
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

function formatDMY(dateStr) {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  if (isNaN(date)) return dateStr; // fallback if not a valid date
  const d = String(date.getDate()).padStart(2, "0");
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const y = date.getFullYear();
  return `${d}-${m}-${y}`;
}

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

  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [dateRange, setDateRange] = useState('30days');

  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
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
  const countryOptions = Country.getAllCountries().map((c) => ({
    value: c.isoCode,
    label: c.name,
    flag: `https://flagcdn.com/24x18/${c.isoCode.toLowerCase()}.png`,
  }));

  const conversionRate = 61.5;

  const parseAmount = (val) => {
    if (val == null) return 0;
    if (typeof val === "number") return val;
    const cleaned = String(val).replace(/[^0-9.-]+/g, "");
    const n = Number(cleaned);
    return Number.isFinite(n) ? n : 0;
  };

  const formatTotal = (amount, currency = "MKD") => {
    const n = parseAmount(amount);
    const cur = (currency || "MKD").toString().toUpperCase();

    if (currentLanguage === "mk") {
      const mkd = cur === "MKD" ? n : n * conversionRate;
      return `${mkd.toFixed(2)} ден.`;
    } else {
      const eur = cur === "EUR" ? n : n / conversionRate;
      return `€ ${eur.toFixed(2)}`;
    }
  };

  const grandTotalInDisplayCurrency = orders.reduce((sum, order) => {
    const amt = parseAmount(order.total);
    const cur = (order.currency || "MKD").toUpperCase();

    if (currentLanguage === "mk") {
      // sum everything as MKD
      return sum + (cur === "MKD" ? amt : amt * conversionRate);
    } else {
      // sum everything as EUR
      return sum + (cur === "EUR" ? amt : amt / conversionRate);
    }
  }, 0);

  const db = getDatabase();

  const findCountryOption = (countryFromDb) => {
    if (!countryFromDb) return null;
    // if already object with value
    if (typeof countryFromDb === "object" && countryFromDb.value) {
      const found = countryOptions.find((c) => c.value === countryFromDb.value);
      if (found) return found;
      // fallback to ensure flag/label/value exist
      return {
        label: countryFromDb.label || countryFromDb.value,
        value: countryFromDb.value,
        flag:
          countryFromDb.flag ||
          `https://flagcdn.com/24x18/${String(countryFromDb.value).toLowerCase()}.png`,
      };
    }
    // if it's a string, try by value (isoCode) or label
    const byValue = countryOptions.find((c) => c.value === countryFromDb);
    if (byValue) return byValue;
    const byLabel = countryOptions.find((c) => c.label === countryFromDb);
    if (byLabel) return byLabel;
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
    return City.getCitiesOfCountry(countryIso).map((c) => ({
      value: c.name,
      label: c.name,
    }));
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

  const paymentData = (orders, currentLanguage) => {
    return orders.reduce((acc, order) => {
      const method = order.paymentMethod || "other";
      const amount =
        currentLanguage === "mk"
          ? order.currency === "MKD"
            ? parseFloat(order.total)
            : parseFloat(order.total) * 61.5
          : order.currency === "EUR"
            ? parseFloat(order.total)
            : parseFloat(order.total) / 61.5;

      const existing = acc.find((d) => d.name === method);
      if (existing) existing.value += amount;
      else acc.push({ name: method, value: amount });
      return acc;
    }, []);
  };

  const statusData = (orders) => {
    return orders.reduce((acc, order) => {
      const status = order.status || "other";
      const existing = acc.find((d) => d.status === status);

      const mkdAmount = parseFloat(order.total || 0);
      const engAmount = mkdAmount / conversionRate; // convert to EUR/USD

      if (existing) {
        existing.mkd += mkdAmount;
        existing.eng += engAmount;
      } else {
        acc.push({ status, mkd: mkdAmount, eng: engAmount });
      }

      return acc;
    }, []);
  };

  // Get unique years from orders
// Get unique years from orders
const getAvailableYears = (orders) => {
  const years = orders.map(order => {
    if (!order.date && !order.createdAt) return new Date().getFullYear();
    const date = order.date ? new Date(order.date) : new Date(order.createdAt);
    return isNaN(date) ? new Date().getFullYear() : date.getFullYear();
  });
  return [...new Set(years)].sort((a, b) => b - a);
};

// Daily Revenue (last N days)
// Daily Revenue (last N days)
const getDailyRevenue = (orders, days = 30) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const dailyData = {};
  
  // Initialize last N days
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateKey = date.toISOString().split('T')[0];
    dailyData[dateKey] = { mkd: 0, eur: 0, count: 0 };
  }
  
  orders.forEach(order => {
    if (!order.date && !order.createdAt) return;
    
    let orderDate;
    if (order.date) {
      // Handle different date formats
      if (order.date.includes('-')) {
        const parts = order.date.split('-');
        if (parts[0].length === 4) {
          // Already in YYYY-MM-DD
          orderDate = new Date(order.date);
        } else {
          // Convert DD-MM-YYYY to YYYY-MM-DD
          orderDate = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
        }
      } else {
        orderDate = new Date(order.date);
      }
    } else {
      orderDate = new Date(order.createdAt);
    }
    
    if (isNaN(orderDate)) return; // Skip invalid dates
    
    orderDate.setHours(0, 0, 0, 0);
    const dateKey = orderDate.toISOString().split('T')[0];
    
    if (dailyData[dateKey]) {
      const mkdAmount = parseFloat(order.total || 0);
      const eurAmount = mkdAmount / conversionRate;
      
      dailyData[dateKey].mkd += mkdAmount;
      dailyData[dateKey].eur += eurAmount;
      dailyData[dateKey].count += 1;
    }
  });
  
  // Month names for both languages
  const monthNames = {
    en: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    mk: ['Јан', 'Фев', 'Мар', 'Апр', 'Мај', 'Јун', 'Јул', 'Авг', 'Сеп', 'Окт', 'Ное', 'Дек']
  };
  
  return Object.entries(dailyData).map(([date, data]) => {
    const dateObj = new Date(date);
    const day = String(dateObj.getDate()).padStart(2, '0');
    const monthIndex = dateObj.getMonth();
    const monthName = currentLanguage === 'mk' ? monthNames.mk[monthIndex] : monthNames.en[monthIndex];
    
    return {
      date: `${day} ${monthName}`,  // "05 Окт" or "05 Oct"
      fullDate: date,
      revenue: currentLanguage === 'mk' ? data.mkd : data.eur,
      orders: data.count
    };
  });
};

// Monthly Revenue for a specific year
const getMonthlyRevenue = (orders, year) => {
  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];
  
  const monthlyData = months.map((month, index) => ({
    month: currentLanguage === 'mk' ? 
      ['Јан', 'Фев', 'Мар', 'Апр', 'Мај', 'Јун', 'Јул', 'Авг', 'Сеп', 'Окт', 'Ное', 'Дек'][index] : 
      month,
    mkd: 0,
    eur: 0,
    count: 0
  }));
  
  orders.forEach(order => {
    if (!order.date && !order.createdAt) return;
    
    let orderDate;
    if (order.date) {
      if (order.date.includes('-')) {
        const parts = order.date.split('-');
        if (parts[0].length === 4) {
          orderDate = new Date(order.date);
        } else {
          // Convert DD-MM-YYYY to YYYY-MM-DD
          orderDate = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
        }
      } else {
        orderDate = new Date(order.date);
      }
    } else {
      orderDate = new Date(order.createdAt);
    }
    
    if (isNaN(orderDate)) return;
    
    if (orderDate.getFullYear() === year) {
      const monthIndex = orderDate.getMonth();
      const mkdAmount = parseFloat(order.total || 0);
      const eurAmount = mkdAmount / conversionRate;
      
      monthlyData[monthIndex].mkd += mkdAmount;
      monthlyData[monthIndex].eur += eurAmount;
      monthlyData[monthIndex].count += 1;
    }
  });
  
  return monthlyData.map(data => ({
    ...data,
    revenue: currentLanguage === 'mk' ? data.mkd : data.eur
  }));
};

// Yearly Revenue Comparison
const getYearlyRevenue = (orders) => {
  const yearlyData = {};
  
  orders.forEach(order => {
    if (!order.date && !order.createdAt) return;
    
    let orderDate;
    if (order.date) {
      if (order.date.includes('-')) {
        const parts = order.date.split('-');
        if (parts[0].length === 4) {
          orderDate = new Date(order.date);
        } else {
          // Convert DD-MM-YYYY to YYYY-MM-DD
          orderDate = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
        }
      } else {
        orderDate = new Date(order.date);
      }
    } else {
      orderDate = new Date(order.createdAt);
    }
    
    if (isNaN(orderDate)) return;
    
    const year = orderDate.getFullYear();
    
    if (!yearlyData[year]) {
      yearlyData[year] = { mkd: 0, eur: 0, count: 0 };
    }
    
    const mkdAmount = parseFloat(order.total || 0);
    const eurAmount = mkdAmount / conversionRate;
    
    yearlyData[year].mkd += mkdAmount;
    yearlyData[year].eur += eurAmount;
    yearlyData[year].count += 1;
  });
  
  return Object.entries(yearlyData)
    .map(([year, data]) => ({
      year,
      revenue: currentLanguage === 'mk' ? data.mkd : data.eur,
      orders: data.count
    }))
    .sort((a, b) => a.year - b.year);
};

// Top Products/Services
// Top Products/Services
const getTopProducts = (orders, limit = 5) => {
  const productStats = {};
  
  orders.forEach(order => {
    const orderCurrency = (order.currency || "MKD").toString().toUpperCase();
    
    (order.products || []).forEach(product => {
      // Handle nested name object {en: "...", mk: "..."}
      let productName;
      if (typeof product.name === 'object' && product.name !== null) {
        productName = currentLanguage === 'mk' ? product.name.mk : product.name.en;
      } else {
        productName = product.name || 'Unknown';
      }
      
      if (!productStats[productName]) {
        productStats[productName] = { count: 0, mkd: 0, eur: 0 };
      }
      
      const quantity = product.quantity || 1;
      productStats[productName].count += quantity;
      
      // Handle nested price object {en: 32.51, mk: 2000}
      let price = 0;
      if (typeof product.price === 'object' && product.price !== null) {
        // Price object has both currencies
        const mkdPrice = parseFloat(product.price.mk || 0);
        const eurPrice = parseFloat(product.price.en || 0);
        
        productStats[productName].mkd += mkdPrice * quantity;
        productStats[productName].eur += eurPrice * quantity;
      } else {
        // Simple price number (fallback)
        price = parseFloat(product.price || 0);
        const totalPrice = price * quantity;
        
        if (orderCurrency === "MKD") {
          productStats[productName].mkd += totalPrice;
          productStats[productName].eur += totalPrice / conversionRate;
        } else {
          productStats[productName].eur += totalPrice;
          productStats[productName].mkd += totalPrice * conversionRate;
        }
      }
    });
  });
  
  return Object.entries(productStats)
    .map(([name, stats]) => ({
      name,
      count: stats.count,
      revenue: currentLanguage === 'mk' ? stats.mkd : stats.eur
    }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, limit);
};
// Average Order Value
const getAverageOrderValue = (orders) => {
  if (orders.length === 0) return 0;
  
  let totalMKD = 0;
  let totalEUR = 0;
  
  orders.forEach(order => {
    const amount = parseFloat(order.total || 0);
    const currency = (order.currency || "MKD").toString().toUpperCase();
    
    if (currency === "MKD") {
      totalMKD += amount;
      totalEUR += amount / conversionRate;
    } else {
      totalEUR += amount;
      totalMKD += amount * conversionRate;
    }
  });
  
  // Return average in the display currency
  if (currentLanguage === 'mk') {
    return totalMKD / orders.length;
  } else {
    return totalEUR / orders.length;
  }
};

// Order Success Rate (Confirmed vs Total)
const getOrderSuccessStats = (orders) => {
  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    confirmed: orders.filter(o => o.status === 'confirmed').length,
    cancelled: orders.filter(o => o.status === 'cancelled').length
  };
  
  stats.successRate = stats.total > 0 
    ? ((stats.confirmed / stats.total) * 100).toFixed(1) 
    : 0;
  
  return stats;
};

  const formattedPaymentData = paymentData(orders, currentLanguage).map(
    (entry) => {
      let name = entry.name;

      if (name === "payment_bank") {
        name = currentLanguage === "mk" ? "Банка" : "Bank";
      } else if (name === "payment_cash") {
        name = currentLanguage === "mk" ? "Готовина" : "Cash";
      }

      return { ...entry, name };
    }
  );

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
        reservationDate,
        reservationTime,
        total,
        products,
        customer,
        email,
        language,
        displayName,
        paymentMethod,
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

      const payload = {
        to: toEmail,
        from: "confirmation@kikamakeupandbeautyacademy.com",
        orderNumber,
        status: newStatus,
        reservationDate,
        reservationTime,
        customerName: displayName,
        paymentMethod,
        total,
        products,
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

  useEffect(() => {
    if (selectedCountry) {
      const cities = City.getCitiesOfCountry(selectedCountry.value).map(
        (c) => ({
          value: c.name,
          label: c.name,
        })
      );
      setCityOptions(cities);
      if (!selectedCity && userData?.billingInfo?.city) {
        const cityFromDB = cities.find(
          (c) => c.value === userData.billingInfo.city
        );
        if (cityFromDB) setSelectedCity(cityFromDB);
      }
    } else {
      setCityOptions([]);
      setSelectedCity(null);
    }
  }, [selectedCountry]);

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
              const subtotal = parseAmount(order.subtotal);
              const total = parseAmount(order.total);
              const currency = (order.currency || "MKD")
                .toString()
                .toUpperCase();

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
                subtotal,
                total,
                currency,
                products: order.products || [],
                paymentMethod: order.paymentMethod || "",
                customerPhone: order.customer?.phone || "",
                customerAddress: order.customer?.address || "",
                customerState: order.customer?.state || "",
                customerCity: order.customer?.city || "",
                customerPostalCode: order.customer?.postalCode || "",
                createdAt: order.createdAt || 0,
              });
            });
          });
        } else {
          Object.entries(raw).forEach(([id, order]) => {
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
              total: order.total,
              products: order.products || [],
              paymentMethod: order.paymentMethod || "",
              customerPhone: order.customer?.phone || "",
              customerAddress: order.customer?.address || "",
              customerState: order.customer?.state || "",
              customerCity: order.customer?.city || "",
              customerPostalCode: order.customer?.postalCode || "",
              createdAt: order.createdAt || 0,
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
      // Build a stronger order object to send to the server for PDF generation
      const orderForPdf = {
        ...order,
        // prefer order.displayName (from fetchOrders) else use local displayName state
        displayName: order.displayName || displayName || null,
        // ensure .customer object exists and contains useful fields (null when missing)
        customer: {
          ...(order.customer || {}),
          // some orders only had address/phone/email under order.customer
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

  return (
    <LayoutTwo>
      <BreadcrumbOne
        pageTitle={t("my_account")}
        backgroundImage="/assets/images/backgrounds/breadcrumb-bg-2.jpg"
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
                  <h3>{t("dashboard")}</h3>
                  <div className="welcome">
                    <p>
                      {t("hello")},{" "}
                      <strong>{displayName || user?.email || ""}</strong> (
                      {t("if_not")}{" "}
                      <strong>{displayName || user?.email || ""}!</strong>)
                    </p>
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
                        t("logout")
                      )}
                    </button>
                  </div>
                  <p className="mt-2">{t("dashboard_welcome")}</p>
                </div>
              </Tab.Pane>
              <Tab.Pane eventKey="orders">
                <div className="my-account-area__content">
                  <h3>{t("orders")}</h3>
                  {orders.length === 0 ? (
                    <div className="saved-message">
                      <p>{t("you_have_not_made_any_order_yet")}</p>
                    </div>
                  ) : (
                    <div className="myaccount-table table-responsive text-center">
                      <table className="table table-bordered">
                        <thead className="thead-light">
                          <tr>
                            {role === "admin" && <th>{t("user")}</th>}
                            <th>{t("order")}</th>
                            <th>{t("date")}</th>
                            <th>{t("date_of_reservation")}</th>
                            <th>{t("time_of_reservation")}</th>
                            <th>{t("status")}</th>
                            <th>{t("total")}</th>
                            <th>{t("action")}</th>
                          </tr>
                        </thead>
                        <tbody>
                          {orders.map((order) => (
                            <tr key={order.id}>
                              {role === "admin" && <td>{order.displayName}</td>}
                              <td>{order.orderNumber}</td>
                              <td>{order.date}</td>
                              <td>{formatDMY(order.reservationDate)}</td>
                              <td>{order.reservationTime}</td>
                              <td>
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
                                    className="form-select"
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
                                    className="fs-6 p-2"
                                  >
                                    {t(order.status)}
                                  </Badge>
                                )}
                              </td>
                              <td>
                                {formatTotal(order.total, order.currency)}
                              </td>
                              <td>
                                <button
                                  type="button"
                                  className="btn btn-primary me-2"
                                  onClick={() =>
                                    viewOrder(order.id, order.userId)
                                  }
                                >
                                  {t("view")}
                                </button>
                                <button
                                  onClick={() => {
                                    setPendingDeleteId(order.id);
                                    setShowDeleteModal(true);
                                  }}
                                  className="btn btn-outline-danger"
                                >
                                  {t("delete")}
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot>
                          <tr>
                            <td
                              colSpan={role === "admin" ? 6 : 5}
                              className="text-end font-weight-bold"
                            >
                              {t("grand_total_label")}
                            </td>
                            <td>
                              {formatTotal(
                                grandTotalInDisplayCurrency,
                                currentLanguage === "mk" ? "MKD" : "EUR"
                              )}
                            </td>
                            <td />
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  )}
                  {role === "admin" && orders.length > 0 && (
                    <div className="financial-reports mt-4">
                      <h4 className="mb-4 mt-4 text-center text-md-start">
                        {t("financial_reports")}
                      </h4>

                      {/* Key Metrics Cards */}
                      <div className="row mb-4">
                        <div className="col-12 col-md-3 mb-3">
                          <div className="card text-center">
                            <div className="card-body">
                              <h6 className="text-muted">{t("total_orders")}</h6>
                              <h3>{orders.length}</h3>
                            </div>
                          </div>
                        </div>
                        <div className="col-12 col-md-3 mb-3">
                          <div className="card text-center">
                            <div className="card-body">
                              <h6 className="text-muted">{t("total_revenue")}</h6>
                              <h3>{formatTotal(grandTotalInDisplayCurrency, currentLanguage === "mk" ? "MKD" : "EUR")}</h3>
                            </div>
                          </div>
                        </div>
                        <div className="col-12 col-md-3 mb-3">
                          <div className="card text-center">
                            <div className="card-body">
                              <h6 className="text-muted">{t("avg_order_value")}</h6>
                              <h3>{formatTotal(getAverageOrderValue(orders), currentLanguage === "mk" ? "MKD" : "EUR")}</h3>
                            </div>
                          </div>
                        </div>
                        <div className="col-12 col-md-3 mb-3">
                        <div className="card text-center">
                          <div className="card-body">
                            <h6 className="text-muted">{t("order_success_rate")}</h6>
                            <h3>{getOrderSuccessStats(orders).successRate}%</h3>
                            <small className="text-muted">
                              {getOrderSuccessStats(orders).confirmed} / {getOrderSuccessStats(orders).total}
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
                                <h5>{t("daily_revenue_trend")}</h5>
                                <select 
                                  className="form-select" 
                                  style={{width: 'auto'}}
                                  value={dateRange}
                                  onChange={(e) => setDateRange(e.target.value)}
                                >
                                  <option value="7days">{t("last_7_days")}</option>
                                  <option value="30days">{t("last_30_days")}</option>
                                  <option value="90days">{t("last_90_days")}</option>
                                </select>
                              </div>
                              <div style={{ width: "100%", height: 300 }}>
                                <ResponsiveContainer>
                                  <BarChart 
                                    data={getDailyRevenue(
                                      orders, 
                                      dateRange === '7days' ? 7 : dateRange === '30days' ? 30 : 90
                                    )}
                                    margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                                  >
                                    <XAxis dataKey="date" />
                                    <YAxis />
                                    <Tooltip 
                                      formatter={(value, name) => [
                                        value.toLocaleString(undefined, {
                                          minimumFractionDigits: 2,
                                          maximumFractionDigits: 2,
                                        }),
                                        name === "revenue" 
                                          ? (currentLanguage === "mk" ? "Приход" : "Revenue")
                                          : (currentLanguage === "mk" ? "Нарачки" : "Orders")
                                      ]}
                                    />
                                    <Bar dataKey="revenue" fill="#0088FE" />
                                  </BarChart>
                                </ResponsiveContainer>
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
                                  <h5>{t("monthly_revenue")}</h5>
                                  <select 
                                    className="form-select" 
                                    style={{width: 'auto'}}
                                    value={selectedYear}
                                    onChange={(e) => setSelectedYear(Number(e.target.value))}
                                  >
                                    {getAvailableYears(orders).map(year => (
                                      <option key={year} value={year}>{year}</option>
                                    ))}
                                  </select>
                                </div>
                                <div style={{ width: "100%", height: 300 }}>
                                  <ResponsiveContainer>
                                    <BarChart 
                                      data={getMonthlyRevenue(orders, selectedYear)}
                                      margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                                    >
                                      <XAxis dataKey="month" />
                                      <YAxis />
                                      <Tooltip 
                                        formatter={(value) => [
                                          value.toLocaleString(undefined, {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2,
                                          }),
                                          currentLanguage === "mk" ? "Приход" : "Revenue"
                                        ]}
                                      />
                                      <Bar dataKey="revenue" fill="#00C49F" />
                                    </BarChart>
                                  </ResponsiveContainer>
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
              <h5 className="mb-3">{t("yearly_comparison")}</h5>
              <div style={{ width: "100%", height: 300 }}>
                <ResponsiveContainer>
                  <BarChart 
                    data={getYearlyRevenue(orders)}
                    margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                  >
                    <XAxis dataKey="year" />
                    <YAxis />
                    <Tooltip 
                      formatter={(value) => [
                        value.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        }),
                        currentLanguage === "mk" ? "Приход" : "Revenue"
                      ]}
                    />
                    <Bar dataKey="revenue" fill="#FFBB28" />
                  </BarChart>
                </ResponsiveContainer>
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
          {t("revenue_by_payment_method")}
        </h5>
        <div style={{ width: "100%", height: 300 }}>
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
                {formattedPaymentData.map((entry, index) => (
                  <Cell
                    key={index}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
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
      </div>
    </div>
  </div>

  <div className="col-12 col-md-6 mb-4">
    <div className="card">
      <div className="card-body">
        <h5 className="mb-3">
          {t("revenue_by_status")}
        </h5>
        <div style={{ width: "100%", height: 300 }}>
          <ResponsiveContainer>
            <BarChart
              data={statusData(orders).map((entry) => {
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
              })}
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
                {statusData(orders).map((entry, index) => (
                  <Cell
                    key={index}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  </div>
</div>
                      
                      {/* Top Products */}
<div className="row mb-4">
  <div className="col-12">
    <div className="card">
      <div className="card-body">
        <h5 className="mb-3">{t("top_products")}</h5>
        {getTopProducts(orders).length > 0 ? (
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>{t("product_name")}</th>
                  <th>{t("quantity_sold")}</th>
                  <th className="text-end">{t("revenue")}</th>
                </tr>
              </thead>
              <tbody>
                {getTopProducts(orders).map((product, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{product.name}</td>
                    <td>{product.count}</td>
                    <td className="text-end">
                      {formatTotal(product.revenue, currentLanguage === "mk" ? "MKD" : "EUR")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-muted">{t("no_products_found")}</p>
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
                  <h3>{t("download")}</h3>
                  {orders.length === 0 ? (
                    <div className="saved-message">
                      <p>{t("you_have_not_downloaded_any_file_yet")}</p>
                    </div>
                  ) : (
                    <div className="myaccount-table table-responsive text-center">
                      <table className="table table-bordered">
                        <thead className="thead-light">
                          <tr>
                            {role === "admin" && <th>{t("user")}</th>}
                            <th>{t("order")}</th>
                            <th>{t("date")}</th>
                            <th>{t("payment_method")}</th>
                            <th>{t("download")}</th>
                          </tr>
                        </thead>
                        <tbody>
                          {orders.map((order) => (
                            <tr key={order.id}>
                              {/* Show user column for both roles */}
                              {role === "admin" && <td>{order.displayName}</td>}
                              <td>{order.orderNumber}</td>
                              <td>{order.date}</td>
                              <td>
                                {order.paymentMethod === "payment_cash"
                                  ? t("payment_cash")
                                  : t("payment_bank")}
                              </td>
                              <td>
                                <button
                                  className="btn btn-outline-secondary"
                                  onClick={() => downloadPdf(order)} // <-- uses new function
                                  disabled={downloadingOrderId === order.id}
                                >
                                  {downloadingOrderId === order.id ? (
                                    <Spinner
                                      as="span"
                                      animation="border"
                                      size="sm"
                                      role="status"
                                      aria-hidden="true"
                                    />
                                  ) : (
                                    t("download")
                                  )}
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
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
                          {orders.map((order, index) => (
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
                                <label className="required">
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
