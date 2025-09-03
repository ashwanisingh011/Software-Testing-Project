import React, { useState, useEffect } from 'react';

// --- Helper Components ---

// Icon for a bus
const BusIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 h-6 w-6 text-indigo-500">
        <path d="M8 6v6"></path>
        <path d="M15 6v6"></path>
        <path d="M2 12h19.6"></path>
        <path d="M18 18h3s.5-1.7.8-2.8c.1-.4.2-.8.2-1.2 0-.4-.1-.8-.2-1.2l-1.4-5C20.1 6.8 19.1 6 18 6H4a2 2 0 0 0-2 2v10h3"></path>
        <circle cx="7" cy="18" r="2"></circle>
        <path d="M9 18h5"></path>
        <circle cx="16" cy="18" r="2"></circle>
    </svg>
);

// Icon for a seat
const SeatIcon = ({ status = 'available' }) => {
    const baseClasses = "w-8 h-8 rounded-md flex items-center justify-center font-semibold text-sm transition-colors duration-200";
    const statusClasses = {
        available: 'bg-gray-200 text-gray-600 hover:bg-indigo-500 hover:text-white cursor-pointer',
        selected: 'bg-indigo-600 text-white',
        booked: 'bg-red-400 text-white cursor-not-allowed',
    };
    return <div className={`${baseClasses} ${statusClasses[status]}`}></div>;
};

// --- Mock Data ---
const mockBuses = [
    { id: 1, name: 'Sleek Liner', from: 'Ahmedabad', to: 'Mumbai', departure: '08:00 AM', arrival: '08:00 PM', price: 1200, type: 'A/C Sleeper', rating: 4.5, seats: Array(30).fill('available').map((s, i) => [4, 5, 10, 11, 21, 28].includes(i) ? 'booked' : s) },
    { id: 2, name: 'Express Way', from: 'Ahmedabad', to: 'Mumbai', departure: '10:30 AM', arrival: '10:00 PM', price: 950, type: 'Non A/C Seater', rating: 4.2, seats: Array(40).fill('available').map((s, i) => [2, 9, 15, 16, 25, 30, 31, 38].includes(i) ? 'booked' : s) },
    { id: 3, name: 'Comfort Travels', from: 'Ahmedabad', to: 'Delhi', departure: '06:00 PM', arrival: '12:00 PM', price: 1500, type: 'A/C Sleeper', rating: 4.8, seats: Array(30).fill('available').map((s, i) => [1, 8, 12, 19, 20, 22].includes(i) ? 'booked' : s) },
    { id: 4, name: 'Gujarat Express', from: 'Ahmedabad', to: 'Surat', departure: '07:00 AM', arrival: '12:00 PM', price: 500, type: 'A/C Seater', rating: 4.6, seats: Array(40).fill('available').map((s, i) => [3, 7, 14, 23, 24, 33, 35].includes(i) ? 'booked' : s) },
    { id: 5, name: 'Night Rider', from: 'Surat', to: 'Ahmedabad', departure: '11:00 PM', arrival: '04:00 AM', price: 550, type: 'A/C Sleeper', rating: 4.3, seats: Array(30).fill('available').map((s, i) => [0, 6, 13, 17, 26, 27].includes(i) ? 'booked' : s) },
    { id: 6, name: 'City Connect', from: 'Delhi', to: 'Ahmedabad', departure: '09:00 AM', arrival: '05:00 AM', price: 1600, type: 'Volvo A/C', rating: 4.9, seats: Array(45).fill('available').map((s, i) => [4, 11, 18, 29, 30, 31, 40, 42].includes(i) ? 'booked' : s) },
];

const CITIES = ['Ahmedabad', 'Mumbai', 'Delhi', 'Surat', 'Pune', 'Jaipur'];

// --- Main App Component ---
export default function App() {
    // --- State Management ---
    const [page, setPage] = useState('login'); // login, home, busList, seatSelection, confirmation, myBookings
    const [user, setUser] = useState(null);
    const [searchQuery, setSearchQuery] = useState({ from: 'Ahmedabad', to: '', date: new Date().toISOString().split('T')[0] });
    const [foundBuses, setFoundBuses] = useState([]);
    const [selectedBus, setSelectedBus] = useState(null);
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [bookings, setBookings] = useState([]);

    // --- Effects ---
    // Simulate checking if a user is already logged in
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
            alert("Please fill all fields.");
            return;
        }
        const results = mockBuses.filter(bus => bus.from === searchQuery.from && bus.to === searchQuery.to);
        setFoundBuses(results);
        setPage('busList');
    };
    
    const handleSelectBus = (bus) => {
        setSelectedBus(bus);
        setSelectedSeats([]);
        setPage('seatSelection');
    };
    
    const toggleSeat = (seatIndex) => {
        if (selectedBus.seats[seatIndex] === 'booked') return;

        setSelectedSeats(prev => 
            prev.includes(seatIndex) 
                ? prev.filter(s => s !== seatIndex) 
                : [...prev, seatIndex]
        );
    };

    const handleBooking = () => {
        if (selectedSeats.length === 0) {
            alert("Please select at least one seat.");
            return;
        }
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

        // Update the mock bus data to reflect booked seats for this session
        const busInMock = mockBuses.find(b => b.id === selectedBus.id);
        if(busInMock){
             selectedSeats.forEach(seatIndex => {
                busInMock.seats[seatIndex] = 'booked';
             });
        }
        
        setPage('confirmation');
    };

    // --- Render Logic ---
    const renderPage = () => {
        switch (page) {
            case 'login': return <Login onLogin={handleLogin} />;
            case 'home': return <Home searchQuery={searchQuery} setSearchQuery={setSearchQuery} onSearch={handleSearch} />;
            case 'busList': return <BusList buses={foundBuses} onSelectBus={handleSelectBus} onBack={() => setPage('home')} />;
            case 'seatSelection': return <SeatSelection bus={selectedBus} selectedSeats={selectedSeats} onToggleSeat={toggleSeat} onConfirm={handleBooking} onBack={() => setPage('busList')} />;
            case 'confirmation': return <BookingConfirmation booking={bookings[bookings.length - 1]} onDone={() => { setPage('home'); setSelectedSeats([]); setSelectedBus(null); }} />;
            case 'myBookings': return <MyBookings bookings={bookings.filter(b => b.user.email === user.email)} onBack={() => setPage('home')} />;
            default: return <Login onLogin={handleLogin} />;
        }
    };
    
    return (
        <div className="bg-gray-100 min-h-screen font-sans antialiased text-gray-800">
            <Header user={user} onLogout={handleLogout} setPage={setPage} currentPage={page} />
            <main className="container mx-auto p-4 md:p-8">
                {renderPage()}
            </main>
        </div>
    );
}

// --- Page Components ---

function Header({ user, onLogout, setPage, currentPage }) {
    return (
        <header className="bg-white shadow-md">
            <nav className="container mx-auto px-4 md:px-8 py-4 flex justify-between items-center">
                <div className="flex items-center cursor-pointer" onClick={() => user && setPage('home')}>
                    <BusIcon />
                    <h1 className="text-2xl font-bold text-indigo-600">BusGo</h1>
                </div>
                {user && (
                    <div className="flex items-center space-x-4">
                        <span className="hidden sm:inline">Welcome, <span className="font-semibold">{user.name}</span>!</span>
                         <button onClick={() => setPage('myBookings')} className={`px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${currentPage === 'myBookings' ? 'bg-indigo-600 text-white' : 'text-gray-700 hover:bg-gray-200'}`}>
                            My Bookings
                        </button>
                        <button onClick={onLogout} className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-md hover:bg-red-600">
                            Logout
                        </button>
                    </div>
                )}
            </nav>
        </header>
    );
}

function Login({ onLogin }) {
    const [username, setUsername] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (username.trim()) {
            onLogin(username.trim());
        }
    };

    return (
        <div className="flex items-center justify-center" style={{minHeight: 'calc(100vh - 200px)'}}>
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-xl shadow-lg">
                <div className="text-center">
                     <div className="flex justify-center items-center mb-4">
                        <BusIcon />
                        <h1 className="text-3xl font-bold text-indigo-600">BusGo</h1>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-700">Welcome Aboard!</h2>
                    <p className="mt-2 text-sm text-gray-600">Please enter your name to continue</p>
                </div>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="username" className="text-sm font-bold text-gray-600 block">Full Name</label>
                        <input
                            id="username"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full p-3 mt-1 text-gray-800 bg-gray-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="e.g., John Doe"
                            required
                        />
                    </div>
                    <button type="submit" className="w-full py-3 font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-700 transition-colors duration-300">
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
}

function Home({ searchQuery, setSearchQuery, onSearch }) {
    const handleInputChange = (e) => {
        setSearchQuery({ ...searchQuery, [e.target.name]: e.target.value });
    };

    const swapLocations = () => {
        setSearchQuery({ ...searchQuery, from: searchQuery.to, to: searchQuery.from });
    };

    return (
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-4xl mx-auto">
             <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-800 mb-2">Book Your Journey</h2>
             <p className="text-center text-gray-600 mb-8">Find the best buses at the best prices.</p>
            <form onSubmit={onSearch} className="grid grid-cols-1 md:grid-cols-10 gap-4 items-end">
                <div className="md:col-span-4">
                    <label htmlFor="from" className="block text-sm font-medium text-gray-700 mb-1">From</label>
                    <select id="from" name="from" value={searchQuery.from} onChange={handleInputChange} className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500">
                        <option value="">Select Origin</option>
                        {CITIES.map(city => <option key={city} value={city}>{city}</option>)}
                    </select>
                </div>

                <div className="md:col-span-1 flex justify-center items-center">
                    <button type="button" onClick={swapLocations} className="p-2 rounded-full bg-gray-200 text-gray-600 hover:bg-indigo-500 hover:text-white transition-colors duration-200 mt-4 md:mt-0">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><polyline points="19 12 12 19 5 12"></polyline></svg>
                    </button>
                </div>

                <div className="md:col-span-4">
                    <label htmlFor="to" className="block text-sm font-medium text-gray-700 mb-1">To</label>
                    <select id="to" name="to" value={searchQuery.to} onChange={handleInputChange} className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500">
                        <option value="">Select Destination</option>
                        {CITIES.filter(c => c !== searchQuery.from).map(city => <option key={city} value={city}>{city}</option>)}
                    </select>
                </div>
                
                <div className="md:col-span-5 md:col-start-3">
                    <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">Date of Journey</label>
                    <input type="date" id="date" name="date" value={searchQuery.date} onChange={handleInputChange} className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"/>
                </div>

                <button type="submit" className="md:col-span-2 md:col-start-5 w-full py-3 font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-700 transition-colors duration-300">
                    Search Buses
                </button>
            </form>
        </div>
    );
}

function BusList({ buses, onSelectBus, onBack }) {
    if (buses.length === 0) {
        return (
            <div className="text-center">
                 <h2 className="text-2xl font-bold mb-4">No Buses Found</h2>
                 <p className="text-gray-600 mb-6">Sorry, there are no buses available for this route on the selected date.</p>
                 <button onClick={onBack} className="px-6 py-2 font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-700">
                    Go Back
                </button>
            </div>
        );
    }
    return (
        <div>
            <button onClick={onBack} className="mb-6 flex items-center text-indigo-600 font-semibold hover:text-indigo-800">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Modify Search
            </button>
            <h2 className="text-2xl font-bold mb-4">Available Buses ({buses.length})</h2>
            <div className="space-y-4">
                {buses.map(bus => (
                    <div key={bus.id} className="bg-white p-4 rounded-lg shadow-md flex flex-col md:flex-row justify-between items-center transition-transform hover:scale-105 duration-300">
                        <div className="w-full md:w-3/4 flex flex-col sm:flex-row items-center text-center sm:text-left">
                            <div className="mb-4 sm:mb-0 sm:mr-6">
                                <BusIcon />
                            </div>
                            <div className="flex-grow">
                                <h3 className="text-xl font-bold text-gray-800">{bus.name}</h3>
                                <p className="text-sm text-gray-500">{bus.type}</p>
                                <div className="flex items-center justify-center sm:justify-start mt-1">
                                    <span className="text-yellow-500">★</span>
                                    <span className="font-bold ml-1">{bus.rating}</span>
                                </div>
                            </div>
                            <div className="flex justify-around w-full mt-4 sm:mt-0 sm:w-auto sm:space-x-8">
                                <div>
                                    <p className="text-lg font-semibold">{bus.departure}</p>
                                    <p className="text-sm text-gray-500">{bus.from}</p>
                                </div>
                                <div className="text-gray-400 self-center">-&gt;</div>
                                <div>
                                    <p className="text-lg font-semibold">{bus.arrival}</p>
                                    <p className="text-sm text-gray-500">{bus.to}</p>
                                </div>
                            </div>
                        </div>

                        <div className="w-full mt-4 md:mt-0 md:w-1/4 md:text-right border-t md:border-t-0 md:border-l pl-0 md:pl-6 pt-4 md:pt-0">
                            <p className="text-2xl font-bold text-indigo-600">₹ {bus.price}</p>
                            <p className="text-sm text-gray-500">per seat</p>
                            <button onClick={() => onSelectBus(bus)} className="mt-2 w-full md:w-auto px-4 py-2 font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-700">
                                Select Seats
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function SeatSelection({ bus, selectedSeats, onToggleSeat, onConfirm, onBack }) {
    const totalPrice = selectedSeats.length * bus.price;
    
    return (
        <div className="bg-white p-8 rounded-xl shadow-lg">
             <button onClick={onBack} className="mb-6 flex items-center text-indigo-600 font-semibold hover:text-indigo-800">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Back to Bus List
            </button>
            <h2 className="text-2xl font-bold mb-4">Select Your Seats for <span className="text-indigo-600">{bus.name}</span></h2>
            
            <div className="flex flex-col lg:flex-row gap-8">
                {/* Seat Map */}
                <div className="flex-grow p-4 border rounded-lg bg-gray-50">
                     <div className="mb-4 flex justify-end">
                        <div className="w-16 h-10 border-2 border-gray-400 rounded-md flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 11c0 3.517-1.009 6.789-2.731 9.546l-2.093-2.093c.12-1.29.355-2.583.743-3.838A8.963 8.963 0 0112 11z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 11c0-4.418 3.582-8 8-8s8 3.582 8 8-3.582 8-8 8" /></svg>
                        </div>
                    </div>
                    <div className="grid grid-cols-5 gap-2">
                        {bus.seats.map((status, index) => (
                            <div key={index} onClick={() => onToggleSeat(index)}>
                                <SeatIcon status={selectedSeats.includes(index) ? 'selected' : status} />
                            </div>
                        ))}
                    </div>
                </div>
                {/* Booking Summary */}
                <div className="lg:w-1/3">
                    <h3 className="text-xl font-bold mb-4">Booking Summary</h3>
                     <div className="space-y-3 p-4 border rounded-lg bg-gray-50">
                        <div className="flex justify-between">
                            <span>Bus:</span>
                            <span className="font-semibold">{bus.name}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Seat(s):</span>
                            <span className="font-semibold">{selectedSeats.map(s => s + 1).join(', ') || 'None'}</span>
                        </div>
                        <div className="border-t my-2"></div>
                         <div className="flex justify-between text-xl font-bold">
                            <span>Total Price:</span>
                            <span className="text-indigo-600">₹ {totalPrice}</span>
                        </div>
                    </div>
                    <div className="mt-6 flex justify-around items-center">
                        <div className="flex items-center"><SeatIcon status="available" /> <span className="ml-2 text-sm">Available</span></div>
                        <div className="flex items-center"><SeatIcon status="selected" /> <span className="ml-2 text-sm">Selected</span></div>
                        <div className="flex items-center"><SeatIcon status="booked" /> <span className="ml-2 text-sm">Booked</span></div>
                    </div>
                    <button 
                        onClick={onConfirm}
                        disabled={selectedSeats.length === 0}
                        className="mt-6 w-full py-3 font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed">
                        Confirm Booking
                    </button>
                </div>
            </div>
        </div>
    );
}

function BookingConfirmation({ booking, onDone }) {
    return (
        <div className="max-w-2xl mx-auto text-center">
             <div className="bg-white p-8 rounded-xl shadow-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 text-green-500 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h2 className="text-3xl font-bold text-gray-800 mt-4">Booking Confirmed!</h2>
                <p className="text-gray-600 mt-2">Your ticket has been successfully booked. Happy Journey!</p>

                <div className="mt-8 text-left border-t pt-6 space-y-4">
                    <h3 className="text-xl font-semibold text-center mb-4">E-Ticket</h3>
                    <p><strong>Booking ID:</strong> {booking.id}</p>
                    <p><strong>Passenger:</strong> {booking.user.name}</p>
                    <p><strong>Bus:</strong> {booking.bus.name} ({booking.bus.type})</p>
                    <p><strong>From:</strong> {booking.bus.from} at {booking.bus.departure}</p>
                    <p><strong>To:</strong> {booking.bus.to} at {booking.bus.arrival}</p>
                    <p><strong>Date:</strong> {new Date(booking.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                    <p><strong>Seat Numbers:</strong> <span className="font-bold text-indigo-600">{booking.seats.map(s => s + 1).join(', ')}</span></p>
                    <p className="text-2xl font-bold mt-4 text-right"><strong>Total Fare:</strong> ₹ {booking.totalPrice}</p>
                </div>

                <button onClick={onDone} className="mt-8 w-full py-3 font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-700">
                    Book Another Ticket
                </button>
            </div>
        </div>
    );
}

function MyBookings({ bookings, onBack }) {
     return (
        <div className="max-w-4xl mx-auto">
            <button onClick={onBack} className="mb-6 flex items-center text-indigo-600 font-semibold hover:text-indigo-800">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Back to Home
            </button>
             <h2 className="text-3xl font-bold text-gray-800 mb-6">My Bookings</h2>
             {bookings.length === 0 ? (
                 <div className="text-center bg-white p-8 rounded-lg shadow">
                     <p className="text-gray-600">You have no bookings yet.</p>
                 </div>
             ) : (
                 <div className="space-y-6">
                     {bookings.slice().reverse().map(booking => (
                         <div key={booking.id} className="bg-white p-6 rounded-lg shadow-md">
                             <div className="flex flex-col sm:flex-row justify-between sm:items-center border-b pb-4 mb-4">
                                <div>
                                    <h3 className="text-xl font-bold text-indigo-600">{booking.bus.name}</h3>
                                    <p className="text-sm text-gray-500">Booking ID: {booking.id}</p>
                                </div>
                                 <div className="mt-2 sm:mt-0 text-right">
                                     <p className="text-lg font-semibold">₹ {booking.totalPrice}</p>
                                     <span className="px-2 py-1 text-xs font-semibold text-green-800 bg-green-200 rounded-full">CONFIRMED</span>
                                 </div>
                             </div>
                             <div>
                                 <p><strong>Route:</strong> {booking.bus.from} to {booking.bus.to}</p>
                                 <p><strong>Date of Journey:</strong> {new Date(booking.date).toLocaleDateString('en-GB', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                                  <p><strong>Departure:</strong> {booking.bus.departure}</p>
                                 <p><strong>Seats:</strong> <span className="font-bold">{booking.seats.map(s => s + 1).join(', ')}</span></p>
                             </div>
                         </div>
                     ))}
                 </div>
             )}
         </div>
     );
}
