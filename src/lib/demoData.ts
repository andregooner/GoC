import { AssessmentResult, Language } from "./types";

export const DEMO_ASSESSMENTS: Record<Language, { initial: AssessmentResult; retry: AssessmentResult }> = {
  id: {
    initial: {
      id: "demo-id-initial",
      timestamp: Date.now() - 1000 * 60 * 5,
      question: "Ceritakan apa yang Anda kerjakan saat ini, dan mengapa pekerjaan tersebut penting.",
      language: "id",
      transcript:
        "Eee... jadi saat ini saya bekerja sebagai product manager di salah satu startup logistik. Emm... latar belakangnya dulu logistik di Indonesia itu kan cukup kompleks ya, kayak banyak pulau dan gudangnya terpencar-pencar. Maksudnya, tantangannya besar sekali. Jadi... eee... pekerjaan saya di sini penting karena kami mendigitalkan sistem rute pengiriman barang. Dengan aplikasi yang kami bangun, para kurir bisa menghemat waktu pengiriman hingga 30%, dan UMKM bisa mengirim barang dengan ongkos yang lebih terjangkau. Jadi itu sih inti dari apa yang saya kerjakan.",
      metrics: {
        durationSeconds: 68,
        wordCount: 154,
        wordsPerMinute: 136,
        fillerTotal: 8,
        fillerBreakdown: {
          eee: 4,
          hmm: 1,
          kayak: 1,
          maksudnya: 1,
          jadi: 1,
        },
        fillerRate: 5.2,
        repetitions: ["“jadi jadi”"],
        longPausesCount: 3,
        responseLengthClass: "Good",
      },
      categoryScores: {
        clarity: 72,
        conciseness: 58,
        structure: 67,
        fillerControl: 61,
        pace: 81,
        vocabulary: 74,
      },
      overallScore: 68,
      coach: {
        clarity: {
          score: 72,
          feedback: "Pesan Anda pada akhirnya tersampaikan dengan baik, tetapi pendengar harus menyaring banyak konteks awal sebelum menangkap intinya.",
        },
        conciseness: {
          score: 58,
          feedback: "Anda menghabiskan hampir separuh waktu untuk menjelaskan konteks geografis Indonesia sebelum menyampaikan dampak nyata pekerjaan Anda.",
        },
        structure: {
          score: 67,
          feedback: "Struktur jawaban Anda terbalik: latar belakang dulu, baru poin utama. Gunakan framework PREP agar kesimpulan hadir di detik awal.",
        },
        vocabulary: {
          score: 74,
          feedback: "Pilihan kata profesional dan natural, tidak berlebihan dan mudah dipahami rekan lintas divisi.",
        },
        fillerControlAssessment: "Terdeteksi 8 kata pengisi (terutama 'eee' dan 'kayak'). Cobalah mengganti jeda berpikir dengan hening sejenak daripada bersuara.",
        fillerControlScore: 61,
        paceAssessment: "Kecepatan 136 kata per menit berada dalam rentang ideal untuk percakapan profesional.",
        paceScore: 81,
        mainStrength: "Anda menjelaskan ide menggunakan bahasa yang mudah dipahami.",
        biggestOpportunity: "Sampaikan poin utama Anda lebih awal.",
        coachFeedback:
          "Penjelasan Anda mudah dipahami, tetapi poin utama Anda muncul terlalu lambat. Pada percobaan berikutnya, sampaikan jawaban Anda di kalimat pertama dan gunakan sisa waktu untuk menjelaskan alasannya.",
        betterApproach:
          "Terapkan PREP: (P) 'Pekerjaan saya penting karena memangkas biaya logistik UMKM hingga 30% melalui optimalisasi rute digital.' (R) 'Karena geografi kepulauan menuntut efisiensi armada...' (E) 'Bulan lalu 500 UMKM menghemat jutaan rupiah.' (P) 'Inilah misi peran saya.'",
        exampleImprovedAnswer:
          "Pekerjaan saya sebagai Product Manager logistik penting karena langsung memangkas biaya kirim ratusan UMKM hingga 30%. Dengan algoritma rute yang kami bangun, kurir bekerja lebih cepat dan barang tiba tepat waktu. Peran ini krusial untuk menghubungkan ekonomi daerah secara efisien.",
        nextExercise: "Day 1: Stop Rambling — Point first, explanation second.",
        summarySentence:
          "Anda berkomunikasi dengan cukup jelas secara umum, namun Anda sering menjelaskan latar belakang sebelum menyampaikan poin utama.",
      },
      isDemo: true,
    },
    retry: {
      id: "demo-id-retry",
      timestamp: Date.now(),
      question: "Ceritakan apa yang Anda kerjakan saat ini, dan mengapa pekerjaan tersebut penting.",
      language: "id",
      transcript:
        "Sebagai Product Manager, pekerjaan saya penting karena kami memangkas biaya pengiriman bagi ribuan pelaku UMKM melalui otomatisasi rute logistik. Alasan utamanya adalah efisiensi: sebelumnya rute ditentukan manual sehingga boros bahan bakar. Kami membangun sistem navigasi pintar yang berhasil memotong waktu antar kurir hingga 30%. Hasilnya, bisnis kecil dapat menjangkau pelanggan lebih murah dan cepat. Itulah nilai terpenting dari apa yang saya kerjakan setiap hari.",
      metrics: {
        durationSeconds: 52,
        wordCount: 122,
        wordsPerMinute: 140,
        fillerTotal: 2,
        fillerBreakdown: {
          jadi: 1,
          eee: 1,
        },
        fillerRate: 1.6,
        repetitions: [],
        longPausesCount: 1,
        responseLengthClass: "Good",
      },
      categoryScores: {
        clarity: 81,
        conciseness: 74,
        structure: 78,
        fillerControl: 84,
        pace: 88,
        vocabulary: 77,
      },
      overallScore: 80,
      coach: {
        clarity: {
          score: 81,
          feedback: "Pernyataan pembuka sangat tegas dan pendengar langsung memahami esensi pekerjaan Anda dalam 5 detik pertama.",
        },
        conciseness: {
          score: 74,
          feedback: "Jauh lebih hemat kata. Tidak ada lagi pembukaan bertele-tele mengenai geografi umum.",
        },
        structure: {
          score: 78,
          feedback: "Penerapan PREP terlihat sangat rapi: Poin pembuka, alasan efisiensi, contoh hasil 30%, lalu penutup yang meyakinkan.",
        },
        vocabulary: {
          score: 77,
          feedback: "Diksi sangat tajam: otomatisasi rute, navigasi pintar, nilai terpenting.",
        },
        fillerControlAssessment: "Penurunan signifikan: hanya 2 filler terdeteksi (tingkat filler turun dari 5.2% menjadi 1.6%).",
        fillerControlScore: 84,
        paceAssessment: "Tempo 140 KPM sangat percaya diri dan stabil tanpa jeda canggung.",
        paceScore: 88,
        mainStrength: "Poin utama langsung dinyatakan di awal dengan dampak terukur.",
        biggestOpportunity: "Pertahankan kontrol jeda hening saat transisi antar kalimat.",
        coachFeedback:
          "Peningkatan luar biasa pada percobaan kedua! Anda memangkas waktu bicara dari 68 detik menjadi 52 detik sambil menyampaikan pesan dengan jauh lebih bertenaga dan berstruktur.",
        betterApproach: "Pertahankan kebiasaan membuka kalimat dengan kesimpulan di setiap rapat kerja.",
        exampleImprovedAnswer:
          "Sebagai Product Manager, pekerjaan saya penting karena kami memangkas biaya pengiriman bagi ribuan UMKM melalui otomatisasi rute logistik. Kami menghemat waktu kurir hingga 30% dan ongkos kirim pelanggan.",
        nextExercise: "Day 2: Answer in 30 Seconds — Extreme conciseness drill.",
        summarySentence:
          "Penyampaian Anda sekarang terstruktur tajam, percaya diri, dan langsung pada substansi dampak.",
      },
      isDemo: true,
    },
  },
  en: {
    initial: {
      id: "demo-en-initial",
      timestamp: Date.now() - 1000 * 60 * 5,
      question: "Tell us what you currently do, and why your work matters.",
      language: "en",
      transcript:
        "Um... basically, right now I work as an engineering lead at a fintech company. And, you know, our team handles payment gateways. I guess, like, the background is that many small merchants struggle with digital transactions because of high failure rates. So, uh, actually, why my work matters is because we build reliable infrastructure that ensures 99.9% uptime. When payments work smoothly, merchants don't lose sales and customers don't get frustrated. So yeah, that is pretty much what we do.",
      metrics: {
        durationSeconds: 68,
        wordCount: 154,
        wordsPerMinute: 136,
        fillerTotal: 8,
        fillerBreakdown: {
          um: 2,
          basically: 1,
          "you know": 1,
          like: 1,
          uh: 1,
          actually: 1,
          "so yeah": 1,
        },
        fillerRate: 5.2,
        repetitions: ["“the the”"],
        longPausesCount: 3,
        responseLengthClass: "Good",
      },
      categoryScores: {
        clarity: 72,
        conciseness: 58,
        structure: 67,
        fillerControl: 61,
        pace: 81,
        vocabulary: 74,
      },
      overallScore: 68,
      coach: {
        clarity: {
          score: 72,
          feedback: "Your core message is understandable, but listeners have to wait through background details before discovering your impact.",
        },
        conciseness: {
          score: 58,
          feedback: "You spent almost half of your response explaining context before communicating your main idea.",
        },
        structure: {
          score: 67,
          feedback: "Your structure is inverted: context first, conclusion at the end. Use PREP to front-load your punchline.",
        },
        vocabulary: {
          score: 74,
          feedback: "Precise engineering vocabulary (uptime, payment gateways, failure rates).",
        },
        fillerControlAssessment: "Detected 8 filler words ('um', 'basically', 'you know', 'like'). Replace filler sounds with intentional silence.",
        fillerControlScore: 61,
        paceAssessment: "136 words per minute is in the optimal presentation tempo band.",
        paceScore: 81,
        mainStrength: "You explain technical ideas using understandable business language.",
        biggestOpportunity: "Get to your main point sooner.",
        coachFeedback:
          "Your explanation is understandable, but your main point appears too late. In your next attempt, state your answer in the first sentence and use the remaining time to explain why.",
        betterApproach:
          "Use PREP: (Point) 'My work as engineering lead matters because we safeguard revenue for 10,000 merchants through 99.9% payment reliability.' (Reason) 'Because downtime directly costs merchants their livelihood...' (Example) 'Last month we processed $20M with zero dropped orders.' (Point) 'That reliability is why my job exists.'",
        exampleImprovedAnswer:
          "As an engineering lead, my work matters because we ensure 99.9% payment reliability for over 10,000 small merchants. When our payment gateway never fails, local businesses never lose a sale. That technical resilience is why my role directly drives customer livelihood.",
        nextExercise: "Day 1: Stop Rambling — Point first, explanation second.",
        summarySentence:
          "You communicate clearly overall, but you often explain the background before stating your main point.",
      },
      isDemo: true,
    },
    retry: {
      id: "demo-en-retry",
      timestamp: Date.now(),
      question: "Tell us what you currently do, and why your work matters.",
      language: "en",
      transcript:
        "As an engineering lead, my work matters because we protect daily revenue for 10,000 digital merchants by ensuring 99.9% payment reliability. In fintech, every second of system downtime directly loses someone a customer. Last quarter, our infrastructure handled five million transactions without a single dropped payment. Ensuring that seamless financial trust is why my work matters every single day.",
      metrics: {
        durationSeconds: 50,
        wordCount: 118,
        wordsPerMinute: 141,
        fillerTotal: 1,
        fillerBreakdown: {
          um: 1,
        },
        fillerRate: 0.8,
        repetitions: [],
        longPausesCount: 1,
        responseLengthClass: "Good",
      },
      categoryScores: {
        clarity: 82,
        conciseness: 75,
        structure: 79,
        fillerControl: 88,
        pace: 89,
        vocabulary: 78,
      },
      overallScore: 81,
      coach: {
        clarity: {
          score: 82,
          feedback: "Sharp, authoritative opening. Your value proposition was crystal clear within 6 seconds.",
        },
        conciseness: {
          score: 75,
          feedback: "Trimmed 18 seconds of conversational fat. Every sentence delivered direct substance.",
        },
        structure: {
          score: 79,
          feedback: "Exemplary PREP adherence: bold Point, urgent Reason, concrete 5M transactions Example, inspiring Point wrap-up.",
        },
        vocabulary: {
          score: 78,
          feedback: "Dynamic verbs and executive phrasing: 'protect daily revenue', 'seamless financial trust'.",
        },
        fillerControlAssessment: "Outstanding progress: reduced filler rate from 5.2% to 0.8% with only 1 filler detected.",
        fillerControlScore: 88,
        paceAssessment: "141 WPM with confident modulation and crisp pauses.",
        paceScore: 89,
        mainStrength: "Immediate point-first clarity backed by concrete metrics.",
        biggestOpportunity: "Maintain this concise discipline during unscripted Q&A.",
        coachFeedback:
          "Huge improvement across all categories! You moved your key conclusion to sentence one and eliminated filler habits, boosting your score from 68 to 81.",
        betterApproach: "Adopt this structure for all upcoming executive updates.",
        exampleImprovedAnswer:
          "As an engineering lead, my work matters because we protect daily revenue for 10,000 digital merchants with 99.9% payment reliability.",
        nextExercise: "Day 2: Answer in 30 Seconds — Brevity sprint.",
        summarySentence:
          "Your communication is now sharp, compelling, and immediately impactful.",
      },
      isDemo: true,
    },
  },
};