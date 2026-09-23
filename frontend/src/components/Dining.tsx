export default function Dining() {
  return (
    <section id="dining" className="py-24 bg-charcoal-900 text-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          
          <div className="w-full lg:w-1/2 space-y-8">
            <h2 className="text-3xl md:text-5xl font-serif text-white leading-tight">
              Exceptional <span className="text-gold-500 italic">Dining</span>
            </h2>
            <p className="text-beige-200 text-lg font-light leading-relaxed">
              Our signature restaurant offers a curated culinary experience, blending local flavors with international excellence. Enjoy meals prepared by award-winning chefs in an elegant atmosphere.
            </p>
            
            <div className="bg-white/5 border border-white/10 rounded-xl p-8 backdrop-blur-sm mt-8">
              <h3 className="text-xl font-serif text-gold-400 mb-4">Breakfast Service</h3>
              <p className="text-beige-100 font-light mb-6">
                Start your day right with our complimentary gourmet breakfast, included with all eligible bookings. We offer a wide selection of hot and cold options, fresh pastries, and premium coffee.
              </p>
              
              <div className="flex items-center text-sm uppercase tracking-widest text-gold-500 font-semibold border-t border-white/10 pt-4">
                <svg className="w-5 h-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                7:00 AM – 10:30 AM Daily
              </div>
            </div>
            
            <button className="border border-gold-500 text-gold-500 px-8 py-3.5 rounded hover:bg-gold-500 hover:text-white transition-all uppercase tracking-widest text-sm font-medium mt-4">
              Explore Dining
            </button>
          </div>
          
          <div className="w-full lg:w-1/2 relative">
            <div className="absolute inset-0 bg-gold-500/20 translate-x-4 translate-y-4 rounded-xl -z-10"></div>
            <img 
              src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=2070&auto=format&fit=crop" 
              alt="Fine dining experience" 
              className="w-full h-auto rounded-xl shadow-2xl object-cover aspect-[4/3]"
            />
          </div>
          
        </div>
      </div>
    </section>
  );
}
