  import { Base_Url } from "component/Base-Url/BaseUrl";
import { postApiWithAuthenticated, getListWithAuthenticated } from 'services/ApiMethod/ApiMethod';

const TrackingBaseUrl = `${Base_Url}/Trackin`;


export const GetTrackinList = async (params) => {
  let url = `${TrackingBaseUrl}/GetTrackinList`;

  const res = await postApiWithAuthenticated(url, params);
  return res;
};


// {{BaseUrl}}Trackin/ImportTrackinCSV?UserKeyID=079692C2-2B90-4F51-93CB-EE18632F425F&CompanyKeyID=ABB23B45-407D-4D30-B5EF-C14ABEC93182

export const ImportTrackinCSV = async (formData,userKeyID,companyKeyID) => {
  try {
    const res = await postApiWithAuthenticated(
      `${TrackingBaseUrl}/ImportTrackinCSV?UserKeyID=${userKeyID}&CompanyKeyID=${companyKeyID}`, 
      formData
    );
    return res;
  } catch (error) {
    console.error('Error in SVTS :', error);
    throw error;
  }
};
