import { Base_Url } from 'component/Base-Url/BaseUrl';
import { postApiWithAuthenticated, getListWithAuthenticated } from 'services/ApiMethod/ApiMethod';

const EmployeeBaseUrl = `${Base_Url}/Employee`;

export const GetEmployeeList = async (params) => {
  let url = `${EmployeeBaseUrl}/GetEmployeeList`;

  const res = await postApiWithAuthenticated(url, params);
  return res;
};

export const AddUpdateEmployee = async (url = '', params) => {
  if (params.employeeKeyID === null || params.employeeKeyID === undefined) {
    delete params.employeeKeyID;
  }

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
export const GetEmployeeLookupList = async (params) => {
  
  const res = await postApiWithAuthenticated(`${EmployeeBaseUrl}${'/GetEmployeeLookupList'}`, params);
  return res;
};


export const GetEmployeeModel = async (id) => {
  let url = `${EmployeeBaseUrl}/GetEmployeeModel?EmployeeKeyID=${id}`;

  const res = await getListWithAuthenticated(url);
  return res;
};




export const ChangeEmployeeStatus = async (id, UserKeyID) => {
  let url = `${EmployeeBaseUrl}/ChangeEmployeeStatus?EmployeeKeyID=${id}&UserKeyID=${UserKeyID}`;
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
