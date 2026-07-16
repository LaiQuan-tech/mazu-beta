import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Phone, 
  Menu, 
  X, 
  ScrollText, 
  Flame, 
  HeartHandshake, 
  ChevronRight,
  CheckCircle2,
  AlertCircle,
  Settings,
  MessageCircle,
  BookOpen,
  Sparkles,
  Volume2,
  VolumeX,
  ZoomIn,
  ZoomOut,
  Heart
} from 'lucide-react';

const LineIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M24 10.304c0-5.232-5.383-9.488-12-9.488s-12 4.256-12 9.488c0 4.69 4.27 8.604 10.04 9.344.39.084.92.258 1.05.592.12.303.08.777.04 1.084l-.17 1.023c-.05.303-.24 1.187 1.04.647 1.27-.54 6.88-4.05 9.39-6.93 1.77-1.92 2.61-3.77 2.61-5.764zm-16.14 3.77h-1.63c-.23 0-.41-.18-.41-.41v-4.66c0-.23.18-.41.41-.41h1.63c.23 0 .41.18.41.41v4.66c0 .23-.18.41-.41.41zm3.83 0h-1.63c-.23 0-.41-.18-.41-.41v-4.66c0-.23.18-.41.41-.41h1.63c.23 0 .41.18.41.41v4.66c0 .23-.18.41-.41.41zm5.12-2.11c0 .23-.18.41-.41.41h-1.22v1.29c0 .23-.18.41-.41.41h-1.63c-.23 0-.41-.18-.41-.41v-4.66c0-.23.18-.41.41-.41h1.63c.23 0 .41.18.41.41v1.29h1.22c.23 0 .41.18.41.41v1.67zm4.27 2.11h-1.63c-.23 0-.41-.18-.41-.41v-4.66c0-.23.18-.41.41-.41h1.63c.23 0 .41.18.41.41v4.66c0 .23-.18.41-.41.41z"/>
  </svg>
);

import { BookingData, ConsultationType, DonationData, DonationType, Announcement } from './types';
import { submitBooking, submitDonation } from './services/firebase';
import AdminDashboard from './components/AdminDashboard';
import BulletinBoard from './components/BulletinBoard';
import { BeadCurtainMenu } from './components/BeadCurtainMenu';

const App: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [bookingStatus, setBookingStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [donationStatus, setDonationStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [showAdmin, setShowAdmin] = useState(false);
  
  // --- Header Hide/Show and Zoom/Scale on Scroll ---
  const [showHeader, setShowHeader] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Keep visible at very top of page
      if (currentScrollY <= 80) {
        setShowHeader(true);
        setLastScrollY(currentScrollY);
        return;
      }
      
      const diff = currentScrollY - lastScrollY;
      if (Math.abs(diff) > 8) {
        if (diff > 0) {
          setShowHeader(false); // scrolling down -> hide
        } else {
          setShowHeader(true);  // scrolling up -> show
        }
        setLastScrollY(currentScrollY);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  // --- Virtual Lighting (光明點燈) State ---
  const [litLamps, setLitLamps] = useState<{ id: number; name: string; type: string; date: string }[]>(() => {
    try {
      const saved = localStorage.getItem('hesheng_lit_lamps');
      return saved ? JSON.parse(saved) : [
        { id: 3, name: '林大華', type: '光明燈', date: '庚子年' },
        { id: 8, name: '陳曉玲', type: '財利燈', date: '辛丑年' },
        { id: 12, name: '張家豪', type: '太歲燈', date: '壬寅年' },
        { id: 18, name: '李智偉', type: '文昌燈', date: '癸卯年' },
      ];
    } catch {
      return [];
    }
  });

  const [lightingForm, setLightingForm] = useState({ name: '', type: '光明燈', birthDate: '' });
  const [selectedLampSlot, setSelectedLampSlot] = useState<number | null>(null);

  // --- Virtual Blessings (消災祈福) State ---
  const [blessings, setBlessings] = useState<{ id: string; name: string; type: string; message: string; date: string }[]>(() => {
    try {
      const saved = localStorage.getItem('hesheng_blessings');
      return saved ? JSON.parse(saved) : [
        { id: '1', name: '李大明', type: '闔家平安', message: '祈求全家身體健康，出入平安，順心如意。', date: '2026-07-15' },
        { id: '2', name: '張小芬', type: '事業順利', message: '祝願今年事業更上一層樓，財源廣進。', date: '2026-07-14' },
        { id: '3', name: '王俊傑', type: '金榜題名', message: '祈求考試順利，名列前茅，順利錄取。', date: '2026-07-12' },
      ];
    } catch {
      return [];
    }
  });
  const [blessingForm, setBlessingForm] = useState({ name: '', type: '闔家平安', message: '' });

  // --- Scripture Reader (聖母經文) State ---
  const [scriptureFontSize, setScriptureFontSize] = useState(20); // readable text
  const [scriptureIsScrolling, setScriptureIsScrolling] = useState(false);
  const [scriptureSound, setScriptureSound] = useState(false);

  // Sync state to localStorage
  useEffect(() => {
    localStorage.setItem('hesheng_lit_lamps', JSON.stringify(litLamps));
  }, [litLamps]);

  useEffect(() => {
    localStorage.setItem('hesheng_blessings', JSON.stringify(blessings));
  }, [blessings]);

  // Muyu Woodblock Audio Loop
  useEffect(() => {
    if (!scriptureSound) return;
    
    const playMuyu = () => {
      try {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        if (!AudioContextClass) return;
        const ctx = new AudioContextClass();
        const now = ctx.currentTime;
        
        const osc = ctx.createOscillator();
        const gainNode = ctx.createGain();
        
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(450, now);
        osc.frequency.exponentialRampToValueAtTime(220, now + 0.12);
        
        gainNode.gain.setValueAtTime(0.4, now);
        gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.15);
        
        osc.connect(gainNode);
        gainNode.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.2);
      } catch (e) {
        console.error(e);
      }
    };

    // Play once immediately
    playMuyu();

    const interval = setInterval(playMuyu, 1000);
    return () => clearInterval(interval);
  }, [scriptureSound]);

  // Scripture Auto-Scroll Loop
  useEffect(() => {
    if (!scriptureIsScrolling) return;

    let animationFrameId: number;
    const scrollContainer = document.getElementById('scripture-scroll-box');
    
    const scrollStep = () => {
      if (scrollContainer) {
        scrollContainer.scrollTop += 0.4; // slow reading scroll rate
        // loop back if reached bottom
        if (scrollContainer.scrollTop + scrollContainer.clientHeight >= scrollContainer.scrollHeight - 5) {
          scrollContainer.scrollTop = 0;
        }
      }
      animationFrameId = requestAnimationFrame(scrollStep);
    };

    animationFrameId = requestAnimationFrame(scrollStep);
    return () => cancelAnimationFrame(animationFrameId);
  }, [scriptureIsScrolling]);

  const [formData, setFormData] = useState<BookingData>({
    name: '',
    phone: '',
    birthDate: '',
    bookingDate: '',
    bookingTime: '',
    type: ConsultationType.CAREER,
    notes: ''
  });

  const [donationData, setDonationData] = useState<DonationData>({
    name: '',
    phone: '',
    amount: 0,
    type: DonationType.GENERAL,
    notes: ''
  });

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name === 'bookingDate' && value) {
      const date = new Date(value);
      const day = date.getDay(); // 0 is Sunday, 6 is Saturday
      if (day !== 6) {
        alert('抱歉，目前僅開放每週六預約諮詢。');
        return;
      }
    }

    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDonationChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setDonationData(prev => ({ 
      ...prev, 
      [name]: name === 'amount' ? Number(value) : value 
    }));
  };

  const handleDonationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (donationData.amount <= 0) {
      alert('請輸入有效的捐款金額。');
      return;
    }
    setDonationStatus('loading');
    try {
      await submitDonation(donationData);
      setDonationStatus('success');
      setDonationData({
        name: '',
        phone: '',
        amount: 0,
        type: DonationType.GENERAL,
        notes: ''
      });
    } catch (error) {
      setDonationStatus('error');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Final validation
    const date = new Date(formData.bookingDate);
    if (date.getDay() !== 6) {
      alert('請選擇週六的日期。');
      return;
    }

    if (formData.bookingTime !== 'evening') {
      alert('目前僅開放晚上時段預約。');
      return;
    }

    setBookingStatus('loading');
    
    try {
      await submitBooking(formData);
      setBookingStatus('success');
      // Reset form after success
      setFormData({
        name: '',
        phone: '',
        birthDate: '',
        bookingDate: '',
        bookingTime: '',
        type: ConsultationType.CAREER,
        notes: ''
      });
    } catch (error) {
      console.error(error);
      setBookingStatus('error');
    }
  };

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  if (showAdmin) {
    return <AdminDashboard onBack={() => setShowAdmin(false)} />;
  }

  return (
    <div className="min-h-screen flex flex-col text-temple-dark selection:bg-temple-red selection:text-white">
      {/* Navigation */}
      <motion.nav 
        animate={{ 
          y: showHeader ? 0 : -100, 
          scaleY: showHeader ? 1 : 0.85,
          opacity: showHeader ? 1 : 0
        }}
        transition={{ 
          duration: 0.35, 
          ease: [0.16, 1, 0.3, 1] 
        }}
        style={{ originY: 0 }}
        className="fixed w-full z-50 bg-temple-red text-temple-bg shadow-lg border-b-4 border-temple-gold"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20 relative">
            <div className="flex items-center space-x-3 cursor-pointer z-10" onClick={() => scrollToSection('home')}>
               <div className="bg-white p-0.5 rounded-full border-2 border-temple-gold/50 shadow-md">
                 <img src="/logo.png" alt="和聖壇 Logo" className="w-14 h-14 object-contain" referrerPolicy="no-referrer" />
               </div>
               <div className="hidden sm:block">
                 <h1 className="text-2xl font-bold tracking-widest font-serif">和聖壇</h1>
                 <p className="text-xs tracking-widest text-temple-gold opacity-90 uppercase">He Sheng Altar</p>
               </div>
            </div>
            
            {/* Bead Curtain Menu - Absolutely Centered */}
            <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 top-0 h-20 items-center justify-center pointer-events-auto">
              <BeadCurtainMenu activeSection={activeSection} onMenuItemClick={scrollToSection} />
            </div>

            {/* Right side controls */}
            <div className="flex items-center space-x-4 z-10">
              <a 
                href="https://line.me/ti/p/@heshengaltar" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hidden md:flex bg-[#06C755] text-white px-4 py-2 rounded-full text-sm font-bold items-center gap-2 hover:bg-[#05b34c] transition-colors shadow-lg self-center"
              >
                <LineIcon className="w-4 h-4" />
                LINE 諮詢
              </a>

              <div className="-mr-2 flex md:hidden">
                <button
                  onClick={toggleMenu}
                  className="inline-flex items-center justify-center p-2 rounded-md text-temple-gold hover:text-white focus:outline-none"
                >
                  {isMenuOpen ? <X className="h-8 w-8" /> : <Menu className="h-8 w-8" />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-temple-red border-t border-temple-gold/30">
            <div className="px-2 pt-4 pb-6 space-y-4">
              <BeadCurtainMenu activeSection={activeSection} onMenuItemClick={scrollToSection} />
              <div className="px-3 pt-4">
                 <a 
                  href="https://line.me/ti/p/@heshengaltar" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-full bg-[#06C755] text-white px-4 py-3 rounded-lg text-center font-bold flex items-center justify-center gap-2 shadow-lg"
                >
                  <LineIcon className="w-5 h-5" />
                  加入 LINE 官方帳號
                </a>
               </div>
            </div>
          </div>
        )}
      </motion.nav>

      {/* Hero Section */}
      <section id="home" className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image Placeholder */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1542045938-4e8c18731c39?q=80&w=2070&auto=format&fit=crop" 
            alt="Temple Background" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-temple-red/70 to-temple-dark/80 mix-blend-multiply" />
        </div>

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <div className="mb-6 inline-block">
             <span className="bg-temple-gold/20 text-temple-gold border border-temple-gold px-4 py-1 rounded-full text-sm tracking-widest backdrop-blur-sm">
               護國佑民 • 慈悲濟世
             </span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 font-serif drop-shadow-lg leading-tight">
            和聖壇 <br/>
            <span className="text-temple-gold">靈感護佑</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 mb-10 font-light tracking-wide max-w-2xl mx-auto">
            誠心祈求，自有感應。和聖壇提供線上預約服務，<br/>為信眾指點迷津，解惑安神。
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => scrollToSection('booking')}
              className="px-8 py-4 bg-temple-gold hover:bg-yellow-400 text-temple-red font-bold rounded-md shadow-[0_0_20px_rgba(212,175,55,0.4)] transition-all transform hover:scale-105 flex items-center justify-center gap-2 text-lg"
            >
              <Calendar className="w-5 h-5" />
              立即預約諮詢
            </button>
            <button 
              onClick={() => scrollToSection('services')}
              className="px-8 py-4 bg-transparent border-2 border-white text-white hover:bg-white/10 font-bold rounded-md transition-all flex items-center justify-center gap-2 text-lg"
            >
              <ScrollText className="w-5 h-5" />
              了解服務項目
            </button>
          </div>
        </div>
        
        {/* Decorative Divider */}
        <div className="absolute bottom-0 w-full h-16 bg-temple-bg" style={{clipPath: 'polygon(50% 100%, 100% 0, 100% 100%, 0 100%, 0 0)'}}></div>
      </section>

      {/* Bulletin Board Section */}
      <BulletinBoard />

      {/* About Section */}
      <section id="about" className="py-20 bg-temple-bg relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="relative">
               <div className="absolute -top-4 -left-4 w-full h-full border-4 border-temple-gold rounded-lg z-0"></div>
               <img 
                 src="https://images.unsplash.com/photo-1599557470872-4632a76f2f9f?q=80&w=1974&auto=format&fit=crop" 
                 alt="Altar Statue" 
                 className="relative z-10 rounded-lg shadow-2xl w-full h-[500px] object-cover"
                 referrerPolicy="no-referrer"
               />
            </div>
            <div>
              <h2 className="text-temple-red font-serif text-lg font-bold tracking-widest mb-2 flex items-center">
                <span className="w-8 h-1 bg-temple-red mr-3"></span>
                關於和聖壇
              </h2>
              <h3 className="text-4xl font-bold text-temple-dark mb-6 font-serif">
                百年香火，世代傳承
              </h3>
              <p className="text-gray-600 mb-6 leading-relaxed text-lg">
                和聖壇供奉神明，自建廟以來，香火鼎盛，神威顯赫。神明慈悲為懷，聞聲救苦，庇佑子民平安順遂。
              </p>
              <p className="text-gray-600 mb-8 leading-relaxed text-lg">
                本壇秉持正信正念，弘揚濟世精神。除了傳統祭祀儀式，更結合現代化服務，提供信眾心靈寄託與人生方向的指引。
              </p>
              
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-temple-gold">
                  <span className="text-4xl font-bold text-temple-red font-serif block mb-2">1892</span>
                  <span className="text-gray-500">建廟年份</span>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-temple-gold">
                  <span className="text-4xl font-bold text-temple-red font-serif block mb-2">10萬+</span>
                  <span className="text-gray-500">年度信眾</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Deities Section (奉祀神明) */}
      <section id="deities" className="py-20 bg-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-12 bg-temple-bg" style={{clipPath: 'polygon(0 0, 100% 0, 50% 100%)'}}></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
          <div className="text-center mb-16">
            <h2 className="text-temple-red font-serif text-lg font-bold tracking-widest mb-2 inline-block border-b-2 border-temple-gold pb-1">
              奉祀神明
            </h2>
            <h3 className="text-4xl font-bold text-temple-dark font-serif mt-3">
              神恩浩蕩，庇佑萬民
            </h3>
            <p className="text-gray-500 max-w-xl mx-auto mt-4">
              和聖壇供奉之列位正神，慈悲顯赫，神威震懾，信眾虔誠參拜，求福得福，求壽得壽。
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Deity 1: 天上聖母 */}
            <div className="bg-temple-bg rounded-2xl border-2 border-temple-gold/30 shadow-xl overflow-hidden hover:shadow-2xl hover:border-temple-gold transition-all duration-300">
              <div className="relative h-72">
                <img 
                  src="https://images.unsplash.com/photo-1542045938-4e8c18731c39?q=80&w=600" 
                  alt="天上聖母" 
                  className="w-full h-full object-cover brightness-95"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent flex flex-col justify-end p-6">
                  <span className="text-temple-gold text-sm font-semibold tracking-wider mb-1">主祀神明</span>
                  <h4 className="text-2xl font-bold text-white font-serif">天上聖母 (媽祖)</h4>
                </div>
              </div>
              <div className="p-6">
                <p className="text-gray-600 leading-relaxed mb-6">
                  天上聖母即媽祖，為華人社會最具代表性的慈悲女神。聖母林默娘自幼具神異之資，白日飛昇後，化身為千手千眼救苦救難之聖。庇佑海路平安、闔家安康、福運綿長。
                </p>
                <div className="border-t border-gray-200/60 pt-4 flex justify-between items-center text-sm">
                  <span className="text-temple-red font-serif font-bold">聖誕：農曆三月廿三日</span>
                  <span className="bg-temple-red/10 text-temple-red px-2.5 py-0.5 rounded text-xs font-semibold">慈悲救苦</span>
                </div>
              </div>
            </div>

            {/* Deity 2: 福德正神 */}
            <div className="bg-temple-bg rounded-2xl border-2 border-temple-gold/30 shadow-xl overflow-hidden hover:shadow-2xl hover:border-temple-gold transition-all duration-300">
              <div className="relative h-72">
                <img 
                  src="https://images.unsplash.com/photo-1621259182978-f09e51224884?q=80&w=600" 
                  alt="福德正神" 
                  className="w-full h-full object-cover brightness-95"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent flex flex-col justify-end p-6">
                  <span className="text-temple-gold text-sm font-semibold tracking-wider mb-1">同祀配神</span>
                  <h4 className="text-2xl font-bold text-white font-serif">福德正神 (土地公)</h4>
                </div>
              </div>
              <div className="p-6">
                <p className="text-gray-600 leading-relaxed mb-6">
                  福德正神俗稱土地公，為造福鄉里、庇佑民生的基層神祇。土地公公和藹可親，手持拐杖與金元寶，不僅保境安民、驅邪避凶，亦兼管地方財路，庇佑商家開張大吉、財源滾滾。
                </p>
                <div className="border-t border-gray-200/60 pt-4 flex justify-between items-center text-sm">
                  <span className="text-temple-red font-serif font-bold">聖誕：農曆二月初二日</span>
                  <span className="bg-amber-100 text-amber-800 px-2.5 py-0.5 rounded text-xs font-semibold">招財納福</span>
                </div>
              </div>
            </div>

            {/* Deity 3: 中壇元帥 */}
            <div className="bg-temple-bg rounded-2xl border-2 border-temple-gold/30 shadow-xl overflow-hidden hover:shadow-2xl hover:border-temple-gold transition-all duration-300">
              <div className="relative h-72">
                <img 
                  src="https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=600" 
                  alt="中壇元帥" 
                  className="w-full h-full object-cover brightness-95"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent flex flex-col justify-end p-6">
                  <span className="text-temple-gold text-sm font-semibold tracking-wider mb-1">同祀配神</span>
                  <h4 className="text-2xl font-bold text-white font-serif">中壇元帥 (太子爺)</h4>
                </div>
              </div>
              <div className="p-6">
                <p className="text-gray-600 leading-relaxed mb-6">
                  中壇元帥即三太子哪吒，神威遠播，威風八面。太子爺個性直爽、重情重義，專司斬妖除魔、護佑孩童平安長大。
                </p>
                <div className="border-t border-gray-200/60 pt-4 flex justify-between items-center text-sm">
                  <span className="text-temple-red font-serif font-bold">聖誕：農曆九月初九日</span>
                  <span className="bg-blue-100 text-blue-800 px-2.5 py-0.5 rounded text-xs font-semibold">護童除妖</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-temple-red font-serif text-lg font-bold tracking-widest mb-2 inline-block border-b-2 border-temple-gold pb-1">
            宮廟服務
          </h2>
          <h3 className="text-4xl font-bold text-temple-dark mb-16 font-serif">
            祈福保平安，點燈開智慧
          </h3>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Service 1 */}
            <div className="group bg-temple-bg p-8 rounded-xl shadow-lg transition-all hover:-translate-y-2 hover:shadow-2xl border border-gray-100">
              <div className="w-16 h-16 bg-temple-red rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:bg-temple-gold transition-colors">
                <Flame className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-2xl font-bold mb-4 font-serif text-temple-dark">光明燈 / 安太歲</h4>
              <p className="text-gray-600 mb-6">
                農曆新年期間，提供安太歲、點光明燈、文昌燈、財利燈服務，祈求流年順遂，元辰光彩。
              </p>
              <a href="#booking" className="text-temple-red font-bold hover:text-temple-gold inline-flex items-center">
                立即登記 <ChevronRight className="w-4 h-4 ml-1" />
              </a>
            </div>

            {/* Service 2 */}
            <div className="group bg-temple-bg p-8 rounded-xl shadow-lg transition-all hover:-translate-y-2 hover:shadow-2xl border border-gray-100">
               <div className="w-16 h-16 bg-temple-red rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:bg-temple-gold transition-colors">
                <ScrollText className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-2xl font-bold mb-4 font-serif text-temple-dark">收驚 / 祭改</h4>
              <p className="text-gray-600 mb-6">
                孩童受驚、成人運勢不順、車關血光等，皆可透過傳統科儀進行收驚祭改，化解厄運。
              </p>
               <a href="#booking" className="text-temple-red font-bold hover:text-temple-gold inline-flex items-center">
                預約時段 <ChevronRight className="w-4 h-4 ml-1" />
              </a>
            </div>

            {/* Service 3 */}
            <div className="group bg-temple-bg p-8 rounded-xl shadow-lg transition-all hover:-translate-y-2 hover:shadow-2xl border border-gray-100 relative overflow-hidden">
               <div className="absolute top-0 right-0 bg-temple-gold text-white text-xs px-2 py-1 font-bold rounded-bl-lg">
                 熱門服務
               </div>
               <div className="w-16 h-16 bg-temple-red rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:bg-temple-gold transition-colors">
                <HeartHandshake className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-2xl font-bold mb-4 font-serif text-temple-dark">問事諮詢</h4>
              <p className="text-gray-600 mb-6">
                事業、感情、家運遇有瓶頸，誠心向神明請示。本壇提供一對一專人解籤與諮詢服務。
              </p>
               <a href="#booking" className="text-temple-red font-bold hover:text-temple-gold inline-flex items-center">
                線上預約 <ChevronRight className="w-4 h-4 ml-1" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Lighting Section (光明點燈) */}
      <section id="lighting" className="py-20 bg-amber-50/30 relative border-y border-amber-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-temple-red font-serif text-lg font-bold tracking-widest mb-2 inline-block border-b-2 border-temple-gold pb-1">
              光明點燈
            </h2>
            <h3 className="text-4xl font-bold text-temple-dark font-serif mt-3">
              線上點燈・神光庇護
            </h3>
            <p className="text-gray-500 max-w-2xl mx-auto mt-4">
              點亮心靈之光，祈求神明庇佑元辰光彩、前途光明。請點選下方「萬壽神案」位置進行線上安奉登記。
            </p>
          </div>

          <div className="grid lg:grid-cols-12 gap-12 items-start">
            {/* Left: Altar Altar Visualization */}
            <div className="lg:col-span-7 bg-amber-950/95 rounded-2xl p-6 sm:p-8 shadow-2xl border-4 border-amber-600 relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(#D4AF37_1px,transparent_1px)] opacity-5" style={{backgroundSize: '20px 20px'}}></div>
              
              {/* Altar Header */}
              <div className="text-center border-b border-amber-500/30 pb-4 mb-6">
                <h4 className="text-xl font-bold text-yellow-300 font-serif tracking-widest flex items-center justify-center gap-2">
                  <Sparkles className="w-5 h-5 text-yellow-300 animate-pulse" />
                  和聖壇 萬壽光明神案
                  <Sparkles className="w-5 h-5 text-yellow-300 animate-pulse" />
                </h4>
                <p className="text-xs text-amber-200 mt-1">目前已安奉 {litLamps.length} 盞 / 剩餘 {24 - litLamps.length} 盞神位</p>
              </div>

              {/* Grid of Lamps */}
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-3 sm:gap-4 justify-center">
                {Array.from({ length: 24 }).map((_, idx) => {
                  const slotId = idx + 1;
                  const isLit = litLamps.find(l => l.id === slotId);
                  const isSelected = selectedLampSlot === slotId;

                  return (
                    <button
                      key={slotId}
                      onClick={() => setSelectedLampSlot(slotId)}
                      className={`relative aspect-square rounded-xl flex flex-col items-center justify-center p-1.5 transition-all duration-300 border-2 cursor-pointer ${
                        isLit 
                          ? 'bg-gradient-to-b from-yellow-400 via-amber-400 to-amber-600 border-yellow-200 shadow-[0_0_15px_rgba(250,204,21,0.5)] scale-100 hover:scale-105' 
                          : isSelected
                            ? 'bg-amber-800/80 border-yellow-400 animate-pulse ring-2 ring-yellow-400 scale-105'
                            : 'bg-amber-950/80 border-amber-800/50 hover:border-amber-500 hover:bg-amber-900/40'
                      }`}
                    >
                      {/* Interactive glowing ring */}
                      {isLit && (
                        <span className="absolute inset-0 rounded-xl bg-yellow-400/20 animate-ping pointer-events-none" />
                      )}

                      {/* Lamp Candle Icon */}
                      <Flame className={`w-6 h-6 transition-transform duration-300 ${
                        isLit ? 'text-red-600 drop-shadow-[0_0_4px_rgba(220,38,38,0.8)] scale-110' : 'text-amber-800/40'
                      }`} />

                      {/* Believer Name or Slot ID */}
                      <span className={`text-[10px] font-bold mt-1 tracking-tighter truncate max-w-full ${
                        isLit ? 'text-amber-950 font-serif' : 'text-amber-500/40'
                      }`}>
                        {isLit ? isLit.name : `${slotId}號`}
                      </span>

                      {/* Hover Info Tooltip */}
                      {isLit && (
                        <div className="absolute bottom-full mb-2 bg-gray-900 text-white text-[10px] px-2 py-1 rounded shadow-lg pointer-events-none opacity-0 hover:opacity-100 group-focus:opacity-100 transition-opacity z-10 whitespace-nowrap">
                          {isLit.type} | {isLit.date} 安奉
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Altar Incense Burner Decorative Footer */}
              <div className="mt-8 pt-6 border-t border-amber-500/30 flex justify-center items-center gap-4">
                <div className="w-12 h-0.5 bg-gradient-to-r from-transparent to-amber-500"></div>
                <div className="w-10 h-10 rounded-full bg-gradient-to-b from-amber-500 to-amber-800 flex items-center justify-center border border-yellow-400/50 shadow-inner relative">
                  {/* Miniature incense smoke trail */}
                  <div className="absolute -top-3 w-0.5 h-4 bg-amber-200/40 rounded blur-sm animate-pulse" />
                  <span className="text-[9px] font-serif font-extrabold text-yellow-300">香</span>
                </div>
                <div className="w-12 h-0.5 bg-gradient-to-l from-transparent to-amber-500"></div>
              </div>
            </div>

            {/* Right: Registration Form */}
            <div className="lg:col-span-5 bg-white rounded-2xl p-6 sm:p-8 shadow-xl border border-gray-100">
              <h4 className="text-2xl font-serif font-bold text-temple-dark mb-4 pb-2 border-b border-gray-100 flex items-center gap-2">
                <Flame className="w-6 h-6 text-temple-red animate-pulse" />
                安奉神燈登記
              </h4>

              {selectedLampSlot ? (
                (() => {
                  const existing = litLamps.find(l => l.id === selectedLampSlot);
                  if (existing) {
                    return (
                      <div className="bg-amber-50 p-6 rounded-xl border border-amber-200 text-center">
                        <Flame className="w-12 h-12 text-temple-red mx-auto mb-3 animate-bounce" />
                        <h5 className="font-bold text-lg text-temple-dark">{selectedLampSlot}號神位：安奉中</h5>
                        <p className="text-gray-600 mt-2 text-sm">
                          本席位已安奉由 <strong className="text-temple-red">{existing.name}</strong> 大德登記之【{existing.type}】，祈求神光普照，常保元辰光彩。
                        </p>
                        <button
                          onClick={() => setSelectedLampSlot(null)}
                          className="mt-6 w-full py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold rounded-lg transition-colors text-sm cursor-pointer"
                        >
                          選擇其他位置
                        </button>
                      </div>
                    );
                  }

                  return (
                    <div className="space-y-4">
                      <div className="bg-amber-50 px-4 py-2 rounded-lg border border-amber-200 flex justify-between items-center">
                        <span className="text-sm text-gray-600">已選定神位位置</span>
                        <span className="font-extrabold text-temple-red text-lg">{selectedLampSlot} 號尊位</span>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">信眾大名 *</label>
                        <input
                          type="text"
                          value={lightingForm.name}
                          onChange={(e) => setLightingForm(prev => ({ ...prev, name: e.target.value }))}
                          placeholder="請輸入欲點燈祈福者大名"
                          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-temple-red focus:border-temple-red outline-none text-sm"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">農曆生日 *</label>
                        <input
                          type="text"
                          value={lightingForm.birthDate}
                          onChange={(e) => setLightingForm(prev => ({ ...prev, birthDate: e.target.value }))}
                          placeholder="例如：農曆七十二年十月十一日"
                          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-temple-red focus:border-temple-red outline-none text-sm"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">安奉神燈類別 *</label>
                        <select
                          value={lightingForm.type}
                          onChange={(e) => setLightingForm(prev => ({ ...prev, type: e.target.value }))}
                          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-temple-red focus:border-temple-red outline-none text-sm"
                        >
                          <option value="光明燈">光明燈 — 元辰光彩、祈求平安 (NT$ 600)</option>
                          <option value="太歲燈">太歲燈 — 趨吉避凶、消災解厄 (NT$ 600)</option>
                          <option value="文昌燈">文昌燈 — 考運亨通、智慧大開 (NT$ 800)</option>
                          <option value="財利燈">財利燈 — 財源廣進、事業亨通 (NT$ 1000)</option>
                        </select>
                      </div>

                      <div className="pt-4 flex gap-3">
                        <button
                          onClick={() => setSelectedLampSlot(null)}
                          className="flex-1 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors text-xs font-semibold cursor-pointer"
                        >
                          取消選位
                        </button>
                        <button
                          onClick={() => {
                            if (!lightingForm.name.trim() || !lightingForm.birthDate.trim()) {
                              alert('請填寫信眾大名與農曆生日，以利書寫祈福牌位。');
                              return;
                            }
                            const newLamp = {
                              id: selectedLampSlot,
                              name: lightingForm.name,
                              type: lightingForm.type,
                              date: '丙午年'
                            };
                            setLitLamps(prev => [...prev, newLamp]);
                            setSelectedLampSlot(null);
                            setLightingForm({ name: '', type: '光明燈', birthDate: '' });
                            
                            try {
                              const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
                              if (AudioContextClass) {
                                const ctx = new AudioContextClass();
                                const now = ctx.currentTime;
                                [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => {
                                  const o = ctx.createOscillator();
                                  const g = ctx.createGain();
                                  o.frequency.setValueAtTime(f, now + i * 0.1);
                                  g.gain.setValueAtTime(0.2, now + i * 0.1);
                                  g.gain.exponentialRampToValueAtTime(0.0001, now + 1.2);
                                  o.connect(g);
                                  g.connect(ctx.destination);
                                  o.start(now + i * 0.1);
                                  o.stop(now + 1.5);
                                });
                              }
                            } catch {}
                            
                            alert(`安奉成功！恭喜您在【${selectedLampSlot}號神位】點亮【${newLamp.type}】，神恩庇佑。`);
                          }}
                          className="flex-[2] py-3 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-amber-950 font-extrabold rounded-lg shadow-md transition-all text-xs cursor-pointer"
                        >
                          安奉大吉・確認點燈
                        </button>
                      </div>
                    </div>
                  );
                })()
              ) : (
                <div className="text-center py-12 text-gray-400 border-2 border-dashed border-gray-200 rounded-xl">
                  <Flame className="w-16 h-16 mx-auto mb-4 text-amber-500/30 animate-pulse" />
                  <p className="font-semibold text-gray-600 text-sm">請先在左側神案</p>
                  <p className="text-xs mt-1">選定一個空的「神燈編號席位」</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Booking Section */}
      <section id="booking" className="py-20 bg-temple-red relative text-white">
        {/* Pattern Overlay */}
        <div className="absolute inset-0 opacity-10" style={{backgroundImage: 'radial-gradient(#D4AF37 1px, transparent 1px)', backgroundSize: '30px 30px'}}></div>
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-temple-gold font-serif text-lg font-bold tracking-widest mb-2">
              線上服務
            </h2>
            <h3 className="text-4xl font-bold mb-4 font-serif">
              預約諮詢表單
            </h3>
            <p className="text-red-100 max-w-2xl mx-auto">
              請填寫下方資料，我們將儘速為您安排諮詢時間。<br/>
              <span className="text-temple-gold font-bold">※ 目前僅開放每週六晚上 (19:00 - 21:00) 時段預約。</span>
            </p>
          </div>

          <div className="bg-white text-gray-800 rounded-2xl shadow-2xl overflow-hidden">
            <div className="p-8 md:p-12">
              {bookingStatus === 'success' ? (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="w-10 h-10 text-green-600" />
                  </div>
                  <h4 className="text-2xl font-bold text-gray-900 mb-2">預約成功！</h4>
                  <p className="text-gray-600 mb-8">
                    感謝您的預約。廟方人員將於收到資料後，<br/>透過電話與您確認最終諮詢時間。
                  </p>
                  <button 
                    onClick={() => setBookingStatus('idle')}
                    className="px-6 py-3 bg-temple-red text-white rounded-md hover:bg-red-800 transition-colors"
                  >
                    再預約一筆
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">信眾大名 *</label>
                      <input
                        type="text"
                        name="name"
                        id="name"
                        required
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-temple-gold focus:border-transparent transition-all outline-none"
                        placeholder="請輸入姓名"
                      />
                    </div>
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">聯絡電話 *</label>
                      <input
                        type="tel"
                        name="phone"
                        id="phone"
                        required
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-temple-gold focus:border-transparent transition-all outline-none"
                        placeholder="0912-345-678"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="birthDate" className="block text-sm font-medium text-gray-700 mb-1">出生年月日 (請填寫農曆) *</label>
                      <input
                        type="text"
                        name="birthDate"
                        id="birthDate"
                        required
                        value={formData.birthDate}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-temple-gold focus:border-transparent transition-all outline-none"
                        placeholder="例如：農曆75年8月15日 辰時"
                      />
                    </div>
                    <div>
                      <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">諮詢項目 *</label>
                      <select
                        name="type"
                        id="type"
                        required
                        value={formData.type}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-temple-gold focus:border-transparent transition-all outline-none bg-white"
                      >
                        {Object.values(ConsultationType).map((type) => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="bookingDate" className="block text-sm font-medium text-gray-700 mb-1">希望預約日期 (限週六) *</label>
                      <input
                        type="date"
                        name="bookingDate"
                        id="bookingDate"
                        required
                        value={formData.bookingDate}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-temple-gold focus:border-transparent transition-all outline-none"
                      />
                      <p className="text-xs text-gray-400 mt-1">請選擇週六日期</p>
                    </div>
                    <div>
                      <label htmlFor="bookingTime" className="block text-sm font-medium text-gray-700 mb-1">希望時段 (限晚上) *</label>
                      <select
                         name="bookingTime"
                         id="bookingTime"
                         required
                         value={formData.bookingTime}
                         onChange={handleInputChange}
                         className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-temple-gold focus:border-transparent transition-all outline-none bg-white"
                      >
                        <option value="">請選擇時段</option>
                        <option value="evening">晚上 (19:00 - 21:00)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">詳細說明 (選填)</label>
                    <textarea
                      name="notes"
                      id="notes"
                      rows={3}
                      value={formData.notes}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-temple-gold focus:border-transparent transition-all outline-none"
                      placeholder="請簡述您想請示的問題..."
                    ></textarea>
                  </div>

                  {bookingStatus === 'error' && (
                    <div className="bg-red-50 text-red-700 p-4 rounded-lg flex items-center gap-2">
                      <AlertCircle className="w-5 h-5" />
                      <span>預約提交失敗，請檢查網路或稍後再試。</span>
                    </div>
                  )}

                  <div className="pt-4">
                    <button
                      type="submit"
                      disabled={bookingStatus === 'loading'}
                      className={`w-full py-4 text-lg font-bold rounded-lg shadow-lg flex items-center justify-center gap-2 transition-all
                        ${bookingStatus === 'loading' 
                          ? 'bg-gray-400 cursor-not-allowed' 
                          : 'bg-temple-gold text-temple-red hover:bg-yellow-400 hover:shadow-xl transform hover:-translate-y-1'}`}
                    >
                      {bookingStatus === 'loading' ? (
                        <span>處理中...</span>
                      ) : (
                        <>
                          <Flame className="w-5 h-5 fill-current" />
                          確認送出預約
                        </>
                      )}
                    </button>
                    <p className="text-center text-gray-500 text-sm mt-4">
                      * 提交後即代表同意本宮隱私權政策
                    </p>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Blessing Section (消災祈福) */}
      <section id="blessing" className="py-20 bg-white relative overflow-hidden border-b border-amber-200/50">
        <div className="absolute top-0 left-0 w-full h-12 bg-gradient-to-b from-amber-50/20 to-transparent" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-temple-red font-serif text-lg font-bold tracking-widest mb-2 inline-block border-b-2 border-temple-gold pb-1">
              消災祈福
            </h2>
            <h3 className="text-4xl font-bold text-temple-dark font-serif mt-3">
              線上祈福牆・福澤庇佑
            </h3>
            <p className="text-gray-500 max-w-2xl mx-auto mt-4">
              寫下您的祈願，將福卡懸掛於和聖壇線上許願牆，祈求天上聖母與諸神明聽聞祈願，護佑心願達成、順心如意。
            </p>
          </div>

          <div className="grid lg:grid-cols-12 gap-12 items-start">
            {/* Left Column: Form to write Blessing */}
            <div className="lg:col-span-5 bg-temple-bg rounded-2xl p-6 sm:p-8 shadow-xl border-2 border-temple-gold/30">
              <h4 className="text-2xl font-serif font-bold text-temple-red mb-6 pb-2 border-b border-temple-gold/20 flex items-center gap-2">
                <Sparkles className="w-6 h-6 animate-pulse" />
                恭寫祈福福卡
              </h4>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">祈福者姓名 *</label>
                  <input
                    type="text"
                    value={blessingForm.name}
                    onChange={(e) => setBlessingForm(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="請輸入姓名 (如：王小明)"
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-temple-red focus:border-transparent outline-none bg-white text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">祈福項目 *</label>
                  <select
                    value={blessingForm.type}
                    onChange={(e) => setBlessingForm(prev => ({ ...prev, type: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-temple-red focus:border-transparent outline-none bg-white text-sm"
                  >
                    <option value="闔家平安">闔家平安 — 祈求全家大小順遂安康</option>
                    <option value="身體健康">身體健康 — 祈求病體康復、強健平安</option>
                    <option value="金榜題名">金榜題名 — 祈求考試開運、名列前茅</option>
                    <option value="事業順利">事業順利 — 祈求工作晉升、商運昌隆</option>
                    <option value="姻緣美滿">姻緣美滿 — 祈求紅線牽成、婚姻美滿</option>
                    <option value="元辰光彩">元辰光彩 — 祈求前途光明、趨吉避凶</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">祈願內文 (限50字) *</label>
                  <textarea
                    rows={4}
                    maxLength={50}
                    value={blessingForm.message}
                    onChange={(e) => setBlessingForm(prev => ({ ...prev, message: e.target.value }))}
                    placeholder="例如：弟子真心祈求聖母保佑家母身體安康、手術順利、闔家平安吉慶。"
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-temple-red focus:border-transparent outline-none bg-white text-sm"
                  />
                </div>

                <button
                  onClick={() => {
                    if (!blessingForm.name.trim() || !blessingForm.message.trim()) {
                      alert('請填寫姓名與祈願內文，向神明敬稟。');
                      return;
                    }
                    const newBlessing = {
                      id: Date.now().toString(),
                      name: blessingForm.name,
                      type: blessingForm.type,
                      message: blessingForm.message,
                      date: new Date().toISOString().split('T')[0]
                    };
                    setBlessings(prev => [newBlessing, ...prev]);
                    setBlessingForm({ name: '', type: '闔家平安', message: '' });
                    
                    try {
                      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
                      if (AudioContextClass) {
                        const ctx = new AudioContextClass();
                        const now = ctx.currentTime;
                        const freqs = [587.33, 659.25, 880.00];
                        freqs.forEach((f, i) => {
                          const o = ctx.createOscillator();
                          const g = ctx.createGain();
                          o.frequency.setValueAtTime(f, now + i * 0.12);
                          g.gain.setValueAtTime(0.25, now + i * 0.12);
                          g.gain.exponentialRampToValueAtTime(0.0001, now + 1.5);
                          o.connect(g);
                          g.connect(ctx.destination);
                          o.start(now + i * 0.12);
                          o.stop(now + 1.8);
                        });
                      }
                    } catch {}
                    
                    alert('福卡懸掛成功！願聖母慈悲普照，福祐大德。');
                  }}
                  className="w-full py-3.5 bg-temple-red hover:bg-red-800 text-white font-bold rounded-lg shadow-md hover:shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer text-sm"
                >
                  <Heart className="w-5 h-5 text-yellow-300 animate-pulse fill-current" />
                  虔心誠稟・掛上祈福牆
                </button>
              </div>
            </div>

            {/* Right Column: Virtual Prayer Lattice Wall */}
            <div className="lg:col-span-7 bg-[url('https://images.unsplash.com/photo-1448375240586-882707db888b?q=80&w=1200')] bg-cover bg-center rounded-2xl p-6 sm:p-8 min-h-[500px] shadow-2xl relative border-4 border-amber-800 flex flex-col">
              {/* Wooden grid semi-transparent overlay */}
              <div className="absolute inset-0 bg-stone-900/85 rounded-xl z-0 pointer-events-none" />
              {/* Simulated traditional wooden support beams */}
              <div className="absolute top-0 inset-x-0 h-4 bg-amber-800 border-b border-amber-900 rounded-t-xl z-10 pointer-events-none" />
              
              <div className="relative z-10 w-full flex flex-col h-full flex-grow">
                <div className="flex justify-between items-center border-b border-stone-700 pb-3 mb-6">
                  <h5 className="text-yellow-400 font-serif font-bold tracking-wider text-base">虔誠信眾祈願福位</h5>
                  <span className="text-stone-400 text-xs bg-stone-800 px-2.5 py-1 rounded-full border border-stone-700">共掛置 {blessings.length} 枚祈福牌</span>
                </div>

                {/* Grid of hanging plaques */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[420px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-stone-700" id="blessing-scroll-box">
                  {blessings.map((b) => (
                    <div
                      key={b.id}
                      className="bg-gradient-to-br from-amber-100 to-amber-200 border-2 border-amber-300 rounded-lg p-4 shadow-lg hover:shadow-amber-500/20 hover:-translate-y-1 transition-all duration-300 text-stone-900 relative flex flex-col justify-between overflow-hidden group min-h-[140px]"
                    >
                      {/* Hanging Red String */}
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-0.5 h-6 bg-red-600 shadow" />
                      {/* Red ribbon background decoration */}
                      <div className="absolute -top-1 -right-8 w-20 h-6 bg-red-600/10 rotate-45 pointer-events-none" />

                      <div className="border-b border-amber-300 pb-1.5 mb-2 flex justify-between items-center">
                        <span className="font-extrabold text-sm text-temple-red font-serif">{b.name} 信士</span>
                        <span className="bg-red-600 text-white text-[10px] px-2 py-0.5 rounded-full font-bold tracking-wide shadow-sm">
                          {b.type}
                        </span>
                      </div>

                      <p className="text-xs text-stone-700 leading-relaxed italic flex-grow py-1">
                        「{b.message}」
                      </p>

                      <div className="text-[10px] text-stone-500 text-right mt-2 font-mono">
                        庚午年 佛光普照
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Donation Section */}
      <section id="donation" className="py-20 bg-temple-bg relative">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-temple-red font-serif text-lg font-bold tracking-widest mb-2">
              功德無量
            </h2>
            <h3 className="text-4xl font-bold text-temple-dark mb-4 font-serif">
              隨喜捐獻 / 護持項目
            </h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              您的每一分心意，都是支持和聖壇持續弘揚神恩、服務大眾的力量。
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl border border-temple-gold/20 overflow-hidden">
            <div className="p-8 md:p-12">
              {donationStatus === 'success' ? (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="w-10 h-10 text-green-600" />
                  </div>
                  <h4 className="text-2xl font-bold text-gray-900 mb-2">感謝您的護持！</h4>
                  <p className="text-gray-600 mb-8">
                    功德無量。我們已收到您的捐款意向，<br/>廟方人員將會與您聯繫後續事宜。
                  </p>
                  <button 
                    onClick={() => setDonationStatus('idle')}
                    className="px-6 py-3 bg-temple-red text-white rounded-md hover:bg-red-800 transition-colors"
                  >
                    返回
                  </button>
                </div>
              ) : (
                <form onSubmit={handleDonationSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="don_name" className="block text-sm font-medium text-gray-700 mb-1">大德姓名 *</label>
                      <input
                        type="text"
                        name="name"
                        id="don_name"
                        required
                        value={donationData.name}
                        onChange={handleDonationChange}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-temple-gold focus:border-transparent transition-all outline-none"
                        placeholder="請輸入姓名"
                      />
                    </div>
                    <div>
                      <label htmlFor="don_phone" className="block text-sm font-medium text-gray-700 mb-1">聯絡電話 *</label>
                      <input
                        type="tel"
                        name="phone"
                        id="don_phone"
                        required
                        value={donationData.phone}
                        onChange={handleDonationChange}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-temple-gold focus:border-transparent transition-all outline-none"
                        placeholder="0912-345-678"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="don_amount" className="block text-sm font-medium text-gray-700 mb-1">捐款金額 (NTD) *</label>
                      <input
                        type="number"
                        name="amount"
                        id="don_amount"
                        required
                        min="1"
                        value={donationData.amount || ''}
                        onChange={handleDonationChange}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-temple-gold focus:border-transparent transition-all outline-none"
                        placeholder="請輸入金額"
                      />
                    </div>
                    <div>
                      <label htmlFor="don_type" className="block text-sm font-medium text-gray-700 mb-1">指定項目 *</label>
                      <select
                        name="type"
                        id="don_type"
                        required
                        value={donationData.type}
                        onChange={handleDonationChange}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-temple-gold focus:border-transparent transition-all outline-none bg-white"
                      >
                        {Object.values(DonationType).map((type) => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="don_notes" className="block text-sm font-medium text-gray-700 mb-1">備註說明 (選填)</label>
                    <textarea
                      name="notes"
                      id="don_notes"
                      rows={3}
                      value={donationData.notes}
                      onChange={handleDonationChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-temple-gold focus:border-transparent transition-all outline-none"
                      placeholder="如有特定祈福對象或說明請填寫..."
                    ></textarea>
                  </div>

                  {donationStatus === 'error' && (
                    <div className="bg-red-50 text-red-700 p-4 rounded-lg flex items-center gap-2">
                      <AlertCircle className="w-5 h-5" />
                      <span>提交失敗，請檢查網路或稍後再試。</span>
                    </div>
                  )}

                  <div className="pt-4">
                    <button
                      type="submit"
                      disabled={donationStatus === 'loading'}
                      className={`w-full py-4 text-lg font-bold rounded-lg shadow-lg flex items-center justify-center gap-2 transition-all
                        ${donationStatus === 'loading' 
                          ? 'bg-gray-400 cursor-not-allowed' 
                          : 'bg-temple-red text-white hover:bg-red-800 hover:shadow-xl transform hover:-translate-y-1'}`}
                    >
                      {donationStatus === 'loading' ? (
                        <span>處理中...</span>
                      ) : (
                        <>
                          <HeartHandshake className="w-5 h-5" />
                          確認捐獻護持
                        </>
                      )}
                    </button>
                  </div>
        </form>
      )}
            </div>
          </div>
        </div>
      </section>

      {/* Scripture Section (聖母經文) */}
      <section id="scripture" className="py-20 bg-temple-bg relative">
        <div className="absolute inset-0 opacity-5" style={{backgroundImage: 'radial-gradient(#D4AF37 1px, transparent 1px)', backgroundSize: '24px 24px'}}></div>
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-10">
            <h2 className="text-temple-red font-serif text-lg font-bold tracking-widest mb-2 inline-block border-b-2 border-temple-gold pb-1">
              聖母經文
            </h2>
            <h3 className="text-4xl font-bold text-temple-dark font-serif mt-3">
              天上聖母真經
            </h3>
            <p className="text-gray-500 max-w-xl mx-auto mt-4">
              虔誦真經，神光加被，洗滌心靈，增福延壽。本處提供線上經典導讀與木魚靜心伴奏。
            </p>
          </div>

          {/* Scripture Player Control Console */}
          <div className="bg-amber-950/90 rounded-t-2xl p-4 sm:p-6 border-t-4 border-x-4 border-temple-gold flex flex-wrap gap-4 items-center justify-between text-yellow-100 shadow-xl">
            <div className="flex items-center gap-3">
              <BookOpen className="w-6 h-6 text-yellow-400 animate-pulse" />
              <div>
                <h4 className="font-serif font-bold text-base tracking-wider text-yellow-300">經文誦讀靜心室</h4>
                <p className="text-[10px] text-amber-200">誦持真經，百難消除</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 items-center">
              {/* Auto Scroll Button */}
              <button
                onClick={() => setScriptureIsScrolling(!scriptureIsScrolling)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  scriptureIsScrolling 
                    ? 'bg-yellow-400 text-amber-950 shadow-[0_0_10px_rgba(250,204,21,0.4)]' 
                    : 'bg-amber-900 border border-amber-600 hover:bg-amber-800'
                }`}
              >
                <Sparkles className={`w-3.5 h-3.5 ${scriptureIsScrolling ? 'animate-spin' : ''}`} />
                {scriptureIsScrolling ? '停止滾動' : '自動朗讀'}
              </button>

              {/* Muyu Audio Loop Toggle */}
              <button
                onClick={() => setScriptureSound(!scriptureSound)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  scriptureSound 
                    ? 'bg-red-600 text-white shadow-[0_0_10px_rgba(220,38,38,0.4)]' 
                    : 'bg-amber-900 border border-amber-600 hover:bg-amber-800'
                }`}
              >
                {scriptureSound ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
                {scriptureSound ? '木魚：啟動' : '木魚：靜音'}
              </button>

              {/* Font Size Adjusters */}
              <div className="flex items-center gap-1.5 bg-amber-900 px-3 py-1 rounded-full border border-amber-600">
                <button
                  onClick={() => setScriptureFontSize(prev => Math.max(14, prev - 2))}
                  className="p-1 hover:text-yellow-400 transition-colors cursor-pointer"
                  title="縮小字體"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
                <span className="text-xs font-mono font-bold select-none px-1.5 border-x border-amber-700">{scriptureFontSize}px</span>
                <button
                  onClick={() => setScriptureFontSize(prev => Math.min(28, prev + 2))}
                  className="p-1 hover:text-yellow-400 transition-colors cursor-pointer"
                  title="放大字體"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Scripture Scroll Canvas */}
          <div className="bg-[#FCF9F2] rounded-b-2xl border-b-4 border-x-4 border-temple-gold shadow-2xl overflow-hidden relative">
            {/* Traditional red line frame decoration */}
            <div className="absolute top-4 left-4 right-4 bottom-4 border border-red-800/20 pointer-events-none z-0" />
            
            {/* Wooden Scroll Bars (visual effect) */}
            <div className="absolute top-0 bottom-0 left-0 w-1 bg-gradient-to-r from-amber-900 to-amber-700 shadow" />
            <div className="absolute top-0 bottom-0 right-0 w-1 bg-gradient-to-l from-amber-900 to-amber-700 shadow" />

            <div 
              id="scripture-scroll-box"
              className="py-12 px-8 sm:px-16 max-h-[480px] overflow-y-auto scroll-smooth font-serif relative z-10 select-text cursor-default"
              style={{ fontSize: `${scriptureFontSize}px` }}
            >
              {/* Traditional Vertical Scroll Simulation with double layout */}
              <div className="max-w-xl mx-auto space-y-8 text-stone-900 leading-relaxed text-center tracking-widest">
                
                {/* Woodblock Header */}
                <div className="border-b-2 border-red-800/40 pb-6 mb-8 text-center">
                  <span className="text-stone-400 text-xs tracking-normal block mb-1 font-mono">丙午年重鐫 敬奉本經</span>
                  <h5 className="text-2xl font-bold text-red-800 font-serif">天上聖母大慈真經</h5>
                </div>

                <div className="space-y-6">
                  <div className="text-red-800 font-bold font-serif mb-2 text-base tracking-widest">【 開 經 偈 】</div>
                  <p>天上有神皆得道，人間無處不顯靈。</p>
                  <p>聖德昭彰光萬國，母恩浩蕩育群生。</p>
                  <p>皈依開導群迷路，敬誦寶經保太平。</p>
                </div>

                <div className="space-y-6">
                  <div className="text-red-800 font-bold font-serif mb-2 text-base tracking-widest">【 聖 母 寶 誥 】</div>
                  <p className="text-xs text-stone-500 tracking-normal block -mb-2">志心皈命禮</p>
                  <p>吉林化聖，湄洲顯靈。</p>
                  <p>保赤子之安全，消災降福。</p>
                  <p>拯生民之困苦，除厄消殃。</p>
                  <p>大悲大願，大聖大慈。</p>
                  <p>天上聖母，無極元君。</p>
                </div>

                <div className="space-y-6">
                  <div className="text-red-800 font-bold font-serif mb-2 text-base tracking-widest">【 聖 母 大 慈 真 經 正 文 】</div>
                  <p>聖母曰：吾本天上女。降生湄洲島。</p>
                  <p>幼而具神異。長而證真道。</p>
                  <p>飛昇騰雲霧。救劫渡同胞。</p>
                  <p>凡人在世間。多災又多難。</p>
                  <p>若有虔誠者。誦此聖母經。</p>
                  <p>一切諸災難。化為塵與泥。</p>
                  <p>病者得痊癒。謀望盡亨通。</p>
                  <p>出入保平安。家宅永吉昌。</p>
                  <p>遇風波不驚。逢險路亨通。</p>
                  <p>水火不能侵。邪魔不敢近。</p>
                  <p>此經德非凡。常持壽延年。</p>
                  <p>至心歸命禮。南無天上聖母菩薩摩訶薩。</p>
                </div>

                <div className="space-y-6 border-t border-stone-200 pt-8">
                  <div className="text-red-800 font-bold font-serif mb-2 text-base tracking-widest">【 完 經 讚 】</div>
                  <p>湄洲聖跡，萬代傳揚。</p>
                  <p>香煙裊裊，福壽綿長。</p>
                  <p>大聖大慈，天上聖母大慈尊。</p>
                </div>

                {/* Footer seal marker */}
                <div className="pt-8 flex justify-center">
                  <div className="border-2 border-red-600 text-red-600 px-3 py-1 font-bold font-serif text-sm rotate-12 select-none tracking-widest">
                    和聖壇印
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-temple-dark text-white border-t border-white/10 pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-12 mb-12">
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <div className="bg-white p-0.5 rounded-full border border-temple-gold/30">
                  <img src="/logo.png" alt="和聖壇 Logo" className="w-10 h-10 object-contain" referrerPolicy="no-referrer" />
                </div>
                <span className="text-xl font-bold font-serif tracking-widest">和聖壇</span>
              </div>
              <p className="text-gray-400 leading-relaxed mb-6">
                神明慈悲為懷，庇佑十方善信。<br/>
                歡迎各界善男信女蒞臨參香指導，共沐神恩。
              </p>
              <div className="flex space-x-4">
                 <a 
                   href="https://line.me/ti/p/@heshengaltar" 
                   target="_blank" 
                   rel="noopener noreferrer"
                   className="w-10 h-10 rounded-full bg-[#06C755] flex items-center justify-center hover:scale-110 transition-transform text-white"
                 >
                   <span className="sr-only">LINE</span>
                   <LineIcon className="h-5 w-5" />
                 </a>
                 <button className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-temple-gold hover:text-temple-red transition-colors">
                   <span className="sr-only">Facebook</span>
                   <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" /></svg>
                 </button>
                 <button className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-temple-gold hover:text-temple-red transition-colors">
                   <span className="sr-only">Instagram</span>
                   <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772 4.902 4.902 0 011.772-1.153c.636-.247 1.363-.416 2.427-.465C9.673 2.013 10.03 2 12.484 2h.05m0 5.238a5.238 5.238 0 110 10.476 5.238 5.238 0 010-10.476zm0 2.162a3.077 3.077 0 100 6.154 3.077 3.077 0 000-6.154zM20.24 6.388a1.44 1.44 0 10-2.88 0 1.44 1.44 0 002.88 0z" clipRule="evenodd" /></svg>
                 </button>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-bold font-serif text-temple-gold mb-6">聯絡資訊</h4>
              <div className="space-y-4">
                <div className="flex items-start space-x-3 text-gray-400">
                  <MapPin className="w-5 h-5 mt-1 text-temple-red" />
                  <span>台灣省某某縣某某市某某路88號<br/>(和聖壇)</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-400">
                  <Phone className="w-5 h-5 text-temple-red" />
                  <span>(02) 2345-6789</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-400">
                  <Clock className="w-5 h-5 text-temple-red" />
                  <span>每日 06:00 - 21:00</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-bold font-serif text-temple-gold mb-6">交通指引</h4>
              <div className="w-full h-40 bg-gray-800 rounded-lg flex items-center justify-center border border-gray-700">
                <span className="text-gray-500 text-sm">Google Maps 嵌入區</span>
              </div>
              <p className="text-sm text-gray-500 mt-4">
                捷運：搭乘至某某站，步行約10分鐘。<br/>
                公車：搭乘123, 456路公車至和聖壇站。
              </p>
            </div>
          </div>

          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center text-gray-500 text-sm">
            <p>&copy; {new Date().getFullYear()} 和聖壇. All rights reserved. 網站設計：信徒志工團</p>
            <button 
              onClick={() => setShowAdmin(true)}
              className="mt-4 md:mt-0 flex items-center hover:text-temple-gold transition-colors"
            >
              <Settings className="w-4 h-4 mr-1" /> 管理員登入
            </button>
          </div>
        </div>
      </footer>

      {/* Floating LINE Button */}
      <a 
        href="https://line.me/ti/p/@heshengaltar" 
        target="_blank" 
        rel="noopener noreferrer"
        className="fixed bottom-8 right-8 z-[60] bg-[#06C755] text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform flex items-center gap-2 group"
      >
        <LineIcon className="w-6 h-6" />
        <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 ease-in-out whitespace-nowrap font-bold">
          加入 LINE 諮詢
        </span>
      </a>
    </div>
  );
};

export default App;