import { Base_Url } from 'component/Base-Url/BaseUrl';
import { postApiWithAuthenticated, getListWithAuthenticated } from 'services/ApiMethod/ApiMethod';

const EmployeeBaseUrl = `${Base_Url}/AppUser`;

export const GetAppUserList = async (params) => {
  let url = `${EmployeeBaseUrl}/GetAppUserList`;

  const res = await postApiWithAuthenticated(url, params);
  return res;
};


export const UpdateUserProjectPermission = async (url = '', params) => {
  

  const res = await postApiWithAuthenticated(`${EmployeeBaseUrl}${url}`, params);
  return res;
};
export const UpdateWebAppUserPassword = async (url = '', params) => {
  

  const res = await postApiWithAuthenticated(`${EmployeeBaseUrl}${url}`, params);
  return res;
};

export const AssignWebAppUserAndSetPassword = async (url = '', params) => {
  

  const res = await postApiWithAuthenticated(`${EmployeeBaseUrl}${url}`, params);
  return res;
};
export const ResetEmployeeMACAddress = async (url = '', params) => {
  

  const res = await postApiWithAuthenticated(`${EmployeeBaseUrl}${url}`, params);
  return res;
};
export const EmployeeProfileUpdation = async (url = '', params) => {
  if (params.employeeKeyID === null || params.employeeKeyID === undefined) {
    delete params.employeeKeyID;
  }

  const res = await postApiWithAuthenticated(`${EmployeeBaseUrl}${url}`, params);
  return res;
};
export const AddUpdateAppUser = async (url = '', params) => {
  if (params.employeeKeyID === null || params.employeeKeyID === undefined) {
    delete params.employeeKeyID;
  }

  const res = await postApiWithAuthenticated(`${EmployeeBaseUrl}${url}`, params);
  return res;
};
export const GetEmployeeLookupList = async (params) => {
  
  const res = await postApiWithAuthenticated(`${EmployeeBaseUrl}${'/GetEmployeeLookupList'}`, params);
  return res;
};
export const GetAppUserTypeLookupList = async (params) => {
  
  const res = await getListWithAuthenticated(`${EmployeeBaseUrl}${'/GetAppUserTypeLookupList'}`, params);
  return res;
};

//not in use
export const GetEmployeeModel = async (id,UserDetailsKeyID) => {
  let url = `${EmployeeBaseUrl}/GetAppUserModel`;

  const res = await getListWithAuthenticated(url);
  return res;
};
export const GetAppUserModel = async (id,UserDetailsKeyID) => {
  let url = `${EmployeeBaseUrl}/GetAppUserModel?UserKeyIDForUpdate=${id}&UserDetailsKeyID=${UserDetailsKeyID}`;

  const res = await getListWithAuthenticated(url);
  return res;
};




export const ChangeEmployeeStatus = async (id,companyID) => {
  let url = `${EmployeeBaseUrl}/ChangeAppUserStatus?UserKeyIDForUpdate=${id}&companyID=${companyID}`;
  const res = await getListWithAuthenticated(url);
  return res;
};

export const GetEmployeeCountList = async (params) => {
  const res = await postApiWithAuthenticated(`${EmployeeBaseUrl}/GetEmployeeCountList`, params);
  return res;
};

export const ResetEmployeeIMEINumber = async (url = '', params) => {
  const res = await postApiWithAuthenticated(`${EmployeeBaseUrl}${url}`, params);
  return res;
};

export const GetEmployeeViewDetails = async (employeeKeyID) => {
  const url = `${EmployeeBaseUrl}/GetEmployeeViewDetails?EmployeeKeyID=${employeeKeyID}`;

  const res = await getListWithAuthenticated(url);
  return res;
};

export const ResetEmployeePassword = async (url = '', params) => {
  if (params.employeeKeyID === null || params.employeeKeyID === undefined) {
    delete params.employeeKeyID;
  }

  const res = await postApiWithAuthenticated(`${EmployeeBaseUrl}${url}`, params);
  return res;
};

export const GetEmployeeIMEILogList = async (params) => {
  const res = await postApiWithAuthenticated(`${EmployeeBaseUrl}/GetEmployeeIMEILogList`, params);
  return res;
};
