export const translations = {
  en: {
    // Navigation
    nav: {
      home: 'Home',
      quran: 'Quran',
      duas: 'Duas',
      bookmarks: 'Bookmarks',
      signIn: 'Sign in',
      signOut: 'Sign out',
    },

    // Homepage
    home: {
      title: 'Welcome to Taslim',
      subtitle: 'Your companion for reading the Quran and daily Islamic duas',
      tagline: 'Simple steps towards goodness every day.',
      startReading: 'Start Reading',
      browseDuas: 'Browse Duas',

      // Features
      features: {
        readQuran: {
          title: 'Read the Quran',
          description: 'Browse all 114 surahs with Arabic text and translations in multiple languages'
        },
        dailyDuas: {
          title: 'Daily Duas',
          description: 'Curated collection of authentic Islamic supplications for every occasion'
        },
        bookmarks: {
          title: 'Bookmarks',
          description: 'Save and bookmark ayahs and duas for quick access anytime'
        }
      },

      // Stats
      stats: {
        title: 'The Complete Quran Experience',
        subtitle: 'Explore authentic Quranic content with translations and daily duas',
        surahs: { number: '114', label: 'Surahs', description: 'Complete Quran' },
        ayahs: { number: '6,236', label: 'Ayahs', description: 'Verses Available' },
        free: { number: '100%', label: 'Free', description: 'Forever' },
        access: { number: '24/7', label: 'Access', description: 'Anytime, Anywhere' }
      },

      // Additional Features
      moreFeatures: {
        title: 'More Than Just a Reader',
        subtitle: 'Taslim offers a complete Islamic companion experience with modern features designed for today\'s digital age',
        mobile: { title: 'Mobile Optimized', description: 'Seamless experience on phones, tablets, and desktops' },
        cloud: { title: 'Cloud Sync', description: 'Access your bookmarks and progress from any device' },
        privacy: { title: 'Privacy First', description: 'Your data is secure and never shared with third parties' },
        fast: { title: 'Lightning Fast', description: 'Optimized performance for instant page loads' },
        language: { title: 'Multi-Language', description: 'Translations and transliterations in Indonesian' },
        community: { title: 'Community Driven', description: 'Built with love for the Muslim Ummah worldwide' }
      },

      // Why Choose
      whyChoose: {
        title: 'Why Choose Taslim?',
        subtitle: 'Experience the Quran in a modern, accessible way',
        guestMode: { label: 'Guest Mode:', text: 'Full functionality without login using localStorage' },
        autoTracking: { label: 'Auto-tracking:', text: 'Automatically saves your last read position' },
        accountMerge: { label: 'Account Merge:', text: 'One-click migration from guest to authenticated user' },
        multiLanguage: { label: 'Multi-language:', text: 'Indonesian translation with transliteration' },
        responsive: { label: 'Responsive:', text: 'Optimized for all devices - mobile, tablet, and desktop' },
        updated: { label: 'Always Updated:', text: 'Powered by EQuran.id public API' }
      },

      // Bismillah Section
      bismillah: {
        arabic: 'بِسۡمِ ٱللَّهِ ٱلرَّحۡمَٰنِ ٱلرَّحِيمِ',
        translation: 'In the name of Allah, the Most Gracious, the Most Merciful',
        description: 'Taslim is dedicated to making the Holy Quran accessible to everyone, everywhere. Whether you\'re at home, traveling, or on the go, your spiritual journey continues seamlessly.'
      },

      // CTA
      cta: {
        title: 'Start Your Journey Today',
        subtitle: 'Join thousands of Muslims worldwide who trust Taslim for their daily Quran reading and duas',
        createAccount: 'Create Free Account',
        browseQuran: 'Browse Quran',
        note: 'No credit card required • 100% Free • Works offline'
      }
    },

    // Quran Page
    quran: {
      title: 'Holy Quran',
      subtitle: 'Browse all 114 surahs with Arabic text, transliteration, and Indonesian translations',
      stats: {
        surahs: 'Surahs',
        ayahs: 'Ayahs',
        makkah: 'Makkah',
        madinah: 'Madinah'
      },
      ayahs: 'ayahs',
      explore: 'Explore',
      previous: 'Previous',
      next: 'Next',
      backToAll: 'Back to All Surahs'
    },

    // Duas Page
    duas: {
      title: 'Daily Duas',
      subtitle: 'Authentic Islamic supplications from the Quran and Sunnah',
      searchPlaceholder: 'Search duas by name, category, or tags...',
      stats: {
        categories: 'Categories',
        duas: 'Duas'
      },
      showMeaning: 'Show Meaning',
      hideMeaning: 'Hide Meaning',
      transliteration: 'Transliteration',
      meaning: 'Meaning',
      reference: 'Reference',
      backToAll: 'Back to All Categories',
      searching: 'Searching...',
      noResults: 'No duas found'
    },

    // Auth Pages
    auth: {
      signIn: {
        title: 'Sign in to Taslim',
        subtitle: 'Access your bookmarks and reading progress across devices',
        emailLabel: 'Email address',
        emailPlaceholder: 'you@example.com',
        signInWithEmail: 'Sign in with Email',
        orContinueWith: 'Or continue with',
        signInWithGoogle: 'Sign in with Google',
        signInWithGitHub: 'Sign in with GitHub',
        checkEmail: 'Check your email',
        emailSent: 'We sent you a sign-in link to',
        note: 'By signing in, you can sync your bookmarks and reading progress across all your devices.',
        guestNote: 'Guest mode is still available without signing in!'
      },
      register: {
        title: 'Create Account',
        subtitle: 'Join Taslim to sync your bookmarks and reading progress',
        fullName: 'Full Name',
        fullNamePlaceholder: 'Enter your full name',
        gender: 'Gender',
        genderPlaceholder: 'Select gender',
        male: 'Male',
        female: 'Female',
        email: 'Email Address',
        emailPlaceholder: 'you@example.com',
        password: 'Password',
        passwordPlaceholder: 'At least 8 characters',
        retypePassword: 'Retype Password',
        retypePasswordPlaceholder: 'Confirm your password',
        createAccount: 'Create Account',
        creatingAccount: 'Creating Account...',
        alreadyHaveAccount: 'Already have an account?',
        signInLink: 'Sign in',
        success: 'Registration Successful!',
        successMessage: 'Your account has been created. Redirecting to sign in...',
        errors: {
          fullNameRequired: 'Full name is required',
          fullNameMin: 'Full name must be at least 3 characters',
          genderRequired: 'Please select your gender',
          emailRequired: 'Email is required',
          emailInvalid: 'Please enter a valid email address',
          passwordRequired: 'Password is required',
          passwordMin: 'Password must be at least 8 characters',
          retypePasswordRequired: 'Please retype your password',
          passwordMismatch: 'Passwords do not match'
        }
      },
      error: {
        title: 'Sign In Error',
        tryAgain: 'Try Again',
        backToHome: 'Back to Home',
        guestNote: 'You can still use Taslim in guest mode without signing in.'
      }
    },

    // Common
    common: {
      explore: 'Explore',
      loading: 'Loading...',
      error: 'Error',
      required: '*',
      guestMode: 'Guest Mode'
    },

    // Footer
    footer: {
      builtWith: 'Built with ❤️ for the Muslim Ummah',
      copyright: '© 2025 Taslim',
      poweredBy: 'Powered by EQuran.id',
      by: 'By Teras'
    }
  },

  id: {
    // Navigasi
    nav: {
      home: 'Beranda',
      quran: 'Quran',
      duas: 'Doa',
      bookmarks: 'Bookmark',
      signIn: 'Masuk',
      signOut: 'Keluar',
    },

    // Halaman Utama
    home: {
      title: 'Selamat Datang di Taslim',
      subtitle: 'Pendamping Anda untuk membaca Al-Quran dan doa-doa harian',
      tagline: 'Langkah sederhana menuju kebaikan setiap hari.',
      startReading: 'Mulai Membaca',
      browseDuas: 'Jelajahi Doa',

      // Fitur
      features: {
        readQuran: {
          title: 'Baca Al-Quran',
          description: 'Jelajahi 114 surah dengan teks Arab dan terjemahan dalam berbagai bahasa'
        },
        dailyDuas: {
          title: 'Doa Harian',
          description: 'Koleksi doa-doa Islam autentik untuk setiap kesempatan'
        },
        bookmarks: {
          title: 'Bookmark',
          description: 'Simpan dan bookmark ayat dan doa untuk akses cepat kapan saja'
        }
      },

      // Statistik
      stats: {
        title: 'Pengalaman Al-Quran Lengkap',
        subtitle: 'Jelajahi konten Qur\'ani autentik dengan terjemahan dan doa harian',
        surahs: { number: '114', label: 'Surah', description: 'Quran Lengkap' },
        ayahs: { number: '6.236', label: 'Ayat', description: 'Tersedia' },
        free: { number: '100%', label: 'Gratis', description: 'Selamanya' },
        access: { number: '24/7', label: 'Akses', description: 'Kapan Saja' }
      },

      // Fitur Tambahan
      moreFeatures: {
        title: 'Lebih dari Sekedar Pembaca',
        subtitle: 'Taslim menawarkan pengalaman pendamping Islam yang lengkap dengan fitur modern',
        mobile: { title: 'Optimal di Mobile', description: 'Pengalaman mulus di ponsel, tablet, dan desktop' },
        cloud: { title: 'Sinkronisasi Cloud', description: 'Akses favorit dan progres dari perangkat mana pun' },
        privacy: { title: 'Privasi Utama', description: 'Data Anda aman dan tidak pernah dibagikan' },
        fast: { title: 'Sangat Cepat', description: 'Performa optimal untuk loading instan' },
        language: { title: 'Multi-Bahasa', description: 'Terjemahan dan transliterasi dalam Bahasa Indonesia' },
        community: { title: 'Berbasis Komunitas', description: 'Dibuat dengan cinta untuk Umat Muslim di seluruh dunia' }
      },

      // Mengapa Memilih
      whyChoose: {
        title: 'Mengapa Memilih Taslim?',
        subtitle: 'Nikmati Al-Quran dengan cara yang modern dan mudah diakses',
        guestMode: { label: 'Mode Tamu:', text: 'Fungsionalitas penuh tanpa login menggunakan localStorage' },
        autoTracking: { label: 'Pelacakan Otomatis:', text: 'Otomatis menyimpan posisi bacaan terakhir Anda' },
        accountMerge: { label: 'Gabung Akun:', text: 'Migrasi satu klik dari tamu ke pengguna terdaftar' },
        multiLanguage: { label: 'Multi-bahasa:', text: 'Terjemahan Indonesia dengan transliterasi' },
        responsive: { label: 'Responsif:', text: 'Optimal untuk semua perangkat - mobile, tablet, dan desktop' },
        updated: { label: 'Selalu Terbaru:', text: 'Didukung oleh API publik EQuran.id' }
      },

      // Bagian Bismillah
      bismillah: {
        arabic: 'بِسۡمِ ٱللَّهِ ٱلرَّحۡمَٰنِ ٱلرَّحِيمِ',
        translation: 'Dengan menyebut nama Allah Yang Maha Pengasih lagi Maha Penyayang',
        description: 'Taslim berdedikasi untuk membuat Al-Quran dapat diakses oleh semua orang, di mana pun. Baik Anda di rumah, bepergian, atau dalam perjalanan, perjalanan spiritual Anda berlanjut dengan lancar.'
      },

      // CTA
      cta: {
        title: 'Mulai Perjalanan Anda Hari Ini',
        subtitle: 'Bergabunglah dengan ribuan Muslim di seluruh dunia yang mempercayai Taslim untuk membaca Al-Quran dan doa harian',
        createAccount: 'Buat Akun Gratis',
        browseQuran: 'Jelajahi Quran',
        note: 'Tidak perlu kartu kredit • 100% Gratis • Bekerja offline'
      }
    },

    // Halaman Quran
    quran: {
      title: 'Al-Quran',
      subtitle: 'Jelajahi 114 surah dengan teks Arab, transliterasi, dan terjemahan Indonesia',
      stats: {
        surahs: 'Surah',
        ayahs: 'Ayat',
        makkah: 'Mekah',
        madinah: 'Madinah'
      },
      ayahs: 'ayat',
      explore: 'Jelajahi',
      previous: 'Sebelumnya',
      next: 'Selanjutnya',
      backToAll: 'Kembali ke Semua Surah'
    },

    // Halaman Doa
    duas: {
      title: 'Doa Harian',
      subtitle: 'Kumpulan doa-doa Islam autentik dari Al-Quran dan Sunnah',
      searchPlaceholder: 'Cari doa berdasarkan nama, kategori, atau tag...',
      stats: {
        categories: 'Kategori',
        duas: 'Doa'
      },
      showMeaning: 'Tampilkan Arti',
      hideMeaning: 'Sembunyikan Arti',
      transliteration: 'Transliterasi',
      meaning: 'Arti',
      reference: 'Referensi',
      backToAll: 'Kembali ke Semua Kategori',
      searching: 'Mencari...',
      noResults: 'Tidak ada doa ditemukan'
    },

    // Halaman Auth
    auth: {
      signIn: {
        title: 'Masuk ke Taslim',
        subtitle: 'Akses favorit dan progres bacaan di semua perangkat',
        emailLabel: 'Alamat Email',
        emailPlaceholder: 'anda@contoh.com',
        signInWithEmail: 'Masuk dengan Email',
        orContinueWith: 'Atau lanjutkan dengan',
        signInWithGoogle: 'Masuk dengan Google',
        signInWithGitHub: 'Masuk dengan GitHub',
        checkEmail: 'Periksa email Anda',
        emailSent: 'Kami telah mengirim tautan masuk ke',
        note: 'Dengan masuk, Anda dapat menyinkronkan favorit dan progres bacaan di semua perangkat.',
        guestNote: 'Mode tamu tetap tersedia tanpa perlu masuk!'
      },
      register: {
        title: 'Buat Akun',
        subtitle: 'Bergabung dengan Taslim untuk menyinkronkan favorit dan progres bacaan',
        fullName: 'Nama Lengkap',
        fullNamePlaceholder: 'Masukkan nama lengkap Anda',
        gender: 'Jenis Kelamin',
        genderPlaceholder: 'Pilih jenis kelamin',
        male: 'Laki-laki',
        female: 'Perempuan',
        email: 'Alamat Email',
        emailPlaceholder: 'anda@contoh.com',
        password: 'Kata Sandi',
        passwordPlaceholder: 'Minimal 8 karakter',
        retypePassword: 'Ulangi Kata Sandi',
        retypePasswordPlaceholder: 'Konfirmasi kata sandi Anda',
        createAccount: 'Buat Akun',
        creatingAccount: 'Membuat Akun...',
        alreadyHaveAccount: 'Sudah punya akun?',
        signInLink: 'Masuk',
        success: 'Registrasi Berhasil!',
        successMessage: 'Akun Anda telah dibuat. Mengalihkan ke halaman masuk...',
        errors: {
          fullNameRequired: 'Nama lengkap harus diisi',
          fullNameMin: 'Nama lengkap minimal 3 karakter',
          genderRequired: 'Silakan pilih jenis kelamin',
          emailRequired: 'Email harus diisi',
          emailInvalid: 'Masukkan alamat email yang valid',
          passwordRequired: 'Kata sandi harus diisi',
          passwordMin: 'Kata sandi minimal 8 karakter',
          retypePasswordRequired: 'Silakan ulangi kata sandi Anda',
          passwordMismatch: 'Kata sandi tidak cocok'
        }
      },
      error: {
        title: 'Kesalahan Masuk',
        tryAgain: 'Coba Lagi',
        backToHome: 'Kembali ke Beranda',
        guestNote: 'Anda masih dapat menggunakan Taslim dalam mode tamu tanpa perlu masuk.'
      }
    },

    // Umum
    common: {
      explore: 'Jelajahi',
      loading: 'Memuat...',
      error: 'Kesalahan',
      required: '*',
      guestMode: 'Mode Tamu'
    },

    // Footer
    footer: {
      builtWith: 'Dibuat dengan ❤️ untuk Umat Muslim',
      copyright: '© 2025 Taslim',
      poweredBy: 'Didukung oleh EQuran.id',
      by: 'Oleh Teras'
    }
  }
} as const

export type Language = 'en' | 'id'
export type TranslationKey = typeof translations.en
