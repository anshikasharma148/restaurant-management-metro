const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Helper function to get auth token
const getToken = () => {
  return localStorage.getItem('metro_token') || '';
};

// Helper function to set auth token
const setToken = (token: string) => {
  localStorage.setItem('metro_token', token);
};

// Helper function to remove auth token
const removeToken = () => {
  localStorage.removeItem('metro_token');
};

// Generic fetch wrapper
const apiRequest = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  const token = getToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'An error occurred');
  }

  return data.data || data;
};

// Auth API
export const authAPI = {
  login: async (email: string, password: string, role: string) => {
    const response = await apiRequest<{ token: string; user: any }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password, role }),
    });
    setToken(response.token);
    return response;
  },
  logout: async () => {
    await apiRequest('/auth/logout', { method: 'POST' });
    removeToken();
  },
  getMe: async () => {
    return apiRequest('/auth/me');
  },
};

// Menu API
export const menuAPI = {
  getItems: async (params?: { category?: string; available?: boolean; search?: string }) => {
    const query = new URLSearchParams();
    if (params?.category) query.append('category', params.category);
    if (params?.available !== undefined) query.append('available', String(params.available));
    if (params?.search) query.append('search', params.search);
    const queryString = query.toString();
    return apiRequest(`/menu/items${queryString ? `?${queryString}` : ''}`);
  },
  getItem: async (id: string) => {
    return apiRequest(`/menu/items/${id}`);
  },
  createItem: async (itemData: any) => {
    return apiRequest('/menu/items', {
      method: 'POST',
      body: JSON.stringify(itemData),
    });
  },
  updateItem: async (id: string, itemData: any) => {
    return apiRequest(`/menu/items/${id}`, {
      method: 'PUT',
      body: JSON.stringify(itemData),
    });
  },
  deleteItem: async (id: string) => {
    return apiRequest(`/menu/items/${id}`, {
      method: 'DELETE',
    });
  },
  getCategories: async () => {
    return apiRequest('/menu/categories');
  },
  createCategory: async (categoryData: any) => {
    return apiRequest('/menu/categories', {
      method: 'POST',
      body: JSON.stringify(categoryData),
    });
  },
  updateCategory: async (id: string, categoryData: any) => {
    return apiRequest(`/menu/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(categoryData),
    });
  },
  deleteCategory: async (id: string) => {
    return apiRequest(`/menu/categories/${id}`, {
      method: 'DELETE',
    });
  },
};

// Orders API
export const ordersAPI = {
  getOrders: async (params?: { status?: string; type?: string; startDate?: string; endDate?: string }) => {
    const query = new URLSearchParams();
    if (params?.status) query.append('status', params.status);
    if (params?.type) query.append('type', params.type);
    if (params?.startDate) query.append('startDate', params.startDate);
    if (params?.endDate) query.append('endDate', params.endDate);
    const queryString = query.toString();
    return apiRequest(`/orders${queryString ? `?${queryString}` : ''}`);
  },
  getOrder: async (id: string) => {
    return apiRequest(`/orders/${id}`);
  },
  createOrder: async (orderData: any) => {
    return apiRequest('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  },
  updateOrderStatus: async (id: string, status: string) => {
    return apiRequest(`/orders/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  },
  updateOrder: async (id: string, orderData: any) => {
    return apiRequest(`/orders/${id}`, {
      method: 'PUT',
      body: JSON.stringify(orderData),
    });
  },
  deleteOrder: async (id: string) => {
    return apiRequest(`/orders/${id}`, {
      method: 'DELETE',
    });
  },
};

// Tables API
export const tablesAPI = {
  getTables: async (params?: { status?: string }) => {
    const query = new URLSearchParams();
    if (params?.status) query.append('status', params.status);
    const queryString = query.toString();
    return apiRequest(`/tables${queryString ? `?${queryString}` : ''}`);
  },
  getTable: async (id: string) => {
    return apiRequest(`/tables/${id}`);
  },
  updateTableStatus: async (id: string, status: string) => {
    return apiRequest(`/tables/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  },
};

// Payments API
export const paymentsAPI = {
  processPayment: async (paymentData: any) => {
    return apiRequest('/payments', {
      method: 'POST',
      body: JSON.stringify(paymentData),
    });
  },
  getPayments: async (params?: { startDate?: string; endDate?: string; method?: string }) => {
    const query = new URLSearchParams();
    if (params?.startDate) query.append('startDate', params.startDate);
    if (params?.endDate) query.append('endDate', params.endDate);
    if (params?.method) query.append('method', params.method);
    const queryString = query.toString();
    return apiRequest(`/payments${queryString ? `?${queryString}` : ''}`);
  },
  getPayment: async (id: string) => {
    return apiRequest(`/payments/${id}`);
  },
  getPaymentByOrder: async (orderId: string) => {
    return apiRequest(`/payments/order/${orderId}`);
  },
};

// Reports API
export const reportsAPI = {
  getSalesSummary: async (params?: { startDate?: string; endDate?: string }) => {
    const query = new URLSearchParams();
    if (params?.startDate) query.append('startDate', params.startDate);
    if (params?.endDate) query.append('endDate', params.endDate);
    const queryString = query.toString();
    return apiRequest(`/reports/sales${queryString ? `?${queryString}` : ''}`);
  },
  getTopItems: async (params?: { startDate?: string; endDate?: string; limit?: number }) => {
    const query = new URLSearchParams();
    if (params?.startDate) query.append('startDate', params.startDate);
    if (params?.endDate) query.append('endDate', params.endDate);
    if (params?.limit) query.append('limit', String(params.limit));
    const queryString = query.toString();
    return apiRequest(`/reports/top-items${queryString ? `?${queryString}` : ''}`);
  },
  getCategorySales: async (params?: { startDate?: string; endDate?: string }) => {
    const query = new URLSearchParams();
    if (params?.startDate) query.append('startDate', params.startDate);
    if (params?.endDate) query.append('endDate', params.endDate);
    const queryString = query.toString();
    return apiRequest(`/reports/category-sales${queryString ? `?${queryString}` : ''}`);
  },
  getDashboardStats: async () => {
    return apiRequest('/reports/dashboard');
  },
};

// Settings API
export const settingsAPI = {
  getSettings: async () => {
    return apiRequest('/settings');
  },
  updateSettings: async (settingsData: any) => {
    return apiRequest('/settings', {
      method: 'PUT',
      body: JSON.stringify(settingsData),
    });
  },
};

