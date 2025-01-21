import { useState, useEffect } from 'react';

export const useProfile = () => {
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    const authUser = JSON.parse(sessionStorage.getItem("authUser"));
    
    if (authUser) {
      setUserProfile(authUser.user);
    }
    
    setLoading(false);
  }, []);

  return { userProfile, loading };
};