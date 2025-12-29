export const fetchPostsByDepartment = async (department) => {
  try {
    console.log(`Fetching posts for department: ${department}`);
    const response = await fetch(`/posts/department/${department}`,{
        headers: {
        'Accept': 'application/json',
      }
    });
    
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data.posts || [];
  } catch (error) {
    console.error('Error fetching posts:', error);
    throw error;
  }
};



export async function authFetch(url, options = {}) {
  let accessToken = localStorage.getItem("accessToken");

  const res = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });

  if (res.status === 401 || res.status === 403) {
    const refreshed = await refreshAccessToken();
    if (!refreshed) throw new Error("Session expired");

    accessToken = localStorage.getItem("accessToken");

    return fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });
  }

  return res;
}
