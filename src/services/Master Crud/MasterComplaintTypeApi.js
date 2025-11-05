import { Base_Url } from 'component/Base-Url/BaseUrl';
import { postApiWithAuthenticated, getListWithAuthenticated } from 'services/ApiMethod/ApiMethod';

const MasterComplaintTypeBaseUrl = `${Base_Url}/ComplaintType`;

export const GetComplaintTypeList = async (params) => {
  let url = `${MasterComplaintTypeBaseUrl}/GetComplaintTypeList`;

  const res = await postApiWithAuthenticated(url, params);
  return res;
};

export const AddUpdateComplaintTypeApi = async (url = '', params) => {
  if (params.complaintTypeKeyID === null || params.complaintTypeKeyID === undefined) {
    delete params.complaintTypeKeyID;
  }

  const res = await postApiWithAuthenticated(`${MasterComplaintTypeBaseUrl}${url}`, params);
  return res;
};

export const GetComplaintTypeModel = async (id) => {
  let url = `${MasterComplaintTypeBaseUrl}/GetComplaintTypeModel?ComplaintTypeKeyID=${id}`;
  const res = await getListWithAuthenticated(url);
  return res;
};

export const GetComplaintTypeLookupList = async () => {
  const url = `${MasterComplaintTypeBaseUrl}/GetComplaintTypeLookupList`;
  const res = await getListWithAuthenticated(url);
  return res;
};

export const ChangeComplaintTypeStatus = async (id, UserKeyID) => {
  let url = `${MasterComplaintTypeBaseUrl}/ChangeComplaintTypeStatus?ComplaintTypeKeyID=${id}&UserKeyID=${UserKeyID}`;
  const res = await getListWithAuthenticated(url);
  return res;
};
