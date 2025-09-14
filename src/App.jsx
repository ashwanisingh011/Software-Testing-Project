import React, { useState, useEffect, useMemo, useRef } from 'react';
import MyBus from "./assets/Images/MyBus.jpg"; 
import Mumbaiimg from "./assets/Images/Mumbai.jpg";
import Jaipurimg from "./assets/Images/Jaipur.jpg";
import puneimg from "./assets/Images/Pune.jpg";
import chennaiimg from "./assets/Images/Chennai.jpg"
// --- SVG ICONS ---
// Using custom SVG components for a consistent and high-quality look.
const ICONS = {
    Bus: (props) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
            <path d="M8 6v6"></path><path d="M15 6v6"></path><path d="M2 12h19.6"></path><path d="M18 18h3s.5-1.7.8-2.8c.1-.4.2-.8.2-1.2 0-.4-.1-.8-.2-1.2l-1.4-5C20.1 6.8 19.1 6 18 6H4a2 2 0 0 0-2 2v10h3"></path>
            <circle cx="7" cy="18" r="2"></circle><path d="M9 18h5"></path><circle cx="16" cy="18" r="2"></circle>
        </svg>
    ),
    MapPin: (props) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path><circle cx="12" cy="10" r="3"></circle></svg>),
    ArrowRight: (props) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>),
    Calendar: (props) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>),
    Users: (props) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>),
    Star: ({ className = "w-5 h-5", isFilled = true }) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill={isFilled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>),
    Wifi: (props) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M5 12.55a11 11 0 0 1 14.08 0"></path><path d="M1.42 9a16 16 0 0 1 21.16 0"></path><path d="M8.53 16.11a6 6 0 0 1 6.95 0"></path><line x1="12" y1="20" x2="12.01" y2="20"></line></svg>),
    Charging: (props) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M5 18H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h3.19M15 6h2a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-3.19"></path><line x1="23" y1="13" x2="23" y2="11"></line><polyline points="11 6 7 12 13 12 9 18"></polyline></svg>),
    Water: (props) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M12 22s8-4.5 8-11.8A8 8 0 0012 2a8 8 0 00-8 8.2c0 7.3 8 11.8 8 11.8z"></path></svg>),
    CheckCircle: (props) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>),
    CreditCard: (props) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line></svg>),
    ChevronLeft: (props) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><polyline points="15 18 9 12 15 6"></polyline></svg>),
    Ticket: (props) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M2 9a3 3 0 0 1 0 6v1a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-1a3 3 0 0 1 0-6V8a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"></path><path d="M13 5v2"></path><path d="M13 17v2"></path><path d="M13 11v2"></path></svg>),
    Tag: (props) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z"></path><path d="M7 7h.01"></path></svg>),
    Headset: (props) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M3 11h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2Z"></path><path d="M21 11h-3a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2Z"></path><path d="M17.89 12.11a7.5 7.5 0 0 0-11.78 0"></path><path d="M15.12 14.88a4.5 4.5 0 0 0-6.24 0"></path></svg>),
    UserCircle: (props) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="10" r="4"></circle><path d="M12 14c-2.67 0-5 1.79-5 4h10c0-2.21-2.33-4-5-4z"></path></svg>),
    Sun: (props) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>),
    Cloud: (props) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"></path></svg>),
    SteeringWheel: (props) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="3"></circle><line x1="12" y1="22" x2="12" y2="15"></line><line x1="12" y1="9" x2="12" y2="2"></line><line x1="5.64" y1="5.64" x2="9.17" y2="9.17"></line><line x1="14.83" y1="14.83" x2="18.36" y2="18.36"></line><line x1="18.36" y1="5.64" x2="14.83" y2="9.17"></line><line x1="9.17" y1="14.83" x2="5.64" y2="18.36"></line></svg>),
    Bank: (props) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M3 21h18"></path><path d="M5 21V8l7-5 7 5v13"></path><path d="M9 21v-5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v5"></path></svg>),
    UPI: (props) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M4 4h2v2H4zM4 10h2v2H4zM4 16h2v2H4zM10 4h2v2h-2zM10 10h2v2h-2zM10 16h2v2h-2zM16 4h2v2h-2zM16 10h2v2h-2zM16 16h2v2h-2zM20 4h2v2h-2zM20 10h2v2h-2zM20 16h2v2h-2zM8 20v-4h8v4"></path><path d="M12 16v-2"></path></svg>),
    Quote: (props) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" {...props}><path d="M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z"></path></svg>),
};

// --- MOCK DATA ---
const CITIES = ['Ahmedabad', 'Mumbai', 'Delhi', 'Surat', 'Pune', 'Jaipur', 'Bangalore', 'Chennai'];

const generateMockBuses = () => [
    { id: 1, name: 'Galaxy Glide', from: 'Ahmedabad', to: 'Mumbai', departure: '08:00', arrival: '20:00', duration: '12h 0m', price: 1200, type: 'A/C Sleeper', rating: 4.5, amenities: ['Wifi', 'Charging', 'Water'], seats: Array(30).fill('available').map((s, i) => [4, 5, 10, 11, 21, 28].includes(i) ? 'booked' : s) },
    { id: 2, name: 'Metro Connect', from: 'Ahmedabad', to: 'Mumbai', departure: '10:30', arrival: '22:30', duration: '12h 0m', price: 950, type: 'Non A/C Seater', rating: 4.2, amenities: ['Water'], seats: Array(40).fill('available').map((s, i) => [2, 9, 15, 16, 25, 30, 31, 38].includes(i) ? 'booked' : s) },
    { id: 3, name: 'Capital Cruiser', from: 'Ahmedabad', to: 'Delhi', departure: '18:00', arrival: '12:00', duration: '18h 0m', price: 1500, type: 'A/C Sleeper', rating: 4.8, amenities: ['Wifi', 'Charging', 'Water'], seats: Array(30).fill('available').map((s, i) => [1, 8, 12, 19, 20, 22].includes(i) ? 'booked' : s) },
    { id: 4, name: 'Diamond Dasher', from: 'Ahmedabad', to: 'Surat', departure: '07:00', arrival: '12:00', duration: '5h 0m', price: 500, type: 'A/C Seater', rating: 4.6, amenities: ['Charging'], seats: Array(40).fill('available').map((s, i) => [3, 7, 14, 23, 24, 33, 35].includes(i) ? 'booked' : s) },
    { id: 5, name: 'Midnight Mover', from: 'Surat', to: 'Ahmedabad', departure: '23:00', arrival: '04:00', duration: '5h 0m', price: 550, type: 'A/C Sleeper', rating: 4.3, amenities: ['Wifi', 'Water'], seats: Array(30).fill('available').map((s, i) => [0, 6, 13, 17, 26, 27].includes(i) ? 'booked' : s) },
    { id: 6, name: 'Royal Rover', from: 'Delhi', to: 'Ahmedabad', departure: '09:00', arrival: '05:00', duration: '20h 0m', price: 1600, type: 'Volvo A/C', rating: 4.9, amenities: ['Wifi', 'Charging', 'Water'], seats: Array(45).fill('available').map((s, i) => [4, 11, 18, 29, 30, 31, 40, 42].includes(i) ? 'booked' : s) },
    { id: 7, name: 'Pune Paradise', from: 'Mumbai', to: 'Pune', departure: '09:30', arrival: '13:30', duration: '4h 0m', price: 400, type: 'A/C Seater', rating: 4.7, amenities: ['Charging', 'Water'], seats: Array(40).fill('available').map((s, i) => [1, 5, 10, 15, 20].includes(i) ? 'booked' : s) },
    { id: 8, name: 'Jaipur Jet', from: 'Delhi', to: 'Jaipur', departure: '06:00', arrival: '11:00', duration: '5h 0m', price: 600, type: 'A/C Seater', rating: 4.4, amenities: ['Charging'], seats: Array(45).fill('available').map((s, i) => [3, 8, 18, 28, 38].includes(i) ? 'booked' : s) },
];

let mockBuses = generateMockBuses();
const SEAT_LOCK_DURATION = 300; // 5 minutes in seconds

// --- HELPER & UI COMPONENTS ---

const Notification = ({ message, type, onDismiss }) => {
    useEffect(() => {
        const timer = setTimeout(onDismiss, 3000);
        return () => clearTimeout(timer);
    }, [onDismiss]);

    const colors = {
        error: 'bg-red-500',
        success: 'bg-green-500',
        info: 'bg-blue-500',
    };

    return (
        <div className={`fixed top-5 right-5 z-50 p-4 rounded-lg text-white ${colors[type]} shadow-lg animate-slide-in-right`}>
            {message}
        </div>
    );
};

const StarRating = ({ rating }) => {
    return (
        <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
                <ICONS.Star key={i} className={`w-5 h-5 ${i < Math.round(rating) ? 'text-yellow-400' : 'text-gray-300'}`} />
            ))}
            <span className="ml-2 text-sm font-semibold text-gray-700">{rating.toFixed(1)}</span>
        </div>
    );
};

const AmenityIcon = ({ name }) => {
    const iconMap = {
        Wifi: <ICONS.Wifi className="w-5 h-5 text-gray-600" title="Wi-Fi" />,
        Charging: <ICONS.Charging className="w-5 h-5 text-gray-600" title="Charging Port" />,
        Water: <ICONS.Water className="w-5 h-5 text-gray-600" title="Water Bottle" />,
    };
    return iconMap[name] || null;
};

const Seat = ({ status = 'available' }) => {
    const baseClasses = "w-7 h-7 sm:w-8 sm:h-8 rounded-md flex items-center justify-center font-semibold text-sm transition-all duration-200 border-2";
    const statusClasses = {
        available: 'bg-white border-gray-300 text-gray-600 hover:bg-indigo-500 hover:text-white hover:border-indigo-500 cursor-pointer',
        selected: 'bg-indigo-600 text-white border-indigo-700 scale-110',
        booked: 'bg-gray-300 border-gray-400 cursor-not-allowed',
        locked: 'bg-yellow-400 border-yellow-500 cursor-not-allowed',
    };
    return <div className={`${baseClasses} ${statusClasses[status]}`}></div>;
};

const SkeletonLoader = () => (
    <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white p-4 rounded-xl shadow-md animate-pulse">
                <div className="flex justify-between items-center">
                    <div className="w-1/3 h-6 bg-gray-200 rounded"></div>
                    <div className="w-1/4 h-8 bg-gray-200 rounded"></div>
                </div>
                <div className="mt-4 flex justify-between items-center">
                    <div className="w-1/2 h-4 bg-gray-200 rounded"></div>
                    <div className="w-1/4 h-10 bg-gray-300 rounded-md"></div>
                </div>
            </div>
        ))}
    </div>
);

// --- MAIN APP COMPONENT ---
export default function App() {
    // --- State Management ---
    const [page, setPage] = useState('login'); // login, home, busList, seatSelection, payment, confirmation, myBookings, profile, liveTracking
    const [user, setUser] = useState(null);
    const [searchQuery, setSearchQuery] = useState({ from: 'Ahmedabad', to: 'Mumbai', date: new Date().toISOString().split('T')[0] });
    const [foundBuses, setFoundBuses] = useState([]);
    const [selectedBus, setSelectedBus] = useState(null);
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [lockedSeats, setLockedSeats] = useState({}); // { seatIndex: expiry_timestamp }
    const [bookings, setBookings] = useState([]);
    const [notification, setNotification] = useState(null); // {message: '', type: ''}
    const [isLoading, setIsLoading] = useState(false);
    const [trackingInfo, setTrackingInfo] = useState(null); // Info for the bus being tracked

    // --- Effects ---
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

    const showNotification = (message, type = 'error') => {
        setNotification({ message, type });
    };

    // --- Event Handlers ---
    const handleLogin = (username) => {
        const newUser = { name: username, email: `${username.toLowerCase().split(' ').join('.')}@example.com` };
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
        setTimeout(() => { // Simulate API call
            const results = mockBuses.filter(bus => bus.from === searchQuery.from && bus.to === searchQuery.to);
            setFoundBuses(results);
            setPage('busList');
            setIsLoading(false);
        }, 1500);
    };
    
    const handleSelectBus = (bus) => {
        setSelectedBus(bus);
        setSelectedSeats([]);
        setPage('seatSelection');
    };
    
    const toggleSeat = (seatIndex) => {
        if (selectedBus.seats[seatIndex] === 'booked' || lockedSeats[seatIndex]) return;

        setSelectedSeats(prev => {
            const isSelected = prev.includes(seatIndex);
            if (isSelected) {
                // Deselecting is always allowed
                return prev.filter(s => s !== seatIndex);
            } else {
                // Selecting a new seat
                if (prev.length >= 5) {
                    showNotification("You can select a maximum of 5 seats.", "error");
                    return prev; // Return previous state without adding
                }
                return [...prev, seatIndex];
            }
        });
    };

    const handleProceedToPayment = () => {
        if (selectedSeats.length === 0) {
            showNotification("Please select at least one seat.");
            return;
        }
        // Lock seats before proceeding
        const expiry = Date.now() + SEAT_LOCK_DURATION * 1000;
        const newLockedSeats = { ...lockedSeats };
        selectedSeats.forEach(seat => {
            newLockedSeats[seat] = expiry;
        });
        setLockedSeats(newLockedSeats);
        setPage('payment');
    };
    
    const handlePayment = () => {
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

        const busIndexInMock = mockBuses.findIndex(b => b.id === selectedBus.id);
        if (busIndexInMock !== -1) {
             selectedSeats.forEach(seatIndex => {
                mockBuses[busIndexInMock].seats[seatIndex] = 'booked';
             });
        }
        showNotification("Booking Successful!", "success");
        setSelectedSeats([]); // Clear selected seats after booking
        setLockedSeats({}); // Clear all locks
        setPage('confirmation');
    };

    const handleStartTracking = (booking) => {
        setTrackingInfo(booking);
        setPage('liveTracking');
    };

    const renderPage = () => {
        const booking = bookings[bookings.length - 1];
        switch (page) {
            case 'login': return <Login onLogin={handleLogin} />;
            case 'home': return <Home searchQuery={searchQuery} setSearchQuery={setSearchQuery} onSearch={handleSearch} />;
            case 'busList': return <BusList buses={foundBuses} onSelectBus={handleSelectBus} onBack={() => setPage('home')} isLoading={isLoading} />;
            case 'seatSelection': return <SeatSelection bus={selectedBus} selectedSeats={selectedSeats} lockedSeats={lockedSeats} onToggleSeat={toggleSeat} onConfirm={handleProceedToPayment} onBack={() => setPage('busList')} showNotification={showNotification} />;
            case 'payment': return <PaymentPage booking={{ bus: selectedBus, seats: selectedSeats }} onConfirm={handlePayment} onBack={() => setPage('seatSelection')} lockedSeats={lockedSeats} setLockedSeats={setLockedSeats} setSelectedSeats={setSelectedSeats} showNotification={showNotification} />;
            case 'confirmation': return <BookingConfirmation booking={booking} onDone={() => { setPage('home'); setSelectedBus(null); }} />;
            case 'myBookings': return <MyBookings bookings={bookings.filter(b => b.user.email === user.email)} onBack={() => setPage('home')} onTrack={handleStartTracking} />;
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
            {!isLoginPage && <Footer/>}
        </div>
    );
}

// --- CORE PAGE & UI COMPONENTS ---

function Header({ user, onLogout, setPage, currentPage }) {
    return (
        <header className="bg-white/80 backdrop-blur-lg sticky top-0 z-40 shadow-sm">
            <nav className="container mx-auto px-4 md:px-6 py-3 flex justify-between items-center">
                <div className="flex items-center gap-2 cursor-pointer" onClick={() => user && setPage('home')}>
                    <ICONS.Bus className="text-indigo-600 h-8 w-8" />
                    <h1 className="text-3xl font-bold text-indigo-600 tracking-tighter">BusGo</h1>
                </div>
                {user && (
                    <div className="flex items-center gap-2 sm:gap-4">
                        <button onClick={() => setPage('myBookings')} className={`px-4 py-2 text-sm font-medium rounded-full transition-all duration-200 ${currentPage === 'myBookings' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-700 hover:bg-slate-200'}`}>
                            My Bookings
                        </button>
                        <button onClick={() => setPage('profile')} className="p-2 rounded-full text-slate-700 hover:bg-slate-200 transition-all duration-200">
                            <ICONS.UserCircle className="w-6 h-6" />
                        </button>
                        <button onClick={onLogout} className="px-4 py-2 text-sm font-medium text-white bg-rose-500 rounded-full hover:bg-rose-600 shadow-md transition-all duration-200">
                            Logout
                        </button>
                    </div>
                )}
            </nav>
        </header>
    );
}

function Footer() {
    return (
        <footer className="bg-slate-800 text-slate-300 mt-12">
            <div className="container mx-auto px-6 py-8 text-center">
                <div className="flex justify-center items-center gap-2">
                    <ICONS.Bus className="h-7 w-7"/>
                    <h2 className="text-2xl font-bold">BusGo</h2>
                </div>
                <p className="mt-4">Your journey, our priority. The easiest way to book bus tickets online.</p>
                <div className="mt-6 border-t border-slate-700 pt-6">
                    <p>&copy; {new Date().getFullYear()} BusGo. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}

function Login({ onLogin }) {
    const [username, setUsername] = useState('');
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        setIsLoaded(true);
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (username.trim()) onLogin(username.trim());
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-slate-100">
            <div className={`w-full max-w-4xl m-4 bg-white shadow-2xl rounded-2xl flex flex-col md:flex-row transition-all duration-1000 ease-in-out ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
                {/* Left Side - Visual */}
                <div className="relative w-full h-64 md:h-auto md:w-1/2 rounded-t-2xl md:rounded-l-2xl md:rounded-tr-none overflow-hidden">
                    <img
                        src={MyBus}
                        alt="View from a bus window on a scenic road"
                        className="object-cover w-full h-full"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent p-8 flex flex-col justify-end text-white">
                        <div className={`transform transition-all duration-700 ease-out ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                           <h2 className="text-4xl font-extrabold leading-tight">Your Journey Begins Here.</h2>
                           <p className="mt-2 text-slate-200">Reliable and comfortable travel is just a click away.</p>
                        </div>
                    </div>
                </div>

                {/* Right Side - Form */}
                <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
                   <div className={`transform transition-all duration-700 ease-out delay-200 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                        <div className="text-center md:text-left mb-8">
                            <div className="flex justify-center md:justify-start items-center mb-4 gap-2">
                                <ICONS.Bus className="h-8 w-8 text-indigo-600"/>
                                <h1 className="text-4xl font-bold text-indigo-600 tracking-tighter">BusGo</h1>
                            </div>
                            <h2 className="text-3xl font-bold text-slate-800">Sign In to Your Account</h2>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label htmlFor="username" className="mb-2 block text-sm font-bold text-slate-600">Full Name</label>
                                <input
                                    id="username"
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="w-full p-3 text-slate-800 bg-slate-100 border-2 border-transparent rounded-lg shadow-inner focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                    placeholder="e.g., Jane Doe"
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full py-3 font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                            >
                                Continue
                            </button>
                        </form>
                   </div>
                </div>
            </div>
        </div>
    );
}

function Home({ searchQuery, setSearchQuery, onSearch }) {
    const handleInputChange = (e) => setSearchQuery({ ...searchQuery, [e.target.name]: e.target.value });
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        setIsLoaded(true);
    }, []);

    return (
        <>
            <div className="rounded-2xl shadow-2xl overflow-hidden -mt-20">
                <div className="h-64 md:h-80 bg-cover bg-center relative" style={{backgroundImage: "url('https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')"}}>
                    <div className="absolute inset-0 bg-black/50 flex flex-col justify-center items-center text-white p-4 text-center">
                        <h2 className={`text-3xl md:text-5xl font-extrabold tracking-tight transition-all duration-700 ease-out ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-5'}`}>Your Next Adventure Awaits</h2>
                        <p className={`mt-2 md:text-lg text-slate-200 transition-all duration-700 ease-out delay-200 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-5'}`}>Find the perfect bus ride with just a few clicks.</p>
                    </div>
                </div>
                <div className="bg-white/80 backdrop-blur-md p-6 md:p-8">
                    <form onSubmit={onSearch} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                        <div className="md:col-span-4">
                            <label htmlFor="from" className="flex items-center text-sm font-medium text-slate-700 mb-1"><ICONS.MapPin className="w-4 h-4 mr-1"/> From</label>
                            <select id="from" name="from" value={searchQuery.from} onChange={handleInputChange} className="w-full p-3 border-2 border-slate-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500">
                                <option value="">Select Origin</option>
                                {CITIES.map(city => <option key={city} value={city}>{city}</option>)}
                            </select>
                        </div>
                         <div className="md:col-span-4">
                            <label htmlFor="to" className="flex items-center text-sm font-medium text-slate-700 mb-1"><ICONS.MapPin className="w-4 h-4 mr-1"/> To</label>
                            <select id="to" name="to" value={searchQuery.to} onChange={handleInputChange} className="w-full p-3 border-2 border-slate-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500">
                                <option value="">Select Destination</option>
                                {CITIES.filter(c => c !== searchQuery.from).map(city => <option key={city} value={city}>{city}</option>)}
                            </select>
                        </div>
                        <div className="md:col-span-2">
                            <label htmlFor="date" className="flex items-center text-sm font-medium text-slate-700 mb-1"><ICONS.Calendar className="w-4 h-4 mr-1"/> Date</label>
                            <input type="date" id="date" name="date" value={searchQuery.date} min={new Date().toISOString().split('T')[0]} onChange={handleInputChange} className="w-full p-3 border-2 border-slate-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"/>
                        </div>
                        <button type="submit" className="md:col-span-2 w-full py-3 font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5">
                            Search Buses
                        </button>
                    </form>
                </div>
            </div>
            <FeaturedDestinations />
            <WhyChooseUs />
            <Testimonials />
        </>
    );
}

function FeaturedDestinations() {
    const destinations = [
        { from: 'Ahmedabad', to: 'Mumbai', img: Mumbaiimg },
        { from: 'Delhi', to: 'Jaipur', img: Jaipurimg },
        { from: 'Mumbai', to: 'Pune', img: puneimg },
        { from: 'Bangalore', to: 'Chennai', img: chennaiimg },
    ];
    return (
        <div className="mt-16">
            <h2 className="text-3xl font-extrabold text-slate-800 text-center">Featured Destinations</h2>
            <p className="mt-2 text-slate-600 max-w-2xl mx-auto text-center">Explore popular routes and book your next trip with ease.</p>
            <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {destinations.map( (place, index) => (
                    <div key={`${place.from}-${place.to}`} className="relative rounded-xl overflow-hidden shadow-lg group transform hover:-translate-y-2 transition-transform duration-300">
                        <img src={place.img} alt={`${place.from} to ${place.to}`} className="w-full h-72 object-cover group-hover:scale-110 transition-transform duration-500" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                        <div className="absolute bottom-0 left-0 p-4 text-white">
                            <h3 className="text-xl font-bold">{place.from} to {place.to}</h3>
                            <button className="mt-2 text-sm font-semibold bg-indigo-500 px-3 py-1 rounded-full hover:bg-indigo-400 transition-colors">Book Now</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function Testimonials() {
    const reviews = [
        { name: 'Priya Sharma', location: 'Mumbai', rating: 5, review: "Booking with BusGo was a breeze! The app is so user-friendly and I found the perfect bus in minutes. Highly recommended!" },
        { name: 'Amit Singh', location: 'Delhi', rating: 4, review: "Great service and comfortable journey. The live tracking feature is a game-changer. Will definitely use BusGo again." },
        { name: 'Sunita Patel', location: 'Ahmedabad', rating: 5, review: "I was impressed with the variety of options and the competitive prices. The customer support was also very helpful." },
    ];
    return (
        <div className="mt-16">
            <h2 className="text-3xl font-extrabold text-slate-800 text-center">What Our Customers Say</h2>
            <p className="mt-2 text-slate-600 max-w-2xl mx-auto text-center">We pride ourselves on providing an exceptional travel experience.</p>
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
                {reviews.map(r => (
                     <div key={r.name} className="bg-white p-8 rounded-2xl shadow-lg">
                        <ICONS.Quote className="w-10 h-10 text-indigo-200" />
                        <p className="mt-4 text-slate-600 italic">"{r.review}"</p>
                        <div className="mt-6 border-t pt-4">
                            <h4 className="font-bold text-slate-900">{r.name}</h4>
                            <p className="text-sm text-slate-500">{r.location}</p>
                            <div className="mt-2"><StarRating rating={r.rating} /></div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function WhyChooseUs() {
    const features = [
        { icon: <ICONS.Ticket className="w-12 h-12 text-indigo-500"/>, title: 'Easy Booking', description: 'Search, select, and book your tickets in just a few clicks. Our process is simple and fast.' },
        { icon: <ICONS.Tag className="w-12 h-12 text-indigo-500"/>, title: 'Best Prices', description: 'We guarantee the best prices for your bus tickets, with no hidden fees or extra charges.' },
        { icon: <ICONS.Headset className="w-12 h-12 text-indigo-500"/>, title: '24/7 Support', description: 'Our dedicated support team is available around the clock to assist you with any queries.' },
    ];
    
    return (
        <div className="mt-16 text-center">
            <h2 className="text-3xl font-extrabold text-slate-800">Why Travel With BusGo?</h2>
            <p className="mt-2 text-slate-600 max-w-2xl mx-auto">We are committed to making your bus travel experience comfortable, affordable, and hassle-free.</p>
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
                {features.map(feature => (
                    <div key={feature.title} className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
                        <div className="flex justify-center mb-4">{feature.icon}</div>
                        <h3 className="text-xl font-bold text-slate-900">{feature.title}</h3>
                        <p className="mt-2 text-slate-500">{feature.description}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

function BusList({ buses, onSelectBus, onBack, isLoading }) {
    const [filters, setFilters] = useState({ type: 'all', time: 'all' });
    const [sortBy, setSortBy] = useState('price');

    const filteredAndSortedBuses = useMemo(() => {
        return buses
            .filter(bus => {
                if (filters.type !== 'all' && !bus.type.toLowerCase().includes(filters.type)) return false;
                if (filters.time !== 'all') {
                    const hour = parseInt(bus.departure.split(':')[0]);
                    if (filters.time === 'morning' && (hour < 6 || hour >= 12)) return false;
                    if (filters.time === 'afternoon' && (hour < 12 || hour >= 18)) return false;
                    if (filters.time === 'evening' && (hour < 18)) return false;
                }
                return true;
            })
            .sort((a, b) => {
                if (sortBy === 'price') return a.price - b.price;
                if (sortBy === 'rating') return b.rating - a.rating;
                if (sortBy === 'duration') return parseInt(a.duration) - parseInt(b.duration);
                return 0;
            });
    }, [buses, filters, sortBy]);

    if (isLoading) return <SkeletonLoader />;

    if (buses.length === 0) {
        return (
            <div className="text-center bg-white p-12 rounded-2xl shadow-lg">
                 <h2 className="text-3xl font-bold mb-4 text-slate-800">No Buses Found</h2>
                 <p className="text-slate-600 mb-8">Sorry, we couldn't find any buses for this route. Try changing your search.</p>
                 <button onClick={onBack} className="px-6 py-3 font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 shadow-md transition-all">
                    Modify Search
                </button>
            </div>
        );
    }
    
    return (
        <div className="flex flex-col md:flex-row gap-8">
            {/* Filters */}
            <aside className="md:w-1/4">
                <div className="bg-white p-6 rounded-xl shadow-lg sticky top-24">
                    <h3 className="text-xl font-bold mb-4 border-b pb-2">Filter & Sort</h3>
                    <div className="mb-6">
                        <label className="font-semibold block mb-2">Bus Type</label>
                        <select onChange={(e) => setFilters({...filters, type: e.target.value})} className="w-full p-2 border rounded-md">
                            <option value="all">All</option>
                            <option value="a/c">A/C</option>
                            <option value="sleeper">Sleeper</option>
                        </select>
                    </div>
                    <div className="mb-6">
                        <label className="font-semibold block mb-2">Departure Time</label>
                        <select onChange={(e) => setFilters({...filters, time: e.target.value})} className="w-full p-2 border rounded-md">
                            <option value="all">Anytime</option>
                            <option value="morning">Morning (6am-12pm)</option>
                            <option value="afternoon">Afternoon (12pm-6pm)</option>
                            <option value="evening">Evening (6pm onwards)</option>
                        </select>
                    </div>
                    <div>
                        <label className="font-semibold block mb-2">Sort By</label>
                        <select onChange={(e) => setSortBy(e.target.value)} className="w-full p-2 border rounded-md">
                            <option value="price">Price (Low to High)</option>
                            <option value="rating">Rating (High to Low)</option>
                            <option value="duration">Duration (Shortest)</option>
                        </select>
                    </div>
                </div>
            </aside>

            {/* Bus Listings */}
            <main className="md:w-3/4">
                 <button onClick={onBack} className="mb-6 flex items-center text-indigo-600 font-semibold hover:text-indigo-800">
                   <ICONS.ChevronLeft className="h-5 w-5"/>
                    Modify Search
                </button>
                <h2 className="text-3xl font-bold mb-4">Available Buses ({filteredAndSortedBuses.length})</h2>
                <div className="space-y-5">
                    {filteredAndSortedBuses.map(bus => (
                        <div key={bus.id} className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
                            <div className="p-5 flex flex-col md:flex-row justify-between items-center gap-4">
                               <div className="flex-grow w-full">
                                   <div className="flex justify-between items-start">
                                       <div>
                                           <h3 className="text-xl font-bold text-slate-800">{bus.name}</h3>
                                           <p className="text-sm text-slate-500">{bus.type}</p>
                                       </div>
                                       <StarRating rating={bus.rating} />
                                   </div>
                                    <div className="mt-4 flex items-center justify-between text-center">
                                        <div>
                                            <p className="text-lg font-semibold text-slate-700">{bus.departure}</p>
                                            <p className="text-sm text-slate-500">{bus.from}</p>
                                        </div>
                                        <div className="flex-grow text-center text-slate-400 px-2">
                                            <p className="text-xs">{bus.duration}</p>
                                            <div className="w-full h-0.5 bg-slate-200 relative my-1">
                                                <div className="absolute left-0 top-1/2 w-2 h-2 rounded-full bg-slate-400 -translate-y-1/2"></div>
                                                <div className="absolute right-0 top-1/2 w-2 h-2 rounded-full bg-slate-400 -translate-y-1/2"></div>
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-lg font-semibold text-slate-700">{bus.arrival}</p>
                                            <p className="text-sm text-slate-500">{bus.to}</p>
                                        </div>
                                    </div>
                                    <div className="mt-4 flex items-center gap-4 border-t pt-3">
                                        <span className="text-sm font-semibold text-slate-600">Amenities:</span>
                                        {bus.amenities.map(a => <AmenityIcon key={a} name={a} />)}
                                    </div>
                               </div>
                               <div className="md:border-l md:pl-5 w-full md:w-auto text-center md:text-right flex-shrink-0">
                                   <p className="text-3xl font-bold text-indigo-600">₹{bus.price}</p>
                                   <p className="text-sm text-slate-500">per seat</p>
                                   <button onClick={() => onSelectBus(bus)} className="mt-3 w-full md:w-auto px-6 py-2 font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 shadow-md transition-all">
                                       Select Seats
                                   </button>
                               </div>
                            </div>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
}

function SeatSelection({ bus, selectedSeats, onToggleSeat, onConfirm, onBack, lockedSeats, showNotification }) {
    const totalPrice = selectedSeats.length * bus.price;
    const seatLockTimerRef = useRef(null);
    const [timer, setTimer] = useState(0);

    useEffect(() => {
        if (selectedSeats.length > 0) {
            if (!seatLockTimerRef.current) {
                // Start a new timer only if one isn't running
                setTimer(SEAT_LOCK_DURATION);
                showNotification(`Seats will be held for 5 minutes.`, 'info');
            }
        } else {
            // Clear timer if all seats are deselected
            setTimer(0);
            clearInterval(seatLockTimerRef.current);
            seatLockTimerRef.current = null;
        }
    
        return () => {
            clearInterval(seatLockTimerRef.current);
        };
    }, [selectedSeats, showNotification]);

    useEffect(() => {
        if (timer > 0) {
            seatLockTimerRef.current = setInterval(() => {
                setTimer(prev => prev - 1);
            }, 1000);
        } else if (timer === 0 && selectedSeats.length > 0) {
            // Timer expired
            clearInterval(seatLockTimerRef.current);
            seatLockTimerRef.current = null;
            showNotification('Your selected seats have been released due to inactivity.', 'error');
            // Here you would also communicate with a backend to release the lock
        }
        return () => clearInterval(seatLockTimerRef.current);
    }, [timer, selectedSeats.length, showNotification]);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    };

    return (
        <div className="bg-white/80 backdrop-blur-md p-6 md:p-8 rounded-2xl shadow-2xl">
            <button onClick={onBack} className="mb-6 flex items-center text-indigo-600 font-semibold hover:text-indigo-800"><ICONS.ChevronLeft className="h-5 w-5"/> Back to Bus List</button>
            <h2 className="text-3xl font-bold mb-2">Select Your Seats</h2>
            <p className="text-slate-600 mb-6">For <span className="font-semibold text-indigo-600">{bus.name}</span></p>
            
            <div className="flex flex-col lg:flex-row gap-8">
                <div className="flex-grow p-4 border-2 border-slate-200 rounded-xl bg-slate-50">
                    <div className="flex justify-end mb-4">
                        <div className="w-16 h-10 border-2 border-slate-400 rounded-md flex items-center justify-center" title="Driver's Seat">
                           <ICONS.SteeringWheel className="w-6 h-6 text-slate-600" />
                        </div>
                    </div>
                    <div className="grid grid-cols-5 gap-2 sm:gap-3">
                        {bus.seats.map((status, index) => (
                            <div key={index} onClick={() => onToggleSeat(index)} className="flex justify-center">
                                <Seat status={selectedSeats.includes(index) ? 'selected' : (lockedSeats[index] ? 'locked' : status)} />
                            </div>
                        ))}
                    </div>
                </div>
                <div className="lg:w-2/5 xl:w-1/3">
                    <div className="bg-slate-50 border-2 border-slate-200 p-6 rounded-xl sticky top-24">
                        <h3 className="text-2xl font-bold mb-4 border-b pb-2">Booking Summary</h3>
                        <div className="space-y-3">
                            <div className="flex justify-between"><span>Bus:</span><span className="font-semibold">{bus.name}</span></div>
                            <div className="flex justify-between"><span>Seats:</span><span className="font-semibold">{selectedSeats.map(s => `S${s + 1}`).join(', ') || 'None'}</span></div>
                        </div>
                        <div className="border-t my-4"></div>
                        <div className="flex justify-between items-center text-2xl font-bold"><span>Total:</span><span className="text-indigo-600">₹{totalPrice}</span></div>
                        {timer > 0 && (
                             <div className="mt-4 text-center bg-yellow-100 border border-yellow-300 text-yellow-800 p-2 rounded-lg">
                                Seats held for: <span className="font-bold">{formatTime(timer)}</span>
                            </div>
                        )}
                        <div className="mt-6 flex justify-around items-center text-xs sm:text-sm">
                            <div className="flex items-center gap-2"><Seat status="available" /> Available</div>
                            <div className="flex items-center gap-2"><Seat status="selected" /> Selected</div>
                            <div className="flex items-center gap-2"><Seat status="booked" /> Booked</div>
                        </div>
                        <button onClick={onConfirm} disabled={selectedSeats.length === 0 || timer === 0} className="mt-6 w-full py-3 font-semibold text-white bg-indigo-600 rounded-lg shadow-md hover:bg-indigo-700 disabled:bg-slate-400 disabled:cursor-not-allowed transition-all">
                            Proceed to Payment
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

function PaymentPage({ booking, onConfirm, onBack, lockedSeats, setLockedSeats, setSelectedSeats, showNotification }) {
    const totalPrice = booking.seats.length * booking.bus.price;
    const paymentTimerRef = useRef(null);
    const [paymentMethod, setPaymentMethod] = useState('card');
    
    // Find the earliest expiry time for the locked seats
    const expiryTime = useMemo(() => {
        const expiries = booking.seats.map(s => lockedSeats[s]).filter(Boolean);
        return expiries.length > 0 ? Math.min(...expiries) : Date.now();
    }, [booking.seats, lockedSeats]);

    const [timeLeft, setTimeLeft] = useState(Math.max(0, Math.floor((expiryTime - Date.now()) / 1000)));

    useEffect(() => {
        paymentTimerRef.current = setInterval(() => {
            const remaining = Math.max(0, Math.floor((expiryTime - Date.now()) / 1000));
            setTimeLeft(remaining);
            if (remaining === 0) {
                clearInterval(paymentTimerRef.current);
                showNotification('Time expired! Your seats have been released.', 'error');
                // Clean up locked seats that belong to this booking
                const newLockedSeats = { ...lockedSeats };
                booking.seats.forEach(seat => delete newLockedSeats[seat]);
                setLockedSeats(newLockedSeats);
                setSelectedSeats([]);
                onBack(); // Go back to seat selection
            }
        }, 1000);

        return () => clearInterval(paymentTimerRef.current);
    }, [expiryTime, onBack, showNotification, lockedSeats, booking.seats, setLockedSeats, setSelectedSeats]);

    const formatTime = (seconds) => `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;
    
    const PaymentMethodButton = ({ method, Icon, children }) => (
        <button
            type="button"
            onClick={() => setPaymentMethod(method)}
            className={`flex-1 p-3 flex items-center justify-center gap-2 font-semibold rounded-t-lg transition-all ${paymentMethod === method ? 'bg-white text-indigo-600 border-b-2 border-indigo-600' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
        >
            <Icon className="w-5 h-5" />
            {children}
        </button>
    );

    return (
        <div className="max-w-4xl mx-auto bg-white/80 backdrop-blur-md p-8 rounded-2xl shadow-2xl">
            <button onClick={onBack} className="mb-6 flex items-center text-indigo-600 font-semibold hover:text-indigo-800"><ICONS.ChevronLeft className="h-5 w-5"/> Back to Seat Selection</button>
            <div className="flex flex-col md:flex-row gap-8">
                {/* Payment Form */}
                <div className="md:w-3/5">
                    <h2 className="text-3xl font-bold mb-2">Confirm and Pay</h2>
                    <div className="mb-6 bg-yellow-100 text-yellow-800 p-3 rounded-lg text-center">
                        Time left to complete payment: <span className="font-bold">{formatTime(timeLeft)}</span>
                    </div>
                    
                    {/* Payment Method Tabs */}
                    <div className="flex border-b">
                        <PaymentMethodButton method="card" Icon={ICONS.CreditCard}>Card</PaymentMethodButton>
                        <PaymentMethodButton method="upi" Icon={ICONS.UPI}>UPI</PaymentMethodButton>
                        <PaymentMethodButton method="netbanking" Icon={ICONS.Bank}>Net Banking</PaymentMethodButton>
                    </div>

                    <form onSubmit={(e) => { e.preventDefault(); onConfirm(); }} className="space-y-4 pt-6 bg-white p-6 rounded-b-lg">
                        {paymentMethod === 'card' && (
                            <>
                                <div>
                                    <label className="font-semibold">Card Number</label>
                                    <input type="text" placeholder="1234 5678 9012 3456" className="w-full p-3 mt-1 border-2 rounded-lg" required />
                                </div>
                                <div>
                                    <label className="font-semibold">Card Holder Name</label>
                                    <input type="text" placeholder="Jane Doe" className="w-full p-3 mt-1 border-2 rounded-lg" required />
                                </div>
                                <div className="flex gap-4">
                                    <div className="w-1/2">
                                        <label className="font-semibold">Expiry Date</label>
                                        <input type="text" placeholder="MM/YY" className="w-full p-3 mt-1 border-2 rounded-lg" required />
                                    </div>
                                    <div className="w-1/2">
                                        <label className="font-semibold">CVV</label>
                                        <input type="text" placeholder="123" className="w-full p-3 mt-1 border-2 rounded-lg" required />
                                    </div>
                                </div>
                            </>
                        )}

                        {paymentMethod === 'upi' && (
                            <div className="text-center">
                                <p className="font-semibold mb-2">Scan QR Code or Enter UPI ID</p>
                                <img src="https://placehold.co/200x200/e0e0e0/000000?text=QR+Code" alt="UPI QR Code" className="mx-auto rounded-lg"/>
                                <div className="my-4">
                                    <label className="font-semibold">UPI ID</label>
                                    <input type="text" placeholder="yourname@bank" className="w-full p-3 mt-1 border-2 rounded-lg text-center" />
                                </div>
                            </div>
                        )}
                        
                        {paymentMethod === 'netbanking' && (
                            <div>
                                <label className="font-semibold">Select Your Bank</label>
                                <select className="w-full p-3 mt-1 border-2 rounded-lg">
                                    <option>State Bank of India</option>
                                    <option>HDFC Bank</option>
                                    <option>ICICI Bank</option>
                                    <option>Axis Bank</option>
                                </select>
                                <p className="text-sm text-slate-500 mt-2">You will be redirected to your bank's website to complete the payment.</p>
                            </div>
                        )}

                        <button type="submit" className="w-full py-3 mt-4 font-semibold text-white bg-green-500 rounded-lg shadow-md hover:bg-green-600 transition-all">
                            Pay ₹{totalPrice} Securely
                        </button>
                    </form>
                </div>
                {/* Order Summary */}
                <div className="md:w-2/5 bg-slate-50 p-6 rounded-xl border-2 self-start">
                    <h3 className="text-xl font-bold mb-4 border-b pb-2">Order Summary</h3>
                    <div className="space-y-2 text-slate-700">
                        <p><strong>Bus:</strong> {booking.bus.name}</p>
                        <p><strong>Route:</strong> {booking.bus.from} to {booking.bus.to}</p>
                        <p><strong>Seats:</strong> {booking.seats.map(s => `S${s + 1}`).join(', ')}</p>
                        <p className="mt-4 pt-4 border-t text-2xl font-bold flex justify-between"><span>Total:</span> <span className="text-indigo-600">₹{totalPrice}</span></p>
                    </div>
                </div>
            </div>
        </div>
    );
}

function BookingConfirmation({ booking, onDone }) {
    if (!booking) return <div className="text-center p-8">Loading booking details...</div>;

    const handlePrint = () => {
        window.print();
    }

    return (
        <>
            <style>
                {`
                    @media print {
                        body * { visibility: hidden; }
                        .printable-ticket, .printable-ticket * { visibility: visible; }
                        .printable-ticket { position: absolute; left: 0; top: 0; width: 100%; }
                        .no-print { display: none; }
                    }
                `}
            </style>
            <div className="max-w-3xl mx-auto text-center">
                 <div className="bg-white p-8 rounded-2xl shadow-2xl printable-ticket">
                    <ICONS.CheckCircle className="h-24 w-24 text-green-500 mx-auto animate-pulse no-print"/>
                    <h2 className="text-4xl font-extrabold text-slate-800 mt-4">Booking Confirmed!</h2>
                    <p className="text-slate-600 mt-2">Your e-ticket is ready. Have a wonderful journey!</p>

                    <div className="mt-8 text-left bg-slate-50 p-6 rounded-xl border-2 border-dashed space-y-3">
                        <h3 className="text-2xl font-bold text-center mb-4">E-Ticket</h3>
                        <p><strong>Booking ID:</strong> <span className="font-mono">{booking.id}</span></p>
                        <p><strong>Passenger:</strong> {booking.user.name}</p>
                        <p><strong>Bus:</strong> {booking.bus.name} ({booking.bus.type})</p>
                        <p><strong>Route:</strong> {booking.bus.from} ({booking.bus.departure}) to {booking.bus.to} ({booking.bus.arrival})</p>
                        <p><strong>Date:</strong> {new Date(booking.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                        <p><strong>Seats:</strong> <span className="font-bold text-xl text-indigo-600">{booking.seats.map(s => `S${s + 1}`).join(', ')}</span></p>
                        <p className="text-3xl font-bold mt-4 pt-4 border-t text-right"><strong>Total Fare:</strong> ₹{booking.totalPrice}</p>
                    </div>
                    <div className="mt-8 flex gap-4 no-print">
                        <button onClick={onDone} className="w-full py-3 font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 shadow-md">
                            Book Another Ticket
                        </button>
                        <button onClick={handlePrint} className="w-full py-3 font-semibold text-indigo-600 bg-slate-200 rounded-lg hover:bg-slate-300 shadow-md">
                            Print Ticket
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}

function MyBookings({ bookings, onBack, onTrack }) {
    const today = new Date().toISOString().split('T')[0];

    const upcomingBookings = bookings.filter(b => b.date >= today);
    const pastBookings = bookings.filter(b => b.date < today);

    const WeatherWidget = ({ city }) => {
        const mockWeather = {
            'Mumbai': { temp: '31°C', condition: 'Sunny' },
            'Delhi': { temp: '34°C', condition: 'Sunny' },
            'Pune': { temp: '28°C', condition: 'Cloudy' },
            'Jaipur': { temp: '36°C', condition: 'Sunny' },
            'Surat': { temp: '32°C', condition: 'Sunny' },
            'Ahmedabad': { temp: '35°C', condition: 'Sunny' },
            'Bangalore': { temp: '27°C', condition: 'Cloudy' },
            'Chennai': { temp: '33°C', condition: 'Sunny' },
        };
        const weather = mockWeather[city] || { temp: 'N/A', condition: 'N/A' };
        const Icon = weather.condition === 'Sunny' ? ICONS.Sun : ICONS.Cloud;

        return (
            <div className="flex items-center gap-2 bg-blue-50 text-blue-800 px-3 py-1 rounded-full text-sm">
                <Icon className="w-5 h-5" />
                <span>{weather.temp}, {weather.condition}</span>
            </div>
        );
    };

     return (
        <div className="max-w-4xl mx-auto">
            <button onClick={onBack} className="mb-6 flex items-center text-indigo-600 font-semibold hover:text-indigo-800"><ICONS.ChevronLeft className="h-5 w-5"/> Back to Home</button>
             <h2 className="text-4xl font-extrabold text-slate-800 mb-6">My Bookings</h2>
             
             {bookings.length === 0 ? (
                 <div className="text-center bg-white p-12 rounded-2xl shadow-lg">
                     <p className="text-slate-600 text-lg">You have no bookings yet. Time for a new adventure!</p>
                 </div>
             ) : (
                <>
                    <h3 className="text-2xl font-bold text-slate-700 mb-4">Upcoming Trips</h3>
                    {upcomingBookings.length > 0 ? (
                        <div className="space-y-6">
                            {upcomingBookings.slice().reverse().map(booking => (
                                <div key={booking.id} className="bg-white p-6 rounded-2xl shadow-lg">
                                    <div className="flex flex-col sm:flex-row justify-between sm:items-center border-b pb-4 mb-4">
                                       <div>
                                           <h3 className="text-2xl font-bold text-indigo-600">{booking.bus.name}</h3>
                                           <p className="text-sm text-slate-500 font-mono">ID: {booking.id}</p>
                                       </div>
                                        <div className="mt-2 sm:mt-0 text-left sm:text-right">
                                            <p className="text-xl font-semibold text-slate-800">₹{booking.totalPrice}</p>
                                            <span className="px-3 py-1 text-xs font-semibold text-green-800 bg-green-100 rounded-full inline-block mt-1">CONFIRMED</span>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-slate-700 mb-4">
                                        <p><strong>Route:</strong> {booking.bus.from} &rarr; {booking.bus.to}</p>
                                        <p><strong>Date:</strong> {new Date(booking.date).toLocaleDateString('en-GB', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                                        <p><strong>Departure:</strong> {booking.bus.departure}</p>
                                        <p><strong>Seats:</strong> <span className="font-bold text-indigo-700">{booking.seats.map(s => `S${s + 1}`).join(', ')}</span></p>
                                    </div>
                                    <div className="border-t pt-4 flex justify-between items-center">
                                        <WeatherWidget city={booking.bus.to} />
                                        <button onClick={() => onTrack(booking)} className="px-4 py-2 font-semibold text-white bg-blue-500 rounded-lg hover:bg-blue-600 shadow-md">Track Bus</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : <p className="text-slate-500 bg-white p-6 rounded-2xl shadow">No upcoming trips.</p>}

                    <h3 className="text-2xl font-bold text-slate-700 mt-12 mb-4">Past Trips</h3>
                    {pastBookings.length > 0 ? (
                        <div className="space-y-6">
                            {pastBookings.slice().reverse().map(booking => (
                                <div key={booking.id} className="bg-white p-6 rounded-2xl shadow-lg opacity-70">
                                   <div className="flex flex-col sm:flex-row justify-between sm:items-center">
                                      <div>
                                          <h3 className="text-xl font-bold text-slate-600">{booking.bus.name}</h3>
                                          <p className="text-sm text-slate-500">{new Date(booking.date).toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                                      </div>
                                       <p className="text-lg font-semibold text-slate-500">₹{booking.totalPrice}</p>
                                   </div>
                                </div>
                            ))}
                        </div>
                     ) : <p className="text-slate-500 bg-white p-6 rounded-2xl shadow">No past trips.</p>}
                </>
             )}
         </div>
     );
}

function ProfilePage({ user, bookings, onBack }) {
    const totalSpent = bookings.reduce((sum, b) => sum + b.totalPrice, 0);
    const totalTrips = bookings.length;

    return (
        <div className="max-w-2xl mx-auto">
             <button onClick={onBack} className="mb-6 flex items-center text-indigo-600 font-semibold hover:text-indigo-800"><ICONS.ChevronLeft className="h-5 w-5"/> Back to Home</button>
             <div className="bg-white p-8 rounded-2xl shadow-2xl text-center">
                 <ICONS.UserCircle className="w-24 h-24 mx-auto text-indigo-500" />
                 <h2 className="text-3xl font-bold mt-4">{user.name}</h2>
                 <p className="text-slate-500">{user.email}</p>
                 <div className="mt-8 grid grid-cols-2 gap-4 text-left">
                     <div className="bg-slate-100 p-4 rounded-lg">
                         <h3 className="font-bold text-slate-600">Total Trips</h3>
                         <p className="text-2xl font-extrabold text-indigo-600">{totalTrips}</p>
                     </div>
                     <div className="bg-slate-100 p-4 rounded-lg">
                         <h3 className="font-bold text-slate-600">Total Spent</h3>
                         <p className="text-2xl font-extrabold text-indigo-600">₹{totalSpent.toLocaleString('en-IN')}</p>
                     </div>
                 </div>
             </div>
        </div>
    );
}

function LiveTrackingPage({ booking, onBack }) {
    const [progress, setProgress] = useState(0); // 0 to 100
    const [status, setStatus] = useState("On its way to pickup point");

    useEffect(() => {
        // Simulate bus movement
        const interval = setInterval(() => {
            setProgress(prev => {
                const newProgress = prev + 2;
                if (newProgress >= 100) {
                    setStatus(`Arrived at ${booking.bus.to}`);
                    clearInterval(interval);
                    return 100;
                }
                if (newProgress > 50 && prev <= 50) {
                    setStatus(`Crossed midpoint, approaching ${booking.bus.to}`);
                }
                return newProgress;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [booking]);

    return (
        <div className="max-w-4xl mx-auto">
            <button onClick={onBack} className="mb-6 flex items-center text-indigo-600 font-semibold hover:text-indigo-800"><ICONS.ChevronLeft className="h-5 w-5"/> Back to Bookings</button>
            <div className="bg-white p-8 rounded-2xl shadow-2xl">
                <h2 className="text-3xl font-bold text-center mb-2">Live Bus Tracking</h2>
                <p className="text-slate-600 text-center mb-8">Bus: <span className="font-semibold">{booking.bus.name}</span></p>

                {/* Map Visualization */}
                <div className="relative p-8">
                    <div className="h-2 bg-slate-200 rounded-full"></div>
                    <div className="absolute top-1/2 left-0 -translate-y-1/2 flex items-center flex-col">
                        <div className="w-5 h-5 bg-green-500 rounded-full border-4 border-white"></div>
                        <span className="text-sm font-semibold mt-2">{booking.bus.from}</span>
                    </div>
                    <div className="absolute top-1/2 right-0 -translate-y-1/2 flex items-center flex-col">
                        <ICONS.MapPin className="w-6 h-6 text-red-500"/>
                        <span className="text-sm font-semibold mt-1">{booking.bus.to}</span>
                    </div>
                    {/* Bus Icon */}
                    <div className="absolute top-1/2 -translate-y-1/2 transition-all duration-1000 ease-linear" style={{ left: `calc(${progress}% - 12px)` }}>
                         <ICONS.Bus className="w-8 h-8 text-indigo-600 -mt-8" />
                    </div>
                </div>

                {/* Progress Bar & Status */}
                <div className="mt-8">
                     <div className="w-full bg-gray-200 rounded-full h-4">
                        <div className="bg-indigo-600 h-4 rounded-full transition-all duration-1000 ease-linear" style={{ width: `${progress}%` }}></div>
                    </div>
                    <div className="mt-4 text-center">
                        <p className="font-semibold text-lg">{status}</p>
                        <p className="text-slate-500">Estimated Arrival: <span className="font-bold">{booking.bus.arrival}</span></p>
                    </div>
                </div>
            </div>
        </div>
    );
}

