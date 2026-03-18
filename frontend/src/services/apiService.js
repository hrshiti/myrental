import axios from 'axios';

// Base URL configuration
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const api = axios.create({
  baseURL: API_URL,
  timeout: 60000, // 60 seconds timeout
});

// Interceptor to add Token and Log
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  console.log(`API Request: ${config.method.toUpperCase()} ${config.baseURL}${config.url}`, config.data || '');
  return config;
}, (error) => Promise.reject(error));

// Interceptor to handle 401 Unauthorized (Token invalid/expired)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response ? error.response.status : null;
    const isBlocked = error.response?.data?.isBlocked;

    if (status === 401 || (status === 403 && isBlocked)) {
      // Clear invalid token and redirect if not already on auth pages
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/otp')) {
        console.warn("Session expired or account blocked. Redirecting to login...");
        if (window.location.pathname.includes('/hotel/')) {
          window.location.href = '/hotel/login';
        } else {
          window.location.href = '/';
        }
      }
    }
    return Promise.reject(error);
  }
);

// User Auth Services
export const authService = {
  // Send OTP
  sendOtp: async (phone, type = 'login', role = 'user') => {
    console.log('Mock API: sendOtp', { phone, type, role });
    return { success: true, message: 'OTP sent successfully (Mock)' };
  },

  // Verify OTP & Login/Register
  verifyOtp: async (data) => {
    console.log('Mock API: verifyOtp', data);
    const mockUser = {
      _id: 'mock-user-123',
      name: 'Static User',
      phone: data.phone,
      email: 'user@example.com',
      role: 'user'
    };
    const response = {
      token: 'mock-jwt-token',
      user: mockUser
    };
    localStorage.setItem('token', response.token);
    localStorage.setItem('user', JSON.stringify(response.user));
    return response;
  },

  // Verify Partner OTP & Register
  verifyPartnerOtp: async (data) => {
    console.log('Mock API: verifyPartnerOtp', data);
    return { success: true, token: 'mock-partner-token', user: { _id: 'partner-123', name: 'Partner Mock' } };
  },

  // Initiate Partner Registration (Step 1 & 2)
  registerPartner: async (data) => {
    console.log('Mock API: registerPartner', data);
    return { success: true };
  },

  // Upload Partner Docs
  uploadDocs: async (formData) => {
    return { success: true, documents: [] };
  },

  // Delete Partner Doc
  deleteDoc: async (publicId) => {
    return { success: true };
  },

  // Upload Partner Docs via Base64 (Flutter Camera)
  uploadDocsBase64: async (images) => {
    return { success: true, documents: [] };
  },

  // Update Profile
  updateProfile: async (data) => {
    return { success: true, user: data };
  },

  // Logout
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
};




// Booking Services
export const bookingService = {
  create: async (bookingData) => {
    return { success: true, booking: { _id: 'mock-booking-1', ...bookingData } };
  },
  getMyBookings: async (type) => {
    return { bookings: [] };
  },
  getPartnerBookings: async (status) => {
    return { bookings: [] };
  },
  getBookingDetail: async (id) => {
    return { booking: { _id: id, status: 'confirmed' } };
  },
  getPartnerBookingDetail: async (id) => {
    return { booking: { _id: id, status: 'confirmed' } };
  },
  markAsPaid: async (id) => {
    return { success: true };
  },
  markNoShow: async (id) => {
    return { success: true };
  },
  checkIn: async (id) => {
    return { success: true };
  },
  checkOut: async (id, force = false) => {
    return { success: true };
  },
  cancel: async (bookingId, reason) => {
    return { success: true };
  },
};


// Property Services
export const propertyService = {
  create: async (propertyData) => {
    return { success: true, property: { _id: 'mock-p-1', ...propertyData } };
  },
  createProperty: async (propertyData) => {
    return { success: true, property: { _id: 'mock-p-1', ...propertyData } };
  },
  upsertDocuments: async (propertyId, documents) => {
    return { success: true };
  },
  update: async (id, data) => {
    return { success: true };
  },
  delete: async (id) => {
    return { success: true };
  },
  addRoomType: async (propertyId, data) => {
    return { success: true };
  },
  updateRoomType: async (propertyId, roomTypeId, data) => {
    return { success: true };
  },
  deleteRoomType: async (propertyId, roomTypeId) => {
    return { success: true };
  },
  getMy: async (filters = {}) => {
    return [];
  },
  getPublic: async (filters = {}) => {
    return [
      {
        _id: 'mock-1',
        propertyName: 'Luxury Villa',
        propertyType: 'Villa',
        coverImage: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914',
        address: { city: 'Goa', fullAddress: 'Goa, India' },
        avgRating: 4.8,
        minPrice: 5000
      },
      {
        _id: 'mock-2',
        propertyName: 'City Side Hotel',
        propertyType: 'Hotel',
        coverImage: 'https://images.unsplash.com/photo-1566073771259-6a8506099945',
        address: { city: 'Mumbai', fullAddress: 'Mumbai, India' },
        avgRating: 4.5,
        minPrice: 2000
      }
    ];
  },
  getDetails: async (id) => {
    return {
      property: {
        _id: id,
        propertyName: 'Luxury Villa',
        propertyType: 'Villa',
        description: 'A beautiful luxury villa with sea view and private pool.',
        coverImage: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914',
        propertyImages: ['https://images.unsplash.com/photo-1580587771525-78b9dba3b914'],
        address: { city: 'Goa', fullAddress: '123 Beach Road, Goa, India' },
        avgRating: 4.8,
        amenities: ['Wifi', 'Pool', 'Kitchen', 'AC'],
        checkInTime: '14:00',
        checkOutTime: '11:00',
        cancellationPolicy: 'Moderate',
        houseRules: 'No smoking, No parties',
        petsAllowed: 'Yes',
        coupleFriendly: 'Yes'
      },
      roomTypes: [
        {
          _id: 'rt-1',
          name: 'Whole Villa',
          pricePerNight: 5000,
          maxAdults: 6,
          maxChildren: 2,
          amenities: ['Private Pool', 'Sea View']
        }
      ]
    };
  },
};


// Hotel Services
export const hotelService = {
  getAll: async (filters = {}) => {
    return propertyService.getPublic(filters);
  },
  getById: async (id) => {
    return propertyService.getDetails(id);
  },
  getMyHotels: async (filters = {}) => {
    return [];
  },
  getCurrentLocation: async () => {
    return { success: true, location: { lat: 15.2993, lng: 74.1240, city: 'Goa' } };
  },
  uploadImages: async (formData) => {
    return { success: true, images: [] };
  },
  uploadImagesBase64: async (images) => {
    return { success: true, images: [] };
  },
  getAddressFromCoordinates: async (lat, lng) => {
    return { success: true, address: 'Goa, India' };
  },
  saveOnboardingStep: async (data) => {
    return { success: true };
  },
  searchLocation: async (query) => {
    return [];
  },
  calculateDistance: async (originLat, originLng, destLat, destLng) => {
    return { distance: '5 km' };
  },
  deleteHotel: async (id) => {
    return { success: true };
  },
  getNotifications: async (page = 1, limit = 20) => {
    return [];
  },
  markAllNotificationsRead: async () => {
    return { success: true };
  },
  deleteNotifications: async (ids) => {
    return { success: true };
  },
  deleteImage: async (url, publicId) => {
    return { success: true };
  }
};


// User Profile Services
export const userService = {
  getProfile: async () => {
    return { name: 'Static User', phone: '9876543210', email: 'user@example.com' };
  },
  updateProfile: async (data) => {
    return { success: true };
  },
  getSavedHotels: async () => {
    return { savedHotels: [] };
  },
  toggleSavedHotel: async (hotelId) => {
    return { success: true };
  },
  updateFcmToken: async (fcmToken, platform = 'web') => {
    return { success: true };
  },
  getNotifications: async (page = 1, limit = 20) => {
    return [];
  },
  deleteNotifications: async (ids) => {
    return { success: true };
  },
  markAllNotificationsRead: async () => {
    return { success: true };
  }
};


// Offer & Coupon Services
export const offerService = {
  getActive: async () => {
    return [
      { code: 'WELCOME50', discountType: 'percentage', discountValue: 50, minBookingAmount: 1000 },
      { code: 'NOWSTAY25', discountType: 'percentage', discountValue: 25, minBookingAmount: 500 }
    ];
  },
  validate: async (code, bookingAmount) => {
    return { valid: true, discountAmount: 100 };
  },
  getAll: async () => {
    return [];
  },
  create: async (offerData) => {
    return { success: true };
  }
};




export const paymentService = {
  createOrder: async (bookingId) => {
    return { success: true, orderId: 'mock-order-1' };
  },
  verifyPayment: async (paymentData) => {
    return { success: true };
  }
};


export const legalService = {
  getPage: async (audience, slug) => {
    return { title: 'Legal Page', content: 'Static legal content.' };
  },
  getPlatformStatus: async () => {
    return { active: true };
  },
  getFinancialSettings: async () => {
    return { success: true, taxRate: 12 };
  },
  submitContact: async (audience, payload) => {
    return { success: true };
  }
};


// Availability & Inventory Services
export const availabilityService = {
  check: async (params) => {
    return { available: true, unitsLeft: 5 };
  },
  createWalkIn: async (data) => {
    return { success: true };
  },
  createExternal: async (data) => {
    return { success: true };
  },
  blockDates: async (data) => {
    return { success: true };
  },
  getLedger: async (params) => {
    return [];
  }
};


export const reviewService = {
  getPropertyReviews: async (propertyId) => {
    return [
      { _id: 'r-1', user: { name: 'John Doe' }, rating: 5, comment: 'Amazing stay!', createdAt: new Date() },
      { _id: 'r-2', user: { name: 'Jane Smith' }, rating: 4, comment: 'Nice place.', createdAt: new Date() }
    ];
  },
  createReview: async (reviewData) => {
    return { success: true };
  },
  getPartnerStats: async () => {
    return { avgRating: 4.5, totalReviews: 10 };
  },
  getAllPartnerReviews: async (status) => {
    return [];
  },
  reply: async (reviewId, reply) => {
    return { success: true };
  },
  toggleHelpful: async (reviewId) => {
    return { success: true };
  }
};


export const referralService = {
  getMyStats: async () => {
    return { totalReferrals: 0, totalEarnings: 0 };
  },
  getActiveProgram: async () => {
    return { title: 'Refer & Earn', description: 'Refer your friends and earn money.' };
  }
};


export const handleResponse = (response) => response.data;

export const handleError = (error) => {
  throw error.response?.data || error.message;
};

/* --- FAQ SERVICES --- */
export const faqService = {
  getFaqs: async (audience) => {
    return [];
  },
  getAllFaqsAdmin: async (audience) => {
    return [];
  },
  createFaq: async (faqData) => {
    return { success: true };
  },
  updateFaq: async (id, faqData) => {
    return { success: true };
  },
  deleteFaq: async (id) => {
    return { success: true };
  }
};


export default api;
