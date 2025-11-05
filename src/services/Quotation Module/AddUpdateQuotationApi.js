import { Base_Url } from "component/Base-Url/BaseUrl";
import { postApiWithAuthenticated, getListWithAuthenticated } from 'services/ApiMethod/ApiMethod';

const QuotationBaseUrl = `${Base_Url}/Quotation`;



export const GetModelList = async (params,productKeyID) => {
  let url = `${QuotationBaseUrl}/GetModelList?productKeyID=${productKeyID}`;

  const res = await postApiWithAuthenticated(url, params);
  return res;
};
export const GetAllQuotationLogList = async (params) => {
  let url = `${QuotationBaseUrl}/GetAllQuotationLogList`;

  const res = await postApiWithAuthenticated(url, params);
  return res;
};

export const UpdateQuotationPDFurl = async (param) => {
  let url = `${QuotationBaseUrl}/UpdateQuotationPDFurl`;
  const res = await postApiWithAuthenticated(url, param);
  return res;
};

export const ChangeSendQuotationStatus = async (UserKeyID, QuotationKeyID) => {
  let url = `${QuotationBaseUrl}/ChangeSendQuotationStatus?UserKeyID=${UserKeyID}&QuotationKeyID=${QuotationKeyID}`;
  const res = await getListWithAuthenticated(url);
  return res;
};
export const AddUpdateQuotation = async (url = '', params) => {
 
  const res = await postApiWithAuthenticated(`${QuotationBaseUrl}${url}`, params);
  return res;
};
export const ApproveOrRejectQuotation = async (url = '', params) => {
 
  const res = await postApiWithAuthenticated(`${QuotationBaseUrl}${url}`, params);
  return res;
};



export const GetQuotationModel = async (id) => {
    let url = `${QuotationBaseUrl}/GetQuotationModel?quotationKeyID=${id}`;
  
    const res = await getListWithAuthenticated(url);
    return res;
  };
export const GetQuotationDetails = async (id) => {
    let url = `${QuotationBaseUrl}/GetQuotationDetails?quotationKeyID=${id}`;
  
    const res = await getListWithAuthenticated(url);
    return res;
  };


export const GetQutationNumberFormatLookupList = async () => {
    const url = `${QuotationNumberFormatBaseUrl}/GetQutationNumberFormatLookupList`;
  
    const res = await getListWithAuthenticated(url );
    return res;
  };
  
  
  export const ChangeModelStatus = async (id,UserKeyID) => {
    let url = `${QuotationBaseUrl}/ChangeModelStatus?ModelKeyID=${id}&UserKeyID=${UserKeyID}`;
    const res = await getListWithAuthenticated(url);
    return res;
  };