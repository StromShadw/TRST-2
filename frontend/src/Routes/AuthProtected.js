import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { setAuthorization } from "../helpers/api_helper";
import { useDispatch } from "react-redux";
import { useProfile } from "../Components/Hooks/UserHooks";
import { logoutUser } from "../slices/auth/login/thunk";

const AuthProtected = (props) => {
  const dispatch = useDispatch();
  const { userProfile, loading } = useProfile();
  const token = sessionStorage.getItem("token");

  useEffect(() => {
    if (token) {
      setAuthorization(token);
    } else {
      dispatch(logoutUser());
    }
  }, [token, dispatch]);

  if (!token) {
    return <Navigate to="/login" />;
  }

  return <>{props.children}</>;
};

export { AuthProtected };