import { Base_Url, generatePdf_Url } from 'component/Base-Url/BaseUrl';
import { postApiWithAuthenticated, getListWithAuthenticated } from 'services/ApiMethod/ApiMethod';

const CustomerStaffBaseUrl = `${Base_Url}/Customer`;

export const GetCustomerList = async (params) => {
  let url = `${CustomerStaffBaseUrl}/GetCustomerList`;

  const res = await postApiWithAuthenticated(url, params);
  return res;
};
export const GetAllCustomerReport = async (params) => {
  let url = `${CustomerStaffBaseUrl}/GetAllCustomerReport`;

  const res = await postApiWithAuthenticated(url, params);
  return res;
};


export const GetAllCustomerLeadsReportApi = async (params) => {
  

  let url = `${CustomerStaffBaseUrl}/GetAllCustomerLeadsReport`;

  const res = await postApiWithAuthenticated(url, params);
  return res;
};


export const GetCustomerInstalledDeviceList = async (params) => {
  let url = `${CustomerStaffBaseUrl}/GetCustomerInstalledDeviceList`;

  const res = await postApiWithAuthenticated(url, params);
  return res;
};
export const GetCustomerComplaintListByID = async (params) => {
  let url = `${CustomerStaffBaseUrl}/GetCustomerComplaintListByID`;

  const res = await postApiWithAuthenticated(url, params);
  return res;
};

export const AddUpdateCustomer = async (url = '', params) => {
  if (params.customerKeyID === null || params.customerKeyID === undefined) {
    delete params.customerKeyID;
  }

  const res = await postApiWithAuthenticated(`${CustomerStaffBaseUrl}${url}`, params);
  return res;
};

export const GetCustomerModel = async (id) => {
  let url = `${CustomerStaffBaseUrl}/GetCustomerModel?CustomerKeyID=${id}`;

  const res = await getListWithAuthenticated(url);
  return res;
};
export const GetRechargeListByCustomerID = async (id,status) => {
  let url = `${CustomerStaffBaseUrl}/GetRechargeListByCustomerID?CustomerKeyID=${id}&Status=${status}`;

  const res = await getListWithAuthenticated(url);
  return res;
};
export const GetAMCListByCustomerID = async (id,status) => {
  let url = `${CustomerStaffBaseUrl}/GetAMCListByCustomerID?CustomerKeyID=${id}&Status=${status}`;

  const res = await getListWithAuthenticated(url);
  return res;
};

export const GetCustomerLookupList = async () => {
  const url = `${CustomerStaffBaseUrl}/GetCustomerLookupList`;

  const res = await getListWithAuthenticated(url);
  return res;
};

export const uploadImageWithNodeApi = async (params) => {
  const url = `${generatePdf_Url}/uploadImage`;
  try {
    const formData = new FormData();
    formData.append('imageFile', params.imageFile); // Here, 'file' is the actual file object from input
    formData.append('moduleName', params.moduleName);
    formData.append('projectName', params.projectName);
    formData.append('userId', params.userId);
    // Debugging: Check FormData entries
    if (!(params.imageFile instanceof File)) {
      console.error('File object is invalid');
      return;
    }
    const response = await postApiWithAuthenticated(url, formData);
    return response;
  } catch (error) {
    console.error('Error uploading Image :', error);
    throw error;
  }
};

export const ChangeCustomerStatus = async (id, UserKeyID) => {
  let url = `${CustomerStaffBaseUrl}/ChangeCustomerStatus?CustomerKeyID=${id}&UserKeyID=${UserKeyID}`;
  const res = await getListWithAuthenticated(url);
  return res;
};

export const GetCustomerViewDetails = async (customerKeyID) => {
  const url = `${CustomerStaffBaseUrl}/GetCustomerViewDetails?CustomerKeyID=${customerKeyID}`;

  const res = await getListWithAuthenticated(url);
  return res;
};
export const GetCustomerUserNamePassword = async (customerKeyID) => {
  const url = `${CustomerStaffBaseUrl}/GetCustomerUserNamePassword?CustomerKeyID=${customerKeyID}`;

  const res = await getListWithAuthenticated(url);
  return res;
};
