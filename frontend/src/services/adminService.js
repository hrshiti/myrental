import { useEffectEvent } from 'react';
import { hotelService, authService, userService, bookingService, reviewService } from './apiService';

// Individual exports for adminService if needed
export const adminService = {
  getStats: () => Promise.resolve({ success: true, stats: { users: 1500, properties: 250, monthlyRevenue: 1250000 } }),
  getUsers: () => Promise.resolve({ success: true, users: [] }),
  getProperties: () => Promise.resolve({ success: true, properties: [] }),
  getBookings: () => Promise.resolve({ success: true, bookings: [] })
};

export default adminService;
