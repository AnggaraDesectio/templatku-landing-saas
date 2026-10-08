// Landing page KARSA, aplikasi manajemen kerja tim.
// Halaman ini TIDAK memakai AuthenticatedLayout, header/nav + footer inline, self-contained.
// Tidak menerima props.
import { useState, type FormEvent } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { StatCounter } from '@/components/stat-counter';
import {
    ArrowRight,
    BarChart3,
    Bell,
    Check,
    CheckCheck,
    ChevronDown,
    Clock,
    Kanban,
    Layers,
    Lock,
    Menu,
    PlayCircle,
    ShieldCheck,
    Users,
    X,
    Zap,
    type LucideIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Format rupiah gaya Indonesia: 99000 -> "Rp99.000"
const rupiah = (n: number) => `Rp${n.toLocaleString('id-ID')}`;

// ---------- Data ----------

interface Fitur {
    icon: LucideIcon;
    judul: string;
    deskripsi: string;
    lebar: string; // span bento
    foto?: string; // foto lokal opsional di atas kartu
}

const FITUR: Fitur[] = [
    {
        icon: Kanban,
        judul: 'Papan Kanban Fleksibel',
        deskripsi: 'Seret-atur tugas antar kolom, atur WIP limit, dan lihat alur kerja tim dalam satu layar. Mendukung tampilan papan, daftar, dan kalender.',
        lebar: 'lg:col-span-2',
        foto: '/images/landing-saas/fitur-kanban.jpg',
    },
    {
        icon: Zap,
        judul: 'Otomatisasi',
        deskripsi: 'Aturan no-code: tugaskan otomatis, kirim pengingat, dan pindahkan kartu saat status berubah.',
        lebar: '',
        foto: '/images/landing-saas/fitur-otomatisasi.jpg',
    },
    {
        icon: BarChart3,
        judul: 'Laporan Real-time',
        deskripsi: 'Burndown chart, beban kerja per anggota, dan ringkasan sprint yang selalu mutakhir.',
        lebar: '',
        foto: '/images/landing-saas/fitur-laporan.jpg',
    },
    {
        icon: Users,
        judul: 'Kolaborasi Tanpa Batas',
        deskripsi: 'Komentar berulir, sebutan anggota, dan riwayat aktivitas di setiap tugas.',
        lebar: 'lg:col-span-2',
        foto: '/images/landing-saas/fitur-kolaborasi.jpg',
    },
    {
        icon: Layers,
        judul: '60+ Integrasi',
        deskripsi: 'Terhubung dengan Slack, Google Workspace, GitHub, dan alat favorit tim kamu.',
        lebar: '',
    },
    {
        icon: Lock,
        judul: 'Keamanan Enterprise',
        deskripsi: 'SSO, audit log, dan enkripsi AES-256. Data disimpan di region Indonesia.',
        lebar: '',
    },
];

// Tabel perbandingan vs status quo, pola section pembeda (bukan kartu 3 kolom).
const PERBANDINGAN = [
    { aspek: 'Rapat status mingguan', statusQuo: '3–5 jam/minggu hilang di Zoom', karsa: 'Diganti ringkasan otomatis tiap Senin 08.00' },
    { aspek: 'Update progres', statusQuo: '"Lagi dikerjain" di chat yang tenggelam', karsa: 'Status terlihat di papan, real-time' },
    { aspek: 'Tugas yang lupa', statusQuo: 'Ketahuan saat deadline lewat', karsa: 'Pengingat otomatis H-3, H-1, dan saat lewat' },
    { aspek: 'Laporan ke atasan', statusQuo: 'Disusun manual tiap Jumat sore', karsa: 'Burndown & beban kerja selalu mutakhir' },
];

interface Paket {
    nama: string;
    deskripsi: string;
    bulanan: number; // harga per bulan bila bayar bulanan (ribuan rupiah)
    unggulan?: boolean;
    fitur: string[];
}

// Matematika konsisten: harga tahunan = 80% dari harga bulanan (diskon 20%)
const PAKET: Paket[] = [
    {
        nama: 'Gratis',
        deskripsi: 'Untuk coba-coba dan proyek pribadi.',
        bulanan: 0,
        fitur: ['3 papan proyek', 'Hingga 5 anggota', 'Tugas tanpa batas', 'Aplikasi mobile & desktop'],
    },
    {
        nama: 'Pro',
        deskripsi: 'Untuk profesional dan tim kecil yang serius.',
        bulanan: 99,
        unggulan: true,
        fitur: ['Papan tanpa batas', 'Otomatisasi 1.000 aksi/bln', 'Laporan & analitik', 'Integrasi prioritas', 'Riwayat 1 tahun'],
    },
    {
        nama: 'Tim',
        deskripsi: 'Untuk organisasi dengan banyak tim.',
        bulanan: 249,
        fitur: ['Semua fitur Pro', 'SSO & audit log', 'Manajer akun khusus', 'SLA 99,9%', 'Onboarding terjadwal'],
    },
];

const FAQ = [
    {
        t: 'Apakah paket Gratis benar-benar gratis selamanya?',
        j: 'Ya. Paket Gratis tidak meminta kartu kredit dan tidak ada batas waktu. Kamu bisa upgrade kapan saja saat tim bertumbuh.',
    },
    {
        t: 'Bagaimana cara kerja diskon tahunan?',
        j: 'Dengan penagihan tahunan kamu membayar 12 bulan sekaligus dengan potongan 20%. Misalnya paket Pro Rp99.000/bulan menjadi Rp79.200/bulan, kami bulatkan menjadi Rp79.000/bulan.',
    },
    {
        t: 'Bisakah saya memindahkan data dari Trello atau Asana?',
        j: 'Bisa. Importir satu-klik kami memindahkan papan, tugas, lampiran, dan komentar dari Trello, Asana, Jira, dan Monday dalam hitungan menit.',
    },
    {
        t: 'Di mana data saya disimpan?',
        j: 'Semua data pelanggan Indonesia disimpan di pusat data region Indonesia dengan enkripsi AES-256 saat istirahat dan TLS 1.3 saat transit.',
    },
    {
        t: 'Apakah ada kontrak atau biaya pembatalan?',
        j: 'Tidak ada kontrak. Batalkan kapan saja dari halaman pengaturan; akses premium tetap aktif sampai akhir periode penagihan.',
    },
];

// ---------- Halaman ----------

export default function Saas() {
    const [menuBuka, setMenuBuka] = useState(false);
    const [tahunan, setTahunan] = useState(true);
    const [faqBuka, setFaqBuka] = useState<number | null>(0);
    const [email, setEmail] = useState('');
    const [daftarOk, setDaftarOk] = useState(false);

    // Harga tampil: ribuan rupiah, tahunan = 80% lalu dibulatkan ke ribuan terdekat
    const hargaTampil = (p: Paket) => {
        if (p.bulanan === 0) return 'Rp0';
        const perBulan = tahunan ? Math.round((p.bulanan * 0.8) / 1) : p.bulanan;
        return `${rupiah(perBulan * 1000)}`;
    };

    const kirimDaftar = (e: FormEvent) => {
        e.preventDefault();
        if (email.trim().length > 3 && email.includes('@')) setDaftarOk(true);
    };

    const scrollKe = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

    return (
        <div className="min-h-screen bg-white font-sans text-slate-900 antialiased">
            {/* Navbar */}
            <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-white/90 backdrop-blur">
                <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
                    <a href="#atas" className="flex items-center gap-2">
                        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white">
                            <Kanban className="h-4 w-4" />
                        </span>
                        <span className="text-xl font-bold tracking-tight">Karsa</span>
                    </a>
                    <nav className="hidden items-center gap-8 text-sm font-medium text-slate-600 md:flex">
                        <a href="#fitur" className="transition hover:text-slate-950">Fitur</a>
                        <a href="#banding" className="transition hover:text-slate-950">Perbandingan</a>
                        <a href="#harga" className="transition hover:text-slate-950">Harga</a>
                        <a href="#faq" className="transition hover:text-slate-950">FAQ</a>
                    </nav>
                    <div className="flex items-center gap-2">
                        <Button className="bg-indigo-600 hover:bg-indigo-700" onClick={() => scrollKe('mulai')}>
                            Coba Gratis
                        </Button>
                        <Button variant="ghost" size="icon" className="md:hidden" aria-label="Menu" onClick={() => setMenuBuka((v) => !v)}>
                            {menuBuka ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                        </Button>
                    </div>
                </div>
                {menuBuka && (
                    <nav className="border-t border-slate-200 bg-white px-4 py-3 md:hidden">
                        {[
                            { href: '#fitur', label: 'Fitur' },
                            { href: '#banding', label: 'Perbandingan' },
                            { href: '#harga', label: 'Harga' },
                            { href: '#faq', label: 'FAQ' },
                        ].map((item) => (
                            <a key={item.href} href={item.href} onClick={() => setMenuBuka(false)} className="block py-2 text-sm font-medium text-slate-700">
                                {item.label}
                            </a>
                        ))}
                    </nav>
                )}
            </header>

            {/* Hero asimetris, 1 proposisi konkret + 1 CTA primer + 1 sekunder tenang */}
            <section id="atas" className="relative overflow-hidden bg-gradient-to-b from-indigo-50/80 via-white to-white">
                <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 pb-16 pt-14 sm:px-6 lg:grid-cols-2 lg:pt-20">
                    <div>
                        <h1 className="font-display text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
                            Ganti 4 tools dan 3 rapat mingguan dengan <span className="text-indigo-600">1 papan kerja.</span>
                        </h1>
                        <p className="mt-5 max-w-lg text-lg text-slate-600">
                            Karsa menggabungkan kanban, otomatisasi, dan laporan real-time. Semua orang tahu
                            apa yang dikerjakan, oleh siapa, dan kapan selesai, tanpa ditanya.
                        </p>
                        <div className="mt-8 flex flex-wrap items-center gap-4">
                            <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700" onClick={() => scrollKe('harga')}>
                                Mulai Gratis <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                            <button
                                onClick={() => scrollKe('fitur')}
                                className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-600 hover:text-indigo-700"
                            >
                                <PlayCircle className="h-4 w-4" /> Lihat demo 2 menit
                            </button>
                        </div>
                        <p className="mt-4 text-xs text-slate-500">Gratis 14 hari paket Pro · Tanpa kartu kredit · Setup 5 menit</p>
                        <div className="mt-8 flex items-center gap-8">
                            <div>
                                <p className="tnum text-2xl font-extrabold text-slate-900"><StatCounter value={12400} suffix="+" /></p>
                                <p className="text-xs text-slate-500">tim aktif di Indonesia</p>
                            </div>
                            <div>
                                <p className="tnum text-2xl font-extrabold text-slate-900"><StatCounter value={98} suffix="%" /></p>
                                <p className="text-xs text-slate-500">retensi tahunan</p>
                            </div>
                            <div>
                                <p className="tnum text-2xl font-extrabold text-slate-900">4.9<span className="text-base text-slate-400">/5</span></p>
                                <p className="text-xs text-slate-500">rating kepuasan</p>
                            </div>
                        </div>
                    </div>
                    {/* Foto beranotasi */}
                    <div className="relative">
                        <div className="overflow-hidden rounded-2xl border border-slate-200 shadow-2xl">
                            <img
                                src="/images/landing-saas/hero.jpg"
                                alt="Tim bekerja bersama menggunakan Karsa di laptop"
                                className="h-auto w-full object-cover"
                                loading="eager"
                            />
                        </div>
                        <div className="absolute -left-3 top-8 rounded-xl bg-white px-4 py-3 shadow-lg sm:-left-6">
                            <p className="text-xs text-slate-500">Rapat status minggu ini</p>
                            <p className="text-sm font-bold text-emerald-600">0, diganti ringkasan otomatis</p>
                        </div>
                        <div className="absolute -right-3 bottom-8 rounded-xl bg-white px-4 py-3 shadow-lg sm:-right-6">
                            <p className="text-xs text-slate-500">Tugas selesai hari ini</p>
                            <p className="text-sm font-bold text-slate-900"><StatCounter value={320} suffix=" rb" /> di semua tim</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Perbandingan vs status quo, tabel, bukan kartu */}
            <section id="banding" className="scroll-mt-16 border-y border-slate-100 bg-slate-50/70">
                <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:py-20">
                    <div className="max-w-2xl">
                        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-indigo-600">Kenapa pindah</p>
                        <h2 className="mt-2 font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
                            Cara lama vs cara Karsa
                        </h2>
                    </div>
                    <div className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white">
                        <div className="grid grid-cols-[1fr_1.2fr_1.2fr] gap-px bg-slate-200 text-sm">
                            <div className="bg-slate-50 p-4 font-semibold text-slate-500"></div>
                            <div className="bg-slate-50 p-4 font-bold text-slate-500">Cara lama</div>
                            <div className="bg-indigo-600 p-4 font-bold text-white">Dengan Karsa</div>
                            {PERBANDINGAN.map((r) => (
                                <>
                                    <div key={`${r.aspek}-a`} className="bg-white p-4 font-semibold text-slate-900">{r.aspek}</div>
                                    <div key={`${r.aspek}-b`} className="bg-white p-4 text-slate-500">{r.statusQuo}</div>
                                    <div key={`${r.aspek}-c`} className="bg-indigo-50/60 p-4 font-medium text-slate-900">{r.karsa}</div>
                                </>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Bento fitur */}
            <section id="fitur" className="mx-auto max-w-7xl scroll-mt-16 px-4 py-16 sm:px-6 lg:py-24">
                <div className="max-w-2xl">
                    <p className="text-xs font-semibold uppercase tracking-[0.25em] text-indigo-600">Fitur</p>
                    <h2 className="mt-2 font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
                        Semua yang tim butuhkan, tanpa plugin tambahan
                    </h2>
                </div>
                <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {FITUR.map((f) => (
                        <Card key={f.judul} className={cn('overflow-hidden border-slate-200 transition hover:-translate-y-1 hover:shadow-lg', f.lebar)}>
                            {f.foto && (
                                <img src={f.foto} alt={f.judul} className="h-44 w-full object-cover" loading="lazy" />
                            )}
                            <CardContent className="p-6">
                                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-100 text-indigo-700">
                                    <f.icon className="h-5 w-5" />
                                </span>
                                <h3 className="mt-4 text-lg font-bold">{f.judul}</h3>
                                <p className="mt-2 text-sm leading-relaxed text-slate-600">{f.deskripsi}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </section>

            {/* Harga */}
            <section id="harga" className="mx-auto max-w-7xl scroll-mt-16 px-4 py-16 sm:px-6 lg:py-24">
                <div className="text-center">
                    <p className="text-xs font-semibold uppercase tracking-[0.25em] text-indigo-600">Harga</p>
                    <h2 className="mt-2 font-display text-3xl font-extrabold tracking-tight sm:text-4xl">Harga jujur, tanpa kejutan</h2>
                    <div className="mt-6 flex items-center justify-center gap-3 text-sm font-medium">
                        <span className={cn(!tahunan && 'font-bold text-slate-900', 'text-slate-500')}>Bulanan</span>
                        <Switch checked={tahunan} onCheckedChange={setTahunan} aria-label="Penagihan tahunan" />
                        <span className={cn(tahunan && 'font-bold text-slate-900', 'text-slate-500')}>
                            Tahunan <Badge className="ml-1 bg-emerald-100 text-emerald-700 hover:bg-emerald-100">Hemat 20%</Badge>
                        </span>
                    </div>
                </div>
                <div className="mt-10 grid gap-6 lg:grid-cols-3">
                    {PAKET.map((p) => (
                        <Card
                            key={p.nama}
                            className={cn(
                                'relative flex flex-col border-slate-200',
                                p.unggulan && 'border-2 border-indigo-600 shadow-xl lg:-my-4',
                            )}
                        >
                            {p.unggulan && (
                                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-indigo-600 hover:bg-indigo-600">
                                    Paling Populer, pilihan 7 dari 10 tim
                                </Badge>
                            )}
                            <CardContent className="flex flex-1 flex-col p-8">
                                <h3 className="text-lg font-bold">{p.nama}</h3>
                                <p className="mt-1 text-sm text-slate-500">{p.deskripsi}</p>
                                <div className="mt-6 flex items-baseline gap-2">
                                    <span className="tnum text-4xl font-extrabold tracking-tight">{hargaTampil(p)}</span>
                                    <span className="text-sm text-slate-500">/pengguna/bln</span>
                                </div>
                                {p.bulanan > 0 && (
                                    <p className="mt-1 text-xs text-slate-500">
                                        {tahunan ? (
                                            <>
                                                <span className="line-through">{rupiah(p.bulanan * 1000)}</span> ditagih tahunan
                                            </>
                                        ) : (
                                            'Ditagih setiap bulan, batalkan kapan saja'
                                        )}
                                    </p>
                                )}
                                <ul className="mt-6 flex-1 space-y-3 text-sm">
                                    {p.fitur.map((f) => (
                                        <li key={f} className="flex items-start gap-2">
                                            <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                                            <span className="text-slate-700">{f}</span>
                                        </li>
                                    ))}
                                </ul>
                                <Button
                                    className={cn('mt-8 w-full', p.unggulan ? 'bg-indigo-600 hover:bg-indigo-700' : '')}
                                    variant={p.unggulan ? 'default' : 'outline'}
                                    onClick={() => scrollKe('mulai')}
                                >
                                    {p.bulanan === 0 ? 'Mulai Gratis' : `Pilih ${p.nama}`}
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>
                <p className="mt-8 text-center text-xs text-slate-500">
                    Harga belum termasuk PPN 11%. Butuh penawaran khusus untuk 100+ pengguna?{' '}
                    <button onClick={() => scrollKe('mulai')} className="font-semibold text-indigo-600 hover:underline">Hubungi tim sales</button>.
                </p>
            </section>

            {/* FAQ */}
            <section id="faq" className="scroll-mt-16 border-t border-slate-100 bg-slate-50/60">
                <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
                    <h2 className="text-center font-display text-3xl font-extrabold tracking-tight">Pertanyaan Umum</h2>
                    <div className="mt-8 space-y-3">
                        {FAQ.map((f, i) => {
                            const buka = faqBuka === i;
                            return (
                                <div key={f.t} className="rounded-xl border border-slate-200 bg-white">
                                    <button
                                        onClick={() => setFaqBuka(buka ? null : i)}
                                        className="flex w-full items-center justify-between gap-4 p-5 text-left"
                                    >
                                        <span className="font-semibold text-slate-900">{f.t}</span>
                                        <ChevronDown className={cn('h-5 w-5 shrink-0 text-slate-400 transition-transform', buka && 'rotate-180')} />
                                    </button>
                                    {buka && <p className="px-5 pb-5 text-sm leading-relaxed text-slate-600">{f.j}</p>}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* CTA + bukti teratribusi di titik konversi */}
            <section id="mulai" className="mx-auto max-w-7xl scroll-mt-16 px-4 py-16 sm:px-6">
                <div className="relative overflow-hidden rounded-3xl bg-indigo-600 px-6 py-14 text-white sm:px-12">
                    <div
                        className="absolute inset-0 opacity-20"
                        style={{
                            backgroundImage: 'radial-gradient(circle at 20% 20%, white 0, transparent 40%), radial-gradient(circle at 80% 70%, white 0, transparent 35%)',
                        }}
                    />
                    <div className="relative grid items-center gap-10 lg:grid-cols-2">
                        <div>
                            <h2 className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
                                Siap merapikan kerja tim kamu?
                            </h2>
                            <p className="mt-3 max-w-xl text-indigo-100">
                                Masukkan email kerja, workspace pertamamu siap dalam 5 menit, gratis, tanpa kartu kredit.
                            </p>
                            <blockquote className="mt-6 border-l-4 border-indigo-300 pl-4">
                                <p className="text-sm italic text-indigo-50">
                                    "Rapat status kami turun dari 5 kali jadi 1 kali seminggu. Sisanya? Semua orang
                                    tinggal buka papan."
                                </p>
                                <footer className="mt-2 text-xs text-indigo-200">
                                    <span className="font-semibold text-white">Rani Kusuma</span>, Product Manager, Aruna Digital (tim 23 orang)
                                </footer>
                            </blockquote>
                        </div>
                        <div className="rounded-2xl bg-white p-6 text-slate-900 sm:p-8">
                            {daftarOk ? (
                                <div className="text-center">
                                    <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                                        <CheckCheck className="h-6 w-6" />
                                    </span>
                                    <p className="mt-3 text-lg font-bold">Undangan terkirim!</p>
                                    <p className="mt-1 text-sm text-slate-600">
                                        Cek {email}, tautan aktivasi workspace sudah menunggu. Berlaku 24 jam.
                                    </p>
                                </div>
                            ) : (
                                <form onSubmit={kirimDaftar} className="space-y-4">
                                    <div>
                                        <p className="text-lg font-bold">Buat workspace gratis</p>
                                        <p className="mt-1 text-sm text-slate-500">Paket Pro aktif 14 hari pertama, lalu turun ke Gratis otomatis.</p>
                                    </div>
                                    <Input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="nama@kantor.com"
                                        className="h-12"
                                    />
                                    <Button type="submit" size="lg" className="w-full bg-indigo-600 hover:bg-indigo-700">
                                        Buat Workspace Gratis <ArrowRight className="ml-2 h-4 w-4" />
                                    </Button>
                                    <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-slate-500">
                                        <span className="flex items-center gap-1.5"><CheckCheck className="h-3.5 w-3.5" /> Tanpa kartu kredit</span>
                                        <span className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" /> Setup 5 menit</span>
                                        <span className="flex items-center gap-1.5"><ShieldCheck className="h-3.5 w-3.5" /> Data di Indonesia</span>
                                        <span className="flex items-center gap-1.5"><Bell className="h-3.5 w-3.5" /> Batalkan kapan saja</span>
                                    </div>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-slate-200 bg-white">
                <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-4">
                    <div>
                        <span className="flex items-center gap-2">
                            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white">
                                <Kanban className="h-4 w-4" />
                            </span>
                            <span className="text-xl font-bold tracking-tight">Karsa</span>
                        </span>
                        <p className="mt-3 text-sm leading-relaxed text-slate-500">
                            Aplikasi manajemen kerja tim buatan Indonesia. PT Karsa Teknologi Nusantara, Jakarta.
                        </p>
                    </div>
                    {[
                        { h: 'Produk', l: ['Fitur', 'Harga', 'Integrasi'] },
                        { h: 'Sumber Daya', l: ['Blog', 'Panduan', 'Template papan'] },
                        { h: 'Perusahaan', l: ['Tentang', 'Karier', 'Kontak'] },
                    ].map((kol) => (
                        <div key={kol.h}>
                            <h4 className="text-sm font-semibold uppercase tracking-widest text-slate-900">{kol.h}</h4>
                            <ul className="mt-4 space-y-2 text-sm text-slate-500">
                                {kol.l.map((l) => (
                                    <li key={l}><span>{l}</span></li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
                <div className="border-t border-slate-200">
                    <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-5 text-xs text-slate-400 sm:flex-row sm:px-6">
                        <span>© 2026 PT Karsa Teknologi Nusantara.</span>
                        <span className="flex items-center gap-1.5"><Lock className="h-3.5 w-3.5" /> ISO 27001 · SOC 2 Type II</span>
                    </div>
                </div>
            </footer>
        </div>
    );
}
