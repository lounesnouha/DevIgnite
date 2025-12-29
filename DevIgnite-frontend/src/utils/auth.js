
export const refreshAccessToken = async () => {
  try {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await fetch('/api/refresh', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token: refreshToken })
    });

    if (!response.ok) {
      throw new Error('Failed to refresh token');
    }

    const data = await response.json();
    localStorage.setItem('accessToken', data.accessToken);
    console.log('Token refreshed successfully');
    return data.accessToken;
  } catch (error) {
    console.error('Token refresh failed:', error);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    throw error;
  }
};

export const authFetch = async (url, options = {}) => {
  const token = localStorage.getItem('accessToken');
  
  const headers = {
    ...options.headers,
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };

  let response = await fetch(url, { ...options, headers });

  if (response.status === 401 && token) {
    try {
      const newToken = await refreshAccessToken();
      
      const newHeaders = {
        ...options.headers,
        'Authorization': `Bearer ${newToken}`
      };
      
      response = await fetch(url, { ...options, headers: newHeaders });
    } catch (refreshError) {
      window.location.href = '/login';
      throw refreshError;
    }
  }

  return response;
};

export const logout = async () => {
  try {
    const token = localStorage.getItem('accessToken');
    
    if (token) {
      await fetch('/api/logout', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
    }
  } catch (error) {
    console.error('Logout API call failed:', error);
  } finally {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    
    window.location.href = '/login';
  }
};

export const setupTokenRefresh = () => {
  const refreshInterval = 19 * 60 * 1000; // 19 minutes
  
  const refreshTokenPeriodically = async () => {
    const token = localStorage.getItem('accessToken');
    if (!token) return;
    
    try {
      await refreshAccessToken();
    } catch (error) {
      console.log('Periodic refresh failed, user will need to login again');
    }
  };
  
  const intervalId = setInterval(refreshTokenPeriodically, refreshInterval);
  
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
      refreshTokenPeriodically();
    }
  });
  
  return () => clearInterval(intervalId);
};