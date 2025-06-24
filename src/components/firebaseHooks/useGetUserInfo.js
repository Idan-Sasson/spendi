import { useLocalStorage } from "../useLocalStorage"

export const useGetUserInfo = () => {
    const [auth, _] = useLocalStorage("auth", {});
    const { email, userID, isAuth } = auth;
    return { email, userID, isAuth };
};