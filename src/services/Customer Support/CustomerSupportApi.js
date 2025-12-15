import { Base_Url, generatePdf_Url } from 'component/Base-Url/BaseUrl';
import { postApiWithAuthenticated, getListWithAuthenticated } from 'services/ApiMethod/ApiMethod';

const CustomerSupportBaseURI = `${Base_Url}/CustomerSupport`;

export const GetCustomerSupportList = async (params) => {
  let url = `${CustomerSupportBaseURI}/GetCustomerSupportList`;

  const res = await postApiWithAuthenticated(url, params);
  return res;
};
export const GetAllCustomerReport = async (params) => {
  let url = `${CustomerSupportBaseURI}/GetAllCustomerReport`;

  const res = await postApiWithAuthenticated(url, params);
  return res;
};


export const GetAllCustomerLeadsReportApi = async (params) => {
  

  let url = `${CustomerSupportBaseURI}/GetAllCustomerLeadsReport`;

  const res = await postApiWithAuthenticated(url, params);
  return res;
};


export const GetCustomerInstalledDeviceList = async (params) => {
  let url = `${CustomerSupportBaseURI}/GetCustomerInstalledDeviceList`;

  const res = await postApiWithAuthenticated(url, params);
  return res;
};
export const GetCustomerComplaintListByID = async (params) => {
  let url = `${CustomerSupportBaseURI}/GetCustomerComplaintListByID`;

  const res = await postApiWithAuthenticated(url, params);
  return res;
};

export const AddUpdateCustomerSupport = async (url = '', params) => {
  

  const res = await postApiWithAuthenticated(`${CustomerSupportBaseURI}${url}`, params);
  return res;
};

export const GetCustomerSupportModel = async (id) => {
  let url = `${CustomerSupportBaseURI}/GetCustomerSupportModel?SupportKeyID=${id}`;

  const res = await getListWithAuthenticated(url);
  return res;
};


export const GetCustomerLookupList = async () => {
  const url = `${CustomerSupportBaseURI}/GetCustomerLookupList`;

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
  let url = `${CustomerSupportBaseURI}/ChangeCustomerStatus?CustomerKeyID=${id}&UserKeyID=${UserKeyID}`;
  const res = await getListWithAuthenticated(url);
  return res;
};

export const GetCustomerViewDetails = async (customerKeyID) => {
  const url = `${CustomerSupportBaseURI}/GetCustomerViewDetails?CustomerKeyID=${customerKeyID}`;

  const res = await getListWithAuthenticated(url);
  return res;
};
export const GetCustomerUserNamePassword = async (customerKeyID) => {
  const url = `${CustomerSupportBaseURI}/GetCustomerUserNamePassword?CustomerKeyID=${customerKeyID}`;

  const res = await getListWithAuthenticated(url);
  return res;
};
