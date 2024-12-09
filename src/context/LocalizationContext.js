import React, { createContext, useContext, useState, useEffect } from 'react';

const fonts = {
  en: "'Dancing Script', cursive", 
  mk: "'Caveat', cursive",   
};

const translations = {
  en: {
    english: "English",
    macedonian: "Macedonian",
    order_online_call: "Order Online Call",
    signup_login: "Sign Up / Login",
    title: "Kika Makeup and Beauty Academy",
    spring_summer: "Spring summer 2024",
    find_your_style: "Find your style. Fall fashion 2024",
    shop_now: "Shop Now",
    men_collection: "MEN COLLECTION",
    sport_collection: "SPORT COLLECTION",
    women_collection: "WOMEN COLLECTION",
    feeling_relax_day: "Feeling relax day, <br /> Enjoy weekend",
    home: "Home",
    shop: "Shop",
    checkout: "Checkout",
    my_account: "My Account",
    login_register: "Login Register",
    about_us: "About Us",
    contact_us: "Contact Us",
    faq: "F.A.Q",
    see_more: "SEE MORE ...",
    read_more: "Read more",
    free_shipping: "FREE SHIPPING",
    free_shipping_description: "On all orders over $75.00",
    free_returns: "FREE RETURNS",
    free_returns_description: "30 days money back guarantee",
    secure_payment: "SECURE PAYMENT",
    brand_name: "makeupbykika",
    all_rights_reserved: "All Rights Reserved",
    about: "ABOUT",
    about_us: "About us",
    store_location: "Store location",
    contact: "Contact",
    orders_tracking: "Orders tracking",
    useful_links: "Useful links",
    returns: "Returns",
    support_policy: "Support Policy",
    size_guide: "Size guide",
    faqs: "FAQs",
    follow_us: "Follow us on",
    subscribe: "Subscribe.",
    subscribe_message: "Subscribe to our newsletter to receive news on updates.",
    email_placeholder: "Your email address",
    contact_title: "Contact",
    home: "Home",
    contact: "Contact",
    contact_detail: "Contact detail",
    come_have_a_look: "COME HAVE A LOOK",
    address: "Address",
    address_details: "Bul. Turisticka 40, Ohrid - Macedonia 6000",
    contact: "Contact",
    mobile: "Mobile",
    phone: "Phone",
    mail: "Mail",
    hours_of_operation: "Hour of operation",
    monday_to_friday: "Monday – Friday",
    weekend_hours: "Sunday & Saturday",
    get_in_touch: "Get in touch",
    first_name: "First Name *",
    email: "Email *",
    subject: "Subject",
    message: "Message",
    submit: "Submit",
    about_page_title: "About",
    home: "Home",
    about: "About",
    simply_or_white: "SIMPLY OR WHITE",
    clever_unique_ideas: "Clever & unique ideas",
    about_page_description: "About us - Kika Makeup and Beauty Academy",
    store: "STORE",
    our_story: "OUR STORY",
    our_story_link: "OUR STORY",
    address: "Address",
    address_value: "Bul. Turisticka 40, Ohrid - Macedonia 6000",
    phone: "Phone",
    mobile: "Mobile",
    email: "Email",
    email_value: "contact@makeupbykika.com",
    about_page_extra_description: "Welcome to Kika Makeup and Beauty Academy, a place where creativity, innovation, and professionalism come together to prepare the future experts in the beauty industry. Our mission is to provide our students with the best training and practical skills to set them on the path to success. As an academy dedicated to makeup and beauty, we offer comprehensive courses that cover not only the basics of makeup but also advanced techniques that are current in the global market. Our program is designed to inspire the creative potential of our students and develop them into highly qualified professionals capable of tackling any challenge in the industry. At Kika Makeup and Beauty Academy, we value an individualized approach and strive to create a motivating and inspiring environment for every student. Our courses focus on the development of makeup techniques as well as the importance of confidence and creativity, which are crucial for building successful careers in this dynamic industry. Whether you aspire to become a professional makeup artist, a beautician, or to refine your skills in the latest beauty trends, our academy is here to guide you on that journey and provide you with the highest training standards.",
    online_store: "online store",
    testimonial_title: "Testimonial",
    our_brands_title: "Our Brands",
    about_us_title: "About Us",
    about_us_description: "At Kika Makeup and Beauty Academy, we are dedicated to inspiring creativity, delivering excellence, and empowering future beauty professionals. Our academy offers comprehensive training in timeless makeup techniques and cutting-edge beauty skills, ensuring our students are prepared for success in a dynamic industry. We focus on nurturing talent and fostering confidence, helping individuals build lasting careers in the world of makeup and beauty.",
    showing: "Showing",
    of: "of",
    result: "result",
    default: "Default",
    price_high_to_low: "Price - High to Low",
    price_low_to_high: "Price - Low to High",
    filter: "Filter",
    categories: "Categories",
    all_categories: "All categories",
    no_categories_found: "No categories found",
    colors: "Colors",
    no_colors_found: "No colors found",
    sizes: "Sizes",
    all_sizes: "All sizes",
    no_sizes_found: "No sizes found",
    tags: "Tags",
    no_tags_found: "No tags found",    
    decor: "Decor",
    fashion: "Fashion",
    men: "Men's Clothing",
    women: "Women's Clothing",
    cosmetics: "Cosmetics",
    furniture: "Furniture",
    perfumes: "Perfumes",
    wearables: "Wearables",
    jewelry: "Jewelry",
    swimsuit: "Swimsuits",
    x: "Small",
    m: "Medium",
    xl: "Large",
    xxl: "Extra Large",
    decor: "Decoration",
    fashion: "Fashion",
    men: "Men's Wear",
    women: "Women's Wear",
    searchPlaceholder: "Search products ...",    
    allCategories: "All categories",
    noCategories: "No categories found",
    colors: "Colors",
    clearFilter: "x",
    noColors: "No colors found",
    popularProducts: "Popular products",
    noPopularProducts: "No products found",
    tags: "Tags",
    noTags: "No tags found",
    added_to_wishlist: "Added to wishlist",
    add_to_wishlist: "Add to wishlist",
    added_to_compare: "Added to compare",
    add_to_compare: "Add to compare",
    quick_view: "Quick view",
    choose_language: "Choose Language",
    choose_currency: "Choose Currency",
    search_here: "Search here",
    dashboard: "Dashboard",
    orders: "Orders",
    downloads: "Downloads",
    payment_method: "Payment Method",
    billing_address: "Billing Address",
    account_details: "Account Details",
    hello_user: "Hello, {name}",
    if_not: "If Not ",
    logout: "Logout",
    dashboard_intro: "From your account dashboard, you can easily check & view your recent orders, manage your shipping and billing addresses, and edit your password and account details.",
    order: "Order",
    date: "Date",
    status: "Status",
    total: "Total",
    action: "Action",
    pending: "Pending",
    view: "View",
    product: "Product",
    expire: "Expire",
    download: "Download",
    free_template: "Free Real Estate PSD Template",
    yes: "Yes",
    download_file: "Download File",
    customer_login: "Customer Login",
    home: "Home",
    login: "Login",
    welcome_back: "Great to have you back!",
    username_or_email: "Username or email address",
    password: "Password",
    remember_me: "Remember me",
    lost_password: "Lost your password?",
    register: "Register",
    no_account_register: "If you don’t have an account, register now!",
    email_address: "Email Address",
    email_placeholder: "Enter your email",
    password_placeholder: "Enter your password",
    dashboard_welcome: "This is your dashboard, where you can easily review your latest orders, manage your shipping and billing addresses, and update your password and profile information.",
    no_payment_saved: "You have not saved a payment method yet.",
    edit_address: "Edit address",    
    last_name: "Last name",
    display_name: "Display name",
    email_address: "Email Address",
    password_change: "Change password",
    current_password: "Current password",
    new_password: "New password",
    confirm_password: "Confirm password",
    save_changes: "Save changes"
  },
  mk: {
    english: "Англиски",
    macedonian: "Македонски",
    order_online_call: "Нарачајте онлајн",
    signup_login: "Регистрирајте се / Најавете се",
    title: "Кика Академија за Шминка и Убавина",
    spring_summer: "Пролет лето 2024",
    find_your_style: "Пронајдете го вашиот стил. Мода за есен 2024",
    shop_now: "Купи сега",
    men_collection: "МAШКА КОЛЕКЦИЈА",
    sport_collection: "СПОРТСКА КОЛЕКЦИЈА",
    women_collection: "ЖЕНСКА КОЛЕКЦИЈА",
    feeling_relax_day: "Опуштен ден, <br /> Уживајте за викендот",
    home: "Дома",
    shop: "Продавница",
    checkout: "Плаќање",
    my_account: "Мој Профил",
    login_register: "Најавете се / Регистрирајте се",
    about_us: "За Нас",
    contact_us: "Контакт",
    faq: "Најчесто поставувани прашања",
    see_more: "Повеќе",
    read_more: "Прочитај повеќе",
    free_shipping: "БЕСПЛАТЕН ПРЕВОЗ",
    free_shipping_description: "На сите нарачки над $75.00",
    free_returns: "БЕСПЛАТНИ ВРАЌАЊА",
    free_returns_description: "Гаранција за поврат на парите во рок од 30 дена",
    secure_payment: "БЕЗБЕДНО ПЛАЌАЊЕ",
    brand_name: "makeupbykika",
    all_rights_reserved: "Сите права се задржани",
    about: "ЗА НАС",
    about_us: "За нас",
    store_location: "Локација на продавница",
    contact: "Контакт",
    orders_tracking: "Следење на нарачки",
    useful_links: "Линкови",
    returns: "Враќања",
    support_policy: "Политика за поддршка",
    size_guide: "Водич за големини",
    faqs: "Најчесто поставувани прашања",
    follow_us: "Следете не на",
    subscribe: "Претплатете се.",
    subscribe_message: "Претплатете се на нашиот билтен за да добивате новости за ажурирања.",
    email_placeholder: "Вашата email адреса",
    contact_title: "Контакт",
    home: "Дома",
    contact: "Контакт",
    contact_detail: "Детали за контакт",
    come_have_a_look: "ДОЈДЕТЕ И ПОГЛЕДНЕТЕ",
    address: "АДРЕСА",
    address_details: "Бул. Туристичка 40, Охрид - Македонија 6000",
    contact: "Контакт",
    mobile: "Мобилен",
    phone: "Телефон",
    mail: "Пошта",
    hours_of_operation: "Работно време",
    monday_to_friday: "Понеделник – Петок",
    weekend_hours: "Недела & Сабота",
    get_in_touch: "Контактирајте не",
    first_name: "Име *",
    email: "Е-пошта *",
    subject: "Предмет",
    message: "Порака",
    submit: "Испрати",
    about_page_title: "За нас",
    home: "Дома",
    about: "За нас",
    simply_or_white: "ЕДНОСТАВНО ИЛИ БЕЛО",
    clever_unique_ideas: "Паметни и уникатни идеи",
    about_page_description: "За нас - Кика Makeup and Beauty Academy",
    store: "ДОМА",
    our_story: "НАШАТА ИСТОРИЈА",
    our_story_link: "НАШАТА ИСТОРИЈА",
    address: "Адреса",
    address_value: "Бул. Туристичка 40, Охрид - Македонија 6000",
    phone: "Телефон",
    mobile: "Мобилен",
    email: "Е-пошта",
    email_value: "contact@makeupbykika.com",
    about_page_extra_description: "Добредојдовте во Кика Makeup and Beauty Academy, место каде што креативноста, иновацијата и професионализмот се комбинираат за да ги подготвиме идните експерти во индустријата за убавина. Наша мисија е да им овозможиме на нашите студенти најдобра обука и практични вештини кои ќе ги постават на патот кон успехот. Како академија посветена на шминкањето и убавината, нудиме сеопфатни курсеви кои опфаќаат не само основите на шминкањето, туку и напредни техники кои се актуелни на глобалниот пазар. Нашата програма е дизајнирана да ги поттикне креативните потенцијали на нашите студенти и да ги развие во високо квалификувани професионалци кои можат да се справат со секој предизвик во индустријата. Во Кика Makeup and Beauty Academy, го цениме индивидуалниот пристап и се стремиме да создадеме поттикнувачка и инспиративна средина за секој студент. Нашите курсеви се фокусирани на развојот на техниките за шминкање, како и на важноста на самодовербата и креативноста, што е клучно за градење успешни кариера во оваа динамична индустрија. Без разлика дали сакате да станете професионален шминкер, козметичар или да се усовршите во најновите трендови на убавина, нашата академија е тука за да ве води на тој пат и да ви овозможи највисоките стандарди на обука.",
    online_store: "онлајн продавница",
    testimonial_title: "Лични искуства",
    our_brands_title: "Брендови",
    about_us_title: "За Нас",
    about_us_description: "Добредојдовте во Кика Makeup and Beauty Academy, место каде што креативноста, иновацијата и професионализмот се комбинираат за да ги подготвиме идните експерти во индустријата за убавина. Наша мисија е да им овозможиме на нашите студенти најдобра обука и практични вештини кои ќе ги постават на патот кон успехот. Како академија посветена на шминкањето и убавината, нудиме сеопфатни курсеви кои опфаќаат не само основите на шминкањето, туку и напредни техники кои се актуелни на глобалниот пазар.",
    showing: "Прикажани",
    of: "од",
    result: "резултати",
    default: "Стандардно",
    price_high_to_low: "Цена - Од висока до ниска",
    price_low_to_high: "Цена - Од ниска до висока",
    filter: "Филтер",
    categories: "Категории",
    all_categories: "Сите категории",
    no_categories_found: "Нема категории",
    colors: "Бои",
    no_colors_found: "Нема бои",
    sizes: "Големини",
    all_sizes: "Сите големини",
    no_sizes_found: "Нема големини",
    tags: "Тагови",
    no_tags_found: "Нема тагови",    
    decor: "Декор",
    fashion: "Мода",
    men: "Мушка облека",
    women: "Женска облека",
    cosmetics: "Козметика",
    furniture: "Мебел",
    perfumes: "Парфеми",
    wearables: "Носиви уреди",
    jewelry: "Накит",
    swimsuit: "Костуми за капење",
    x: "Мала",
    m: "Средна",
    xl: "Голема",
    xxl: "Екстра голема",
    decor: "Декорација",
    fashion: "Мода",
    men: "Мажка облека",
    women: "Женска облека",
    searchPlaceholder: "Пребарување на производи ...",
    categories: "Категории",
    allCategories: "Сите категории",
    noCategories: "Нема категории",
    colors: "Бои",
    clearFilter: "x",
    noColors: "Нема бои",
    popularProducts: "Популарни производи",
    noPopularProducts: "Нема производи",
    tags: "Ознаки",
    noTags: "Нема ознаки",
    added_to_wishlist: "Додадено во листата на желби",
    add_to_wishlist: "Додади во листата на желби",
    added_to_compare: "Додадено за споредба",
    add_to_compare: "Додади за споредба",
    quick_view: "Брз преглед",
    choose_language: "Изберете јазик",
    choose_currency: "Изберете валута",
    search_here: "Пребарувај тука",
    dashboard: "Табла",
    orders: "Нарачки",
    download: "Превземи",
    payment: "Плаќање",
    address: "Адреса",
    account_details: "Детали за профилот",
    hello: "Здраво",
    if_not: "Ако не е",
    logout: "Одјави се",
    dashboard_welcome: "Ова е вашата контролна табла, можете лесно да ги прегледате вашите најнови нарачки, да управувате со адресите за испорака и фактурирање, како и да ги ажурирате вашата лозинка и податоците за профилот.",
    order: "Нарачка",
    date: "Датум",
    status: "Статус",
    total: "Вкупно",
    action: "Акција",
    view: "Прегледај",
    product: "Производ",
    expire: "Истекува",
    download_file: "Превземи датотека",
    payment_method: "Начин на плаќање",
    no_payment_saved: "Сè уште немате зачувано начин на плаќање.",
    billing_address: "Адреса за фактурирање",
    mobile: "Мобилен",
    edit_address: "Уреди адреса",
    first_name: "Име",
    last_name: "Презиме",
    display_name: "Име за прикажување",
    email_address: "Е-пошта",
    password_change: "Промена на лозинка",
    current_password: "Тековна лозинка",
    new_password: "Нова лозинка",
    confirm_password: "Потврди лозинка",
    save_changes: "Зачувај промени",
    customer_login: "Најава на корисник",
    home: "Дома",
    login: "Најава",
    welcome_back: "Добредојдовте повторно!",
    username_or_email: "Корисничко име или е-адреса",
    password: "Лозинка",
    remember_me: "Запомни ме",
    lost_password: "Ја заборавивте лозинката?",
    register: "Регистрирај се",
    no_account_register: "Ако немате сметка, регистрирајте се сега!",
    email_address: "Е-пошта",
    email_placeholder: "Внесете ја вашата е-пошта",
    password_placeholder: "Внесете ја вашата лозинка",
    hello_user: "Здраво, {name}",
    not_you: "Ако не си {name}"
  }
};

const LocalizationContext = createContext();

export const useLocalization = () => {
  return useContext(LocalizationContext);
};

export const LocalizationProvider = ({ children }) => {
  const [language, setLanguage] = useState('en');  // Tracks the current language

  useEffect(() => {
    document.body.style.fontFamily = fonts[language] || fonts.en; 
  }, [language]);

  const changeLanguage = (lang) => {
    setLanguage(lang);
  };

  const t = (key) => {
    return translations[language][key] || key;  // default to key if not found
  };

  return (
    <LocalizationContext.Provider value={{ changeLanguage, t, currentLanguage: language }}>
      {children}
    </LocalizationContext.Provider>
  );
};

export default LocalizationContext;