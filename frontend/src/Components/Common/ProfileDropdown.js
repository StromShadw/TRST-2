import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Dropdown, DropdownItem, DropdownMenu, DropdownToggle } from 'reactstrap';
import { useSelector, useDispatch } from 'react-redux';
import { createSelector } from 'reselect';
import { logoutUser } from '../../slices/auth/login/thunk';
import { useNavigate } from 'react-router-dom';

//import images
import avatar from "../../assets/images/logo.jpg";
// Memoized selector
const userSelector = createSelector(
    state => state.Login.user,
    user => ({ user: user?.user })
);

const ProfileDropdown = () => {
    const { user } = useSelector(userSelector);

    const [userName, setUserName] = useState("");
    const [userAvatar, setUserAvatar] = useState(avatar);
    const [userEmail, setUserEmail] = useState("");

    useEffect(() => {
        // Try to get user from Redux first, then fallback to sessionStorage
        let userData = user;
        
        if (!userData) {
            const storedUser = sessionStorage.getItem("authUser");
            if (storedUser) {
                try {
                    userData = JSON.parse(storedUser).user;
                } catch (error) {
                    console.warn("Failed to parse stored user data");
                }
            }
        }

        if (userData) {
            const displayName = userData.fullName || "";
            setUserName(displayName);
            setUserEmail(userData.email || "");
            
            if (userData.avatar && userData.avatar.trim() !== '') {
                try {
                    const url = new URL(userData.avatar);
                    const img = new Image();
                    img.onload = () => setUserAvatar(userData.avatar);
                    img.onerror = () => {
                        console.warn('Failed to load avatar image');
                        setUserAvatar(avatar);
                    };
                    img.src = userData.avatar;
                } catch (error) {
                    console.warn('Invalid avatar URL');
                    setUserAvatar(avatar);
                }
            } else {
                setUserAvatar(avatar);
            }
        }
    }, [user]);

    //Dropdown Toggle
    const [isProfileDropdown, setIsProfileDropdown] = useState(false);
    const toggleProfileDropdown = () => {
        setIsProfileDropdown(!isProfileDropdown);
    };

    return (
        <React.Fragment>
            <Dropdown isOpen={isProfileDropdown} toggle={toggleProfileDropdown} className="ms-sm-3 header-item topbar-user">
                <DropdownToggle tag="button" type="button" className="btn">
                    <span className="d-flex align-items-center">
                        <img 
                            className="rounded-circle header-profile-user" 
                            src={userAvatar}
                            alt="Header Avatar" 
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = avatar;
                            }}
                        />
                        <span className="text-start ms-xl-2">
                            <span className="d-none d-xl-inline-block ms-1 fw-medium user-name-text">
                                {userName || 'Guest'}
                            </span>
                            <span className="d-none d-xl-block ms-1 fs-12 text-muted user-name-sub-text">
                                {userEmail || 'User'}
                            </span>
                        </span>
                    </span>
                </DropdownToggle>
                <DropdownMenu className="dropdown-menu-end">
                    <h6 className="dropdown-header">Welcome {userName}!</h6>
                    <DropdownItem href="/logout">
                        <i className="mdi mdi-logout text-muted fs-16 align-middle me-1"></i>
                        <span className="align-middle" data-key="t-logout">Logout</span>
                    </DropdownItem>
                </DropdownMenu>
            </Dropdown>
        </React.Fragment>
    );
};

export default ProfileDropdown;