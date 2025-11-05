import { Base_Url } from 'component/Base-Url/BaseUrl';
import { getListWithAuthenticated, postApiWithAuthenticated } from 'services/ApiMethod/ApiMethod';

const LeadBaseURL = `${Base_Url}/Lead`;
const QutationTypeURL = `${Base_Url}/QuotationType`;
const QutationFormatURL = `${Base_Url}/QuotationFormat`;


export const GetLeadDataList = async (params) => {
  const url = `${LeadBaseURL}/GetLeadList`;
  const res = await postApiWithAuthenticated(url, params);
  return res;
};

export const AddUpdateLeadApi = async (params) => {
  const url = `${LeadBaseURL}/AddUpdateLead`;
  const res = await postApiWithAuthenticated(url, params);
  return res;
};
export const LeadAssignToSales = async (params) => {
  const url = `${LeadBaseURL}/LeadAssignToSales`;
  const res = await postApiWithAuthenticated(url, params);
  return res;
};
export const MultipleLeadAssignToSalesman = async (params) => {
  const url = `${LeadBaseURL}/MultipleLeadAssignToSalesman`;
  const res = await postApiWithAuthenticated(url, params);
  return res;
};

export const GetLeadModel = async (id) => {
  let url = `${LeadBaseURL}/GetLeadModel?LeadKeyID=${id}`;

  const res = await getListWithAuthenticated(url);
  return res;
};
export const GetLeadLogList = async (id) => {
  let url = `${LeadBaseURL}/GetLeadLogList?LeadKeyID=${id}`;

  const res = await getListWithAuthenticated(url);
  return res;
};

export const AssignTechnicianApi = async (params) => {
  const url = `${LeadBaseURL}/AssignLeadSalesman`;
  const res = await postApiWithAuthenticated(url, params);
  return res;
};

export const ChangeLeadStatus = async (id, UserKeyID) => {
  let url = `${LeadBaseURL}/ChangeLeadStatus?LeadKeyID=${id}&UserKeyID=${UserKeyID}`;
  const res = await getListWithAuthenticated(url);
  return res;
};

export const GetLeadLookupList = async () => {
  const url = `${LeadBaseURL}/GetLeadLookupList`;

  const res = await getListWithAuthenticated(url);
  return res;
};
export const GetCustomerLeadLookupList = async (CustomerID) => {
  const url = `${LeadBaseURL}/GetCustomerLeadLookupList?CustomerID=${CustomerID}`;

  const res = await getListWithAuthenticated(url);
  return res;
};
export const GetQutationTypeLookupList = async () => {
  const url = `${QutationTypeURL}/GetQuotationTypeLookupList`;

  const res = await getListWithAuthenticated(url);
  return res;
};

export const GetquotationFormatLookupList = async () => {
  const url = `${QutationFormatURL}/GetQuotationFormatLookupList`;

  const res = await getListWithAuthenticated(url);
  return res;
};