export default function Footer() {
  return (
    <footer className="bg-charcoal-900 text-beige-200 py-16 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          
          <div className="col-span-1 lg:col-span-1">
            <h2 className="font-serif text-2xl font-semibold tracking-wider uppercase text-white mb-6">
              Simplotel <span className="text-gold-500">Grand</span>
            </h2>
            <p className="text-sm font-light leading-relaxed opacity-80">
              An elegant stay designed around comfort, hospitality, and unforgettable experiences.
            </p>
          </div>
          
          <div>
            <h3 className="text-gold-500 uppercase tracking-widest text-xs font-bold mb-6">Contact Us</h3>
            <ul className="space-y-4 text-sm font-light opacity-80">
              <li className="flex items-start">
                <span className="mr-3 mt-0.5">📍</span>
                <span>123 MG Road<br/>Bangalore, Karnataka<br/>India</span>
              </li>
              <li className="flex items-center">
                <span className="mr-3">📞</span>
                <span>+91 9876543210</span>
              </li>
              <li className="flex items-center">
                <span className="mr-3">✉️</span>
                <span>reservations@simplotelgrand.com</span>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-gold-500 uppercase tracking-widest text-xs font-bold mb-6">Policies</h3>
            <ul className="space-y-4 text-sm font-light opacity-80">
              <li><strong>Check-in:</strong> 2:00 PM</li>
              <li><strong>Check-out:</strong> 11:00 AM</li>
              <li><strong>Cancellation:</strong> Free up to 24 hours before check-in</li>
              <li><strong>Pets:</strong> Not allowed</li>
              <li><strong>Smoking:</strong> Prohibited in guest rooms</li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-gold-500 uppercase tracking-widest text-xs font-bold mb-6">Newsletter</h3>
            <p className="text-sm font-light opacity-80 mb-4">
              Subscribe to receive exclusive offers and news.
            </p>
            <form className="flex" onSubmit={e => e.preventDefault()}>
              <input 
                type="email" 
                placeholder="Email Address" 
                className="bg-white/5 border border-white/20 rounded-l px-4 py-2 w-full focus:outline-none focus:border-gold-500 text-sm"
              />
              <button 
                type="submit"
                className="bg-gold-500 text-charcoal-900 px-4 py-2 rounded-r font-medium hover:bg-gold-400 transition-colors"
              >
                Join
              </button>
            </form>
          </div>
          
        </div>
        
        <div className="border-t border-white/10 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center opacity-60 text-xs font-light">
          <p>&copy; {new Date().getFullYear()} Simplotel Grand Hotel. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-gold-500 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-gold-500 transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
