import { useState, useMemo, useEffect, useRef, lazy, Suspense } from 'react';
import { motion } from 'motion/react';
import { Turnstile } from '@marsidev/react-turnstile';
import { BrowserRouter, Routes, Route, Link as RouterLink, Navigate } from 'react-router-dom';
import Fuse from 'fuse.js';
import { Search, Terminal, Activity, Zap, Shield, Code2, Copy, CheckCircle2, Play, Cpu, Image as ImageIcon, Tv, Download, Gamepad2, Film, AlertTriangle, Search as SearchIcon, Music, Monitor, Eye, Type, Mic, Link, Palette, Phone, Wrench, Folder, ChevronRight, Globe, Coins, Smile, FlaskConical, Box, Database, MessageSquare, BookOpen, Leaf, Coffee, Wifi, Brush, Headphones, Car, GraduationCap, Trophy, Newspaper, Briefcase, BrainCircuit, Building2, Train, Bitcoin, Camera, ShoppingCart, TestTube, BookA, Calendar, Calculator, Map as MapIcon, Network, CheckSquare, Share2, ShieldAlert, Send, X } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/src/components/ui/card';
import { Input } from '@/src/components/ui/input';
import { Button } from '@/src/components/ui/button';
import { Badge } from '@/src/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/src/components/ui/dialog';
import endpointsData from '@/src/data/endpoints.json';

const Tools = lazy(() => import('./pages/Tools'));

const categoryIcons: Record<string, any> = {
  "Artificial Intelligence": Cpu,
  "Image Generation": ImageIcon,
  "Anime": Tv,
  "Downloader": Download,
  "Games": Gamepad2,
  "Image Creator": Palette,
  "Movies": Film,
  "NSFW Content": AlertTriangle,
  "Search": SearchIcon,
  "Audio": Music,
  "Screenshot Website": Monitor,
  "Stalk": Eye,
  "Text Maker": Type,
  "Text To Speech": Mic,
  "URL Shortener": Link,
  "StyleText": Palette,
  "Virtual Number": Phone,
  "Public Utilities & Tools": Wrench,
  "Developer & Testing Tools": Code2,
  "Finance & Crypto": Coins,
  "Entertainment & Pop Culture": Smile,
  "Science & Weather": FlaskConical,
  "More Utilities": Box,
  "Temp Numbers & SMS": MessageSquare,
  "Books & Literature": BookOpen,
  "Animals & Nature": Leaf,
  "Health & Food": Coffee,
  "Security & Network": Wifi,
  "Art & Design": Brush,
  "Music & Audio": Headphones,
  "Vehicles & Transport": Car,
  "University & Education": GraduationCap,
  "Sports & Fitness": Trophy,
  "News & Information": Newspaper,
  "Jobs & Careers": Briefcase,
  "Machine Learning & AI": BrainCircuit,
  "Open Data & Government": Building2,
  "Transportation & Logistics": Train,
  "Video Games & eSports": Gamepad2,
  "Blockchain & Cryptocurrency": Bitcoin,
  "Photography & Imagery": Camera,
  "Shopping & E-Commerce": ShoppingCart,
  "Test Data & Mocking": TestTube,
  "Dictionaries & Words": BookA,
  "Calendar & Time": Calendar,
  "Math & Calculation": Calculator,
  "Geocoding & Maps": MapIcon,
  "DNS & Network Tools": Network,
  "Validation & Verification": CheckSquare,
  "Social Media & Engagement": Share2,
  "JSONPlaceholder Data": Database,
  "Pokemon API": Gamepad2,
  "Rick and Morty API": Tv,
  "DummyJSON Products": ShoppingCart
};

const AdBanner = ({ width, height, dataKey }: { width: number, height: number, dataKey: string }) => {
  return (
    <div className="flex justify-center my-8 overflow-hidden w-full">
      <iframe 
        src={`/ad.html?key=${dataKey}&width=${width}&height=${height}`}
        width={width}
        height={height}
        frameBorder="0"
        scrolling="no"
        className="bg-slate-100 rounded-lg"
        title="Advertisement"
        loading="eager"
        fetchPriority="high"
      />
    </div>
  );
};

function MainApp() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEndpoint, setSelectedEndpoint] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [params, setParams] = useState<Record<string, string>>({});
  const [method, setMethod] = useState('GET');
  const [requestBody, setRequestBody] = useState('');
  const [response, setResponse] = useState<{ data: any; status: number; time: number; type: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [origin, setOrigin] = useState('');
  const [adblockDetected, setAdblockDetected] = useState(false);
  const [botVerificationOpen, setBotVerificationOpen] = useState(false);
  const [visibleCategories, setVisibleCategories] = useState(5);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const categories = useMemo(() => {
    const rawCategories = JSON.parse(JSON.stringify(endpointsData.endpoints || []));
    
    // Sort categories: Artificial Intelligence at top, Downloader at bottom
    const sortedCategories = [...rawCategories].sort((a, b) => {
      if (a.name === "Artificial Intelligence") return -1;
      if (b.name === "Artificial Intelligence") return 1;
      if (a.name === "Downloader") return 1;
      if (b.name === "Downloader") return -1;
      return 0;
    });

    const premiumCategoryIndex = sortedCategories.findIndex((c: any) => c.name === "Featured APIs");
    
    if (premiumCategoryIndex === -1) return sortedCategories;
    
    const premiumItems = sortedCategories[premiumCategoryIndex].items;
    const newCategories = sortedCategories.filter((_: any, idx: number) => idx !== premiumCategoryIndex);
    
    // Distribute premium items into the first few categories
    premiumItems.forEach((item: any, idx: number) => {
      if (newCategories[idx]) {
        const itemName = Object.keys(item)[0];
        item[itemName].isPremium = true;
        // Insert at index 1 to mix it naturally
        newCategories[idx].items.splice(1, 0, item);
      }
    });
    
    return newCategories;
  }, []);

  const flatEndpoints = useMemo(() => {
    const flat: any[] = [];
    categories.forEach((category: any) => {
      category.items.forEach((itemObj: any) => {
        const name = Object.keys(itemObj)[0];
        const details = itemObj[name];
        flat.push({
          categoryName: category.name,
          name: name,
          desc: details.desc || '',
          path: details.path || '',
          originalItem: itemObj
        });
      });
    });
    return flat;
  }, [categories]);

  const fuse = useMemo(() => new Fuse(flatEndpoints, {
    keys: [
      { name: 'name', weight: 0.5 },
      { name: 'desc', weight: 0.3 },
      { name: 'path', weight: 0.1 },
      { name: 'categoryName', weight: 0.1 }
    ],
    threshold: 0.3, // 0.0 requires perfect match, 1.0 matches anything
    includeScore: true,
    ignoreLocation: true
  }), [flatEndpoints]);

  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) return categories;
    
    const results = fuse.search(searchQuery);
    
    const categoryMap = new Map<string, any>();
    results.forEach(result => {
      const item = result.item;
      if (!categoryMap.has(item.categoryName)) {
        categoryMap.set(item.categoryName, {
          name: item.categoryName,
          items: []
        });
      }
      categoryMap.get(item.categoryName).items.push(item.originalItem);
    });

    return Array.from(categoryMap.values());
  }, [categories, searchQuery, fuse]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && visibleCategories < filteredCategories.length) {
          setVisibleCategories((prev) => prev + 5);
        }
      },
      { threshold: 0.1 }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => observer.disconnect();
  }, [filteredCategories.length, visibleCategories]);

  useEffect(() => {
    setOrigin(window.location.origin);

    // Bot Verification Logic
    const lastVerification = localStorage.getItem('lastVerification');
    const now = Date.now();
    if (!lastVerification || now - parseInt(lastVerification) > 30 * 60 * 1000) {
      setBotVerificationOpen(true);
    }

    // Adblock Detection Logic
    const bait = document.createElement('div');
    bait.className = 'ad-banner adsbox doubleclick sponsor-ad';
    bait.style.height = '10px';
    bait.style.width = '10px';
    bait.style.position = 'absolute';
    bait.style.left = '-9999px';
    bait.style.top = '-9999px';
    document.body.appendChild(bait);

    setTimeout(() => {
      const isBlocked = bait.offsetHeight === 0 || window.getComputedStyle(bait).display === 'none';
      if (isBlocked) {
        setAdblockDetected(true);
      }
      bait.remove();
    }, 500);
  }, []);

  const handleVerificationSuccess = () => {
    localStorage.setItem('lastVerification', Date.now().toString());
    setBotVerificationOpen(false);
  };

  const totalEndpoints = endpointsData.totalfitur || 0;

  const handleOpenModal = (name: string, details: any) => {
    setSelectedEndpoint({ name, ...details });
    setResponse(null);
    setMethod(details.method || 'GET');
    setRequestBody(details.exampleBody ? JSON.stringify(details.exampleBody, null, 2) : '');
    setTurnstileToken(null); // Reset Turnstile on modal open
    
    // Parse params from path
    const urlParams = details.path.split('?')[1];
    const initialParams: Record<string, string> = {};
    if (urlParams) {
      urlParams.split('&').forEach((p: string) => {
        const key = p.split('=')[0];
        if (key) initialParams[key] = '';
      });
    }
    setParams(initialParams);
    setIsModalOpen(true);
  };

  const handleTestEndpoint = async () => {
    if (!selectedEndpoint) return;
    
    setLoading(true);
    setResponse(null);
    
    try {
      let finalPath = selectedEndpoint.path.split('?')[0];
      const queryParams = new URLSearchParams();
      
      Object.entries(params).forEach(([key, value]) => {
        const isOptional = key.endsWith('?');
        const cleanKey = isOptional ? key.slice(0, -1) : key;
        if (value || !isOptional) {
          queryParams.append(cleanKey, value as string);
        }
      });
      
      const queryString = queryParams.toString();
      
      let url = '';
      const baseUrl = 'https://apis.prexzyvilla.site';
      if (finalPath.startsWith('http')) {
        url = `${finalPath}${queryString ? `?${queryString}` : ''}`;
      } else {
        url = `${baseUrl}${finalPath}${queryString ? `?${queryString}` : ''}`;
      }
      
      const options: RequestInit = { method };
      if (['POST', 'PUT', 'PATCH'].includes(method) && requestBody) {
        options.headers = { 'Content-Type': 'application/json' };
        try {
          JSON.parse(requestBody); // Validate JSON
          options.body = requestBody;
        } catch (e) {
          options.body = requestBody; // Send as text if invalid JSON
        }
      }
      
      const startTime = Date.now();
      const res = await fetch(url, options);
      const endTime = Date.now();
      
      const contentType = res.headers.get('content-type') || '';
      let data;
      let type = 'text';
      
      if (contentType.includes('image/') || contentType.includes('video/') || contentType.includes('audio/')) {
        const blob = await res.blob();
        data = URL.createObjectURL(blob);
        type = contentType.split('/')[0];
      } else {
        const text = await res.text();
        try {
          data = JSON.parse(text);
          type = 'json';
        } catch (e) {
          // Force JSON format even for HTML/text errors to ensure clean JSON output
          data = { 
            error: "Invalid JSON response", 
            status: res.status,
            raw_response: text.substring(0, 500) + (text.length > 500 ? '...' : '')
          };
          type = 'json';
        }
      }
      
      setResponse({
        data,
        status: res.status,
        time: endTime - startTime,
        type
      });
    } catch (error: any) {
      setResponse({
        data: {
          error: 'Failed to fetch',
          message: error.message || 'Network error or CORS issue'
        },
        status: 0,
        time: 0,
        type: 'json'
      });
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans relative overflow-hidden">
      {/* Premium Ambient Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(56,189,248,0.1),transparent_70%)] blur-[100px]"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(129,140,248,0.05),transparent_70%)] blur-[100px]"></div>
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay"></div>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/80 backdrop-blur-xl">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center shadow-sm">
              <Terminal size={16} className="text-blue-600" />
            </div>
            <h1 className="text-lg font-semibold tracking-tight text-slate-900">API Vault</h1>
            <Badge variant="outline" className="ml-2 border-emerald-200 text-emerald-700 bg-emerald-50 hidden sm:inline-flex px-2 py-0.5 text-[10px] uppercase tracking-wider font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 animate-pulse"></span>
              All Systems Operational
            </Badge>
          </div>
          <div className="flex items-center gap-4">
            <a href="https://t.me/Alexzochannel" target="_blank" rel="noreferrer" className="text-slate-500 hover:text-blue-500 transition-colors flex items-center gap-2 text-sm font-medium">
              <Send size={16} />
              <span className="hidden sm:inline">Telegram</span>
            </a>
            <a href="https://penguinsincequalify.com/n8dibdbq?key=64fbe1c81638a0debe45609e1fe6cce6" target="_blank" rel="noreferrer" className="hidden sm:flex items-center gap-2 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2 rounded-lg shadow-sm hover:shadow-md transition-all">
              <Zap size={16} />
              Premium APIs
            </a>
            <a href="https://alexzo.vercel.app/" target="_blank" rel="noreferrer" className="text-slate-500 hover:text-slate-900 transition-colors flex items-center gap-2 text-sm font-medium">
              <Globe size={16} />
              <span className="hidden sm:inline">Website</span>
            </a>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-16 max-w-6xl relative z-10">
        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center text-center mb-12 space-y-6"
        >
          <Badge variant="outline" className="border-slate-200 bg-white text-slate-600 px-3 py-1 text-xs mb-4 shadow-sm">
            v1 is now live
          </Badge>
          <h2 className="text-5xl md:text-7xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-slate-900 to-slate-600 pb-2">
            The Ultimate API <br className="hidden md:block" />
            Directory
          </h2>
          <p className="text-lg md:text-xl text-slate-500 max-w-2xl font-light">
            A highly curated, ultra-fast collection of powerful endpoints. 
            Currently serving <strong className="text-slate-900 font-medium">{totalEndpoints}</strong> active APIs.
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-3xl mt-10">
            {[
              { icon: Activity, label: "99.9% Uptime", color: "text-blue-500" },
              { icon: Zap, label: "Ultra Fast", color: "text-amber-500" },
              { icon: Shield, label: "Secure", color: "text-emerald-500" },
              { icon: Code2, label: "Easy Integration", color: "text-indigo-500" }
            ].map((stat, i) => (
              <div key={i} className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col items-center justify-center shadow-sm hover:shadow-md transition-all">
                <stat.icon className={`${stat.color} mb-3`} size={24} strokeWidth={1.5} />
                <span className="text-sm font-medium text-slate-700">{stat.label}</span>
              </div>
            ))}
          </div>

          <div className="w-full max-w-3xl mt-6">
            <RouterLink to="/tools" className="block group">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between shadow-sm group-hover:shadow-md transition-all">
                <div className="flex items-center gap-4 text-left mb-4 sm:mb-0">
                  <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center shadow-sm shrink-0">
                    <Terminal size={24} className="text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-700 transition-colors">Developer Tools</h3>
                    <p className="text-sm text-slate-600">Access our suite of free developer utilities including JSON formatters, encoders, and more.</p>
                  </div>
                </div>
                <div className="shrink-0">
                  <Button variant="outline" className="bg-white text-blue-600 border-blue-200 hover:bg-blue-50 font-semibold group-hover:scale-105 transition-transform">
                    Explore Tools <ChevronRight size={16} className="ml-1" />
                  </Button>
                </div>
              </div>
            </RouterLink>
          </div>
        </motion.div>

        {/* Search */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="relative max-w-2xl mx-auto mb-10"
        >
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-slate-400" />
          </div>
          <Input
            type="text"
            placeholder="Search endpoints, categories, or descriptions..."
            className="w-full pl-12 pr-4 py-7 bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 rounded-2xl focus-visible:ring-1 focus-visible:ring-blue-500 focus-visible:border-blue-500 text-lg shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setVisibleCategories(5); // Reset pagination on search
            }}
          />
        </motion.div>

        {/* 728x90 Banner */}
        <div className="hidden md:block mb-16">
          <AdBanner width={728} height={90} dataKey="3f774e44518c99b802b52db67915bdbe" />
        </div>

        {/* Disclaimer */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-10 flex items-start gap-3 text-amber-800 shadow-sm">
          <AlertTriangle className="shrink-0 mt-0.5" size={18} />
          <div className="text-sm">
            <strong>Disclaimer:</strong> These APIs are collected from public sources and come with no guarantees. Please use them at your own risk.
          </div>
        </div>

        {/* Endpoints List */}
        <div className="space-y-20">
          {filteredCategories.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-slate-500 text-lg">No endpoints found matching "{searchQuery}"</p>
            </div>
          ) : (
            <>
              {filteredCategories.slice(0, visibleCategories).map((category: any, idx: number) => {
                const Icon = categoryIcons[category.name] || Folder;
                
                return (
                  <div key={idx}>
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-50px" }}
                      transition={{ duration: 0.4 }}
                      className="space-y-6"
                    >
                <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
                  <div className="p-2 bg-white border border-slate-200 text-slate-600 rounded-lg shadow-sm">
                    <Icon size={20} strokeWidth={1.5} />
                  </div>
                  <h3 className="text-2xl font-semibold text-slate-900 tracking-tight">{category.name}</h3>
                  <Badge variant="outline" className="bg-slate-100 text-slate-500 border-slate-200 ml-auto md:ml-0 font-mono text-xs">
                    {category.items.length}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {category.items.map((itemObj: any, itemIdx: number) => {
                    const name = Object.keys(itemObj)[0];
                    const details = itemObj[name];
                    const isExternal = details.path.startsWith('http');
                    const displayPath = isExternal ? details.path.split('?')[0] : `https://apivault.pages.dev${details.path.split('?')[0]}`;
                    const isPremiumItem = details.isPremium;
                    
                    const card = isPremiumItem ? (
                      <Card key={`item-${itemIdx}`} className="bg-gradient-to-br from-indigo-50 to-blue-50 border-blue-200 hover:border-blue-300 hover:shadow-md transition-all duration-300 group overflow-hidden relative">
                        <CardHeader className="pb-3 relative z-10">
                          <div className="flex justify-between items-start">
                            <CardTitle className="text-lg text-blue-900 font-bold">
                              {name}
                            </CardTitle>
                            <Badge variant="default" className="bg-blue-600 hover:bg-blue-700 text-white font-mono text-[10px] uppercase tracking-wider">
                              PREMIUM
                            </Badge>
                          </div>
                          <CardDescription className="text-blue-700/70 line-clamp-2 mt-2 text-sm">
                            {details.desc}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="relative z-10">
                          <div className="bg-white/60 rounded-lg p-3 flex flex-col items-center justify-center border border-blue-100 text-center gap-2">
                            <span className="text-sm font-medium text-slate-700">Get access to this API</span>
                            <a href={details.path} target="_blank" rel="noreferrer" className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md text-sm font-semibold transition-colors">
                              <Globe size={16} /> Visit Site
                            </a>
                          </div>
                        </CardContent>
                      </Card>
                    ) : (
                      <Card key={`item-${itemIdx}`} className="bg-white border-slate-200 hover:border-slate-300 hover:shadow-md transition-all duration-300 group overflow-hidden relative">
                        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <CardHeader className="pb-3 relative z-10">
                          <div className="flex justify-between items-start">
                            <CardTitle className="text-lg text-slate-800 group-hover:text-blue-600 transition-colors font-medium">
                              {name}
                            </CardTitle>
                            <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200 font-mono text-[10px] uppercase tracking-wider">
                              GET
                            </Badge>
                          </div>
                          <CardDescription className="text-slate-500 line-clamp-2 mt-2 text-sm">
                            {details.desc}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="relative z-10">
                          <div className="bg-slate-50 rounded-lg p-2.5 flex items-center justify-between border border-slate-100 group-hover:border-slate-200 transition-colors">
                            <code className="text-xs text-slate-500 font-mono truncate mr-2">
                              {displayPath}
                            </code>
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              className="h-7 px-2 text-xs bg-white hover:bg-slate-100 text-slate-600 border border-slate-200 shrink-0 shadow-sm"
                              onClick={() => handleOpenModal(name, details)}
                            >
                              <Play className="w-3 h-3 mr-1.5" /> Test
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    );

                    return (
                      <div className="contents" key={`frag-${itemIdx}`}>
                        {card}
                        {/* 300x250 Banner every 5 endpoints */}
                        {((itemIdx + 1) % 5 === 0) && (
                          <div className="flex justify-center items-center bg-slate-50 rounded-xl border border-slate-200 overflow-hidden min-h-[250px]">
                            <AdBanner width={300} height={250} dataKey="36c65a945aa722669a63704442691dd9" />
                          </div>
                        )}
                        {/* 728x90 Banner every 10 endpoints */}
                        {((itemIdx + 1) % 10 === 0) && (
                          <div className="col-span-1 md:col-span-2 lg:col-span-3 flex justify-center items-center py-4 hidden md:flex bg-slate-50 rounded-xl border border-slate-200 my-2">
                            <AdBanner width={728} height={90} dataKey="3f774e44518c99b802b52db67915bdbe" />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            </div>
            );
            })}
            
            {visibleCategories < filteredCategories.length && (
              <div ref={loadMoreRef} className="flex justify-center pt-10 pb-20">
                <div className="flex flex-col items-center gap-4">
                  <div className="w-8 h-8 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
                  <p className="text-slate-400 text-sm font-medium">Loading more categories...</p>
                </div>
              </div>
            )}
          </>
          )}
        </div>
      </main>

      {/* Footer Ad */}
      <div className="container mx-auto px-4 py-8 flex justify-center">
        <div className="hidden md:block">
          <AdBanner width={728} height={90} dataKey="3f774e44518c99b802b52db67915bdbe" />
        </div>
        <div className="md:hidden">
          <AdBanner width={300} height={250} dataKey="36c65a945aa722669a63704442691dd9" />
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white mt-10 relative z-10">
        <div className="container mx-auto px-4 py-8 max-w-6xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center shadow-sm">
              <Terminal size={16} className="text-blue-600" />
            </div>
            <span className="font-semibold text-slate-900">API Vault</span>
            <span className="text-slate-500 text-sm ml-2">© {new Date().getFullYear()}</span>
          </div>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-3 text-sm font-medium text-slate-500">
            <RouterLink to="/disclaimer" target="_blank" className="hover:text-slate-900 transition-colors">Disclaimer</RouterLink>
            <RouterLink to="/privacy" target="_blank" className="hover:text-slate-900 transition-colors">Privacy Policy</RouterLink>
            <RouterLink to="/terms" target="_blank" className="hover:text-slate-900 transition-colors">Terms of Service</RouterLink>
            <a href="https://t.me/prexzyvillatech" target="_blank" rel="noreferrer" className="hover:text-slate-900 transition-colors">Contact Us</a>
          </div>
        </div>
      </footer>

      {/* Test Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="bg-white border-none text-slate-900 max-w-[95vw] sm:max-w-lg w-full max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl p-5 sm:p-6 outline-none [&>button]:hidden">
          {/* Modal Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="space-y-1.5 pr-4">
              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                <div className="bg-[#eef2ff] text-[#4f46e5] font-bold text-[10px] sm:text-xs rounded px-2 py-1 uppercase tracking-wider shrink-0">
                  {method}
                </div>
                <DialogTitle className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight leading-tight">
                  {selectedEndpoint?.name}
                </DialogTitle>
              </div>
              {selectedEndpoint?.desc && (
                <DialogDescription className="text-slate-600 text-xs sm:text-sm mt-1">
                  {selectedEndpoint.desc}
                </DialogDescription>
              )}
            </div>
            <button 
              onClick={() => setIsModalOpen(false)} 
              className="text-slate-400 hover:text-slate-600 transition-colors shrink-0 p-1 -mr-1 -mt-1"
            >
              <X size={22} />
            </button>
          </div>

          <div className="space-y-5 sm:space-y-6">
            {/* Full Request URL Section */}
            <div className="border border-slate-300 rounded-lg p-3 relative flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="font-mono text-xs sm:text-sm text-slate-800 break-all flex-1">
                {(() => {
                  if (!selectedEndpoint) return '';
                  let finalPath = selectedEndpoint.path.split('?')[0];
                  const queryParams = new URLSearchParams();
                  Object.entries(params).forEach(([key, value]) => {
                    const isOptional = key.endsWith('?');
                    const cleanKey = isOptional ? key.slice(0, -1) : key;
                    if (value || !isOptional) {
                      queryParams.append(cleanKey, value as string);
                    }
                  });
                  const queryString = queryParams.toString();
                  const baseUrl = 'https://apivault.pages.dev';
                  const fullUrl = finalPath.startsWith('http') ? finalPath : `${baseUrl}${finalPath}`;
                  return `${fullUrl}${queryString ? `?${queryString}` : ''}`;
                })()}
              </div>
              <Button 
                className="shrink-0 bg-[#3b82f6] hover:bg-[#2563eb] text-white text-xs font-medium px-4 py-2 sm:py-1.5 h-auto rounded-md w-full sm:w-auto"
                onClick={() => {
                  let finalPath = selectedEndpoint?.path.split('?')[0] || '';
                  const queryParams = new URLSearchParams();
                  Object.entries(params).forEach(([key, value]) => {
                    const isOptional = key.endsWith('?');
                    const cleanKey = isOptional ? key.slice(0, -1) : key;
                    if (value || !isOptional) {
                      queryParams.append(cleanKey, value as string);
                    }
                  });
                  const queryString = queryParams.toString();
                  const baseUrl = 'https://apivault.pages.dev';
                  const fullUrl = finalPath.startsWith('http') ? finalPath : `${baseUrl}${finalPath}`;
                  copyToClipboard(`${fullUrl}${queryString ? `?${queryString}` : ''}`);
                }}
              >
                {copied ? 'Copied' : 'Copy URL'}
              </Button>
            </div>

            {/* Parameters Section */}
            {Object.keys(params).length > 0 && (
              <div className="space-y-3">
                <div className="grid grid-cols-1 gap-3">
                  {Object.keys(params).map((key) => {
                    const isOptional = key.endsWith('?');
                    const cleanKey = isOptional ? key.slice(0, -1) : key;
                    
                    return (
                      <div key={key} className="space-y-1">
                        <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider px-1">
                          {cleanKey} {isOptional && <span className="text-slate-300 font-normal">(Optional)</span>}
                        </label>
                        <Input
                          value={params[key]}
                          onChange={(e) => setParams({ ...params, [key]: e.target.value })}
                          placeholder={`Enter ${cleanKey}...`}
                          className="bg-white border-slate-200 text-slate-900 h-10 rounded-lg focus-visible:ring-blue-500 transition-all text-sm"
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Response Section */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-base font-bold text-slate-900">Response</h4>
                <div className="flex items-center gap-2">
                  <div className={`px-2 py-0.5 rounded text-xs font-bold ${response?.status >= 200 && response?.status < 300 ? 'bg-[#e6f4ea] text-[#137333]' : (response ? 'bg-red-100 text-red-600' : 'bg-[#e6f4ea] text-[#137333]')}`}>
                    {response ? response.status : '200'}
                  </div>
                  <div className="text-slate-500 text-xs">
                    {response ? `${response.time}ms` : '200ms'}
                  </div>
                </div>
              </div>
              
              <div className="border border-slate-300 rounded-lg p-3 min-h-[100px] max-h-[300px] overflow-auto relative">
                {response && (
                  <div className="absolute top-2 right-2 z-10">
                    <Button 
                      size="sm" 
                      variant="ghost"
                      className="bg-white/90 backdrop-blur hover:bg-slate-100 text-slate-600 text-[10px] font-bold h-7 px-3 rounded-md border border-slate-200 transition-all"
                      onClick={() => {
                        const textToCopy = response.type === 'json' ? JSON.stringify(response.data, null, 2) : String(response.data);
                        copyToClipboard(textToCopy);
                      }}
                    >
                      {response.type === 'json' ? 'Copy JSON' : 'Copy Response'}
                    </Button>
                  </div>
                )}
                {loading ? (
                  <div className="font-mono text-sm text-slate-800">Loading...</div>
                ) : response ? (
                  <>
                    {response.type === 'json' ? (
                      <pre className="font-mono text-sm text-slate-800 whitespace-pre-wrap break-all mt-6">
                        {JSON.stringify(response.data, null, 2)}
                      </pre>
                    ) : response.type === 'image' ? (
                      <div className="flex justify-center p-1 mt-6">
                        <img src={response.data} alt="API Response" className="max-w-full h-auto rounded-lg shadow-sm" referrerPolicy="no-referrer" />
                      </div>
                    ) : (
                      <div className="font-mono text-sm text-slate-800 whitespace-pre-wrap break-all mt-6">
                        {String(response.data)}
                      </div>
                    )}
                  </>
                ) : (
                  <div className="font-mono text-sm text-slate-800">Loading...</div>
                )}
              </div>
            </div>

            {/* Action Button */}
            <Button 
              onClick={handleTestEndpoint} 
              disabled={loading}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white h-10 text-sm font-medium rounded-lg"
            >
              {loading ? 'Sending...' : 'Send Request'}
            </Button>

            {/* Modal Ad */}
            <div className="flex justify-center mt-4">
              <AdBanner width={320} height={50} dataKey="3f774e44518c99b802b52db67915bdbe" />
            </div>
          </div>
        </DialogContent>
      </Dialog>



      {/* Bot Verification Modal */}
      <Dialog open={botVerificationOpen} onOpenChange={() => {}}>
        <DialogContent 
          className="fixed inset-0 z-[100] bg-white border-none text-slate-900 w-screen h-screen max-w-none translate-x-0 translate-y-0 left-0 top-0 rounded-none shadow-none p-0 gap-0 outline-none [&>button]:hidden flex items-center justify-center" 
          onPointerDownOutside={(e) => e.preventDefault()} 
          onEscapeKeyDown={(e) => e.preventDefault()}
        >
          <div className="flex flex-col items-center text-center p-6 space-y-8 max-w-lg w-full">
            <div className="space-y-2">
              <DialogTitle className="text-2xl sm:text-4xl font-bold text-slate-900 tracking-tight">
                Security Check
              </DialogTitle>
              <DialogDescription className="text-slate-500 text-sm sm:text-base">
                Verifying your connection to API Vault...
              </DialogDescription>
            </div>

            <div className="flex justify-center scale-110 sm:scale-125">
              <Turnstile 
                siteKey="0x4AAAAAAC2peINI9p1_A0No"
                onSuccess={handleVerificationSuccess}
                options={{ theme: 'light' }}
              />
            </div>

            <div className="text-[10px] text-slate-400 uppercase tracking-[0.2em] font-medium">
              Protected by Cloudflare
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Adblocker Warning Modal */}
      <Dialog open={adblockDetected} onOpenChange={() => {}}>
        <DialogContent 
          className="bg-white border-slate-200 text-slate-900 sm:max-w-md [&>button]:hidden" 
          onPointerDownOutside={(e) => e.preventDefault()} 
          onEscapeKeyDown={(e) => e.preventDefault()}
        >
          <div className="flex flex-col items-center text-center p-6 space-y-4">
            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-2">
              <ShieldAlert size={32} />
            </div>
            <DialogTitle className="text-2xl font-bold text-slate-900">Adblocker Detected!</DialogTitle>
            <DialogDescription className="text-slate-600 text-base">
              It looks like you are using an adblocker. We rely on ads to keep this API directory free and servers running. 
              <br/><br/>
              Please <strong>disable your adblocker</strong> for this site and refresh the page to continue using API Vault.
            </DialogDescription>
            <Button 
              className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white h-12 text-md font-semibold rounded-xl"
              onClick={() => window.location.reload()}
            >
              I have disabled it, Refresh Page
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Disclaimer() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans py-12 px-4">
      <div className="max-w-3xl mx-auto bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-slate-200">
        <h1 className="text-3xl font-bold mb-6">Disclaimer</h1>
        <div className="prose prose-slate max-w-none">
          <p>The APIs provided in this directory are aggregated from various public sources across the internet. We do not host, control, or take responsibility for the content, availability, or reliability of these external endpoints.</p>
          <p>Users are solely responsible for how they use these APIs. Please ensure you comply with the respective terms of service of each API provider before using them in production applications.</p>
          <p>We do not guarantee the uptime, accuracy, or safety of any endpoint listed here. Use them at your own risk.</p>
        </div>
      </div>
    </div>
  );
}

function Privacy() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans py-12 px-4">
      <div className="max-w-3xl mx-auto bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-slate-200">
        <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
        <div className="prose prose-slate max-w-none">
          <p>Your privacy is important to us. This Privacy Policy explains how we collect, use, and protect your information when you use API Vault.</p>
          <h3 className="text-lg font-semibold mt-6 mb-2">Information We Collect</h3>
          <p>We do not require you to create an account to use our directory. We may collect anonymous usage data (such as page views and clicks) to improve our service and user experience.</p>
          <h3 className="text-lg font-semibold mt-6 mb-2">Third-Party Services</h3>
          <p>We use third-party advertising networks (like Adsterra) and security services (like Cloudflare Turnstile). These services may use cookies or similar technologies to collect data about your browsing habits to provide relevant ads and ensure security.</p>
        </div>
      </div>
    </div>
  );
}

function Terms() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans py-12 px-4">
      <div className="max-w-3xl mx-auto bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-slate-200">
        <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
        <div className="prose prose-slate max-w-none">
          <p>By accessing and using API Vault, you agree to be bound by these Terms of Service.</p>
          <h3 className="text-lg font-semibold mt-6 mb-2">Use of Service</h3>
          <p>API Vault is provided "as is" and "as available". You agree not to misuse the service, including but not limited to attempting to bypass security measures, scraping data excessively, or using the directory for malicious purposes.</p>
          <h3 className="text-lg font-semibold mt-6 mb-2">Adblockers</h3>
          <p>We rely on advertising revenue to keep this service free. By using this site, you agree to disable adblockers or whitelist our domain.</p>
          <h3 className="text-lg font-semibold mt-6 mb-2">Changes to Terms</h3>
          <p>We reserve the right to modify these terms at any time. Continued use of the service constitutes acceptance of the new terms.</p>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainApp />} />
        <Route path="/tools" element={<Suspense fallback={<div className="min-h-screen flex items-center justify-center text-slate-500">Loading tools...</div>}><Tools /></Suspense>} />
        <Route path="/tool" element={<Navigate to="/tools" replace />} />
        <Route path="/disclaimer" element={<Disclaimer />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
      </Routes>
    </BrowserRouter>
  );
}

