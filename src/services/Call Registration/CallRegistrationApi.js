import { Base_Url } from 'component/Base-Url/BaseUrl';
import { getListWithAuthenticated, postApiWithAuthenticated } from 'services/ApiMethod/ApiMethod';

const serviceCallBaseUrl = `${Base_Url}/ServiceCall`;

export const GetServiceCallList = async (params) => {
  const url = `${serviceCallBaseUrl}/GetServiceCallList`;
  const res = await postApiWithAuthenticated(url, params);
  return res;
};
export const GetComplaintList = async (params) => {
  const url = `${serviceCallBaseUrl}/GetComplaintList`;
  const res = await postApiWithAuthenticated(url, params);
  return res;
};





export const AddUpdateServiceCall = async (url = '', params) => {

  const res = await postApiWithAuthenticated(`${serviceCallBaseUrl}${url}`, params);
  return res;
};
export const AssignServiceCallToSiteEng = async (url = '', params) => {

  const res = await postApiWithAuthenticated(`${serviceCallBaseUrl}${url}`, params);
  return res;
};

export const ComplaintStageChangeStatus = async (params) => {
  const url = `${serviceCallBaseUrl}/ComplaintStageChangeStatus`;
  const res = await postApiWithAuthenticated(url, params);
  return res;
};
export const ComplaintSalesReturnAccept = async (params) => {
  const url = `${serviceCallBaseUrl}/ComplaintSalesReturnAccept`;
  const res = await postApiWithAuthenticated(url, params);
  return res;
};
export const SendSalesReturnApprovalRequest = async (params) => {
  const url = `${serviceCallBaseUrl}/SendSalesReturnApprovalRequest`;
  const res = await postApiWithAuthenticated(url, params);
  return res;
};
export const DeviceSendToManufacturer = async (params) => {
  const url = `${serviceCallBaseUrl}/DeviceSendToManufacurer`;
  const res = await postApiWithAuthenticated(url, params);
  return res;
};
export const MultipleComplaintAssignToSalesman = async (params) => {
  const url = `${serviceCallBaseUrl}/MultipleComplaintAssignToSalesman`;
  const res = await postApiWithAuthenticated(url, params);
  return res;
};
export const DeviceReceiveFromManufacturer = async (params) => {
  const url = `${serviceCallBaseUrl}/DeviceReceiveFromManufacurer`;
  const res = await postApiWithAuthenticated(url, params);
  return res;
};
export const SalesReturnTransferDevice = async (params) => {
  const url = `${serviceCallBaseUrl}/SalesReturnTransferDevice`;
  const res = await postApiWithAuthenticated(url, params);
  return res;
};

export const GetComplaintTypeLookupList = async () => {
  const url = `${serviceCallBaseUrl}/ComplaintType/GetComplaintTypeLookupList`;

  const res = await getListWithAuthenticated(url);
  return res;
};

export const GetServiceCallModel = async (id) => {
  const url = `${serviceCallBaseUrl}/GetServiceCallModel?ServiceCallKeyID=${id}`;

  const res = await getListWithAuthenticated(url);
  return res;
};
export const GetServiceCallDetailsList = async (id) => {
  const url = `${serviceCallBaseUrl}/GetServiceCallDetailsList?ServiceCallKeyID=${id}`;

  const res = await getListWithAuthenticated(url);
  return res;
};
export const GetComplaintLogList = async (id) => {
  const url = `${serviceCallBaseUrl}/GetComplaintLogList?ComplaintKeyID=${id}`;

  const res = await getListWithAuthenticated(url);
  return res;
};
