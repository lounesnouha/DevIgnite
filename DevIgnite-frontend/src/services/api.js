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


