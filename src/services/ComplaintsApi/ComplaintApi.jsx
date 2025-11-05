import { Base_Url } from 'component/Base-Url/BaseUrl';
import { getListWithAuthenticated, postApiWithAuthenticated } from 'services/ApiMethod/ApiMethod';

const ComplaintBaseURL = `${Base_Url}/Complaint`;

export const GetComplaintCompletedList = async (params) => {
  const url = `${ComplaintBaseURL}/GetComplaintCompletedList`;
  const res = await postApiWithAuthenticated(url, params);
  return res;
};
export const GetComplaintList = async (params) => {
  const url = `${ComplaintBaseURL}/GetComplaintList`;
  const res = await postApiWithAuthenticated(url, params);
  return res;
};

export const GetCompletedComplaintsDataList = async (params) => {
  const url = `${ComplaintBaseURL}/GetComplaintCompletedList`;
  const res = await postApiWithAuthenticated(url, params);
  return res;
};

export const AddUpdateComplaintApi = async (params) => {
  const url = `${ComplaintBaseURL}/AddUpdateComplaint`;
  const res = await postApiWithAuthenticated(url, params);
  return res;
};
export const ComplaintStageChangeStatus = async (params) => {
  const url = `${ComplaintBaseURL}/ComplaintStageChangeStatus`;
  const res = await postApiWithAuthenticated(url, params);
  return res;
};
export const ComplaintSalesReturnAccept = async (params) => {
  const url = `${ComplaintBaseURL}/ComplaintSalesReturnAccept`;
  const res = await postApiWithAuthenticated(url, params);
  return res;
};
export const SendSalesReturnApprovalRequest = async (params) => {
  const url = `${ComplaintBaseURL}/SendSalesReturnApprovalRequest`;
  const res = await postApiWithAuthenticated(url, params);
  return res;
};
export const DeviceSendToManufacturer = async (params) => {
  const url = `${ComplaintBaseURL}/DeviceSendToManufacurer`;
  const res = await postApiWithAuthenticated(url, params);
  return res;
};
export const MultipleComplaintAssignToSalesman = async (params) => {
  const url = `${ComplaintBaseURL}/MultipleComplaintAssignToSalesman`;
  const res = await postApiWithAuthenticated(url, params);
  return res;
};
export const DeviceReceiveFromManufacturer = async (params) => {
  const url = `${ComplaintBaseURL}/DeviceReceiveFromManufacurer`;
  const res = await postApiWithAuthenticated(url, params);
  return res;
};
export const SalesReturnTransferDevice = async (params) => {
  const url = `${ComplaintBaseURL}/SalesReturnTransferDevice`;
  const res = await postApiWithAuthenticated(url, params);
  return res;
};

export const GetComplaintTypeLookupList = async () => {
  const url = `${Base_Url}/ComplaintType/GetComplaintTypeLookupList`;

  const res = await getListWithAuthenticated(url);
  return res;
};

export const GetComplaintModel = async (id) => {
  const url = `${Base_Url}/Complaint/GetComplaintModel?ComplaintKeyID=${id}`;

  const res = await getListWithAuthenticated(url);
  return res;
};
export const GetComplaintLogList = async (id) => {
  const url = `${Base_Url}/Complaint/GetComplaintLogList?ComplaintKeyID=${id}`;

  const res = await getListWithAuthenticated(url);
  return res;
};
