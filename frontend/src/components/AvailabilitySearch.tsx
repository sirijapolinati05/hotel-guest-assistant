import { useState } from 'react';

type AvailabilitySearchProps = {
  onSearch: (dates: { check_in: string; check_out: string; adults: number }) => Promise<void>;
  isLoading: boolean;
};

export default function AvailabilitySearch({ onSearch, isLoading }: AvailabilitySearchProps) {
  const [dates, setDates] = useState({ check_in: '', check_out: '', adults: 1 });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(dates);
  };

  // Get today's date in YYYY-MM-DD format for min date restriction
  const today = new Date().toISOString().split('T')[0];
  
  // Calculate tomorrow's date for check-out min date
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];

  return (
    <section id="availability" className="relative z-20 -mt-16 px-4 max-w-5xl mx-auto mb-16 scroll-mt-28">
      <div className="bg-white rounded-xl shadow-2xl p-6 md:p-8">
        <form onSubmit={handleSubmit} className="flex flex-col md:flex-row items-end gap-4 md:gap-6">
          
          <div className="w-full md:flex-1">
            <label className="block text-xs font-semibold text-charcoal-900/60 uppercase tracking-widest mb-2">
              Check-in
            </label>
            <input 
              type="date" 
              required 
              min={today}
              className="w-full p-3 border-b-2 border-gray-200 focus:outline-none focus:border-gold-500 transition-colors bg-transparent text-charcoal-900"
              value={dates.check_in} 
              onChange={e => setDates({...dates, check_in: e.target.value})} 
            />
          </div>
          
          <div className="w-full md:flex-1">
            <label className="block text-xs font-semibold text-charcoal-900/60 uppercase tracking-widest mb-2">
              Check-out
            </label>
            <input 
              type="date" 
              required 
              min={dates.check_in ? new Date(new Date(dates.check_in).getTime() + 86400000).toISOString().split('T')[0] : tomorrow}
              className="w-full p-3 border-b-2 border-gray-200 focus:outline-none focus:border-gold-500 transition-colors bg-transparent text-charcoal-900"
              value={dates.check_out} 
              onChange={e => setDates({...dates, check_out: e.target.value})} 
            />
          </div>
          
          <div className="w-full md:w-32">
            <label className="block text-xs font-semibold text-charcoal-900/60 uppercase tracking-widest mb-2">
              Guests
            </label>
            <div className="relative">
              <input 
                type="number" 
                min="1" 
                max="10" 
                required 
                className="w-full p-3 border-b-2 border-gray-200 focus:outline-none focus:border-gold-500 transition-colors bg-transparent text-charcoal-900 appearance-none"
                value={dates.adults} 
                onChange={e => setDates({...dates, adults: parseInt(e.target.value)})} 
              />
            </div>
          </div>
          
          <div className="w-full md:w-auto mt-4 md:mt-0">
            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full md:w-auto bg-charcoal-900 text-white px-8 py-3.5 rounded font-medium hover:bg-gold-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-widest text-sm h-[52px] flex items-center justify-center min-w-[200px]"
            >
              {isLoading ? (
                <div className="flex space-x-2 items-center">
                  <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce"></div>
                  <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce delay-100"></div>
                  <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce delay-200"></div>
                </div>
              ) : (
                'Check Availability'
              )}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
