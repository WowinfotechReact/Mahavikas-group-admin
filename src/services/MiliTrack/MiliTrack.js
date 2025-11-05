  import { Base_Url } from "component/Base-Url/BaseUrl";
import { postApiWithAuthenticated, getListWithAuthenticated } from 'services/ApiMethod/ApiMethod';

const MiliTrackBaseUrl = `${Base_Url}/MiliTrack`;


export const GetMilitrackList = async (params) => {
  let url = `${MiliTrackBaseUrl}/GetMilitrackList`;
  const res = await postApiWithAuthenticated(url, params);
  return res;
};
export const ImportSVTSMilitrackCSV = async (formData,userKeyID,companyKeyID) => {
  try {
    const res = await postApiWithAuthenticated(
      `${MiliTrackBaseUrl}/ImportSVTSMilitrackCSV?UserKeyID=${userKeyID}&CompanyKeyID=${companyKeyID}`, 
      formData
    );
    return res;
  } catch (error) {
    console.error('Error in SVTS :', error);
    throw error;
  }
};

export const ImportSVTS1MilitrackCSV = async (formData,userKeyID,companyKeyID) => {
  try {
    const res = await postApiWithAuthenticated(
      `${MiliTrackBaseUrl}/ImportSVTS1MilitrackCSV?UserKeyID=${userKeyID}&CompanyKeyID=${companyKeyID}`, 
      formData
    );
    return res;
  } catch (error) {
    console.error('Error in SVTS :', error);
    throw error;
  }
};
export const ImportVihaanaMilitrackCSV = async (formData,userKeyID,companyKeyID) => {
  try {
    const res = await postApiWithAuthenticated(
      `${MiliTrackBaseUrl}/ImportVihaanaMilitrackCSV?UserKeyID=${userKeyID}&CompanyKeyID=${companyKeyID}`, 
      formData
    );
    return res;
  } catch (error) {
    console.error('Error in SVTS :', error);
    throw error;
  }
};
