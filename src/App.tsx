import { useState, useMemo, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { Turnstile } from '@marsidev/react-turnstile';
import { BrowserRouter, Routes, Route, Link as RouterLink } from 'react-router-dom';
import Fuse from 'fuse.js';
import { Search, Terminal, Activity, Zap, Shield, Code2, Copy, CheckCircle2, Play, Cpu, Image as ImageIcon, Tv, Download, Gamepad2, Film, AlertTriangle, Search as SearchIcon, Music, Monitor, Eye, Type, Mic, Link, Palette, Phone, Wrench, Folder, ChevronRight, Globe, Coins, Smile, FlaskConical, Box, Database, MessageSquare, BookOpen, Leaf, Coffee, Wifi, Brush, Headphones, Car, GraduationCap, Trophy, Newspaper, Briefcase, BrainCircuit, Building2, Train, Bitcoin, Camera, ShoppingCart, TestTube, BookA, Calendar, Calculator, Map as MapIcon, Network, CheckSquare, Share2, ShieldAlert, Send } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/src/components/ui/card';
import { Input } from '@/src/components/ui/input';
import { Button } from '@/src/components/ui/button';
import { Badge } from '@/src/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/src/components/ui/dialog';
import endpointsData from '@/src/data/endpoints.json';

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
  const [visibleCategories, setVisibleCategories] = useState(5);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);

  useEffect(() => {
    setOrigin(window.location.origin);

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

  const categories = useMemo(() => {
    const rawCategories = JSON.parse(JSON.stringify(endpointsData.endpoints || []));
    const premiumCategoryIndex = rawCategories.findIndex((c: any) => c.name === "Featured APIs");
    
    if (premiumCategoryIndex === -1) return rawCategories;
    
    const premiumItems = rawCategories[premiumCategoryIndex].items;
    const newCategories = rawCategories.filter((_: any, idx: number) => idx !== premiumCategoryIndex);
    
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
  const totalEndpoints = endpointsData.totalfitur || 0;

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
      if (finalPath.startsWith('http')) {
        url = `${finalPath}${queryString ? `?${queryString}` : ''}`;
      } else {
        url = `/api${finalPath}${queryString ? `?${queryString}` : ''}`;
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
      
      if (contentType.includes('application/json')) {
        data = await res.json();
        type = 'json';
      } else if (contentType.includes('image/') || contentType.includes('video/') || contentType.includes('audio/')) {
        const blob = await res.blob();
        data = URL.createObjectURL(blob);
        type = contentType.split('/')[0];
      } else {
        data = await res.text();
      }
      
      setResponse({
        data,
        status: res.status,
        time: endTime - startTime,
        type
      });
    } catch (error: any) {
      setResponse({
        data: error.message || 'Failed to fetch',
        status: 0,
        time: 0,
        type: 'error'
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
                    const displayPath = isExternal ? details.path.split('?')[0] : `${origin}/api${details.path.split('?')[0]}`;
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
                              {displayPath.replace(/^https?:\/\//, '')}
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
                        {/* 300x250 Banner every 2 endpoints */}
                        {((itemIdx + 1) % 2 === 0) && (
                          <div className="flex justify-center items-center bg-slate-50 rounded-xl border border-slate-200 overflow-hidden min-h-[250px]">
                            <AdBanner width={300} height={250} dataKey="36c65a945aa722669a63704442691dd9" />
                          </div>
                        )}
                        {/* 728x90 Banner every 5 endpoints */}
                        {((itemIdx + 1) % 5 === 0) && (
                          <div className="col-span-1 md:col-span-2 lg:col-span-3 flex justify-center items-center py-4 hidden md:flex bg-slate-50 rounded-xl border border-slate-200 my-2">
                            <AdBanner width={728} height={90} dataKey="3f774e44518c99b802b52db67915bdbe" />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </motion.div>
              
              {/* Insert 300x250 Banner after every 3 categories */}
              {(idx + 1) % 3 === 0 && (
                <div className="mt-20">
                  <AdBanner width={300} height={250} dataKey="36c65a945aa722669a63704442691dd9" />
                </div>
              )}
            </div>
            );
            })}
            
            {visibleCategories < filteredCategories.length && (
              <div className="flex justify-center pt-10 pb-20">
                <Button 
                  onClick={() => setVisibleCategories(prev => prev + 5)}
                  className="bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-900 px-8 py-6 rounded-xl shadow-sm hover:shadow-md transition-all text-base font-medium"
                  variant="outline"
                >
                  Load More Categories
                </Button>
              </div>
            )}
          </>
          )}
        </div>
      </main>

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
        <DialogContent className="bg-white border-slate-200 text-slate-900 max-w-2xl w-full max-h-[90vh] overflow-y-auto sm:rounded-2xl shadow-2xl p-0 gap-0">
          <div className="p-6 border-b border-slate-100">
            <DialogHeader>
              <div className="flex items-center gap-3 mb-2">
                <select 
                  value={method} 
                  onChange={(e) => setMethod(e.target.value)}
                  className="bg-blue-50 text-blue-600 border border-blue-200 font-mono text-xs rounded-md px-2 py-1 outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                >
                  <option value="GET">GET</option>
                  <option value="POST">POST</option>
                  <option value="PUT">PUT</option>
                  <option value="PATCH">PATCH</option>
                  <option value="DELETE">DELETE</option>
                </select>
                <DialogTitle className="text-xl font-semibold text-slate-900">{selectedEndpoint?.name}</DialogTitle>
              </div>
              <DialogDescription className="text-slate-500 text-sm">
                {selectedEndpoint?.desc}
              </DialogDescription>
              {(selectedEndpoint?.docs || selectedEndpoint?.exampleResponse || selectedEndpoint?.statusCodes) && (
                <div className="mt-2 flex gap-4">
                  {selectedEndpoint?.docs && (
                    <a href={selectedEndpoint.docs} target="_blank" rel="noreferrer" className="text-xs text-blue-600 hover:underline flex items-center gap-1 font-medium">
                      <Link size={12} /> API Documentation
                    </a>
                  )}
                  {selectedEndpoint?.statusCodes && (
                    <span className="text-xs text-slate-500 flex items-center gap-1">
                      <Activity size={12} /> Status: {selectedEndpoint.statusCodes.join(', ')}
                    </span>
                  )}
                </div>
              )}
            </DialogHeader>
          </div>

          <div className="p-6 space-y-8">
            {/* Base URL Preview */}
            <div className="space-y-2">
              <h4 className="text-xs font-medium text-slate-500 uppercase tracking-wider">Full Request URL</h4>
              <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200 flex items-center justify-between group">
                <code className="text-sm text-slate-700 font-mono break-all">
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
                    const baseUrl = finalPath.startsWith('http') ? finalPath : `${origin}/api${finalPath}`;
                    return `${baseUrl}${queryString ? `?${queryString}` : ''}`;
                  })()}
                </code>
                <Button 
                  size="icon" 
                  variant="ghost" 
                  className="h-8 w-8 text-slate-400 hover:text-slate-700 hover:bg-slate-200 opacity-0 group-hover:opacity-100 transition-all"
                  onClick={() => {
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
                    const baseUrl = finalPath.startsWith('http') ? finalPath : `${origin}/api${finalPath}`;
                    copyToClipboard(`${baseUrl}${queryString ? `?${queryString}` : ''}`);
                  }}
                >
                  {copied ? <CheckCircle2 size={14} className="text-emerald-500" /> : <Copy size={14} />}
                </Button>
              </div>
            </div>

            {/* Parameters */}
            {Object.keys(params).length > 0 && (
              <div className="space-y-4">
                <h4 className="text-xs font-medium text-slate-500 uppercase tracking-wider">Query Parameters</h4>
                <div className="space-y-3">
                  {Object.keys(params).map((key) => {
                    const isOptional = key.endsWith('?');
                    const cleanKey = isOptional ? key.slice(0, -1) : key;
                    
                    return (
                      <div key={key} className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                          {cleanKey}
                          {isOptional ? (
                            <span className="text-[10px] text-emerald-500 uppercase tracking-wider">Optional</span>
                          ) : (
                            <span className="text-[10px] text-red-500 uppercase tracking-wider">Required</span>
                          )}
                        </label>
                        <Input
                          value={params[key]}
                          onChange={(e) => setParams({ ...params, [key]: e.target.value })}
                          placeholder={`Enter value for ${cleanKey}...`}
                          className="bg-white border-slate-200 text-slate-900 focus-visible:ring-1 focus-visible:ring-blue-500 focus-visible:border-blue-500 h-11"
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Request Body */}
            {['POST', 'PUT', 'PATCH'].includes(method) && (
              <div className="space-y-2">
                <h4 className="text-xs font-medium text-slate-500 uppercase tracking-wider">Request Body (JSON)</h4>
                <textarea
                  value={requestBody}
                  onChange={(e) => setRequestBody(e.target.value)}
                  placeholder="{\n  &quot;key&quot;: &quot;value&quot;\n}"
                  className="w-full h-32 p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono text-slate-700 focus-visible:ring-1 focus-visible:ring-blue-500 focus-visible:border-blue-500 outline-none resize-y"
                />
              </div>
            )}

            {/* Cloudflare Turnstile */}
            <div className="flex justify-center py-2">
              <Turnstile 
                siteKey="0x4AAAAAAC2peINI9p1_A0No"
                onSuccess={(token) => setTurnstileToken(token)}
                options={{ theme: 'light' }}
              />
            </div>

            {/* Action */}
            <Button 
              onClick={handleTestEndpoint} 
              disabled={loading || !turnstileToken}
              className="w-full bg-slate-900 text-white hover:bg-slate-800 h-12 text-sm font-semibold rounded-xl transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                  Executing...
                </span>
              ) : !turnstileToken ? (
                <span className="flex items-center gap-2">
                  <Shield size={16} fill="currentColor" />
                  Verify to Send Request
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Play size={16} fill="currentColor" />
                  Send Request
                </span>
              )}
            </Button>

            {/* Response */}
            {response && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-3 pt-4 border-t border-slate-100"
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-medium text-slate-500 uppercase tracking-wider">Response</h4>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono text-slate-500">{response.time}ms</span>
                    <Badge variant="outline" className={
                      response.status >= 200 && response.status < 300 
                        ? "bg-emerald-50 text-emerald-600 border-emerald-200 font-mono" 
                        : "bg-red-50 text-red-600 border-red-200 font-mono"
                    }>
                      {response.status}
                    </Badge>
                  </div>
                </div>
                
                <div className="relative bg-slate-900 border border-slate-800 rounded-xl overflow-hidden group shadow-inner">
                  <div className="absolute top-2 right-2 flex gap-2 z-10">
                    {response.type === 'json' && (
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        className="h-8 w-8 text-slate-400 hover:text-white hover:bg-white/10 bg-black/50 backdrop-blur-md border border-white/10 opacity-0 group-hover:opacity-100 transition-all"
                        onClick={() => copyToClipboard(JSON.stringify(response.data, null, 2))}
                      >
                        {copied ? <CheckCircle2 size={14} className="text-emerald-400" /> : <Copy size={14} />}
                      </Button>
                    )}
                  </div>
                  
                  <div className="p-4 overflow-auto max-h-[400px] custom-scrollbar">
                    {response.type === 'json' ? (
                      <pre className="text-[13px] leading-relaxed text-slate-300 font-mono">
                        {JSON.stringify(response.data, null, 2)}
                      </pre>
                    ) : response.type === 'image' ? (
                      <img src={response.data} alt="API Response" className="max-w-full h-auto rounded-lg border border-white/10" />
                    ) : response.type === 'video' ? (
                      <video src={response.data} controls className="max-w-full rounded-lg border border-white/10" />
                    ) : response.type === 'audio' ? (
                      <audio src={response.data} controls className="w-full" />
                    ) : (
                      <pre className="text-[13px] leading-relaxed text-slate-300 font-mono whitespace-pre-wrap">
                        {String(response.data)}
                      </pre>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
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
        <Route path="/disclaimer" element={<Disclaimer />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
      </Routes>
    </BrowserRouter>
  );
}

