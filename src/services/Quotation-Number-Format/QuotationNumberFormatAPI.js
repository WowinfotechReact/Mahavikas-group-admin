import { Base_Url } from "component/Base-Url/BaseUrl";
import { postApiWithAuthenticated, getListWithAuthenticated } from 'services/ApiMethod/ApiMethod';

const QuotationNumFormatUrl = `${Base_Url}/QuotationNumberFormat`;


export const GetQuotationNumFormatList = async (params) => {
  let url = `${QuotationNumFormatUrl}/GetQutationNumberFormatList`;

  const res = await postApiWithAuthenticated(url, params);
  return res;
};
export const AddUpdateQuotationNumFormatApi = async (params) => {
  const url = `${QuotationNumFormatUrl}/AddUpdateQuotationNumberFormat`;
  const res = await postApiWithAuthenticated(url, params);
  return res;
};


export const GetQuotationNumberFormatByID = async (id) => {
    let url = `${QuotationNumFormatUrl}/GetQuotationNumberFormat?QuotationNumberFormatKeyID=${id}`;
  
    const res = await getListWithAuthenticated(url);
    return res;
  };


export const GetQuotationNumberFormatLookupList = async () => {
    const url = `${QuotationNumFormatUrl}/GetQutationNumberFormatLookupList`;
  
    const res = await getListWithAuthenticated(url );
    return res;
  };

  
  export const ChangeQuotationNumberFormatStatus = async (id,UserKeyID) => {
    let url = `${QuotationNumFormatUrl}/QutationNumberFormaStatus?QuotationNumberFormatKeyID=${id}&UserKeyID=${UserKeyID}`;
    const res = await getListWithAuthenticated(url);
    return res;
  };