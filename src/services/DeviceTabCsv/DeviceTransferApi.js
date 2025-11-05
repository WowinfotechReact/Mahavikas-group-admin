import { Base_Url } from "component/Base-Url/BaseUrl";
import { postApiWithAuthenticated,getListWithAuthenticated } from "services/ApiMethod/ApiMethod";


const DeviceTabBaseUrl = `${Base_Url}/Device`;



export const GetDeviceTransferList = async (params) => {
  let url = `${DeviceTabBaseUrl}/GetDeviceTransferList`;
  const res = await postApiWithAuthenticated(url, params);
  return res;
};
export const GetDeviceTransferredList = async (params) => {
  let url = `${DeviceTabBaseUrl}/GetMyTransferredDeviceList`;
  const res = await postApiWithAuthenticated(url, params);
  return res;
};

export const ImportDeviceCSV = async (formData,userKeyID,companyKeyID) => {
    try {
      const res = await postApiWithAuthenticated(
        `${DeviceTabBaseUrl}/Device/ImportDeviceCSV?UserKeyID=${userKeyID}&CompanyKeyID=${companyKeyID}`, 
        formData
      );
      return res;
    } catch (error) {
      console.error('Error in DeviceImport:', error);
      throw error;
    }
  };
  

  export const AddUpdateDeviceTransfer = async (url = '', params) => {
      
    const res = await postApiWithAuthenticated(`${DeviceTabBaseUrl}${url}`, params);
    return res;
  };