// utils/GetHeaders.js

/**
 * Utility function to get authentication headers from localStorage
 * @returns {Object|null} Headers object or null if authentication data is missing
 */
const getHeaders = () => {
    try {
        const userName = localStorage.getItem('userName') || 
                       localStorage.getItem('user_username') || '';
        const token = localStorage.getItem('token') || 
                      localStorage.getItem('user_token') || '';
        const branchId = localStorage.getItem('branchId') || 
                       localStorage.getItem('branch_id') || '';
        
        if (!userName || !token || !branchId) {
            console.error('Missing authentication data in localStorage');
            return null;
        }
        
        return {
            'Content-Type': 'application/json',
            'username': userName,
            'token': token,
            'branch': branchId
        };
    } catch (error) {
        console.error('Error getting headers from localStorage:', error);
        return null;
    }
};

export default getHeaders;