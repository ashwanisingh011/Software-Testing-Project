import React, { useState, useEffect } from 'react';
import { mockBuses as initialMockBuses } from './data/mockData';
import Header from './components/Header';
import Footer from './components/Footer';
import Notification from './components/Notification';
import Login from './pages/Login';
import Home from './pages/Home';
import BusList from './pages/BusList';
import SeatSelection from './pages/SeatSelection';
import PaymentPage from './pages/PaymentPage';
import BookingConfirmation from './pages/BookingConfirmation';
import MyBookings from './pages/MyBookings';
import ProfilePage from './pages/ProfilePage';
import LiveTrackingPage from './pages/LiveTrackingPage';

// Make a mutable copy for in-session updates
let mockBuses = JSON.parse(JSON.stringify(initialMockBuses));

export default function App() {
    const [page, setPage] = useState('login');
    const [user, setUser] = useState(null);
    const [searchQuery, setSearchQuery] = useState({ from: 'Ahmedabad', to: 'Mumbai', date: new Date().toISOString().split('T')[0] });
    const [foundBuses, setFoundBuses] = useState([]);
    const [selectedBus, setSelectedBus] = useState(null);
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [lockedSeats, setLockedSeats] = useState({});
    const [bookings, setBookings] = useState([]);
    const [notification, setNotification] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [trackingInfo, setTrackingInfo] = useState(null);

    // Effect to load data from localStorage on initial render
    useEffect(() => {
        const loggedInUser = localStorage.getItem('bus_booking_user');
        if (loggedInUser) {
            setUser(JSON.parse(loggedInUser));
            setPage('home');
        }
        const storedBookings = localStorage.getItem('bus_bookings');
        if (storedBookings) {
            setBookings(JSON.parse(storedBookings));
        }
    }, []);

    // --- Utility Functions ---
    const showNotification = (message, type = 'error') => {
        setNotification({ message, type });
    };

    // --- Event Handlers ---
    const handleLogin = (username) => {
        const newUser = { name: username, email: `${username.toLowerCase().replace(/\s/g, '.')}@example.com` };
        setUser(newUser);
        localStorage.setItem('bus_booking_user', JSON.stringify(newUser));
        setPage('home');
    };

    const handleLogout = () => {
        setUser(null);
        localStorage.removeItem('bus_booking_user');
        setPage('login');
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (!searchQuery.from || !searchQuery.to || !searchQuery.date) {
            showNotification("Please fill all search fields.");
            return;
        }
        setIsLoading(true);
        setTimeout(() => {
            const results = mockBuses.filter(bus => bus.from === searchQuery.from && bus.to === searchQuery.to);
            setFoundBuses(results);
            setPage('busList');
            setIsLoading(false);
        }, 1000); // Simulate network delay
    };

    const handleSelectBus = (bus) => {
        setSelectedBus(bus);
        setSelectedSeats([]);
        setPage('seatSelection');
    };
    
    const toggleSeat = (seatIndex) => {
        const isSelected = selectedSeats.includes(seatIndex);
        if (selectedSeats.length >= 5 && !isSelected) {
            showNotification("You can select a maximum of 5 seats.");
            return;
        }
        setSelectedSeats(prev => isSelected ? prev.filter(s => s !== seatIndex) : [...prev, seatIndex]);
    };

    const handleProceedToPayment = () => {
        if (selectedSeats.length === 0) {
            showNotification("Please select at least one seat.");
            return;
        }
        const expiry = Date.now() + 5 * 60 * 1000; // 5 minutes
        const newLockedSeats = { ...lockedSeats };
        selectedSeats.forEach(seat => { newLockedSeats[seat] = expiry; });
        setLockedSeats(newLockedSeats);
        setPage('payment');
    };

    const handlePaymentConfirm = () => {
        const newBooking = {
            id: `BK${Date.now()}`,
            bus: selectedBus,
            seats: selectedSeats,
            date: searchQuery.date,
            totalPrice: selectedBus.price * selectedSeats.length,
            user: user
        };
        const updatedBookings = [...bookings, newBooking];
        setBookings(updatedBookings);
        localStorage.setItem('bus_bookings', JSON.stringify(updatedBookings));

        // Update mock data for the current session to show seats as booked
        const busIndex = mockBuses.findIndex(b => b.id === selectedBus.id);
        if (busIndex !== -1) {
             selectedSeats.forEach(seatIndex => { mockBuses[busIndex].seats[seatIndex] = 'booked'; });
        }
        
        showNotification("Booking Successful!", "success");
        setSelectedSeats([]);
        setLockedSeats({});
        setPage('confirmation');
    };

    const handleStartTracking = (booking) => {
        setTrackingInfo(booking);
        setPage('liveTracking');
    };

    // --- Page Rendering Logic ---
    const renderPage = () => {
        const lastBooking = bookings[bookings.length - 1];
        switch (page) {
            case 'login': return <Login onLogin={handleLogin} />;
            case 'home': return <Home searchQuery={searchQuery} setSearchQuery={setSearchQuery} onSearch={handleSearch} />;
            case 'busList': return <BusList buses={foundBuses} onSelectBus={handleSelectBus} onBack={() => setPage('home')} isLoading={isLoading} />;
            case 'seatSelection': return <SeatSelection bus={selectedBus} selectedSeats={selectedSeats} lockedSeats={lockedSeats} onToggleSeat={toggleSeat} onConfirm={handleProceedToPayment} onBack={() => setPage('busList')} showNotification={showNotification} />;
            case 'payment': return <PaymentPage booking={{ bus: selectedBus, seats: selectedSeats }} onConfirm={handlePaymentConfirm} onBack={() => setPage('seatSelection')} lockedSeats={lockedSeats} setLockedSeats={setLockedSeats} setSelectedSeats={setSelectedSeats} showNotification={showNotification} />;
            case 'confirmation': return <BookingConfirmation booking={lastBooking} onDone={() => setPage('home')} />;
            case 'myBookings': return <MyBookings bookings={bookings.filter(b => b.user?.email === user?.email)} onBack={() => setPage('home')} onTrack={handleStartTracking} />;
            case 'profile': return <ProfilePage user={user} bookings={bookings} onBack={() => setPage('home')} />;
            case 'liveTracking': return <LiveTrackingPage booking={trackingInfo} onBack={() => setPage('myBookings')} />;
            default: return <Login onLogin={handleLogin} />;
        }
    };
    
    const isLoginPage = page === 'login';

    return (
        <div className="bg-slate-50 min-h-screen font-sans antialiased text-slate-800">
            {notification && <Notification message={notification.message} type={notification.type} onDismiss={() => setNotification(null)} />}
            {!isLoginPage && <Header user={user} onLogout={handleLogout} setPage={setPage} currentPage={page} />}
            <main className={!isLoginPage ? "container mx-auto p-4 md:p-6" : ""}>
                {renderPage()}
            </main>
            {!isLoginPage && <Footer />}
        </div>
    );
}

