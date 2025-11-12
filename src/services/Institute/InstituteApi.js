import { Base_Url } from 'component/Base-Url/BaseUrl';
import { postApiWithAuthenticated, getListWithAuthenticated } from 'services/ApiMethod/ApiMethod';

const InstituteBaseURI = `${Base_Url}/Institute`;

export const GetInstituteList = async (params) => {
  let url = `${InstituteBaseURI}/GetInstituteList`;

  const res = await postApiWithAuthenticated(url, params);
  return res;
};


export const AddUpdateInstitute = async (url = '', params) => {
  if (params.employeeKeyID === null || params.employeeKeyID === undefined) {
    delete params.employeeKeyID;
  }

  const res = await postApiWithAuthenticated(`${InstituteBaseURI}${url}`, params);
  return res;
};

export const GetEmployeeLookupList = async (params) => {
  
  const res = await postApiWithAuthenticated(`${InstituteBaseURI}${'/GetEmployeeLookupList'}`, params);
  return res;
};


export const GetInstituteModel = async (id) => {
  let url = `${InstituteBaseURI}/GetInstituteModel?InstituteKeyID=${id}`;

  const res = await getListWithAuthenticated(url);
  return res;
};




export const ChangeEmployeeStatus = async (id, UserKeyID) => {
  let url = `${InstituteBaseURI}/ChangeEmployeeStatus?EmployeeKeyID=${id}&UserKeyID=${UserKeyID}`;
  const res = await getListWithAuthenticated(url);
  return res;
};

export const GetEmployeeCountList = async (params) => {
  const res = await postApiWithAuthenticated(`${InstituteBaseURI}/GetEmployeeCountList`, params);
  return res;
};

export const ResetEmployeeIMEINumber = async (url = '', params) => {
  const res = await postApiWithAuthenticated(`${InstituteBaseURI}${url}`, params);
  return res;
};

export const GetEmployeeViewDetails = async (employeeKeyID) => {
  const url = `${InstituteBaseURI}/GetEmployeeViewDetails?EmployeeKeyID=${employeeKeyID}`;

  const res = await getListWithAuthenticated(url);
  return res;
};

export const ResetEmployeePassword = async (url = '', params) => {
  if (params.employeeKeyID === null || params.employeeKeyID === undefined) {
    delete params.employeeKeyID;
  }

  const res = await postApiWithAuthenticated(`${InstituteBaseURI}${url}`, params);
  return res;
};

export const GetEmployeeIMEILogList = async (params) => {
  const res = await postApiWithAuthenticated(`${InstituteBaseURI}/GetEmployeeIMEILogList`, params);
  return res;
};
