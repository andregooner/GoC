import { TrainingDay } from "./types";

export const TRAINING_DAYS: TrainingDay[] = [
  {
    day: 1,
    titleId: "Stop Rambling",
    titleEn: "Stop Rambling",
    subtitleId: "Sampaikan pesan utama di detik pertama. Penjelasan belakangan.",
    subtitleEn: "Deliver your main point in the first second. Explain later.",
    badge: "DAY 1 · 10 MIN",
    durationMinutes: 10,
    goalId: "Sampai ke poin utama lebih cepat tanpa berputar-putar.",
    goalEn: "Get to your point faster without circling around.",
    framework: "PREP (Point - Reason - Example - Point)",
    learnContentId: [
      "Rambling biasanya terjadi saat kita mulai berbicara sebelum memutuskan apa poin utama kita.",
      "Aturan emas: Point first. Explanation second.",
      "Jangan membuka dengan latar belakang panjang. Buka dengan kesimpulan Anda, baru gunakan sisa waktu untuk membuktikan mengapa kesimpulan itu benar.",
    ],
    learnContentEn: [
      "Rambling usually happens when we start speaking before deciding what our main point is.",
      "Golden rule: Point first. Explanation second.",
      "Never begin with long-winded backstory. Open with your conclusion, then use the remaining seconds to substantiate why it's true.",
    ],
    exampleBadId:
      "“Eee... jadi sebenarnya WFH itu kan tren baru ya sejak pandemi. Dulu kita ke kantor macet-macetan di Sudirman, capek banget. Terus kalau di rumah kadang sinyal internet drop atau ada suara tetangga. Tapi di sisi lain kita bisa hemat ongkos bensin. Jadi ya menurut saya... eee... WFH bisa produktif sih kalau disiplin.”",
    exampleBadEn:
      "“Um... so actually working from home is a trend since the pandemic. Back then we commuted in heavy traffic, very tiring. Then at home sometimes Wi-Fi drops or neighbors are noisy. But on the other hand we save commute cash. So yeah, I think... um... WFH can be productive if disciplined.”",
    exampleGoodId:
      "“Bekerja dari rumah membuat seseorang jauh lebih produktif karena mengeliminasi 3 jam kelelahan komuter harian. Ketika energi tidak terkuras di jalan, fokus kerja mendalam meningkat drastis. Contohnya di tim kami, output fitur selesai 20% lebih cepat sejak sistem hybrid. Karena itu, fleksibilitas kerja langsung mendongkrak produktivitas nyata.”",
    exampleGoodEn:
      "“Working from home significantly increases productivity by eliminating three hours of draining daily commute. When energy isn't wasted in traffic, deep focus increases dramatically. For instance, in our team, project delivery accelerated by 20% under hybrid work. Therefore, workplace autonomy directly amplifies real output.”",
    challengeQuestionId:
      "“Apakah bekerja dari rumah membuat seseorang lebih produktif? Jelaskan pendapat Anda.”",
    challengeQuestionEn:
      "“Does working from home make people more productive? Explain your opinion.”",
    targetSeconds: { min: 30, max: 60 },
  },
  {
    day: 2,
    titleId: "Answer in 30 Seconds",
    titleEn: "Answer in 30 Seconds",
    subtitleId: "Komunikasi super ringkas dan hemat kata.",
    subtitleEn: "Extreme conciseness and conversational efficiency.",
    badge: "DAY 2 · 10 MIN",
    durationMinutes: 10,
    goalId: "Jelaskan satu gagasan penting dalam batas maksimal 30 detik.",
    goalEn: "Explain an important idea within a strict 30-second cap.",
    framework: "The 30-Second Elevator Cut",
    learnContentId: [
      "Orang sibuk tidak punya waktu untuk mendengarkan cerita 3 menit.",
      "Batasi jawaban Anda hanya menjadi 3 kalimat: Apa nilainya, bagaimana bekerjanya, dan mengapa itu penting bagi lawan bicara.",
      "Setiap kata yang tidak menambah nilai adalah gangguan.",
    ],
    learnContentEn: [
      "Busy leaders do not have time for a 3-minute preamble.",
      "Constrain your response to 3 sentences: What is the core value, how it works, and why it matters to your listener.",
      "Every single word that does not add immediate value is noise.",
    ],
    exampleBadId:
      "“Produk kami ini sebenarnya baru diluncurkan kuartal lalu setelah riset panjang, dan kami melihat banyak software lain itu fiturnya terlalu rumit sehingga user bingung...”",
    exampleBadEn:
      "“Our product was actually launched last quarter after extensive research, and we noticed existing software has overly complex features that confuse users...”",
    exampleGoodId:
      "“Platform kami memotong waktu onboarding karyawan dari 5 hari menjadi 30 menit melalui otomasi dokumen terpadu. Lebih dari 50 perusahaan sudah menghemat ratusan jam kerja HR. Inilah solusi tercepat untuk tim yang bertumbuh pesat.”",
    exampleGoodEn:
      "“Our platform slashes employee onboarding from 5 days to 30 minutes through automated workflows. Over 50 companies already saved hundreds of administrative hours. It is the fastest solution for scaling teams.”",
    challengeQuestionId:
      "“Jelaskan apa keunggulan terbesar dari produk, layanan, atau keahlian Anda dalam waktu maksimal 30 detik.”",
    challengeQuestionEn:
      "“Explain the single biggest advantage of your product, service, or skillset in under 30 seconds.”",
    targetSeconds: { min: 20, max: 35 },
  },
  {
    day: 3,
    titleId: "Think Before You Speak",
    titleEn: "Think Before You Speak",
    subtitleId: "Jeda 3 detik adalah tanda percaya diri, bukan kelemahan.",
    subtitleEn: "A 3-second pause conveys authority, not hesitation.",
    badge: "DAY 3 · 10 MIN",
    durationMinutes: 10,
    goalId: "Strukturkan pikiran sebelum membuka mulut: Pause → Structure → Speak.",
    goalEn: "Structure thoughts before opening your mouth: Pause → Structure → Speak.",
    framework: "Pause → Structure → Speak",
    learnContentId: [
      "Banyak orang langsung mengeluarkan suara 'eee' atau 'jadi' karena takut hening dinilai lambat.",
      "Hening 2-3 detik menunjukkan pemikir matang yang menghargai bobot perkataannya.",
      "Tarik napas, tentukan 1 kata kunci kesimpulan di kepala, baru mulai berbicara.",
    ],
    learnContentEn: [
      "Speakers often blur out 'um' or 'uh' immediately out of fear that silence signals ignorance.",
      "A deliberate 2-3 second pause commands the room and signals executive poise.",
      "Breathe, anchor one conclusion keyword in your mind, then speak with intent.",
    ],
    exampleBadId:
      "“Eee... langsung jawab ya... waktu itu krisisnya pas server down, aduh panik banget, jadi semua orang teriak-teriak di Slack...”",
    exampleBadEn:
      "“Um... right away... well the crisis happened when servers crashed, oh man we panicked so everyone was yelling on Slack...”",
    exampleGoodId:
      "[Jeda 2 detik] “Saat krisis melanda, tim kami selalu menerapkan prinsip 'Stabilkan, Diagnosa, Komunikasikan'. Pertama, kami menghentikan kerusakan sistem seketika. Kedua, kami mencari akar masalah tanpa mencari kambing hitam. Ketiga, kami memberikan update transparan ke klien setiap 30 menit. Ketenangan terstruktur adalah kunci kami keluar dari krisis.”",
    exampleGoodEn:
      "[2-second pause] “When crisis strikes, our team follows 'Contain, Diagnose, Communicate'. First, we arrest ongoing damage immediately. Second, we isolate root causes without blaming individuals. Third, we give transparent updates to stakeholders every 30 minutes. Structured composure is how we resolve crises.”",
    challengeQuestionId:
      "“Bagaimana cara tim Anda mengatasi kegagalan atau krisis mendadak di tempat kerja?”",
    challengeQuestionEn:
      "“How does your team handle unexpected setbacks or critical emergencies at work?”",
    targetSeconds: { min: 30, max: 60 },
  },
  {
    day: 4,
    titleId: "Eliminate Fillers",
    titleEn: "Eliminate Fillers",
    subtitleId: "Ganti suara pengisi (eee, kayak, actually) dengan hening sengaja.",
    subtitleEn: "Replace filler sounds with deliberate silence.",
    badge: "DAY 4 · 10 MIN",
    durationMinutes: 10,
    goalId: "Kurangi filler rate di bawah 2% menggunakan teknik silent anchor.",
    goalEn: "Reduce filler rate below 2% using silent micro-pauses.",
    framework: "Silent Anchor Technique",
    learnContentId: [
      "Filler words muncul ketika pita suara bekerja lebih cepat daripada proses berpikir di otak.",
      "Kapan pun Anda merasakan dorongan mengucapkan 'eee' atau 'maksudnya', tutup bibir rapat-rapat selama 1 detik.",
      "Pendengar tidak akan menganggap jeda hening sebagai gangguan—justru kalimat Anda terdengar lebih berwibawa.",
    ],
    learnContentEn: [
      "Filler words happen when vocal cords operate faster than the brain organizes thoughts.",
      "Whenever you feel the urge to emit 'um', 'like', or 'basically', close your lips for 1 second.",
      "Listeners never mind silence; in fact, intentional silence projects confidence and authority.",
    ],
    exampleBadId:
      "“Waktu itu saya, kayak, harus mutusin buat nge-cut budget proyek, eee... maksudnya itu berat banget kan, sebenarnya banyak yang komplain...”",
    exampleBadEn:
      "“Back then I, like, had to decide to cut project budget, um... basically that was super tough, actually a lot of people complained...”",
    exampleGoodId:
      "“Keputusan tersulit saya adalah membatalkan fitur yang sudah dikerjakan 2 bulan karena validasi pasar membuktikan tidak ada peminat. [Hening] Itu keputusan menyakitkan bagi tim teknis. [Hening] Namun menghentikan pemborosan sumber daya menyelamatkan kas perusahaan untuk pivot yang berhasil.”",
    exampleGoodEn:
      "“My hardest decision was canceling a feature built over two months because market validation proved zero demand. [Silence] It was painful for the engineering team. [Silence] But stopping resource waste preserved critical runway for our subsequent successful pivot.”",
    challengeQuestionId:
      "“Ceritakan sebuah keputusan sulit yang pernah Anda ambil dalam pekerjaan atau studi Anda.”",
    challengeQuestionEn:
      "“Describe a difficult decision you had to make in your work or academic journey.”",
    targetSeconds: { min: 30, max: 60 },
  },
  {
    day: 5,
    titleId: "Explain Complex Ideas Simply",
    titleEn: "Explain Complex Ideas Simply",
    subtitleId: "Ubah jargon teknis menjadi analogi yang dipahami siapa saja.",
    subtitleEn: "Translate technical jargon into relatable analogies anyone understands.",
    badge: "DAY 5 · 10 MIN",
    durationMinutes: 10,
    goalId: "Jelaskan konsep rumit kepada orang awam tanpa istilah membingungkan.",
    goalEn: "Explain a complex concept to a non-expert without jargon.",
    framework: "The Feynman Analogy Bridge",
    learnContentId: [
      "Kecerdasan sejati bukan terlihat dari seberapa rumit kata-kata Anda, melainkan seberapa sederhana Anda bisa membuatnya dipahami.",
      "Gunakan rumus: [Konsep rumit] itu seperti [Hal sehari-hari], karena [Kesamaan fungsi].",
      "Hindari akronim internal dan jargon industri.",
    ],
    learnContentEn: [
      "True mastery is never measured by vocabulary complexity, but by how effortlessly you make it understood.",
      "Use the formula: [Complex concept] is just like [Familiar everyday object], because [Shared function].",
      "Eliminate obscure acronyms and insider buzzwords.",
    ],
    exampleBadId:
      "“API itu antarmuka protokol RESTful stateless dengan payload JSON untuk serialisasi data antara backend microservice dengan front-end client...”",
    exampleBadEn:
      "“An API is a stateless RESTful protocol interface serialization payload in JSON bridging backend microservices with client UI endpoints...”",
    exampleGoodId:
      "“API itu seperti pelayan di restoran. Anda sebagai pelanggan memesan makanan dari buku menu. Pelayan membawa pesanan Anda ke dapur, lalu membawakan makanan yang sudah jadi kembali ke meja Anda. Anda tidak perlu tahu bagaimana koki memasak di dalam dapur—pelayanlah yang menghubungkan keduanya.”",
    exampleGoodEn:
      "“An API is like a waiter in a restaurant. As a customer, you pick an order from the menu. The waiter carries your order to the kitchen, then brings delicious food back to your table. You don't need to know how the chef cooks inside—the waiter seamlessly bridges the two sides.”",
    challengeQuestionId:
      "“Jelaskan sebuah konsep di bidang Anda (misalnya: API, suku bunga, atau AI) kepada anak usia 12 tahun menggunakan analogi sederhana.”",
    challengeQuestionEn:
      "“Explain a complex concept from your field (e.g. APIs, interest rates, or AI) to a 12-year-old using a simple everyday analogy.”",
    targetSeconds: { min: 30, max: 60 },
  },
  {
    day: 6,
    titleId: "Speak With Structure",
    titleEn: "Speak With Structure",
    subtitleId: "Kuasai framework 1–3–1 untuk presentasi dan argumen persuasif.",
    subtitleEn: "Master the 1–3–1 framework for structured executive persuasion.",
    badge: "DAY 6 · 10 MIN",
    durationMinutes: 10,
    goalId: "Bangun argumen dengan struktur 1 Hook, 3 Pilar Inti, 1 Punchline.",
    goalEn: "Construct an argument with 1 Hook, 3 Pillars, and 1 Punchline.",
    framework: "The 1–3–1 Persuasion Pillar",
    learnContentId: [
      "Otak manusia menyukai angka tiga. Tiga alasan terasa lengkap, kokoh, dan mudah diingat.",
      "Struktur 1–3–1: 1 Hook utama -> 3 Pilar pendukung (Pertama, Kedua, Ketiga) -> 1 Kalimat penutup tegas.",
      "Metode ini membuat pendengar langsung mencatat poin Anda di rapat tanpa merasa kelelahan.",
    ],
    learnContentEn: [
      "The human brain naturally remembers trios. Three supporting pillars feel complete and authoritative.",
      "The 1–3–1 format: 1 Core Hook -> 3 Supporting Pillars (First, Second, Third) -> 1 Resonant Punchline.",
      "This lets colleagues take clean meeting notes without cognitive fatigue.",
    ],
    exampleBadId:
      "“Perusahaan harus pakai AI karena AI lagi tren banget, terus kompetitor juga pakai, dan kita bisa hemat waktu karyawan, terus nanti hasilnya juga lebih keren...”",
    exampleBadEn:
      "“The company needs AI because AI is trendy, competitors use it too, and we save employee time, and our output will look cooler...”",
    exampleGoodId:
      "“Perusahaan kita harus mengadopsi AI tahun ini karena 3 alasan strategis: Pertama, memangkas 40% waktu kerja berulang tim operasional. Kedua, mempercepat respon layanan pelanggan 24/7. Ketiga, melindungi pangsa pasar kita dari kompetitor yang sudah bergerak. Berinvestasi pada AI bukan lagi eksperimen, melainkan pertahanan bisnis wajib.”",
    exampleGoodEn:
      "“Our organization must integrate AI this year for three strategic reasons: First, it eliminates 40% of repetitive operational drudgery. Second, it delivers instant 24/7 client response times. Third, it safeguards our market share against fast-moving rivals. Adopting AI is no longer an experiment; it is essential competitive defense.”",
    challengeQuestionId:
      "“Mengapa perusahaan atau organisasi Anda harus berinvestasi pada AI atau teknologi baru tahun ini? Gunakan struktur 3 pilar.”",
    challengeQuestionEn:
      "“Why should your company or team invest in AI or modern tooling this year? Use a 3-pillar structure.”",
    targetSeconds: { min: 40, max: 75 },
  },
  {
    day: 7,
    titleId: "Tell Better Stories",
    titleEn: "Tell Better Stories",
    subtitleId: "Bercerita dengan ketegangan, tindakan nyata, dan pelajaran bermakna.",
    subtitleEn: "Narrate with authentic tension, decisive action, and lasting lessons.",
    badge: "DAY 7 · 10 MIN",
    durationMinutes: 10,
    goalId: "Ceritakan pengalaman berkesan dengan struktur STAR-L (Situation, Tension, Action, Result, Lesson).",
    goalEn: "Narrate an experience using STAR-L: Situation, Tension, Action, Result, Lesson.",
    framework: "STAR-L (Situation, Tension, Action, Result, Lesson)",
    learnContentId: [
      "Cerita yang baik bukan sekadar kronologi peristiwa. Cerita butuh 'Tension' (titik konflik/tekanan).",
      "Tanpa ketegangan, cerita Anda terasa datar seperti membaca log harian.",
      "Akhiri selalu dengan 'Lesson' (pelajaran berharga) agar cerita memiliki bobot inspirasi bagi lawan bicara.",
    ],
    learnContentEn: [
      "A great story is not a dry chronological log. It requires genuine tension and stakes.",
      "Without tension, stories feel flat and forgettable.",
      "Always conclude with the 'Lesson' so the narrative imparts enduring wisdom.",
    ],
    exampleBadId:
      "“Dulu saya pernah ngerjain proyek bareng tim. Proyeknya susah, deadline mepet. Tapi kita lembur bareng dan akhirnya selesai tepat waktu terus bos senang.”",
    exampleBadEn:
      "“Back then I worked on a project with a team. It was hard with a tight deadline. But we worked overtime, finished on time, and our manager was happy.”",
    exampleGoodId:
      "“Dua tahun lalu, 24 jam sebelum peluncuran produk terbesar kami, sistem database utama tiba-tiba korup. [Tension] Klien sudah menunggu, dan reputasi perusahaan dipertaruhkan. [Action] Saya mengumpulkan tim kunci, membagi tugas pemulihan cadangan data darurat, dan memimpin koordinasi tanpa kepanikan selama 14 jam berturut-turut. [Result] Kami meluncur tepat pukul 8 pagi tanpa kehilangan satu data pun. [Lesson] Pelajaran terbesar saya: di tengah krisis hebat, kepemimpinan yang tenang bernilai seribu kali lebih berharga daripada kepanikan.”",
    exampleGoodEn:
      "“Two years ago, 24 hours before our flagship launch, our production database catastrophically corrupted. [Tension] 10,000 customers were waiting and our reputation hung in the balance. [Action] I gathered key engineers, established isolated recovery protocols, and maintained calm communication throughout a 14-hour marathon. [Result] We went live at 8 AM sharp without losing a single record. [Lesson] My ultimate takeaway: in high-stakes turbulence, structured composure is worth a thousand times more than panic.”",
    challengeQuestionId:
      "“Ceritakan momen ketika kerja keras Anda membawa perubahan nyata bagi seseorang atau organisasi Anda. Ikuti alur STAR-L.”",
    challengeQuestionEn:
      "“Tell the story of a defining moment where your effort made a lasting impact on your team or organization. Follow STAR-L.”",
    targetSeconds: { min: 45, max: 90 },
  },
];