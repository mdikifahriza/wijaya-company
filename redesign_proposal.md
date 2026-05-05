# 🎨 Proposal Redesign Halaman Publik — DK Showroom

## Daftar Isi
1. [Diagnosis Masalah Saat Ini](#diagnosis)
2. [Filosofi Desain Baru](#filosofi)
3. [Sistem Warna & Tipografi](#sistem-warna)
4. [Redesign Per-Section](#redesign)
5. [Rencana Implementasi](#rencana)

---

## 1. Diagnosis Masalah Saat Ini {#diagnosis}

### 🔴 Masalah Kritis

| # | Masalah | File | Dampak |
|---|---------|------|--------|
| 1 | **Terlalu banyak warna hardcoded** | Semua file | `#69734f`, `#60684f`, `#7a8460`, `#8a9472`, `#87926d`, `#a9b38d`, `#50593b`, `#5f6948`, `#5c6645`, `#66714d`, `#707b55`, `#6e7951`, dll — ada **15+ varian hijau** yang tersebar tanpa sistem. Mata lelah membedakan, UI terasa "lumpur hijau" |
| 2 | **Rounded corners tidak konsisten** | `page.tsx`, semua section | `rounded-lg`, `rounded-2xl`, `rounded-[1.4rem]`, `rounded-[1.6rem]`, `rounded-[1.8rem]`, `rounded-[2rem]`, `rounded-[2.2rem]`, `rounded-[2.4rem]`, `rounded-[2.6rem]`, `rounded-[2.8rem]` — **10 varian border-radius** membuat UI chaotic |
| 3 | **Shadow terlalu banyak dan berat** | Semua section | `shadow-[0_16px_35px...]`, `shadow-[0_20px_45px...]`, `shadow-[0_24px_55px...]`, `shadow-[0_28px_70px...]`, `shadow-[0_30px_80px...]` — layar dipenuhi bayangan yang saling tumpuk, terasa berat bukan premium |
| 4 | **Konten marketing terlalu agresif** | `page.tsx` L453-535 | 2 section berturut-turut ("Harga Anda", "Exclusivity Frame") terasa pushy dan repetitif |
| 5 | **Font serif sebagai display font** | `globals.css` | `Iowan Old Style`, `Palatino Linotype` → font serif klasik yang kurang cocok untuk web agency modern |

### 🟡 Masalah Menengah

| # | Masalah | Detail |
|---|---------|--------|
| 6 | **Layout hero terlalu kompleks** | Grid 2 kolom tapi kolom kanan kosong (`<div hidden lg:block aria-hidden />`). Banyak translate-y manual yang fragile |
| 7 | **Floating animation pada stat cards** | Bouncing terus-menerus = distracting, bukan elegant |
| 8 | **`text-justify` pada body copy** | Membuat spasi antar kata tidak rata, mengurangi readability di layar kecil |
| 9 | **Blur blobs dekoratif berlebihan** | 2-3 blur blob per section × 8 section = ~20 blur blob. GPU-heavy, visual benefit minimal |
| 10 | **Mobile nav drawer sederhana** | Tidak ada animasi masuk per-item, active state sama dengan non-active |

### 🟢 Yang Sudah Bagus (Pertahankan)

- ✅ Struktur data dari CMS/Prisma sudah solid
- ✅ Server Component pattern (async page) sudah benar
- ✅ WhatsApp link normalization logic bagus
- ✅ ScrollSpy di header sudah work
- ✅ `resolveMediaUrl` abstraction bagus
- ✅ SEO metadata sudah comprehensive

---

## 2. Filosofi Desain Baru {#filosofi}

### Prinsip: **"Tenang, Tajam, Terpercaya"**

Referensi visual: Stripe, Linear, Vercel, Apple — website yang minimalis tapi tidak kosong. Setiap elemen punya tujuan.

| Lama | Baru |
|------|------|
| Banyak warna mirip = confusing | **5 token warna** saja, kontras jelas |
| Rounded corners sangat besar (2.8rem) = playful | **Rounded sedang** (0.75rem-1rem) = profesional |
| Shadow sangat dalam = berat | **Shadow halus** atau tanpa shadow = clean |
| Blur blobs di mana-mana | **Gradient subtle** hanya di hero |
| Serif display font = old-fashioned | **Inter/DM Sans** = modern, readable |
| Floating/bouncing animation | **Fade-in on scroll** = elegant |
| Content marketing agresif | **Kurangi jadi 1 persuasion section** |

---

## 3. Sistem Warna & Tipografi {#sistem-warna}

### Opsi A: "Forest Minimal" (Evolusi warna saat ini)
Tetap pakai hijau, tapi diperkecil menjadi 5 token saja:

```
--ink:        #2d3319    (teks utama — gelap tajam, bukan hijau pucat)
--ink-muted:  #5c6645    (teks sekunder)
--accent:     #4a6741    (CTA, link, aksen — lebih biru/segar dari #69734f)
--surface:    #f7f8f4    (background utama — hampir putih)
--border:     #e2e5da    (garis pembatas)
--white:      #ffffff    (card background)
```

### Opsi B: "Neutral Pro" (Pivot ke arah agency mainstream)
Tinggalkan hijau, pakai netral + satu aksen:

```
--ink:        #1a1a1a    (teks utama)
--ink-muted:  #6b7280    (teks sekunder — gray-500)
--accent:     #2563eb    (CTA biru — universally trusted)
--surface:    #fafafa    (background)
--border:     #e5e7eb    (garis pembatas — gray-200)
--white:      #ffffff    (card background)
```

### Opsi C: "Dark Prestige" (Premium feel)

```
--ink:        #f5f5f5    (teks utama — light on dark)
--ink-muted:  #a1a1aa    (teks sekunder)
--accent:     #22c55e    (aksen hijau segar)
--surface:    #09090b    (background — zinc-950)
--card:       #18181b    (card background — zinc-900)
--border:     #27272a    (garis — zinc-800)
```

> [!IMPORTANT]
> **Rekomendasi saya: Opsi A (Forest Minimal)**. Tetap konsisten dengan brand identity hijau yang sudah ada, tapi di-*refine* agar tidak "lumpur". Opsi C bisa dipertimbangkan jika ingin pivot drastis.

### Tipografi

```css
/* Ganti font stack */
--font-sans: 'Inter', 'DM Sans', system-ui, sans-serif;
--font-display: 'DM Serif Display', Georgia, serif;  /* Hanya untuk H1 hero */
```

Catatan: Gunakan Google Fonts CDN. Inter untuk semua body text — readability terbaik di web. DM Serif Display hanya untuk headline hero supaya ada kontras.

### Spacing & Radius System

```css
/* Hanya 3 radius */
--radius-sm: 0.5rem;    /* 8px — button, badge */
--radius-md: 0.75rem;   /* 12px — card, input */
--radius-lg: 1rem;      /* 16px — section container */

/* Section padding standar */
--section-py: clamp(4rem, 8vw, 7rem);  /* Responsive tanpa breakpoint */
```

---

## 4. Redesign Per-Section {#redesign}

### 4.1 Header / Navbar

**Sekarang:** Sticky header dengan scroll background change. ✅ Sudah oke.

**Perbaikan:**
- Kurangi gap antar nav link dari `gap-8` ke `gap-6`
- Active link: tambah `border-bottom` 2px accent, bukan hanya color change
- Mobile drawer: tambah stagger animation per-item (framer-motion)
- Hapus `windowWidth` state — cukup pakai CSS `md:hidden` / `md:flex`

### 4.2 Hero Section

**Sekarang:** Full-screen hero dengan background image, text kiri, kolom kanan kosong. TypeAnimation. Banyak translate-y hack.

**Redesign:**
```
┌─────────────────────────────────────────────────────┐
│  [bg image with overlay]                            │
│                                                     │
│        SITE NAME                                    │
│        ─────────                                    │
│        Tagline / Animated Text                      │
│                                                     │
│        [CTA Primary]  [CTA Secondary]               │
│                                                     │
│        [social icons]                               │
│                                                     │
└─────────────────────────────────────────────────────┘
```
- **Hapus grid 2-kolom** (kolom kanan kosong = mubazir)
- **Center aligned** — lebih bersih untuk hero
- Hapus semua translate-y hack
- Overlay: `bg-black/50` dengan `backdrop-blur-sm` — lebih modern dari solid overlay
- Font hero: `text-5xl md:text-7xl font-bold tracking-tight`

### 4.3 Projects Showcase

**Sekarang:** ✅ Layout sudah cukup bagus. Card dengan gradient overlay dan title di bawah.

**Perbaikan minor:**
- Tambah `hover:scale-[1.02]` pada card (bukan hanya gambar scale)
- Tambah subtle border saat hover
- Category heading: tambah garis horizontal di sampingnya

### 4.4 About Section

**Sekarang:** Grid foto + bio + 3 stat card yang floating/bouncing.

**Redesign:**
```
┌───────────────────────────────────────────────────────┐
│  ABOUT                                                │
│  ─────                                                │
│                                                       │
│  ┌──────────┐  Judul Bio                              │
│  │          │  ──────────                              │
│  │  PHOTO   │  Paragraf deskripsi yang readable,      │
│  │          │  line-height 1.8, max-width 65ch         │
│  │          │                                          │
│  └──────────┘  ┌──────┐ ┌──────┐ ┌──────┐             │
│                │ 5+   │ │ 850+ │ │ 30+  │             │
│                │ Thn  │ │ Proj │ │ Kli  │             │
│                └──────┘ └──────┘ └──────┘             │
└───────────────────────────────────────────────────────┘
```
- **Hapus floating animation** → ganti `fade-in-up` saat scroll (Intersection Observer atau framer-motion `whileInView`)
- Stat card: flat border, tanpa shadow berat
- `text-justify` → `text-left` untuk readability

### 4.5 Services Section

**Sekarang:** Dark green background. Banyak nested rounded cards. `motion.div whileHover={{ y: -4 }}` pada container (aneh — container seharusnya tidak bounce).

**Redesign:**
```
┌─────────────────────────────────────────────────────┐
│  LAYANAN                                  bg: white  │
│  ───────                                             │
│  Deskripsi singkat                                   │
│                                                      │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐              │
│  │  [img]   │ │  [img]   │ │  [img]   │              │
│  │          │ │          │ │          │              │
│  │  Title   │ │  Title   │ │  Title   │              │
│  │  Desc    │ │  Desc    │ │  Desc    │              │
│  │  [CTA]   │ │  [CTA]   │ │  [CTA]   │              │
│  └──────────┘ └──────────┘ └──────────┘              │
└─────────────────────────────────────────────────────┘
```
- **Hapus** "Cocok Untuk" dan "Nilai Yang Didapat" cards — pindahkan ke section persuasi
- Background: **putih/surface** bukan dark green (terlalu banyak dark section berturut-turut)
- Hapus `whileHover` pada container — hanya pada individual card
- Card: border ringan, hover shadow minimal

### 4.6 Package / Pricing Section

**Sekarang:** ✅ Struktur sudah solid. `<details>` untuk fitur = pintar.

**Perbaikan:**
- Ganti icon bulat besar `h-16 w-16` → lebih kecil atau hilangkan
- Featured card: tetap dark, tapi radius dikecilkan ke `rounded-xl`
- Seragamkan semua radius ke sistem (sm/md/lg)

### 4.7 Social Proof / Testimonials

**Sekarang:** IsotopePortfolio component dengan Framer Motion. Rating stars. Grid cards.

**Perbaikan:**
- Stats section (700+ Brand, Rating, Premium) → pindah ke atas, lebih compact
- Testimonial card: kurangi height dari `h-72 md:h-80` → auto height
- Hapus `overflow-y-auto` pada testimonial text (scrollbar di dalam card = bad UX)
- Tambah `<blockquote>` semantik

### 4.8 "Pressure" Section (Harga Anda Menentukan)

> [!WARNING]
> **Rekomendasi: HAPUS atau GABUNG.** Saat ini ada 2 section persuasi berturut-turut (Pressure + Exclusivity) yang redundan. Cukup satu section.

Jika dipertahankan:
- Gabung jadi 1 section compact: "Mengapa Website Premium?" dengan 2 kolom (Tanpa/Dengan)
- Hapus section "Exclusivity Frame" — konten bisa dijadikan paragraph kecil di section ini

### 4.9 Contact / CTA Section

**Sekarang:** Card besar di dalam card besar. Nested rounded corners.

**Redesign:**
```
┌─────────────────────────────────────────────────────┐
│  bg: accent dark                                     │
│                                                      │
│        Judul CTA                                     │
│        Deskripsi singkat                             │
│                                                      │
│  ┌──────────────────┐  ┌──────────────────┐          │
│  │ ✉ Email          │  │ 📱 WhatsApp      │          │
│  │ info@example.com │  │ +62 xxx          │          │
│  └──────────────────┘  └──────────────────┘          │
│                                                      │
│        [Konsultasi Sekarang →]                       │
│                                                      │
└─────────────────────────────────────────────────────┘
```
- **1 level nesting** saja, bukan card-in-card-in-card
- Hapus "Siap Jika Anda Ingin" list — redundan dengan atas
- Contact info: cukup 2 card horizontal, flat

### 4.10 Footer

**Sekarang:** ✅ Cukup clean. Pertahankan, hanya seragamkan warna.

---

## 5. Rencana Implementasi {#rencana}

### Fase 1: Foundation (CSS + Layout Global)
1. Refactor `globals.css` → definisikan 6 token warna + 3 radius + spacing system
2. Tambah Google Fonts (Inter + DM Serif Display) di `layout.tsx`
3. Hapus semua hardcoded color, ganti ke CSS variable

### Fase 2: Header + Hero + Footer
4. Simplify hero layout → center-aligned, hapus grid kosong
5. Perbaiki header active state
6. Seragamkan footer

### Fase 3: Content Sections
7. About section → hapus floating animation, fix typography
8. Services section → light background, simplified cards
9. Projects showcase → minor polish
10. Package/Pricing → radius & color system

### Fase 4: Persuasion & CTA
11. Gabung Pressure + Exclusivity → 1 section
12. Simplify Contact/CTA → flat layout
13. Testimonials → auto height, semantic markup

### Fase 5: Sub-pages
14. `/portfolio` list page → seragamkan
15. `/portfolio/[slug]` detail → seragamkan
16. `/services/[id]` detail → seragamkan

> [!TIP]
> Estimasi: Fase 1-2 bisa selesai dalam 1 sesi. Fase 3-5 butuh 1-2 sesi tambahan. Total ~3 sesi kerja.

---

## Keputusan Yang Perlu Dari Kamu

Sebelum saya mulai eksekusi, tolong pilih:

1. **Palet warna:** Opsi A (Forest Minimal), B (Neutral Pro), atau C (Dark Prestige)?
2. **Scope:** Full redesign (Fase 1-5) atau mulai dari fase tertentu dulu?
3. **Section Pressure + Exclusivity:** Hapus, gabung jadi 1, atau pertahankan keduanya?
4. **Konten hardcoded** (pressureRisks, pressureWins, exclusivityPoints, premiumMarkets, premiumBenefits): Pindah ke CMS/database atau tetap hardcoded?
