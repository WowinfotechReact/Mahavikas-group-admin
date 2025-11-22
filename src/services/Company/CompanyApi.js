import { Base_Url } from 'component/Base-Url/BaseUrl';
import { getListWithAuthenticated, postApiWithAuthenticated } from 'services/ApiMethod/ApiMethod';
import axios from "axios";

const GetCompanyBaseURI = `${Base_Url}/AdminUser`;



export const GetCompanyLookupList = async () => {
  const url = `${GetCompanyBaseURI}/GetCompanyLookupList`;

  const res = await getListWithAuthenticated(url);
  return res;
};
export const GetCompanyLookupListWithoutAuth = async () => {
  const url = `${GetCompanyBaseURI}/GetCompanyLookupList`;

  try {
    const res = await axios.get(url);  // <-- no auth header
    return res;
  } catch (error) {
    console.error("Error fetching company lookup (no auth):", error);
    throw error;
  }
};
export const GetRoleLookupList = async () => {
  const url = `${GetCompanyBaseURI}/GetRoleLookupList?RoleCategoryID=${1}`;

  const res = await getListWithAuthenticated(url);
  return res;
};
export const AddUpdateAdminUser = async (url = '', params) => {
  if (params.employeeKeyID === null || params.employeeKeyID === undefined) {
    delete params.employeeKeyID;
  }

  const res = await postApiWithAuthenticated(`${GetCompanyBaseURI}${url}`, params);
  return res;
};
export const GetAdminUserModel = async (id,UserDetailsKeyID) => {
  let url = `${GetCompanyBaseURI}/GetAdminUserModel?UserKeyIDForUpdate=${id}&UserDetailsKeyID=${UserDetailsKeyID}`;

  const res = await getListWithAuthenticated(url);
  return res;
};

export const GetAdminUserList = async (params) => {
  let url = `${GetCompanyBaseURI}/GetAdminUserList`;

  const res = await postApiWithAuthenticated(url, params);
  return res;
};