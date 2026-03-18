import axios from 'axios';

// Mock Data
const mockProperties = [
  { 
    _id: 'hotel-1', 
    name: 'Luxury Beach Resort', 
    propertyName: 'Luxury Beach Resort', 
    type: 'Hotel', 
    propertyType: 'hotel',
    address: { city: 'Calangute', state: 'Goa', fullAddress: '123 Beach Road, Calangute, Goa' }, 
    basePrice: 5500, 
    minPrice: 5500,
    images: ['https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&q=80&w=1000'], 
    propertyImages: ['https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&q=80&w=1000'],
    coverImage: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&q=80&w=1000',
    rating: 4.8, 
    avgRating: 4.8, 
    amenities: ['Pool', 'Wi-Fi', 'AC', 'Breakfast'], 
    suitability: 'Both', 
    description: 'A beautiful beach resort with world-class amenities.',
    checkInTime: '12:00 PM',
    checkOutTime: '11:00 AM',
    roomTypes: [
      { _id: 'rt-1', name: 'Deluxe Room', pricePerNight: 5500, maxAdults: 2, maxChildren: 1, amenities: ['King Bed', 'Sea View'] }
    ]
  },
  { 
    _id: 'hotel-2', 
    name: 'Heritage Palace Inn', 
    propertyName: 'Heritage Palace Inn', 
    type: 'Hotel', 
    propertyType: 'hotel',
    address: { city: 'Jaipur', state: 'Rajasthan', fullAddress: 'Palace Road, Jaipur' }, 
    basePrice: 3200, 
    minPrice: 3200,
    images: ['https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=1000'], 
    propertyImages: ['https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=1000'],
    coverImage: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=1000',
    rating: 4.5, 
    avgRating: 4.5, 
    amenities: ['Heritage Tour', 'Wi-Fi'], 
    suitability: 'Family Friendly', 
    description: 'Experience royal heritage in the heart of Jaipur.' 
  }
];

const mockUser = { _id: 'mock-user-123', name: 'John Doe', phone: '9970907005', email: 'johndoe@example.com', role: 'user', walletBalance: 2500, savedHotels: [] };

const mockBookings = [
  { _id: 'b1', bookingId: 'BK-1001', hotelName: 'Luxury Beach Resort', propertyId: mockProperties[0], checkInDate: '2024-04-10', checkOutDate: '2024-04-12', totalAmount: 11000, status: 'confirmed', paymentStatus: 'paid' }
];

const mockCategories = [
  { _id: 'cat-1', name: 'hotel', displayName: 'Hotel', isActive: true, icon: 'Hotel' },
  { _id: 'cat-2', name: 'villa', displayName: 'Villa', isActive: true, icon: 'Home' }
];

const mockReviews = [
  { _id: 'rev-1', user: { name: 'Alice' }, rating: 5, comment: 'Amazing stay!', createdAt: new Date().toISOString() }
];

// Mock API Instance (Axios Mock)
export const api = {
  get: async (url) => {
    console.log('Mock API GET:', url);
    if (url.includes('/properties')) return { data: mockProperties };
    if (url.includes('/categories/active')) return { data: mockCategories };
    if (url.includes('/notifications')) return { data: { notifications: [], meta: { unreadCount: 0 } } };
    if (url.includes('/auth/me')) return { data: { user: mockUser } };
    if (url.includes('/wallet')) return { data: { wallet: { balance: 2500, transactions: [] } } };
    return { data: { success: true } };
  },
  post: async (url, data) => {
    console.log('Mock API POST:', url, data);
    return { data: { success: true, token: 'mock-token', user: mockUser } };
  },
  put: async (url, data) => {
    console.log('Mock API PUT:', url, data);
    return { data: { success: true } };
  },
  delete: async (url) => {
    console.log('Mock API DELETE:', url);
    return { data: { success: true } };
  },
  interceptors: {
    request: { use: () => {} },
    response: { use: () => {} }
  },
  defaults: { headers: { common: {} } }
};

export const authService = {
  sendOtp: async (phone) => ({ success: true, message: 'OTP sent (Mock)' }),
  verifyOtp: async (data) => {
    const user = { ...mockUser, phone: data.phone || '9970907005', role: data.role || 'user' };
    localStorage.setItem('token', 'mock-token-' + Date.now());
    localStorage.setItem('user', JSON.stringify(user));
    return { success: true, token: 'mock-token', user };
  },
  verifyPartnerOtp: async (data) => {
    const user = { ...mockUser, role: 'partner', partnerApprovalStatus: 'approved' };
    localStorage.setItem('token', 'mock-partner-token');
    localStorage.setItem('user', JSON.stringify(user));
    return { success: true, token: 'mock-partner-token', user };
  },
  registerUser: async (data) => {
    const user = { ...mockUser, ...data };
    localStorage.setItem('token', 'mock-token');
    localStorage.setItem('user', JSON.stringify(user));
    return { success: true, token: 'mock-token', user };
  }
};

export const userService = {
  getProfile: async () => ({ success: true, user: JSON.parse(localStorage.getItem('user')) || mockUser }),
  getNotifications: async () => ({ success: true, notifications: [], meta: { unreadCount: 0 } }),
  getSavedHotels: async () => ({ success: true, savedHotels: [] }),
  updateFcmToken: async () => ({ success: true }),
  updateProfile: async (data) => ({ success: true, user: { ...mockUser, ...data } }),
  toggleSavedHotel: async (id) => ({ success: true })
};

export const propertyService = {
  getPublic: async () => mockProperties,
  getPublicProperties: async () => mockProperties,
  getPropertyDetails: async (id) => ({ 
    success: true, 
    property: mockProperties.find(p => p._id === id) || mockProperties[0],
    roomTypes: (mockProperties.find(p => p._id === id) || mockProperties[0]).roomTypes || []
  }),
  getDetails: async (id) => ({ 
    success: true, 
    property: mockProperties.find(p => p._id === id) || mockProperties[0],
    roomTypes: (mockProperties.find(p => p._id === id) || mockProperties[0]).roomTypes || []
  }),
  getManaged: async () => ({ success: true, hotels: mockProperties }),
  getCurrentLocation: async () => ({ lat: 15.5415, lng: 73.7634 })
};

export const hotelService = {
  getStats: async () => ({ success: true, stats: { totalBookings: 12, revenue: 45000, activeRooms: 5 } }),
  getManaged: async () => ({ success: true, hotels: mockProperties }),
  getDetails: async (id) => ({ success: true, hotel: mockProperties[0] }),
  updateDetails: async (id, data) => ({ success: true }),
  addHotel: async (data) => ({ success: true, hotel: mockProperties[0] })
};

export const bookingService = {
  getUserBookings: async () => ({ success: true, bookings: mockBookings }),
  getMyBookings: async (type) => mockBookings,
  getBookingDetails: async (id) => ({ success: true, booking: mockBookings[0] }),
  createBooking: async (data) => ({ success: true, booking: { ...mockBookings[0], ...data, _id: 'b-' + Date.now() } }),
  create: async (data) => ({ success: true, booking: { ...mockBookings[0], ...data, _id: 'b-' + Date.now() } }),
  getPartnerBookings: async () => ({ success: true, bookings: mockBookings })
};

export const reviewService = {
  getHotelReviews: async (id) => mockReviews,
  getPropertyReviews: async (id) => mockReviews,
  getAll: async () => ({ success: true, reviews: mockReviews }),
  submitReview: async (data) => ({ success: true }),
  createReview: async (data) => ({ success: true })
};

export const availabilityService = {
  checkAvailability: async (id, dates) => ({ success: true, available: true, rooms: [{ _id: 'r1', type: 'Deluxe', price: 2500 }] }),
  check: async (data) => ({ success: true, available: true, availableUnits: 5 }),
  updateAvailability: async (data) => ({ success: true })
};

export const categoryService = {
  getAll: async () => mockCategories,
  getActiveCategories: async () => mockCategories
};

export const offerService = {
  getActive: async () => [],
  getAll: async () => ({ success: true, offers: [] })
};

export const walletService = {
  getWallet: async () => ({ success: true, wallet: { balance: 15450, transactions: [] } }),
  getTransactions: async () => ({ success: true, transactions: [], meta: { totalCount: 0 } })
};

export const paymentService = {
  createOrder: async (data) => ({ success: true, order: { id: 'order_123', amount: 5000 } }),
  verifyPayment: async (data) => ({ success: true })
};

export const faqService = {
  getAll: async () => ({ success: true, faqs: [] }),
  getFaqs: async () => ({ success: true, faqs: [] })
};

export const referralService = {
  getStats: async () => ({ success: true, totalReferrals: 5, earnings: 1500 }),
  getHistory: async () => ({ success: true, history: [] })
};

export const legalService = {
  getLegalPage: async (slug) => ({ success: true, content: `Mock content for ${slug}` }),
  getPlatformStatus: async () => ({ success: true, maintenanceMode: false }),
  getFinancialSettings: async () => ({ success: true, taxRate: 12, settings: { gstPercentage: 12, serviceFee: 50 } })
};

export const handleResponse = (response) => response;
export const handleError = (error) => { throw error; };

export default {
  auth: authService,
  user: userService,
  property: propertyService,
  hotel: hotelService,
  booking: bookingService,
  review: reviewService,
  availability: availabilityService,
  category: categoryService,
  offer: offerService,
  wallet: walletService,
  payment: paymentService,
  faq: faqService,
  referral: referralService,
  legal: legalService,
  api: api
};
