import { useState, useRef, useEffect } from 'react';

type RoomData = {
  id: string;
  name: string;
  price_per_night: number;
  beds: string;
  max_guests: number;
  available_count: number;
};

type AvailabilityContext = {
  active: boolean;
  check_in: string | null;
  check_out: string | null;
  adults: number | null;
  room_type: string | null;
};

type Message = {
  role: 'user' | 'model';
  text: string;
  availability?: RoomData[];
};

export default function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Show popup animation on first load
    if (typeof window !== 'undefined') {
      const closed = sessionStorage.getItem("grandAssistantClosed");
      if (closed !== "true") {
        const timer = setTimeout(() => {
          setIsOpen(true);
        }, 800); // Wait 800ms before popping up
        return () => clearTimeout(timer);
      }
    }
  }, []);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: 'Welcome to Simplotel Grand Hotel! I am your personal digital concierge. How can I assist you with your stay today?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [availabilityContext, setAvailabilityContext] = useState<AvailabilityContext | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const suggestedQuestions = [
    'What time is check-in?',
    'Is breakfast included?',
    'Do you have a pool?',
    'Check room availability'
  ];

  const handleSend = async (text: string) => {
    if (!text.trim()) return;
    
    setMessages(prev => [...prev, { role: 'user', text }]);
    setInput('');
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          conversation: messages.map(m => ({ role: m.role, text: m.text })),
          availability_context: availabilityContext
        })
      });

      if (!response.ok) throw new Error('Failed to get response');

      const data = await response.json();
      
      const replyText = data.reply;
      const availability: RoomData[] | undefined = data.availability || undefined;
      
      // Update availability context from backend response
      if (data.availability_context) {
        setAvailabilityContext(data.availability_context);
      }
      
      setMessages(prev => [...prev, { role: 'model', text: replyText, availability }]);
      
    } catch (err) {
      console.error(err);
      setError('I\'m having trouble connecting right now. Please try again in a moment.');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend(input);
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      <div className={`fixed bottom-4 right-4 md:bottom-6 md:right-6 z-50 transition-all duration-300 ${isOpen ? 'opacity-0 pointer-events-none scale-50' : 'opacity-100 scale-100'}`}>
        <div className="relative group">
          {/* Tooltip */}
          <div className="absolute -top-12 right-0 md:right-auto md:-left-36 bg-charcoal-900 text-white text-xs px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap shadow-lg pointer-events-none font-medium tracking-wide">
            Ask Grand Assistant
            <div className="absolute -bottom-1 right-6 md:right-auto md:-right-1 md:top-1/2 md:-translate-y-1/2 w-2 h-2 bg-charcoal-900 rotate-45"></div>
          </div>
          
          <button 
            onClick={() => {
              setIsOpen(true);
              sessionStorage.setItem("grandAssistantClosed", "false");
            }}
            className="bg-white border-2 border-[#8B5E34] text-charcoal-900 w-14 h-14 md:w-16 md:h-16 rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.12)] flex items-center justify-center hover:shadow-[0_8px_30px_rgb(0,0,0,0.2)] hover:scale-105 transition-all duration-300 focus:outline-none"
            aria-label="Open AI Assistant"
          >
            {/* Elegant Robot SVG */}
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-gold-500 group-hover:text-gold-600 transition-colors">
              <rect x="3" y="11" width="18" height="10" rx="2" />
              <circle cx="12" cy="5" r="2" />
              <path d="M12 7v4" />
              <line x1="8" y1="16" x2="8" y2="16" strokeWidth="2" strokeLinecap="round" />
              <line x1="16" y1="16" x2="16" y2="16" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </div>

      {/* Floating Chat Window */}
      <div className={`fixed bottom-4 right-4 md:bottom-6 md:right-6 z-50 w-[calc(100vw-32px)] sm:w-[340px] md:w-[360px] bg-white rounded-2xl shadow-[0_20px_50px_rgb(0,0,0,0.15)] border border-gray-100 overflow-hidden flex flex-col transition-all duration-500 origin-bottom-right ${isOpen ? 'scale-100 opacity-100 h-[calc(100dvh-100px)] sm:h-[480px] max-h-[700px]' : 'scale-50 opacity-0 h-0 pointer-events-none'}`}>
        
        {/* Header */}
        <div className="bg-charcoal-900 text-white p-4 flex justify-between items-center shadow-md relative z-10">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gold-500 rounded-full flex items-center justify-center text-charcoal-900 shadow-inner">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="10" rx="2" />
                <circle cx="12" cy="5" r="2" />
                <path d="M12 7v4" />
                <line x1="8" y1="16" x2="8" y2="16" strokeWidth="2" strokeLinecap="round" />
                <line x1="16" y1="16" x2="16" y2="16" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
            <div>
              <h3 className="font-serif text-lg leading-tight">Grand Assistant</h3>
              <p className="text-[10px] text-gold-400 uppercase tracking-wider">Your AI Assistant</p>
            </div>
          </div>
          <div className="flex space-x-2">
            <button 
              onClick={() => {
                setIsOpen(false);
                sessionStorage.setItem("grandAssistantClosed", "true");
              }} 
              className="text-gray-400 hover:text-white transition-colors p-1"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-beige-50">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[90%] ${
                msg.role === 'user' 
                  ? 'bg-gold-500 text-white rounded-2xl rounded-br-none px-5 py-3 shadow-sm text-sm' 
                  : 'space-y-3'
              }`}>
                {msg.role === 'user' ? (
                  msg.text
                ) : (
                  <>
                    <div className="bg-white border border-gray-100 rounded-2xl rounded-bl-none px-5 py-3 shadow-sm text-sm text-charcoal-900 leading-relaxed whitespace-pre-wrap">
                      {msg.text}
                    </div>
                    {msg.text.includes("still use the hotel availability search") && (
                      <button 
                        onClick={() => {
                          setIsOpen(false);
                          setTimeout(() => {
                            document.getElementById('availability')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                          }, 100);
                        }}
                        className="mt-2 w-full bg-[#8B5E34] hover:bg-[#704A29] text-white py-2 px-4 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors shadow-sm"
                      >
                        Go to Availability Search
                      </button>
                    )}
                    {msg.availability && msg.availability.length > 0 && (
                      <div className="space-y-2 mt-2">
                        {msg.availability.map((room) => (
                          <div key={room.id} className="bg-white border border-gray-100 rounded-xl p-3 shadow-sm">
                            <div className="flex justify-between items-start">
                              <h4 className="font-serif text-sm font-semibold text-charcoal-900">🏨 {room.name}</h4>
                              <span className="text-[10px] bg-green-50 text-green-700 px-2 py-0.5 rounded-full font-medium border border-green-100">Available ✓</span>
                            </div>
                            <div className="mt-1.5 text-[11px] text-gray-500 space-y-0.5">
                              <p>🛏️ {room.beds}</p>
                              <p>👤 Up to {room.max_guests} guest{room.max_guests > 1 ? 's' : ''}</p>
                            </div>
                            <div className="mt-2 flex justify-between items-center border-t border-gray-50 pt-2">
                              <span className="font-semibold text-sm text-charcoal-900">₹{room.price_per_night.toLocaleString('en-IN')}</span>
                              <span className="text-[10px] text-gray-400">/ night</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="bg-white border border-gray-100 rounded-2xl rounded-bl-none px-5 py-4 flex space-x-2 items-center shadow-sm">
                <div className="w-1.5 h-1.5 bg-gold-500 rounded-full animate-bounce"></div>
                <div className="w-1.5 h-1.5 bg-gold-500 rounded-full animate-bounce delay-100"></div>
                <div className="w-1.5 h-1.5 bg-gold-500 rounded-full animate-bounce delay-200"></div>
              </div>
            </div>
          )}
          
          {error && (
            <div className="flex justify-center my-2">
              <div className="bg-red-50 text-red-600 px-3 py-2 rounded-lg text-xs border border-red-100 shadow-sm flex flex-col items-center text-center">
                <span>{error}</span>
                <button onClick={() => setError(null)} className="mt-2 text-charcoal-900 font-bold hover:underline">Dismiss</button>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="border-t border-gray-100 bg-white p-4">
          {messages.length === 1 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {suggestedQuestions.map((q, idx) => (
                <button key={idx} onClick={() => handleSend(q)}
                  className="text-[11px] bg-beige-100 text-charcoal-900 px-3 py-1.5 rounded-full hover:bg-gold-500 hover:text-white transition-colors border border-gray-200">
                  {q}
                </button>
              ))}
            </div>
          )}
          
          <div className="relative flex items-center">
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message..."
              className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-4 pr-12 py-3 focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500 resize-none h-[48px] text-sm"
              rows={1}
            />
            <button 
              onClick={() => handleSend(input)}
              disabled={!input.trim() || loading}
              className="absolute right-1.5 p-2 bg-charcoal-900 text-gold-500 rounded-lg hover:bg-black disabled:opacity-50 disabled:hover:bg-charcoal-900 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
