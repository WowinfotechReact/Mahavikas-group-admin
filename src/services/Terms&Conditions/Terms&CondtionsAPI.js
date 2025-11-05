import { Base_Url } from "component/Base-Url/BaseUrl";
import { postApiWithAuthenticated, getListWithAuthenticated } from 'services/ApiMethod/ApiMethod';

const TermsAndCondtionsUrl = `${Base_Url}/TermsAndConditions`;


export const GetTermsAndCondtionsList = async (params) => {
  let url = `${TermsAndCondtionsUrl}/GetTermsAndConditionsList`;

  const res = await postApiWithAuthenticated(url, params);
  return res;
};
export const AddUpdateTermsAndCondtionsApi = async (params) => {
  const url = `${TermsAndCondtionsUrl}/AddUpdateTermsAndConditions`;
  const res = await postApiWithAuthenticated(url, params);
  return res;
};


export const GetTermsAndCondtionsByID = async (id) => {
    let url = `${TermsAndCondtionsUrl}/GetTermsAndConditionsModel?TermsAndConditionsKeyID=${id}`;
  
    const res = await getListWithAuthenticated(url);
    return res;
  };


export const GetTermsAndCondtionsLookupList = async () => {
    const url = `${TermsAndCondtionsUrl}/GetTermsAndConditionsLookupList`;
  
    const res = await getListWithAuthenticated(url );
    return res;
  };

  
  