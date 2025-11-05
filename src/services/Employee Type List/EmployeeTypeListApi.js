import { Base_Url } from 'component/Base-Url/BaseUrl';
import { postApiWithAuthenticated, getListWithAuthenticated } from 'services/ApiMethod/ApiMethod';

const EmployeeTypeBaseUrl = `${Base_Url}/EmployeeType`;

export const GetEmployeeTypeList = async (params) => {
  let url = `${EmployeeTypeBaseUrl}/GetEmployeeTypeList`;

  const res = await postApiWithAuthenticated(url, params);
  return res;
};

export const AddUpdateEmployeeType = async (url = '', params) => {
  


  const res = await postApiWithAuthenticated(`${EmployeeTypeBaseUrl}${url}`, params);
  return res;
};
export const EmployeeProfileUpdation = async (url = '', params) => {
  if (params.employeeKeyID === null || params.employeeKeyID === undefined) {
    delete params.employeeKeyID;
  }

  const res = await postApiWithAuthenticated(`${EmployeeTypeBaseUrl}${url}`, params);
  return res;
};

export const GetEmployeeTypeModel = async (id) => {
  let url = `${EmployeeTypeBaseUrl}/GetEmployeeTypeModel?EmployeeTypeKeyID=${id}`;

  const res = await getListWithAuthenticated(url);
  return res;
};

export const GetTalukaLookupList = async (id) => {
  const url = `${EmployeeTypeBaseUrl}/GetTalukaLookupList?DistrictID=${id}`;

  const res = await getListWithAuthenticated(url);
  return res;
};



export const ChenageEmployeeTypeStatus = async (id, UserKeyID) => {
  let url = `${EmployeeTypeBaseUrl}/ChangeEmployeeTypeStatus?EmployeeTypeKeyID=${id}&UserKeyID=${UserKeyID}`;
  const res = await getListWithAuthenticated(url);
  return res;
};

export const GetEmployeeCountList = async (params) => {
  const res = await postApiWithAuthenticated(`${EmployeeTypeBaseUrl}/GetEmployeeCountList`, params);
  return res;
};

export const ResetEmployeeIMEINumber = async (url = '', params) => {
  const res = await postApiWithAuthenticated(`${EmployeeTypeBaseUrl}${url}`, params);
  return res;
};

export const GetEmployeeViewDetails = async (employeeKeyID) => {
  const url = `${EmployeeTypeBaseUrl}/GetEmployeeViewDetails?EmployeeKeyID=${employeeKeyID}`;

  const res = await getListWithAuthenticated(url);
  return res;
};

export const ResetEmployeePassword = async (url = '', params) => {
  if (params.employeeKeyID === null || params.employeeKeyID === undefined) {
    delete params.employeeKeyID;
  }

  const res = await postApiWithAuthenticated(`${EmployeeTypeBaseUrl}${url}`, params);
  return res;
};

export const GetEmployeeIMEILogList = async (params) => {
  const res = await postApiWithAuthenticated(`${EmployeeTypeBaseUrl}/GetEmployeeIMEILogList`, params);
  return res;
};
