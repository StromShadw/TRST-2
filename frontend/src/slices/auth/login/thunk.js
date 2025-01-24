import { loginSuccess, logoutUserSuccess, apiError, reset_login_flag } from './reducer';

export const loginUser = (user, history) => async (dispatch) => {
  try {
    dispatch(apiError({ data: "" })); // Clear previous errors
    
    const response = await fetch('http://localhost:8000/api/v1/users/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: user.username,
        password: user.password
      }),
      credentials: 'include'
    });

    const data = await response.json();
    
    // Add debugging to check the response data
    // console.log('Login response:', data);

    if (response.ok && data.success) {
      // Store user data in sessionStorage
      sessionStorage.setItem("authUser", JSON.stringify(data.data));
      
      // Add more explicit token handling and debugging
      if (data.token) {
        console.log('Setting token:', data.token);
        localStorage.setItem("accessToken", data.token);
        document.cookie = `authToken=${data.token}; path=/; secure; samesite=strict`;
        
        // Verify token was set
        const storedToken = localStorage.getItem("accessToken");
        console.log('Stored token:', storedToken);
      } else {
        console.log('No token received in response');
      }
      
      dispatch(loginSuccess(data.data));
      history('/dashboard');
    } else {
      dispatch(apiError({ data: data.message || "Invalid username or password" }));
    }
  } catch (error) {
    dispatch(apiError({ data: "Login failed. Please check your credentials." }));
  }
};

export const logoutUser = () => async (dispatch) => {
  try {
    sessionStorage.removeItem("authUser");
    localStorage.removeItem("accessToken"); // Also remove token on logout
    dispatch(logoutUserSuccess(true));
  } catch (error) {
    dispatch(apiError(error));
  }
};

export const resetLoginFlag = () => async (dispatch) => {
  try {
    const response = dispatch(reset_login_flag());
    return response;
  } catch (error) {
    dispatch(apiError(error));
  }
};