export type Locale = 'ms' | 'en';

const en = {
  appTagline: 'Connecting Resources. Empowering Communities.',
  nav: { home: 'Home', needs: 'Needs', about: 'About', impact: 'Impact', map: 'Map', dashboard: 'My dashboard' },
  common: {
    login: 'Login', signup: 'Sign up', logout: 'Log out', save: 'Save', cancel: 'Cancel', delete: 'Delete', edit: 'Edit',
    back: 'Back', view: 'View details', all: 'All', search: 'Search', quantity: 'Quantity', category: 'Category',
    area: 'Area', urgency: 'Urgency', neededBy: 'Needed by', status: 'Status', description: 'Description', title: 'Title',
    condition: 'Condition', name: 'Name', email: 'Email', password: 'Password', role: 'I am a', none: 'Nothing here yet.',
    from: 'Available from', to: 'Available until', optional: 'optional', verified: 'Verified', pending: 'Pending verification',
    donor: 'Donor', approve: 'Approve match', verify: 'Verify', organization: 'Organization', setupTitle: 'Supabase is not connected yet',
    setupBody: 'Copy .env.example to .env.local, add your Supabase URL and anon key, then restart the server.',
    footer: 'KITA is a proposed MVP for UTP CodeFest 2026 (Track 3). Pilot partnerships are not yet confirmed.',
    km: 'km', items: 'items', sort: 'Sort', mostUrgent: 'Most urgent', soonest: 'Soonest date', searchPlaceholder: 'Search needs (food, school kits, hygiene...)'
  },
  cat: { food: 'Food', education: 'Education', hygiene: 'Hygiene', essentials: 'Daily essentials', others: 'Others' },
  urg: { 1: 'Flexible', 2: 'Soon', 3: 'Urgent' },
  cond: { new: 'New', good: 'Good condition', perishable: 'Perishable (not accepted in pilot)' },
  rstatus: { available: 'Available', partial: 'Partly reserved', matched: 'Matched', completed: 'Delivered' },
  qstatus: { open: 'Open', matched: 'Matched', fulfilled: 'Fulfilled', cancelled: 'Cancelled' },
  mstatus: { proposed: 'Proposed', approved: 'Approved', accepted: 'Volunteer accepted', delivered: 'Delivered, waiting for confirmation', received: 'Delivery confirmed', declined: 'Declined' },
  roles: { donor: 'Donor', community: 'Community representative', volunteer: 'Volunteer', admin: 'Administrator' },
  errors: {
    required: 'Please fill in all required fields.', quantity: 'Quantity must be a whole number above zero.',
    notVerified: 'Your organization must be verified by an administrator first.', notFeasible: 'This match is not feasible right now. Review the checks.',
    stale: 'Stock changed while you were reviewing. Please review the match again.', generic: 'Something went wrong. Please try again.',
    inUse: 'This resource is already reserved for a match and cannot be removed.', reduce: 'Quantity cannot be lower than what is already reserved.',
    login: 'Wrong email or password.', signup: 'Could not create the account.'
  },
  ok: { saved: 'Saved.', approved: 'Match approved. The volunteer can now accept the delivery.', verified: 'Organization verified.', checkEmail: 'Account created. Check your email to confirm, then log in.' },
  home: {
    title: 'People. Resources. Stronger Communities.',
    sub: 'KITA connects donors, verified community needs and volunteers through a rule-based matching platform. Every match is reviewed by a person.',
    offer: 'Offer resources', request: 'Request help',
    f1t: 'Donate', f1p: 'List food, supplies or services you can share.',
    f2t: 'Request', f2p: 'Verified groups say exactly what they need.',
    f3t: 'Volunteer', f3p: 'Share your time and transport for pickups.',
    f4t: 'Get matched', f4p: 'We suggest allocations and explain why.',
    s1: 'Verified requests', s2: 'Resources listed', s3: 'Requests fulfilled', s4: 'Active volunteers',
    statsNote: 'Live numbers. Only confirmed deliveries count as fulfilled.',
    howTitle: 'How KITA works', howSub: 'A simple, transparent process from need to confirmed delivery.',
    steps: ['Submit a verified need', 'Register available resources', 'Check compatible matches', 'Confirm donors and volunteers', 'Deliver and verify receipt'],
    moreTitle: 'More than a listing board', moreBody: 'KITA is a decision-support tool: it filters by category, condition, distance and dates, combines several donors, finds a volunteer with enough transport, and shows its reasoning.',
    learn: 'Read about our mission'
  },
  needs: { title: 'Community needs', sub: 'Requests from verified community organizations.', empty: 'No requests match your search.', by: 'Needed by', offerHelp: 'I can help', loginToHelp: 'Log in as a donor to offer resources.', org: 'Requested by', matchedNote: 'A match is already being arranged for this request.' },
  auth: {
    loginTitle: 'Log in to KITA', signupTitle: 'Create your KITA account', fullName: 'Full name', noAccount: 'No account yet?', haveAccount: 'Already have an account?',
    roleHelp: 'Community representatives register their organization after signing up. An administrator verifies it before requests appear.'
  },
  dash: { welcome: 'Welcome', setupProfile: 'Your profile could not be loaded.' },
  donor: {
    title: 'My resources', sub: 'Manage the items you want to contribute.', add: 'Add resource', editTitle: 'Edit resource', newTitle: 'Add a resource',
    reserved: 'Reserved', delivered: 'Delivered', pickupArea: 'Pickup area', safety: 'Only non-perishable items are accepted in the pilot. Perishable food cannot be matched.',
    confirmDelete: 'Delete this resource?', tabAll: 'All', tabAvailable: 'Available', tabProgress: 'In progress', tabDone: 'Completed', itemTitle: 'Item name'
  },
  community: {
    title: 'Community dashboard', sub: 'Request help and confirm what you received.', registerTitle: 'Register your organization',
    registerBody: 'An administrator must verify your organization before you can post requests.', orgName: 'Organization name', register: 'Register organization',
    newRequest: 'New request', requestsTitle: 'My requests', confirmTitle: 'Confirm receipt', confirmBtn: 'We received the items', noConfirm: 'Nothing is waiting for your confirmation.',
    newTitle: 'Request assistance', newSub: 'Share what is needed, not personal details of beneficiaries.', waiting: 'Waiting for administrator verification.', submit: 'Submit request',
    requestTitle: 'What do you need?', whereHelp: 'General service area only'
  },
  volunteer: {
    title: 'Volunteer dashboard', sub: 'Share your availability and accept deliveries.', availability: 'My availability', vehicle: 'Vehicle', capacity: 'Items you can carry per trip',
    range: 'How far will you travel (km)?', available: 'I am available', saveBtn: 'Save availability', assignments: 'My assignments', accept: 'Accept delivery', markDelivered: 'Mark as delivered',
    noAssign: 'No assignments yet. An administrator will assign you when a match needs your transport.', pickup: 'Pickup', deliverTo: 'Deliver to', vehicles: { motorbike: 'Motorbike', car: 'Car', van: 'Van', truck: 'Truck' }
  },
  admin: {
    title: 'Administrator dashboard', sub: 'Verify organizations, review matches and monitor deliveries.', orgsTitle: 'Organizations to verify', noOrgs: 'All organizations are verified.',
    openTitle: 'Open requests (most urgent first)', reviewMatch: 'Review match', matchesTitle: 'Matches and delivery progress', volunteer: 'Volunteer', score: 'Match score',
    reviewTitle: 'Review suggested match', request: 'Request', allocation: 'Suggested allocation', donorCol: 'Donor', itemCol: 'Item', takeCol: 'Take', distCol: 'Distance',
    transport: 'Transport', checks: 'Why this allocation', rejectedTitle: 'Resources that were skipped', approveHint: 'Nothing happens until you approve. Donors and the volunteer are only notified after approval.',
    notFeasibleTitle: 'This request cannot be fully matched yet', shortfall: 'Still missing {n} items.', backToList: 'Back to dashboard', noMatches: 'No matches yet.'
  },
  checks: {
    category: 'Category matches: {category}.',
    quantity_ok: 'Quantity covered: {total} of {needed} items from {donors} donor(s).',
    quantity_no: 'Quantity not covered: only {total} of {needed} items available.',
    distance_ok: 'Distance: the furthest pickup is {max} km away (limit {limit} km).',
    distance_no: 'No donor is within {limit} km with usable stock.',
    transport_ok: 'Transport: a {vehicle} with capacity {capacity} can carry this in {trips} trip(s).',
    transport_no: 'Transport: a {vehicle} with capacity {capacity} needs {trips} trips.',
    no_volunteer: 'No free volunteer is available for these dates and distances.',
    schedule: 'Schedule: pickups fit before the needed date ({date}).'
  },
  reject: { none_left: 'No unreserved stock left', perishable: 'Perishable goods are not accepted in the pilot', too_far: 'Too far from the community', schedule: 'Availability dates do not fit' },
  impact: {
    title: 'Impact dashboard', sub: 'Only confirmed outcomes are counted as completed assistance.', k1: 'Verified requests', k2: 'Requests fulfilled', k3: 'Fulfillment rate',
    k4: 'Items redistributed', k5: 'Deliveries completed', k6: 'Active volunteers', k7: 'Average time to match (hours)', byCat: 'Items redistributed by category', noData: 'No confirmed deliveries yet.'
  },
  map: { title: 'Map view', sub: 'Open community requests around Seri Iskandar. Locations are general areas.', legend: 'Red = urgent, amber = other requests.' },
  about: {
    title: 'About KITA', aboutTitle: 'About us',
    about1: 'KITA is a web platform that helps donors, verified community groups, volunteers and administrators work together. It starts around Universiti Teknologi PETRONAS (UTP) and the Seri Iskandar community in Perak.',
    about2: 'KITA is not another donation listing board. Community groups say exactly what they need, and the system suggests which donors and volunteers can meet that need. A person always approves the match.',
    visionTitle: 'Vision', vision: 'A community where available help reaches the people who need it, and nobody is missed because information was scattered.',
    missionTitle: 'Mission', mission: 'Make it simple to list resources, submit verified needs, get matched fairly, deliver the help and confirm it was received.',
    valuesTitle: 'Values', values: [
      ['Trust', 'Only verified organizations can post needs.'], ['Transparency', 'Every suggested match shows why it was chosen.'],
      ['Privacy', 'We collect as little personal information as possible.'], ['Community first', 'Documented needs come before what is easiest to give.'],
      ['Accountability', 'Only deliveries confirmed as received are counted.']
    ],
    problemTitle: 'The problem we want to solve', problemLead: 'Resources can exist while community needs remain unmet.',
    problems: [['Information is scattered', 'Needs and offers are shared across separate groups, calls and personal networks.'], ['Matching takes effort', 'Coordinators compare quantities, locations, timing and transport by hand.'], ['Outcomes are hard to track', 'It is hard to see which requests are pending, reserved or fulfilled.']],
    problemNote: 'DOSM reported 6.9% absolute poverty in Perak for 2024 (Malaysia: 5.1%). This shows social need, not proof of a coordination gap. That gap is a hypothesis we will test through interviews with NGOs, campus clubs, donors and volunteers.',
    sdgTitle: 'Global goals (SDGs)', sdgs: [['1', 'No Poverty', 'Improves coordination of essential assistance.'], ['2', 'Zero Hunger', 'Redistributes suitable non-perishable food.'], ['11', 'Sustainable Communities', 'Strengthens links between campus and neighbours.'], ['12', 'Responsible Consumption', 'Gives unused items a second use.'], ['17', 'Partnerships', 'Brings students, NGOs and volunteers together.']],
    scopeTitle: 'Community guidelines', scope: ['Only verified organizations can post requests.', 'The pilot accepts non-perishable goods and selected essentials only.', 'No money donations or payments.', 'Beneficiary identities are never shown publicly.', 'KITA does not guarantee delivery. Every match needs human approval.'],
    statusNote: 'Project status: proposed MVP for UTP CodeFest 2026, Track 3. Partnerships and pilot participation are not yet confirmed.'
  }
};

export type Dict = typeof en;

const ms: Dict = {
  appTagline: 'Menghubungkan Sumber. Memperkasa Komuniti.',
  nav: { home: 'Utama', needs: 'Keperluan', about: 'Tentang', impact: 'Impak', map: 'Peta', dashboard: 'Papan pemuka saya' },
  common: {
    login: 'Log masuk', signup: 'Daftar', logout: 'Log keluar', save: 'Simpan', cancel: 'Batal', delete: 'Padam', edit: 'Ubah',
    back: 'Kembali', view: 'Lihat butiran', all: 'Semua', search: 'Cari', quantity: 'Kuantiti', category: 'Kategori',
    area: 'Kawasan', urgency: 'Kecemasan', neededBy: 'Diperlukan pada', status: 'Status', description: 'Penerangan', title: 'Tajuk',
    condition: 'Keadaan', name: 'Nama', email: 'E-mel', password: 'Kata laluan', role: 'Saya seorang', none: 'Belum ada apa-apa di sini.',
    from: 'Tersedia dari', to: 'Tersedia hingga', optional: 'pilihan', verified: 'Disahkan', pending: 'Menunggu pengesahan',
    donor: 'Penderma', approve: 'Luluskan padanan', verify: 'Sahkan', organization: 'Organisasi', setupTitle: 'Supabase belum disambungkan',
    setupBody: 'Salin .env.example ke .env.local, masukkan URL dan kunci anon Supabase anda, kemudian mulakan semula pelayan.',
    footer: 'KITA ialah MVP cadangan untuk UTP CodeFest 2026 (Trek 3). Kerjasama pilot belum disahkan.',
    km: 'km', items: 'barang', sort: 'Susun', mostUrgent: 'Paling segera', soonest: 'Tarikh terdekat', searchPlaceholder: 'Cari keperluan (makanan, set sekolah, kebersihan...)'
  },
  cat: { food: 'Makanan', education: 'Pendidikan', hygiene: 'Kebersihan', essentials: 'Keperluan harian', others: 'Lain-lain' },
  urg: { 1: 'Fleksibel', 2: 'Tidak lama lagi', 3: 'Segera' },
  cond: { new: 'Baharu', good: 'Keadaan baik', perishable: 'Mudah rosak (tidak diterima dalam pilot)' },
  rstatus: { available: 'Tersedia', partial: 'Sebahagian ditempah', matched: 'Dipadankan', completed: 'Dihantar' },
  qstatus: { open: 'Terbuka', matched: 'Dipadankan', fulfilled: 'Dipenuhi', cancelled: 'Dibatalkan' },
  mstatus: { proposed: 'Dicadangkan', approved: 'Diluluskan', accepted: 'Sukarelawan menerima', delivered: 'Dihantar, menunggu pengesahan', received: 'Penerimaan disahkan', declined: 'Ditolak' },
  roles: { donor: 'Penderma', community: 'Wakil komuniti', volunteer: 'Sukarelawan', admin: 'Pentadbir' },
  errors: {
    required: 'Sila isi semua ruangan wajib.', quantity: 'Kuantiti mestilah nombor bulat lebih daripada sifar.',
    notVerified: 'Organisasi anda perlu disahkan oleh pentadbir terlebih dahulu.', notFeasible: 'Padanan ini belum boleh dilaksanakan. Semak pemeriksaan.',
    stale: 'Stok berubah semasa anda menyemak. Sila semak padanan sekali lagi.', generic: 'Sesuatu tidak kena. Sila cuba lagi.',
    inUse: 'Sumber ini sudah ditempah untuk padanan dan tidak boleh dibuang.', reduce: 'Kuantiti tidak boleh kurang daripada yang sudah ditempah.',
    login: 'E-mel atau kata laluan salah.', signup: 'Akaun tidak dapat dicipta.'
  },
  ok: { saved: 'Disimpan.', approved: 'Padanan diluluskan. Sukarelawan kini boleh menerima penghantaran.', verified: 'Organisasi disahkan.', checkEmail: 'Akaun dicipta. Semak e-mel anda untuk mengesahkan, kemudian log masuk.' },
  home: {
    title: 'Insan. Sumber. Komuniti Lebih Kuat.',
    sub: 'KITA menghubungkan penderma, keperluan komuniti yang disahkan dan sukarelawan melalui platform padanan berasaskan peraturan. Setiap padanan disemak oleh manusia.',
    offer: 'Tawar sumber', request: 'Mohon bantuan',
    f1t: 'Derma', f1p: 'Senaraikan makanan, bekalan atau perkhidmatan yang boleh dikongsi.',
    f2t: 'Mohon', f2p: 'Kumpulan yang disahkan menyatakan dengan tepat apa yang diperlukan.',
    f3t: 'Sukarelawan', f3p: 'Kongsi masa dan pengangkutan anda untuk pengambilan.',
    f4t: 'Dipadankan', f4p: 'Kami mencadangkan agihan dan menerangkan sebabnya.',
    s1: 'Permohonan disahkan', s2: 'Sumber disenaraikan', s3: 'Permohonan dipenuhi', s4: 'Sukarelawan aktif',
    statsNote: 'Nombor sebenar. Hanya penghantaran yang disahkan dikira sebagai dipenuhi.',
    howTitle: 'Cara KITA berfungsi', howSub: 'Proses mudah dan telus dari keperluan hingga penghantaran disahkan.',
    steps: ['Hantar keperluan yang disahkan', 'Daftar sumber yang tersedia', 'Semak padanan yang sesuai', 'Sahkan penderma dan sukarelawan', 'Hantar dan sahkan penerimaan'],
    moreTitle: 'Lebih daripada papan senarai', moreBody: 'KITA ialah alat sokongan keputusan: ia menapis mengikut kategori, keadaan, jarak dan tarikh, menggabungkan beberapa penderma, mencari sukarelawan yang mempunyai pengangkutan mencukupi, dan menunjukkan alasannya.',
    learn: 'Baca tentang misi kami'
  },
  needs: { title: 'Keperluan komuniti', sub: 'Permohonan daripada organisasi komuniti yang disahkan.', empty: 'Tiada permohonan sepadan dengan carian anda.', by: 'Diperlukan pada', offerHelp: 'Saya boleh bantu', loginToHelp: 'Log masuk sebagai penderma untuk menawarkan sumber.', org: 'Dimohon oleh', matchedNote: 'Padanan sedang diatur untuk permohonan ini.' },
  auth: {
    loginTitle: 'Log masuk ke KITA', signupTitle: 'Cipta akaun KITA anda', fullName: 'Nama penuh', noAccount: 'Belum ada akaun?', haveAccount: 'Sudah ada akaun?',
    roleHelp: 'Wakil komuniti mendaftarkan organisasi selepas mendaftar. Pentadbir mengesahkannya sebelum permohonan dipaparkan.'
  },
  dash: { welcome: 'Selamat datang', setupProfile: 'Profil anda tidak dapat dimuatkan.' },
  donor: {
    title: 'Sumber saya', sub: 'Urus barang yang ingin anda sumbangkan.', add: 'Tambah sumber', editTitle: 'Ubah sumber', newTitle: 'Tambah sumber',
    reserved: 'Ditempah', delivered: 'Dihantar', pickupArea: 'Kawasan pengambilan', safety: 'Hanya barang tidak mudah rosak diterima dalam pilot. Makanan mudah rosak tidak boleh dipadankan.',
    confirmDelete: 'Padam sumber ini?', tabAll: 'Semua', tabAvailable: 'Tersedia', tabProgress: 'Dalam proses', tabDone: 'Selesai', itemTitle: 'Nama barang'
  },
  community: {
    title: 'Papan pemuka komuniti', sub: 'Mohon bantuan dan sahkan apa yang diterima.', registerTitle: 'Daftarkan organisasi anda',
    registerBody: 'Pentadbir perlu mengesahkan organisasi anda sebelum anda boleh menghantar permohonan.', orgName: 'Nama organisasi', register: 'Daftar organisasi',
    newRequest: 'Permohonan baharu', requestsTitle: 'Permohonan saya', confirmTitle: 'Sahkan penerimaan', confirmBtn: 'Kami telah menerima barang', noConfirm: 'Tiada apa yang menunggu pengesahan anda.',
    newTitle: 'Mohon bantuan', newSub: 'Kongsi apa yang diperlukan, bukan butiran peribadi penerima.', waiting: 'Menunggu pengesahan pentadbir.', submit: 'Hantar permohonan',
    requestTitle: 'Apa yang anda perlukan?', whereHelp: 'Kawasan perkhidmatan umum sahaja'
  },
  volunteer: {
    title: 'Papan pemuka sukarelawan', sub: 'Kongsi ketersediaan anda dan terima penghantaran.', availability: 'Ketersediaan saya', vehicle: 'Kenderaan', capacity: 'Barang yang boleh dibawa setiap perjalanan',
    range: 'Sejauh mana anda sanggup bergerak (km)?', available: 'Saya tersedia', saveBtn: 'Simpan ketersediaan', assignments: 'Tugasan saya', accept: 'Terima penghantaran', markDelivered: 'Tandakan sudah dihantar',
    noAssign: 'Belum ada tugasan. Pentadbir akan menugaskan anda apabila padanan memerlukan pengangkutan anda.', pickup: 'Pengambilan', deliverTo: 'Hantar ke', vehicles: { motorbike: 'Motosikal', car: 'Kereta', van: 'Van', truck: 'Lori' }
  },
  admin: {
    title: 'Papan pemuka pentadbir', sub: 'Sahkan organisasi, semak padanan dan pantau penghantaran.', orgsTitle: 'Organisasi untuk disahkan', noOrgs: 'Semua organisasi telah disahkan.',
    openTitle: 'Permohonan terbuka (paling segera dahulu)', reviewMatch: 'Semak padanan', matchesTitle: 'Padanan dan kemajuan penghantaran', volunteer: 'Sukarelawan', score: 'Skor padanan',
    reviewTitle: 'Semak padanan yang dicadangkan', request: 'Permohonan', allocation: 'Agihan yang dicadangkan', donorCol: 'Penderma', itemCol: 'Barang', takeCol: 'Ambil', distCol: 'Jarak',
    transport: 'Pengangkutan', checks: 'Sebab agihan ini', rejectedTitle: 'Sumber yang dilangkau', approveHint: 'Tiada apa berlaku sehingga anda meluluskan. Penderma dan sukarelawan hanya dimaklumkan selepas kelulusan.',
    notFeasibleTitle: 'Permohonan ini belum boleh dipenuhi sepenuhnya', shortfall: 'Masih kurang {n} barang.', backToList: 'Kembali ke papan pemuka', noMatches: 'Belum ada padanan.'
  },
  checks: {
    category: 'Kategori sepadan: {category}.',
    quantity_ok: 'Kuantiti dipenuhi: {total} daripada {needed} barang dari {donors} penderma.',
    quantity_no: 'Kuantiti tidak dipenuhi: hanya {total} daripada {needed} barang tersedia.',
    distance_ok: 'Jarak: lokasi pengambilan terjauh ialah {max} km (had {limit} km).',
    distance_no: 'Tiada penderma dalam lingkungan {limit} km yang mempunyai stok boleh digunakan.',
    transport_ok: 'Pengangkutan: {vehicle} berkapasiti {capacity} boleh membawa ini dalam {trips} perjalanan.',
    transport_no: 'Pengangkutan: {vehicle} berkapasiti {capacity} memerlukan {trips} perjalanan.',
    no_volunteer: 'Tiada sukarelawan yang bebas untuk tarikh dan jarak ini.',
    schedule: 'Jadual: pengambilan sempat sebelum tarikh diperlukan ({date}).'
  },
  reject: { none_left: 'Tiada stok belum ditempah', perishable: 'Barang mudah rosak tidak diterima dalam pilot', too_far: 'Terlalu jauh dari komuniti', schedule: 'Tarikh ketersediaan tidak sesuai' },
  impact: {
    title: 'Papan pemuka impak', sub: 'Hanya hasil yang disahkan dikira sebagai bantuan selesai.', k1: 'Permohonan disahkan', k2: 'Permohonan dipenuhi', k3: 'Kadar pemenuhan',
    k4: 'Barang diagihkan', k5: 'Penghantaran selesai', k6: 'Sukarelawan aktif', k7: 'Purata masa untuk padanan (jam)', byCat: 'Barang diagihkan mengikut kategori', noData: 'Belum ada penghantaran yang disahkan.'
  },
  map: { title: 'Paparan peta', sub: 'Permohonan komuniti terbuka sekitar Seri Iskandar. Lokasi ialah kawasan umum.', legend: 'Merah = segera, kuning = permohonan lain.' },
  about: {
    title: 'Tentang KITA', aboutTitle: 'Tentang kami',
    about1: 'KITA ialah platform web yang membantu penderma, kumpulan komuniti yang disahkan, sukarelawan dan pentadbir bekerjasama. Ia bermula di sekitar Universiti Teknologi PETRONAS (UTP) dan komuniti Seri Iskandar, Perak.',
    about2: 'KITA bukan sekadar papan senarai derma. Kumpulan komuniti menyatakan dengan tepat apa yang diperlukan, dan sistem mencadangkan penderma serta sukarelawan yang boleh memenuhinya. Manusia sentiasa meluluskan padanan.',
    visionTitle: 'Visi', vision: 'Komuniti di mana bantuan yang ada sampai kepada mereka yang memerlukan, dan tiada siapa tercicir kerana maklumat bertaburan.',
    missionTitle: 'Misi', mission: 'Memudahkan penyenaraian sumber, penghantaran keperluan yang disahkan, padanan yang adil, penghantaran bantuan dan pengesahan penerimaan.',
    valuesTitle: 'Nilai', values: [
      ['Amanah', 'Hanya organisasi yang disahkan boleh menghantar keperluan.'], ['Ketelusan', 'Setiap padanan yang dicadangkan menunjukkan sebab ia dipilih.'],
      ['Privasi', 'Kami mengumpul maklumat peribadi sesedikit mungkin.'], ['Komuniti dahulu', 'Keperluan yang didokumenkan didahulukan berbanding apa yang paling mudah diberi.'],
      ['Akauntabiliti', 'Hanya penghantaran yang disahkan diterima dikira.']
    ],
    problemTitle: 'Masalah yang ingin kami selesaikan', problemLead: 'Sumber wujud, tetapi keperluan komuniti masih tidak dipenuhi.',
    problems: [['Maklumat bertaburan', 'Keperluan dan tawaran dikongsi merentas kumpulan, panggilan dan rangkaian peribadi yang berasingan.'], ['Padanan memerlukan usaha', 'Penyelaras membandingkan kuantiti, lokasi, masa dan pengangkutan secara manual.'], ['Hasil sukar dijejak', 'Sukar melihat permohonan mana yang belum selesai, ditempah atau dipenuhi.']],
    problemNote: 'DOSM melaporkan kemiskinan mutlak 6.9% di Perak bagi 2024 (Malaysia: 5.1%). Ini menunjukkan keperluan sosial, bukan bukti jurang penyelarasan. Jurang itu ialah hipotesis yang akan kami uji melalui temu bual dengan NGO, kelab kampus, penderma dan sukarelawan.',
    sdgTitle: 'Matlamat global (SDG)', sdgs: [['1', 'Tiada Kemiskinan', 'Memperbaik penyelarasan bantuan asas.'], ['2', 'Sifar Kelaparan', 'Mengagihkan makanan tidak mudah rosak yang sesuai.'], ['11', 'Komuniti Mampan', 'Mengukuhkan hubungan antara kampus dan jiran.'], ['12', 'Penggunaan Bertanggungjawab', 'Memberi kegunaan kedua kepada barang tidak terpakai.'], ['17', 'Perkongsian', 'Menghimpunkan pelajar, NGO dan sukarelawan.']],
    scopeTitle: 'Garis panduan komuniti', scope: ['Hanya organisasi yang disahkan boleh menghantar permohonan.', 'Pilot hanya menerima barang tidak mudah rosak dan keperluan terpilih.', 'Tiada derma wang atau pembayaran.', 'Identiti penerima tidak dipaparkan kepada umum.', 'KITA tidak menjamin penghantaran. Setiap padanan memerlukan kelulusan manusia.'],
    statusNote: 'Status projek: MVP cadangan untuk UTP CodeFest 2026, Trek 3. Kerjasama dan penyertaan pilot belum disahkan.'
  }
};

export const dictionaries: Record<Locale, Dict> = { en, ms };

/** Fill {placeholders} in a dictionary string. */
export function fmt(template: string, data: Record<string, string | number> = {}): string {
  return template.replace(/\{(\w+)\}/g, (_, k) => String(data[k] ?? ''));
}
