// Central EN/UR dictionary for the whole app.
// Add a key under both `en` and `ur`; components read it with t('key').
// Missing Urdu keys automatically fall back to English.

export const translations = {
  en: {
    // --- Nav ---
    'nav.home': 'Home',
    'nav.findDonors': 'Find Donors',
    'nav.requests': 'Blood Requests',
    'nav.about': 'About Us',
    'nav.faq': 'FAQ',
    'nav.register': 'Register',
    'nav.login': 'Login',
    'nav.logout': 'Logout',
    'nav.dashboard': 'Dashboard',

    // --- Hero ---
    'hero.title': 'Every drop counts. Donate blood, save lives.',
    'hero.subtitle':
      'Heart-To-Heart connects blood donors with people who urgently need blood. Register in minutes and help someone in your city today.',
    'hero.donate': 'Donate Blood',
    'hero.request': 'Request Blood',
    'hero.findDonors': 'Find Donors',

    // --- Home: how it works ---
    'process.title': 'How It Works',
    'process.donorTitle': 'For Donors',
    'process.recipientTitle': 'For Those Who Need Blood',
    'process.donor1': 'Register as a donor with your blood group and city.',
    'process.donor2': 'See nearby blood requests and respond to those you can help.',
    'process.donor3': 'The requester contacts you and you donate at a nearby center.',
    'process.recipient1': 'Post a blood request with the patient details and hospital.',
    'process.recipient2': 'Search registered donors by blood group and location.',
    'process.recipient3': 'Contact a matching donor directly and arrange the donation.',

    // --- Home: search ---
    'search.title': 'Find Blood Donors Near You',
    'search.subtitle': 'Search registered donors by location and blood type.',
    'search.location': 'Location',
    'search.locationPlaceholder': 'Enter city or area (e.g. Karachi, Lahore)',
    'search.bloodGroup': 'Blood Group (optional)',
    'search.allGroups': 'All Blood Groups',
    'search.button': 'Search Donors',
    'search.needLocation': 'Please enter a location to search for donors.',
    'stats.donors': 'Registered Donors',
    'stats.cities': 'Cities Covered',
    'stats.available': 'Available',
    'stats.verified': 'Verified',

    // --- FAQ ---
    'faq.title': 'Frequently Asked Questions',
    'faq.q1': 'Who can donate blood?',
    'faq.a1': 'Healthy individuals aged 18-65, weighing at least 50kg, can donate blood.',
    'faq.q2': 'How often can I donate blood?',
    'faq.a2': 'You can donate whole blood every 8 weeks.',
    'faq.q3': 'Is blood donation safe?',
    'faq.a3': 'Yes. Sterile, single-use equipment is used for every donation.',
    'faq.q4': 'What should I do before donating?',
    'faq.a4': 'Drink plenty of water, eat a good meal, and avoid alcohol for 24 hours before.',
    'faq.q5': 'How long does it take?',
    'faq.a5': 'The whole visit takes about an hour; the donation itself about 10 minutes.',

    // --- Footer ---
    'footer.aboutTitle': 'About Us',
    'footer.aboutText':
      'Heart-To-Heart helps save lives by connecting blood donors with people in need.',
    'footer.quickLinks': 'Quick Links',
    'footer.contact': 'Contact Us',
    'footer.rights': 'All rights reserved.',

    // --- Choice / forms ---
    'choice.title': 'What would you like to do?',
    'choice.donate': 'Donate Blood',
    'choice.getBlood': 'Request Blood',
    'choice.close': 'Close',
    'choice.donateDesc': 'Register as a donor and help people near you.',
    'choice.getDesc': 'Post a request and find matching donors.',

    // --- Auth ---
    'auth.loginTitle': 'Login to Your Account',
    'auth.email': 'Email Address',
    'auth.password': 'Password',
    'auth.loginBtn': 'Login',
    'auth.loggingIn': 'Logging in...',
    'auth.noAccount': "Don't have an account?",
    'auth.registerHere': 'Register here',
    'auth.haveAccount': 'Already have an account?',

    // --- Find donors ---
    'donors.title': 'Blood Donors',
    'donors.subtitle': 'Browse registered donors and contact them directly.',
    'donors.filterLocation': 'Filter by location',
    'donors.filterGroup': 'Filter by blood group',
    'donors.none': 'No donors found matching your search.',
    'donors.call': 'Call Donor',
    'donors.contact': 'Contact',
    'donors.bloodGroup': 'Blood Group',
    'donors.location': 'Location',
    'donors.loading': 'Loading donors...',
    'donors.reviews': 'Reviews',
    'donors.writeReview': 'Write a review...',
    'donors.submitReview': 'Submit',

    // --- Requests ---
    'requests.title': 'Blood Requests',
    'requests.subtitle': 'People who urgently need blood. Respond if you can help.',
    'requests.all': 'All',
    'requests.none': 'No active blood requests right now.',
    'requests.patient': 'Patient',
    'requests.hospital': 'Hospital',
    'requests.units': 'Units Needed',
    'requests.contact': 'Contact',
    'requests.neededBy': 'Needed By',
    'requests.loading': 'Loading requests...',

    // --- Dashboard chrome ---
    'dash.welcome': 'Welcome',
    'dash.bloodType': 'Blood Type',
    'dash.overview': 'Overview',
    'dash.myDonations': 'My Donations',
    'dash.requests': 'Blood Requests',
    'dash.schedule': 'Schedule',
    'dash.nearby': 'Nearby Donors',
    'dash.health': 'Health',
    'dash.notifications': 'Notifications',
    'dash.profile': 'Profile',
    'dash.quickActions': 'Quick Actions',
    'dash.menu': 'Menu',

    // --- Common ---
    'common.search': 'Search',
    'common.back': 'Back',
    'common.cancel': 'Cancel',
    'common.save': 'Save',
    'common.loading': 'Loading...',
  },

  ur: {
    // --- Nav ---
    'nav.home': 'ہوم',
    'nav.findDonors': 'ڈونر تلاش کریں',
    'nav.requests': 'خون کی درخواستیں',
    'nav.about': 'ہمارے بارے میں',
    'nav.faq': 'سوالات',
    'nav.register': 'رجسٹر',
    'nav.login': 'لاگ ان',
    'nav.logout': 'لاگ آؤٹ',
    'nav.dashboard': 'ڈیش بورڈ',

    // --- Hero ---
    'hero.title': 'ہر قطرہ اہم ہے۔ خون دیں، زندگیاں بچائیں۔',
    'hero.subtitle':
      'ہارٹ ٹو ہارٹ خون کے عطیہ دہندگان کو ان لوگوں سے جوڑتا ہے جنہیں فوری خون کی ضرورت ہے۔ چند منٹ میں رجسٹر کریں اور آج ہی اپنے شہر میں کسی کی مدد کریں۔',
    'hero.donate': 'خون عطیہ کریں',
    'hero.request': 'خون طلب کریں',
    'hero.findDonors': 'ڈونر تلاش کریں',

    // --- Home: how it works ---
    'process.title': 'یہ کیسے کام کرتا ہے',
    'process.donorTitle': 'عطیہ دہندگان کے لیے',
    'process.recipientTitle': 'جنہیں خون درکار ہے ان کے لیے',
    'process.donor1': 'اپنے بلڈ گروپ اور شہر کے ساتھ بطور ڈونر رجسٹر کریں۔',
    'process.donor2': 'قریبی خون کی درخواستیں دیکھیں اور جن کی مدد کر سکتے ہیں ان کا جواب دیں۔',
    'process.donor3': 'درخواست کرنے والا آپ سے رابطہ کرے گا اور آپ قریبی مرکز پر خون دیں گے۔',
    'process.recipient1': 'مریض کی تفصیلات اور ہسپتال کے ساتھ خون کی درخواست پوسٹ کریں۔',
    'process.recipient2': 'بلڈ گروپ اور مقام کے لحاظ سے رجسٹرڈ ڈونرز تلاش کریں۔',
    'process.recipient3': 'موزوں ڈونر سے براہِ راست رابطہ کریں اور عطیہ کا بندوبست کریں۔',

    // --- Home: search ---
    'search.title': 'اپنے قریب خون کے ڈونر تلاش کریں',
    'search.subtitle': 'مقام اور بلڈ گروپ کے لحاظ سے رجسٹرڈ ڈونرز تلاش کریں۔',
    'search.location': 'مقام',
    'search.locationPlaceholder': 'شہر یا علاقہ درج کریں (مثلاً کراچی، لاہور)',
    'search.bloodGroup': 'بلڈ گروپ (اختیاری)',
    'search.allGroups': 'تمام بلڈ گروپ',
    'search.button': 'ڈونر تلاش کریں',
    'search.needLocation': 'ڈونر تلاش کرنے کے لیے براہِ کرم مقام درج کریں۔',
    'stats.donors': 'رجسٹرڈ ڈونرز',
    'stats.cities': 'شہر',
    'stats.available': 'دستیاب',
    'stats.verified': 'تصدیق شدہ',

    // --- FAQ ---
    'faq.title': 'اکثر پوچھے جانے والے سوالات',
    'faq.q1': 'خون کون عطیہ کر سکتا ہے؟',
    'faq.a1': 'صحت مند افراد جن کی عمر 18 سے 65 سال اور وزن کم از کم 50 کلو ہو، خون دے سکتے ہیں۔',
    'faq.q2': 'میں کتنی بار خون دے سکتا ہوں؟',
    'faq.a2': 'آپ ہر 8 ہفتوں بعد خون عطیہ کر سکتے ہیں۔',
    'faq.q3': 'کیا خون کا عطیہ محفوظ ہے؟',
    'faq.a3': 'جی ہاں۔ ہر عطیہ کے لیے جراثیم سے پاک، ایک بار استعمال ہونے والے آلات استعمال ہوتے ہیں۔',
    'faq.q4': 'عطیہ سے پہلے مجھے کیا کرنا چاہیے؟',
    'faq.a4': 'وافر پانی پئیں، اچھا کھانا کھائیں، اور 24 گھنٹے پہلے الکحل سے پرہیز کریں۔',
    'faq.q5': 'اس میں کتنا وقت لگتا ہے؟',
    'faq.a5': 'پورا دورہ تقریباً ایک گھنٹہ اور خون دینے کا عمل تقریباً 10 منٹ لیتا ہے۔',

    // --- Footer ---
    'footer.aboutTitle': 'ہمارے بارے میں',
    'footer.aboutText':
      'ہارٹ ٹو ہارٹ خون کے عطیہ دہندگان کو ضرورت مندوں سے جوڑ کر زندگیاں بچانے میں مدد کرتا ہے۔',
    'footer.quickLinks': 'فوری لنکس',
    'footer.contact': 'ہم سے رابطہ کریں',
    'footer.rights': 'جملہ حقوق محفوظ ہیں۔',

    // --- Choice / forms ---
    'choice.title': 'آپ کیا کرنا چاہیں گے؟',
    'choice.donate': 'خون عطیہ کریں',
    'choice.getBlood': 'خون طلب کریں',
    'choice.close': 'بند کریں',
    'choice.donateDesc': 'بطور ڈونر رجسٹر کریں اور اپنے قریب لوگوں کی مدد کریں۔',
    'choice.getDesc': 'درخواست پوسٹ کریں اور موزوں ڈونرز تلاش کریں۔',

    // --- Auth ---
    'auth.loginTitle': 'اپنے اکاؤنٹ میں لاگ ان کریں',
    'auth.email': 'ای میل',
    'auth.password': 'پاس ورڈ',
    'auth.loginBtn': 'لاگ ان',
    'auth.loggingIn': 'لاگ ان ہو رہا ہے...',
    'auth.noAccount': 'اکاؤنٹ نہیں ہے؟',
    'auth.registerHere': 'یہاں رجسٹر کریں',
    'auth.haveAccount': 'پہلے سے اکاؤنٹ ہے؟',

    // --- Find donors ---
    'donors.title': 'خون کے ڈونرز',
    'donors.subtitle': 'رجسٹرڈ ڈونرز دیکھیں اور براہِ راست رابطہ کریں۔',
    'donors.filterLocation': 'مقام کے لحاظ سے فلٹر کریں',
    'donors.filterGroup': 'بلڈ گروپ کے لحاظ سے فلٹر کریں',
    'donors.none': 'آپ کی تلاش سے کوئی ڈونر نہیں ملا۔',
    'donors.call': 'ڈونر کو کال کریں',
    'donors.contact': 'رابطہ',
    'donors.bloodGroup': 'بلڈ گروپ',
    'donors.location': 'مقام',
    'donors.loading': 'ڈونرز لوڈ ہو رہے ہیں...',
    'donors.reviews': 'آراء',
    'donors.writeReview': 'رائے لکھیں...',
    'donors.submitReview': 'جمع کرائیں',

    // --- Requests ---
    'requests.title': 'خون کی درخواستیں',
    'requests.subtitle': 'جن لوگوں کو فوری خون چاہیے۔ اگر مدد کر سکتے ہیں تو جواب دیں۔',
    'requests.all': 'تمام',
    'requests.none': 'اس وقت کوئی فعال درخواست نہیں ہے۔',
    'requests.patient': 'مریض',
    'requests.hospital': 'ہسپتال',
    'requests.units': 'مطلوبہ یونٹس',
    'requests.contact': 'رابطہ',
    'requests.neededBy': 'کب تک درکار',
    'requests.loading': 'درخواستیں لوڈ ہو رہی ہیں...',

    // --- Dashboard chrome ---
    'dash.welcome': 'خوش آمدید',
    'dash.bloodType': 'بلڈ گروپ',
    'dash.overview': 'جائزہ',
    'dash.myDonations': 'میرے عطیات',
    'dash.requests': 'خون کی درخواستیں',
    'dash.schedule': 'شیڈول',
    'dash.nearby': 'قریبی ڈونرز',
    'dash.health': 'صحت',
    'dash.notifications': 'اطلاعات',
    'dash.profile': 'پروفائل',
    'dash.quickActions': 'فوری اقدامات',
    'dash.menu': 'مینو',

    // --- Common ---
    'common.search': 'تلاش',
    'common.back': 'واپس',
    'common.cancel': 'منسوخ',
    'common.save': 'محفوظ کریں',
    'common.loading': 'لوڈ ہو رہا ہے...',
  },
};

export default translations;
