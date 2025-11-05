import { Base_Url } from "component/Base-Url/BaseUrl";
import { postApiWithAuthenticated,getListWithAuthenticated } from "services/ApiMethod/ApiMethod";

export const ImportDeviceCSV = async (formData,userKeyID,companyKeyID) => {
  
    try {
      const res = await postApiWithAuthenticated(
        `${Base_Url}/Device/ImportDeviceCSV?UserKeyID=${userKeyID}&CompanyKeyID=${companyKeyID}`, 
        formData
      );
      return res;
    } catch (error) {
      console.error('Error in DeviceImport:', error);
      throw error;
    }
  };

  export const GetDeviceViewDetails = async (deviceKeyID) => {
    const url = `${Base_Url}/Device/GetDeviceViewDetails?DeviceKeyID=${deviceKeyID}`;
    const res = await getListWithAuthenticated(url);
    return res;
  };