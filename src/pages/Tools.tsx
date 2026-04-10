import { useState } from 'react';
import { Terminal, Code, Hash, Link as LinkIcon, FileJson, ArrowRightLeft, Copy, CheckCircle2, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const tools = [
  { id: 'json', name: 'JSON Formatter', icon: FileJson, desc: 'Format and validate JSON data' },
  { id: 'base64', name: 'Base64 Encode/Decode', icon: ArrowRightLeft, desc: 'Encode or decode Base64 strings' },
  { id: 'url', name: 'URL Encode/Decode', icon: LinkIcon, desc: 'Encode or decode URL parameters' },
  { id: 'hash', name: 'Hash Generator', icon: Hash, desc: 'Generate MD5, SHA-1, SHA-256 hashes' },
];

export default function Tools() {
  const [activeTool, setActiveTool] = useState('json');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const processInput = (toolId: string, val: string, action: 'encode' | 'decode' | 'format' | 'hash' = 'encode', hashType = 'SHA-256') => {
    setError('');
    setOutput('');
    if (!val) return;

    try {
      if (toolId === 'json') {
        const parsed = JSON.parse(val);
        setOutput(JSON.stringify(parsed, null, 2));
      } else if (toolId === 'base64') {
        if (action === 'encode') {
          setOutput(btoa(val));
        } else {
          setOutput(atob(val));
        }
      } else if (toolId === 'url') {
        if (action === 'encode') {
          setOutput(encodeURIComponent(val));
        } else {
          setOutput(decodeURIComponent(val));
        }
      } else if (toolId === 'hash') {
        // Simple hash using Web Crypto API
        const msgBuffer = new TextEncoder().encode(val);
        crypto.subtle.digest(hashType, msgBuffer).then(hashBuffer => {
          const hashArray = Array.from(new Uint8Array(hashBuffer));
          const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
          setOutput(hashHex);
        }).catch(() => setError('Hashing failed'));
      }
    } catch (e: any) {
      setError(e.message || 'Invalid input');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between max-w-6xl">
          <div className="flex items-center gap-4">
            <Link to="/" className="p-2 -ml-2 rounded-full hover:bg-slate-100 text-slate-500 transition-colors">
              <ArrowLeft size={20} />
            </Link>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shadow-sm">
                <Terminal size={18} className="text-white" />
              </div>
              <span className="text-xl font-bold tracking-tight text-slate-900">Developer Tools</span>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-2">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 px-3">Available Tools</h3>
            {tools.map((tool) => {
              const Icon = tool.icon;
              const isActive = activeTool === tool.id;
              return (
                <button
                  key={tool.id}
                  onClick={() => {
                    setActiveTool(tool.id);
                    setInput('');
                    setOutput('');
                    setError('');
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all text-left ${
                    isActive 
                      ? 'bg-blue-50 text-blue-700 font-semibold shadow-sm border border-blue-100' 
                      : 'hover:bg-slate-100 text-slate-600 font-medium border border-transparent'
                  }`}
                >
                  <Icon size={18} className={isActive ? 'text-blue-600' : 'text-slate-400'} />
                  <div className="flex-1">
                    <div className="text-sm">{tool.name}</div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                <h2 className="text-xl font-bold text-slate-900">
                  {tools.find(t => t.id === activeTool)?.name}
                </h2>
                <p className="text-sm text-slate-500 mt-1">
                  {tools.find(t => t.id === activeTool)?.desc}
                </p>
              </div>
              
              <div className="p-6 space-y-6">
                {/* Input Area */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-semibold text-slate-700">Input</label>
                    {activeTool !== 'json' && (
                      <div className="flex gap-2">
                        {activeTool === 'hash' ? (
                          <>
                            <button onClick={() => processInput(activeTool, input, 'hash', 'SHA-1')} className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-md font-medium transition-colors">SHA-1</button>
                            <button onClick={() => processInput(activeTool, input, 'hash', 'SHA-256')} className="text-xs bg-blue-50 hover:bg-blue-100 text-blue-700 px-3 py-1.5 rounded-md font-medium transition-colors">SHA-256</button>
                            <button onClick={() => processInput(activeTool, input, 'hash', 'SHA-512')} className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-md font-medium transition-colors">SHA-512</button>
                          </>
                        ) : (
                          <>
                            <button onClick={() => processInput(activeTool, input, 'encode')} className="text-xs bg-blue-50 hover:bg-blue-100 text-blue-700 px-3 py-1.5 rounded-md font-medium transition-colors">Encode</button>
                            <button onClick={() => processInput(activeTool, input, 'decode')} className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-md font-medium transition-colors">Decode</button>
                          </>
                        )}
                      </div>
                    )}
                    {activeTool === 'json' && (
                      <button onClick={() => processInput(activeTool, input, 'format')} className="text-xs bg-blue-50 hover:bg-blue-100 text-blue-700 px-3 py-1.5 rounded-md font-medium transition-colors">Format JSON</button>
                    )}
                  </div>
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Paste your text here..."
                    className="w-full h-40 p-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none custom-scrollbar"
                  />
                </div>

                {/* Error Message */}
                {error && (
                  <div className="p-3 bg-red-50 border border-red-100 rounded-lg text-sm text-red-600 font-medium flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
                    {error}
                  </div>
                )}

                {/* Output Area */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-semibold text-slate-700">Output</label>
                    <button 
                      onClick={handleCopy}
                      disabled={!output}
                      className="flex items-center gap-1.5 text-xs bg-slate-100 hover:bg-slate-200 disabled:opacity-50 disabled:hover:bg-slate-100 text-slate-700 px-3 py-1.5 rounded-md font-medium transition-colors"
                    >
                      {copied ? <CheckCircle2 size={14} className="text-emerald-600" /> : <Copy size={14} />}
                      {copied ? 'Copied' : 'Copy'}
                    </button>
                  </div>
                  <div className="relative">
                    <textarea
                      value={output}
                      readOnly
                      placeholder="Result will appear here..."
                      className="w-full h-64 p-4 bg-slate-900 border border-slate-800 rounded-xl text-sm font-mono text-emerald-400 focus:outline-none resize-none custom-scrollbar"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
