import { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import AvailabilitySearch from './components/AvailabilitySearch';
import Rooms, { type Room } from './components/Rooms';
import Amenities from './components/Amenities';
import Dining from './components/Dining';
import About from './components/About';
import Gallery from './components/Gallery';
import Footer from './components/Footer';
import AIAssistant from './components/AIAssistant';

function App() {
  const [availableRooms, setAvailableRooms] = useState<Room[] | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (dates: { check_in: string; check_out: string; adults: number }) => {
    setIsSearching(true);
    setHasSearched(true);
    
    try {
      const response = await fetch('/api/availability', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dates)
      });

      if (!response.ok) {
        throw new Error('Failed to check availability');
      }

      const data = await response.json();
      setAvailableRooms(data);
      
      // Scroll to rooms section after search
      setTimeout(() => {
        const element = document.getElementById('rooms');
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
      
    } catch (err) {
      console.error(err);
      // In a real app we might show a toast, but for now we just clear results
      // which shows the "No Rooms Available" state or an error state
      setAvailableRooms([]);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-beige-50">
      <Navbar />
      
      <main>
        <Hero />
        <AvailabilitySearch onSearch={handleSearch} isLoading={isSearching} />
        <Rooms availableRooms={availableRooms} hasSearched={hasSearched} />
        <Amenities />
        <Dining />
        <About />
        <Gallery />
      </main>
      
      <Footer />
      
      <AIAssistant />
    </div>
  );
}

export default App;
