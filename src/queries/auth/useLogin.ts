import { useMutation } from '@tanstack/react-query';
import AUTH_API from 'apis/authApi';
import { RT_TIME } from 'constants/shared';
import { onLoginInSuccess } from 'hooks/useAuth';
import { useCookies } from 'react-cookie';
import { useTokenActions } from 'store/token';
import { LoginFormData } from 'types/authType';

export const useLogin = (formData: LoginFormData) => {
  const { setToken } = useTokenActions();
  const [_, setCookie] = useCookies(['RT']);

  return useMutation({
    mutationFn: () => AUTH_API.POST.loginData(formData),
    onSuccess: (res) => {
      console.log(res);
      setToken(res.headers.authorization);
      setCookie('RT', res.headers[`authorization-refresh`], { maxAge: RT_TIME });
      onLoginInSuccess(res.headers.authorization, res.headers[`authorization-refresh`]);
    },
    onError: (error) => console.error('로그인 실패', error),
  });
};
