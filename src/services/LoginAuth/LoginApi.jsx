import { Base_Url } from 'component/Base-Url/BaseUrl';
import { postApi } from 'services/ApiMethod/ApiMethod';

const loginUrl = `${Base_Url}/Login/AdminLogin`;

export const VerifyLoginCredential = async (params) => {
  const res = await postApi(loginUrl, params);

  return res;
};
