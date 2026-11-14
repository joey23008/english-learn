import { useCallback, useContext } from "react";
import { AuthContext, AuthSetContext } from "@/providers/AuthProvider";
import { get, post } from "@/lib/axios";
import { User, UserCount } from "ApiDataTypes";

const fetchUser = async () => {
  const response = await get<User>('/users/me');
  return response.data;
};

const getCount = async (
  params: { email: string },
) => {
  const response = await get<UserCount>('/users/get-count', { params });
  return response.data;
};

const login = async (
  credentials: { email: string; password: string }
) => {
  const response = await post<User>('/users/login', credentials);
  return response.data;
};

const signup = async (
  credentials: { email: string; password: string; }
) => {
  const response = await post<User>('/users/signup', credentials);
  return response.data;
};

const logout = async () => {
  const response = await get<string>('/users/logout');
  return response.data;
};


export function useAuth () {

  const me = useContext(AuthContext);
  const setMe = useContext(AuthSetContext);

  const tmpFetchUser = useCallback(async () => {
    const user = await fetchUser();
    setMe(user);
  }, [setMe]);

  const tmpLogin = useCallback(async (
    credentials: { email: string; password: string }
  ) => {
    const user = await login(credentials);
    setMe(user);
  }, [setMe]);

  const tmpLogout = useCallback(async () => {
    await logout();
    setMe(null);
  }, [setMe]);

  return {
    me,
    fetchUser: tmpFetchUser,
    getCount,
    login: tmpLogin,
    signup,
    logout: tmpLogout,
  };
}