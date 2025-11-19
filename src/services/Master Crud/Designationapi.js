import { Base_Url } from 'component/Base-Url/BaseUrl';
import { postApiWithAuthenticated, getListWithAuthenticated } from 'services/ApiMethod/ApiMethod';

const MasterDesignationBaseUrl = `${Base_Url}/Designation`;

export const GetDesignationList = async (params) => {
  let url = `${MasterDesignationBaseUrl}/GetDesignationList`;

  const res = await postApiWithAuthenticated(url, params);
  return res;
};
export const AddUpdateDesignation = async (url = '', params) => {
 

  const res = await postApiWithAuthenticated(`${MasterDesignationBaseUrl}${url}`, params);
  return res;
};

export const GetDesignationModel = async (id) => {
  let url = `${MasterDesignationBaseUrl}/GetDesignationModel?DesignationKeyID=${id}`;

  const res = await getListWithAuthenticated(url);
  return res;
};

export const GetDesignationLookupList = async (userKeyID) => {
  const url = `${MasterDesignationBaseUrl}/GetDesignationLookupList`;

  const res = await getListWithAuthenticated(url);
  return res;
};
export const GetCompanyLookupList = async (userKeyID) => {
  const url = `${MasterDesignationBaseUrl}/GetCompanyLookupList?UserKeyID=${userKeyID}`;

  const res = await getListWithAuthenticated(url);
  return res;
};

export const ChenageDesignationStatus = async (id, UserKeyID) => {
  let url = `${MasterDesignationBaseUrl}/ChangeDesignationStatus?DesignationKeyID=${id}&UserKeyID=${UserKeyID}`;
  const res = await getListWithAuthenticated(url);
  return res;
};

export const GetCompanyViewDetails = async (companyKeyID) => {
  const url = `${MasterDesignationBaseUrl}/GetCompanyViewDetails?CompanyKeyID=${companyKeyID}`;

  const res = await getListWithAuthenticated(url);
  return res;
};
