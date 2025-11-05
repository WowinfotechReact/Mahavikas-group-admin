import { Base_Url } from "component/Base-Url/BaseUrl";
import { postApiWithAuthenticated, getListWithAuthenticated } from 'services/ApiMethod/ApiMethod';

const termsAndCondition = `${Base_Url}/TermsAndConditions`;
const ManufacturerModalBaseUrl = `${Base_Url}/Manufacturer`;
const VarientModalBaseUrl = `${Base_Url}/Variant`;


export const GetModelList = async (params,productKeyID) => {
  let url = `${termsAndCondition}/GetModelList?productKeyID=${productKeyID}`;

  const res = await postApiWithAuthenticated(url, params);
  return res;
};
export const AddUpdateModelApi = async (url = '', params) => {
  if (params.ModelID === null || params.ModelID === undefined) {
    delete params.ModelID;
  }

  const res = await postApiWithAuthenticated(`${termsAndCondition}${url}`, params);
  return res;
};


export const GetModelByID = async (id) => {
    let url = `${termsAndCondition}/GetModelModel?ModelKeyID=${id}`;
  
    const res = await getListWithAuthenticated(url);
    return res;
  };


export const GetTermsAndConditionsLookupList = async () => {
    const url = `${termsAndCondition}/GetTermsAndConditionsLookupList`;
  
    const res = await getListWithAuthenticated(url );
    return res;
  };

  
  export const ChangeModelStatus = async (id,UserKeyID) => {
    let url = `${termsAndCondition}/ChangeModelStatus?ModelKeyID=${id}&UserKeyID=${UserKeyID}`;
    const res = await getListWithAuthenticated(url);
    return res;
  };