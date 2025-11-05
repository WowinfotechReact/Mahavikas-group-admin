import { Base_Url } from 'component/Base-Url/BaseUrl';
import { postApiWithAuthenticated } from 'services/ApiMethod/ApiMethod';

export const DeviceImport = async (formData) => {
  try {
    const res = await postApiWithAuthenticated(`${Base_Url}/Device/DeviceImport`, formData);
    return res;
  } catch (error) {
    console.error('Error in DeviceImport:', error);
    throw error;
  }
};
