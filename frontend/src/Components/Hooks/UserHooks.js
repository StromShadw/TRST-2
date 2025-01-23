import { useEffect, useState } from "react";
import { getLoggedinUser } from "../../helpers/api_helper";

const useProfile = () => {
  const userProfileSession = getLoggedinUser();
  const token = userProfileSession?.accessToken;
  
  const [loading, setLoading] = useState(userProfileSession ? false : true);
  const [userProfile, setUserProfile] = useState(
    userProfileSession ? userProfileSession.user : null
  );

  useEffect(() => {
    const userProfileSession = getLoggedinUser();
    const token = userProfileSession?.accessToken;
    
    setUserProfile(userProfileSession ? userProfileSession.user : null);
    setLoading(token ? false : true);
  }, []);

  return { userProfile, loading, token };
};

export { useProfile };