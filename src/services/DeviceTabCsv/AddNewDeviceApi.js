import { Base_Url } from 'component/Base-Url/BaseUrl';
import { postApiWithAuthenticated, getListWithAuthenticated } from 'services/ApiMethod/ApiMethod';

const NewDeviceImportBaseUrl = `${Base_Url}/Device`;

export const GetDeviceList = async (params) => {
  let url = `${NewDeviceImportBaseUrl}/GetDeviceList`;

  const res = await postApiWithAuthenticated(url, params);
  return res;
};

export const AddUpdateDeviceApi = async (url = '', params) => {
  if (params.deviceKeyID === null || params.deviceKeyID === undefined) {
    delete params.deviceKeyID;
  }

  const res = await postApiWithAuthenticated(`${NewDeviceImportBaseUrl}${url}`, params);
  return res;
};

export const GetDeviceModel = async (id) => {
  let url = `${NewDeviceImportBaseUrl}/GetDeviceModel?DeviceKeyID=${id}`;
  const res = await getListWithAuthenticated(url);
  return res;
};

export const GetComplaintTypeLookupList = async () => {
  const url = `${NewDeviceImportBaseUrl}/GetComplaintTypeLookupList`;
  const res = await getListWithAuthenticated(url);
  return res;
};

export const ChangeComplaintTypeStatus = async (id, UserKeyID) => {
  let url = `${NewDeviceImportBaseUrl}/ChangeComplaintTypeStatus?ComplaintTypeKeyID=${id}&UserKeyID=${UserKeyID}`;
  const res = await getListWithAuthenticated(url);
  return res;
};


 export const ChangeDeviceStatus = async (id,UserKeyID) => {
    let url = `${NewDeviceImportBaseUrl}/ChangeDeviceStatus?DeviceKeyID=${id}&UserKeyID=${UserKeyID}`;
    const res = await getListWithAuthenticated(url);
    return res;
  };