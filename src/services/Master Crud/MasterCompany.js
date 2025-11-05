import { Base_Url } from 'component/Base-Url/BaseUrl';
import { postApiWithAuthenticated, getListWithAuthenticated } from 'services/ApiMethod/ApiMethod';

const MasterCompanyBaseUrl = `${Base_Url}/Company`;

export const GetCompanyList = async (params) => {
  let url = `${MasterCompanyBaseUrl}/GetCompanyList`;

  const res = await postApiWithAuthenticated(url, params);
  return res;
};
export const AddUpdateCompanyApi = async (url = '', params) => {
  if (params.companyKeyID === null || params.companyKeyID === undefined) {
    delete params.companyKeyID;
  }

  const res = await postApiWithAuthenticated(`${MasterCompanyBaseUrl}${url}`, params);
  return res;
};

export const GetCompanyModel = async (id) => {
  let url = `${MasterCompanyBaseUrl}/GetCompanyModel?CompanyKeyID=${id}`;

  const res = await getListWithAuthenticated(url);
  return res;
};

export const GetCompanyLookupList = async (userKeyID) => {
  const url = `${MasterCompanyBaseUrl}/GetCompanyLookupList?UserKeyID=${userKeyID}`;

  const res = await getListWithAuthenticated(url);
  return res;
};

export const ChangeCompanyStatus = async (id, UserKeyID) => {
  let url = `${MasterCompanyBaseUrl}/ChangeCompanyStatus?CompanyKeyID=${id}&UserKeyID=${UserKeyID}`;
  const res = await getListWithAuthenticated(url);
  return res;
};

export const GetCompanyViewDetails = async (companyKeyID) => {
  const url = `${MasterCompanyBaseUrl}/GetCompanyViewDetails?CompanyKeyID=${companyKeyID}`;

  const res = await getListWithAuthenticated(url);
  return res;
};
