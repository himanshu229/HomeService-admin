import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../store';
import { loginAdmin, fetchMe } from '../store/slices/authSlice';
import { logout, setCredentials } from '../store/slices/authSlice';
import type { AdminUser } from '../types';

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const { user, token, isAuthenticated, loading, error } =
    useAppSelector((s) => s.auth);

  const handleLogin = useCallback(
    (email: string, password: string) =>
      dispatch(loginAdmin({ email, password })),
    [dispatch]
  );

  const handleFetchMe = useCallback(
    () => dispatch(fetchMe()),
    [dispatch]
  );

  const handleLogout = useCallback(
    () => dispatch(logout()),
    [dispatch]
  );

  const handleSetCredentials = useCallback(
    (user: AdminUser, token: string) =>
      dispatch(setCredentials({ user, token })),
    [dispatch]
  );

  return {
    user,
    token,
    isAuthenticated,
    isLoading: loading,
    error,
    login:          handleLogin,
    fetchMe:        handleFetchMe,
    logout:         handleLogout,
    setCredentials: handleSetCredentials,
  };
};
