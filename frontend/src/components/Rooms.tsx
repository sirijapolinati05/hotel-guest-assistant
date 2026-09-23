export type Room = {
  id: string;
  name: string;
  price_per_night: number;
  beds: string;
  max_guests: number;
  available_count: number;
};

type RoomsProps = {
  availableRooms: Room[] | null;
  hasSearched: boolean;
};

const STATIC_ROOMS = [
  {
    name: "Deluxe Room",
    beds: "King Bed",
    max_guests: 2,
    price_per_night: 5000,
    description: "A comfortable and elegantly designed room, perfect for couples or solo travelers.",
    image: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=2070&auto=format&fit=crop"
  },
  {
    name: "Executive Room",
    beds: "King Bed + Sofa Bed",
    max_guests: 3,
    price_per_night: 7000,
    description: "Spacious luxury with additional seating area and premium amenities.",
    image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=2070&auto=format&fit=crop"
  },
  {
    name: "Family Suite",
    beds: "King Bed + 2 Single Beds",
    max_guests: 4,
    price_per_night: 8500,
    description: "Our largest suite featuring separated living and sleeping areas for the whole family.",
    image: "https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=1974&auto=format&fit=crop"
  }
];

export default function Rooms({ availableRooms, hasSearched }: RoomsProps) {
  
  // Render Availability Results
  if (hasSearched && availableRooms !== null) {
    return (
      <section id="rooms" className="py-20 bg-beige-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif text-charcoal-900 mb-4">Available Rooms</h2>
            <div className="w-24 h-1 bg-gold-500 mx-auto"></div>
          </div>
          
          {availableRooms.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {availableRooms.map((room) => {
                // Find matching static image or use placeholder
                const staticInfo = STATIC_ROOMS.find(r => r.name === room.name);
                const image = staticInfo?.image || "https://images.unsplash.com/photo-1566665797739-1674de7a421a?q=80&w=1974&auto=format&fit=crop";
                
                return (
                  <div key={room.id} className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow group flex flex-col">
                    <div className="relative h-64 overflow-hidden">
                      <img src={image} alt={room.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                      <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded text-xs font-bold uppercase tracking-wider shadow-sm">
                        Available ({room.available_count} left)
                      </div>
                    </div>
                    
                    <div className="p-8 flex-1 flex flex-col">
                      <h3 className="text-2xl font-serif text-charcoal-900 mb-2">{room.name}</h3>
                      <div className="flex items-center text-charcoal-800 text-sm mb-4 space-x-4">
                        <span className="flex items-center"><span className="mr-2">🛏️</span> {room.beds}</span>
                        <span className="flex items-center"><span className="mr-2">👥</span> Up to {room.max_guests} guests</span>
                      </div>
                      
                      <div className="mt-auto pt-6 border-t border-gray-100 flex items-end justify-between">
                        <div>
                          <p className="text-3xl font-serif text-gold-600">₹{room.price_per_night.toLocaleString()}</p>
                          <p className="text-xs text-charcoal-800 uppercase tracking-wider">per night</p>
                        </div>
                        <button className="bg-charcoal-900 text-white px-6 py-2.5 rounded hover:bg-gold-500 transition-colors uppercase tracking-widest text-xs font-medium">
                          Choose
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-md p-12 text-center max-w-2xl mx-auto">
              <h3 className="text-2xl font-serif text-charcoal-900 mb-4">No Rooms Available</h3>
              <p className="text-charcoal-800 mb-8">We're sorry, but there are no rooms available for your selected dates and guest count.</p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="border border-charcoal-900 text-charcoal-900 px-6 py-2 rounded hover:bg-charcoal-900 hover:text-white transition-colors uppercase tracking-widest text-xs font-medium">
                  Change Dates
                </button>
              </div>
            </div>
          )}
        </div>
      </section>
    );
  }

  // Render Static Showcase
  return (
    <section id="rooms" className="py-20 bg-beige-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-serif text-charcoal-900 mb-4">Rooms & Suites</h2>
          <p className="text-charcoal-800 max-w-2xl mx-auto">Thoughtfully designed spaces for every kind of stay.</p>
          <div className="w-24 h-1 bg-gold-500 mx-auto mt-8"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {STATIC_ROOMS.map((room, index) => (
            <div key={index} className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow group flex flex-col">
              <div className="relative h-64 overflow-hidden">
                <img src={room.image} alt={room.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              </div>
              
              <div className="p-8 flex-1 flex flex-col">
                <h3 className="text-2xl font-serif text-charcoal-900 mb-2">{room.name}</h3>
                <p className="text-charcoal-800 text-sm mb-6 leading-relaxed flex-1">{room.description}</p>
                
                <div className="flex items-center text-charcoal-800 text-sm mb-6 space-x-4 border-y border-gray-100 py-3">
                  <span className="flex items-center"><span className="mr-2">🛏️</span> {room.beds}</span>
                  <span className="flex items-center"><span className="mr-2">👥</span> Up to {room.max_guests} guests</span>
                </div>
                
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-3xl font-serif text-gold-600">₹{room.price_per_night.toLocaleString()}</p>
                    <p className="text-xs text-charcoal-800 uppercase tracking-wider">per night</p>
                  </div>
                  <a href="#availability" className="border border-gold-500 text-gold-600 px-4 py-2 rounded hover:bg-gold-500 hover:text-white transition-colors uppercase tracking-widest text-[10px] font-bold">
                    Check Dates
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
