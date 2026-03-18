const mockPlans = [
  { _id: 'plan-1', name: 'Starter', price: 0, durationMonths: 1, features: ['List 1 Property', 'Basic Visibility', '2% Commission'] },
  { _id: 'plan-2', name: 'Pro', price: 999, durationMonths: 6, features: ['List Up to 5 Properties', 'Prioritized Visibility', '1% Commission', 'Basic Analytics'] },
  { _id: 'plan-3', name: 'Enterprise', price: 2999, durationMonths: 12, features: ['Unlimited Properties', 'Top-tier Visibility', '0% Commission', 'Advanced Analytics', 'Dedicated Support'] }
];

export const subscriptionService = {
  getAllPlans: async () => {
    return { success: true, plans: mockPlans };
  },

  purchasePlan: async (planId) => {
    return { success: true, message: 'Plan purchased successfully (Mock)' };
  },

  getCurrentSubscription: async () => {
    return { success: true, subscription: { plan: mockPlans[1], expiresAt: '2025-01-01', status: 'active' } };
  }
};

export default subscriptionService;
