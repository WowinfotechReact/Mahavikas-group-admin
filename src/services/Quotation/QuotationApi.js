import { Base_Url } from "component/Base-Url/BaseUrl";
import { postApiWithAuthenticated, getListWithAuthenticated } from 'services/ApiMethod/ApiMethod';

const QuotationNumberFormatBaseUrl = `${Base_Url}/QuotationNumberFormat`;
const ManufacturerModalBaseUrl = `${Base_Url}/Manufacturer`;



export const GetModelList = async (params,productKeyID) => {
  let url = `${ModelBaseUrl}/GetModelList?productKeyID=${productKeyID}`;

  const res = await postApiWithAuthenticated(url, params);
  return res;
};
export const AddUpdateModelApi = async (url = '', params) => {
  if (params.ModelID === null || params.ModelID === undefined) {
    delete params.ModelID;
  }

  const res = await postApiWithAuthenticated(`${ModelBaseUrl}${url}`, params);
  return res;
};


export const GetModelByID = async (id) => {
    let url = `${ModelBaseUrl}/GetModelModel?ModelKeyID=${id}`;
  
    const res = await getListWithAuthenticated(url);
    return res;
  };


export const GetQutationNumberFormatLookupList = async () => {
    const url = `${QuotationNumberFormatBaseUrl}/GetQutationNumberFormatLookupList`;
  
    const res = await getListWithAuthenticated(url );
    return res;
  };
 
  
  
  
  export const ChangeModelStatus = async (id,UserKeyID) => {
    let url = `${ModelBaseUrl}/ChangeModelStatus?ModelKeyID=${id}&UserKeyID=${UserKeyID}`;
    const res = await getListWithAuthenticated(url);
    return res;
  };