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
    save_changes: "Save changes",

    shipping_information_title: "Shipping Information",
    shipping_question_1: "What Shipping Methods are Available?",
    shipping_question_2: "Do You Ship Internationally?",
    shipping_question_3: "How to Track My Order?",
    shipping_question_4: "How Long Will It Take To Get My Package?",
    payment_information_title: "Payment Information",
    payment_question_1: "What payment methods do you accept?",
    payment_question_2: "What Happens If There Is A Pricing Error?",
    payment_question_3: "What Do You Do With My Information?",
    orders_and_returns_title: "Orders and Returns",
    orders_question_1: "How do I place an Order?",
    orders_question_2: "How Can I Cancel Or Change My Order?",
    orders_question_3: "Who Should I Contact If I Have Any Queries?",

    shipping_answer_1: "Depending on the item(s) you purchase here and the location to which the item(s) will be delivered, different shipping methods will be available. At checkout, you will be prompted to choose a variety of shipping methods.",
    shipping_answer_2: "At the moment, we only ship to Canada and the United States. For international orders, please contact internationalorders@dynamite.ca. If you have any questions, please don’t hesitate to contact our Customer Experience Department by mail or by phone at 1-888-882-1138 (Canada) and 1-888-342-7243 (USA).",
    shipping_answer_3: "Once your order has been shipped, you will receive an email with your tracking and shipping information. Simply click on the link in the email or select the ‘track order’ option here and enter your order number and email address or sign into your account.",
    shipping_answer_4: "We ship only on business days. Business days are from Monday to Friday, excluding holidays. Any order placed after 12 P.M. ET will be processed the following business day. Due to a high volume period, your order may take longer than anticipated. For remote locations, please add an additional 2-5 business days to each shipping method’s expected delivery time. If you are not sure whether your location is remote, please click here for all the details.",
    payment_answer_1: "We gladly accept Visa, MasterCard, and American Express. If your card has been issued outside the U.S. or Canada, please note that your order may need additional verification before it can be processed. Unfortunately, we cannot accept COD orders, and all orders must be paid in full once submitted online.",
    payment_answer_2: "We do our best to provide accuracy in the pricing and other product information displayed on our website, but mistakes sometimes happen. In such cases, Furniture.ca expressly reserves the right not to honor pricing errors found on this website when accepting an online order. If an error occurs, we’ll let you know and cancel the order. Any authorized payments for that order will be immediately refunded. If you find an error once your order is delivered, please contact our Customer Care team or refer to our return policy.",
    payment_answer_3: "We use your info to fulfill your order accurately and quickly and to improve your shopping experience. We respect your privacy and never share this information with anyone, except in connection with your order. If you want to know more, take a look at our Private Policy.",
    orders_answer_1: "Click on a Product Photo or Product Name to see more detailed information. To place your order, choose the specification you want and enter the quantity, and click ‘Buy Now’. Please enter the required information such as Delivery Address, Quantity Type, etc. Before clicking “Place Order,” please check your Order Details carefully. If you want to add a new Delivery Address, click “Add a new address.” If you want to edit a current Delivery Address, click ‘Edit this address.’ After confirming your Order, you will be automatically taken to the Payment page.",
    orders_answer_2: "Go to Your Orders. Click Cancel Items. Note: Select the checkbox next to each item you wish to remove from the order. If you want to cancel the entire order, select all of the items. Click Cancel checked items when finished.",
    orders_answer_3: "You can contact our customer support team by the provided email or mobile phone. In case it’s not convenient to talk, you can come to our store to make your request.",

    checkout_title: "Checkout",
    home: "Home",
    billing_address: "Billing Address",
    first_name_label: "First Name",
    first_name_placeholder: "Enter your first name",
    last_name_label: "Last Name",
    last_name_placeholder: "Enter your last name",
    email_label: "Email Address",
    email_placeholder: "Enter your email address",
    phone_label: "Phone Number",
    phone_placeholder: "Enter your phone number",
    company_label: "Company",
    company_placeholder: "Enter your company name",
    address_label: "Address",
    address_line1_placeholder: "Enter address line 1",
    address_line2_placeholder: "Enter address line 2",
    country_label: "Country",
    city_label: "City",
    city_placeholder: "Enter your city",
    state_label: "State",
    state_placeholder: "Enter your state",
    zip_label: "Zip Code",
    zip_placeholder: "Enter your zip code",
    country_bangladesh: "Bangladesh",
    country_china: "China",
    country_australia: "Australia",
    country_india: "India",
    country_japan: "Japan",
    cart_total: "Cart Total",
    product_label: "Product",
    total_label: "Total",
    subtotal_label: "Subtotal",
    shipping_fee_label: "Shipping Fee",
    grand_total_label: "Grand Total",
    payment_method: "Payment Method",
    payment_check: "Check Payment",
    payment_bank: "Bank Transfer",
    payment_cash: "Cash on Delivery",
    payment_paypal: "PayPal",
    payment_payoneer: "Payoneer",
    accept_terms_label: "I have read and agree to the terms and conditions",
    place_order: "Place Order",
    cart_empty_message: "No items found in cart to checkout",
    shop_now: "Shop Now"
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
    dashboard: "Контролна табла",
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
    not_you: "Ако не си {name}",

    shipping_information_title: "Информации за испорака",
    shipping_question_1: "Кои методи за испорака се достапни?",
    shipping_question_2: "Дали испорачувате меѓународно?",
    shipping_question_3: "Како да ја следам мојата нарачка?",
    shipping_question_4: "Колку време е потребно за да го добијам мојот пакет?",
    payment_information_title: "Информации за плаќање",
    payment_question_1: "Кои методи за плаќање ги прифаќате?",
    payment_question_2: "Што се случува ако има грешка во цените?",
    payment_question_3: "Што правите со моите информации?",
    orders_and_returns_title: "Нарачки и враќање",
    orders_question_1: "Како да направам нарачка?",
    orders_question_2: "Како можам да ја откажам или сменам мојата нарачка?",
    orders_question_3: "Кого треба да контактирам ако имам прашања?",
    shipping_answer_1: "Во зависност од предметите што ги купувате тука и локацијата на која ќе бидат испорачани, достапни се различни методи за испорака. При наплата, ќе бидете повикани да изберете од повеќе методи за испорака.",
    shipping_answer_2: "Во моментот, испорачуваме само во Канада и Соединетите Американски Држави. За меѓународни нарачки, ве молиме контактирајте на internationalorders@dynamite.ca. Ако имате прашања, слободно контактирајте го нашиот оддел за корисничка поддршка по пошта или телефон на 1-888-882-1138 (Канада) и 1-888-342-7243 (САД).",
    shipping_answer_3: "Откако вашата нарачка ќе биде испорачана, ќе добиете е-пошта со информации за следење и испорака. Едноставно кликнете на линкот во е-поштата или изберете опцијата „следи нарачка“ тука и внесете го бројот на нарачката и е-поштата или најавете се на вашата сметка.",
    shipping_answer_4: "Испорачуваме само во работни денови. Работни денови се од понеделник до петок, без празници. Секоја нарачка направена по 12 часот по источна време ќе биде обработена следниот работен ден. Поради голем обем на нарачки, вашата нарачка може да трае подолго од очекуваното. За оддалечени локации, додадете дополнителни 2-5 работни дена на очекуваното време за испорака. Ако не сте сигурни дали вашата локација е оддалечена, кликнете тука за сите детали.",
    payment_answer_1: "Со задоволство прифаќаме Visa, MasterCard и American Express. Ако вашата картичка е издадена надвор од САД или Канада, имајте предвид дека вашата нарачка може да бара дополнителна верификација пред да биде обработена. За жал, не можеме да прифатиме нарачки со плаќање при испорака, и сите нарачки мора да бидат целосно платени штом се поднесат онлајн.",
    payment_answer_2: "Се трудиме да обезбедиме точност во цените и другите информации за производите прикажани на нашата веб-страница, но понекогаш се случуваат грешки. Во такви случаи, Furniture.ca изречно го задржува правото да не ги почитува грешките во цените откриени на оваа веб-страница при прифаќање онлајн нарачка. Ако се случи грешка, ќе ве известиме и ќе ја откажеме нарачката. Сите овластени плаќања за таа нарачка ќе бидат веднаш рефундирани. Ако најдете грешка откако вашата нарачка е доставена, ве молиме контактирајте го нашиот тим за грижа на корисници или погледнете ја нашата политика за враќање.",
    payment_answer_3: "Ги користиме вашите информации за точно и брзо исполнување на вашата нарачка и за подобрување на вашето искуство при купување. Го почитуваме вашето право на приватност и никогаш не ги споделуваме овие информации со никого, освен во врска со вашата нарачка. Ако сакате да дознаете повеќе, погледнете ја нашата политика за приватност.",
    orders_answer_1: "Кликнете на слика или име на производ за да видите подетални информации. За да ја направите вашата нарачка, изберете ја спецификацијата што ја сакате и внесете ја количината, потоа кликнете „Купи сега“. Внесете ги потребните информации како адреса за испорака, тип на количина итн. Пред да кликнете „Направи нарачка“, проверете ги деталите за вашата нарачка внимателно. Ако сакате да додадете нова адреса за испорака, кликнете „Додади нова адреса“. Ако сакате да уредите моментална адреса, кликнете „Уреди ја оваа адреса“. По потврдувањето на нарачката, автоматски ќе бидете префрлени на страницата за плаќање.",
    orders_answer_2: "Одете на 'Вашите нарачки'. Кликнете 'Откажи ставки'. Забелешка: Изберете го полето покрај секоја ставка што сакате да ја отстраните од нарачката. Ако сакате да ја откажете целата нарачка, изберете ги сите ставки. Кликнете на 'Откажи избрани ставки' кога ќе завршите.",
    orders_answer_3: "Можете да го контактирате нашиот тим за поддршка на корисници преку обезбедениот е-пошта или телефонски број. Ако не ви е погодно да зборувате, можете да дојдете во нашата продавница за да го направите вашето барање.",

    checkout_title: "Плаќање",
    home: "Дома",
    billing_address: "Фактурна адреса",
    first_name_label: "Име",
    first_name_placeholder: "Внесете го вашето име",
    last_name_label: "Презиме",
    last_name_placeholder: "Внесете го вашето презиме",
    email_label: "Емаил адреса",
    email_placeholder: "Внесете ја вашата емаил адреса",
    phone_label: "Телефонски број",
    phone_placeholder: "Внесете го вашиот телефонски број",
    company_label: "Компанија",
    company_placeholder: "Внесете го името на вашата компанија",
    address_label: "Адреса",
    address_line1_placeholder: "Внесете ја адресата (линија 1)",
    address_line2_placeholder: "Внесете ја адресата (линија 2)",
    country_label: "Држава",
    city_label: "Град",
    city_placeholder: "Внесете го вашиот град",
    state_label: "Држава/Област",
    state_placeholder: "Внесете ја вашата држава/област",
    zip_label: "Поштенски код",
    zip_placeholder: "Внесете го вашиот поштенски код",
    country_bangladesh: "Бангладеш",
    country_china: "Кина",
    country_australia: "Австралија",
    country_india: "Индија",
    country_japan: "Јапонија",
    cart_total: "Вкупна количка",
    product_label: "Продукт",
    total_label: "Вкупно",
    subtotal_label: "Подвкупно",
    shipping_fee_label: "Цена на испорака",
    grand_total_label: "Конечен износ",
    payment_method: "Начин на плаќање",
    payment_check: "Плаќање со чек",
    payment_bank: "Банкарски трансфер",
    payment_cash: "Плаќање при достава",
    payment_paypal: "PayPal",
    payment_payoneer: "Payoneer",
    accept_terms_label: "Го прочитав и се согласувам со условите и правилата",
    place_order: "Нарачај",
    cart_empty_message: "Нема продукти во вашата количка",
    shop_now: "Купувајте сега"
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