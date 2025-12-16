import { Base_Url } from 'component/Base-Url/BaseUrl';
import { postApiWithAuthenticated, getListWithAuthenticated, postApiWithAuthenticatedZip } from 'services/ApiMethod/ApiMethod';

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
// export const ExportInstituteAttendanceZip = async (url = '', params) => {
 
//   const res = await postApiWithAuthenticated(`${InstituteBaseURI}${url}`, params);
//   return res;
// };


export const ExportInstituteAttendanceZip = async (url = '', params) => {
  return postApiWithAuthenticatedZip(
    `${InstituteBaseURI}${url}`,
    params,
    { responseType: 'blob' } // 🔥 REQUIRED
  );
};

export const GetInstituteLookupList = async (url = '', params) => {
  if (params.employeeKeyID === null || params.employeeKeyID === undefined) {
    delete params.employeeKeyID;
  }

  const res = await postApiWithAuthenticated(`${InstituteBaseURI}${url}`, params);
  return res;
};





export const GetInstituteModel = async (id) => {
  let url = `${InstituteBaseURI}/GetInstituteModel?InstituteKeyID=${id}`;

  const res = await getListWithAuthenticated(url);
  return res;
};




export const ChangeInstituteStatus = async (id) => {
  let url = `${InstituteBaseURI}/ChangeInstituteStatus?InstituteKeyID=${id}`;
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
