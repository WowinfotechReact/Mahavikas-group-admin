import { Base_Url } from 'component/Base-Url/BaseUrl';
import { getListWithAuthenticated, postApiWithAuthenticated } from 'services/ApiMethod/ApiMethod';

const bannerBaseURI = `${Base_Url}/Banner`;

export const GetBannerList = async (params) => {
  const url = `${bannerBaseURI}/GetBannerList`;
  const res = await postApiWithAuthenticated(url, params);
  return res;
};

export const ChangeBannerStatus = async (BannerKeyID,UserKeyID) => {
  const res = await getListWithAuthenticated(
    `${bannerBaseURI}/ChangeBannerStatus?BannerKeyID=${BannerKeyID}&UserKeyID=${UserKeyID}`
  );
  return res;
};


export const AddUpdateBanner = async (url = '', params) => {

  const res = await postApiWithAuthenticated(`${bannerBaseURI}${url}`, params);
  return res;
};


export const GetBannerModel = async (id) => {
  const url = `${bannerBaseURI}/GetBannerModel?BannerKeyID=${id}`;

  const res = await getListWithAuthenticated(url);
  return res;
};


