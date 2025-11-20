import { Base_Url } from 'component/Base-Url/BaseUrl';
import { postApiWithAuthenticated, getListWithAuthenticated } from 'services/ApiMethod/ApiMethod';

const MasterDistrictBaseUrl = `${Base_Url}/District`;

export const GetDistrictList = async (params) => {
  let url = `${MasterDistrictBaseUrl}/GetDistrictList`;

  const res = await postApiWithAuthenticated(url, params);
  return res;
};
export const AddUpdateDistrict = async (url = '', params) => {
  if (params.stateID === null || params.stateID === undefined) {
    delete params.stateID;
  }

  const res = await postApiWithAuthenticated(`${MasterDistrictBaseUrl}${url}`, params);
  return res;
};

export const GetDistrictModel = async (id) => {
  let url = `${MasterDistrictBaseUrl}/GetDistrictModel?DistrictID=${id}`;

  const res = await getListWithAuthenticated(url);
  return res;
};

export const GetDistrictLookupList = async (ZoneIDs, userID, StateID) => {
  let url = `${MasterDistrictBaseUrl}/GetDistrictLookupList`;

  let params = [];

  if (ZoneIDs) params.push(`ZoneIDs=${ZoneIDs}`);
  if (userID) params.push(`userID=${userID}`);
  if (StateID) params.push(`StateID=${StateID}`);

  if (params.length > 0) {
    url += `?${params.join("&")}`;
  }

  const res = await getListWithAuthenticated(url);
  return res;
};



export const ChangeDistrictStatus = async (id, UserKeyID) => {
  let url = `${MasterDistrictBaseUrl}/ChangeDistrictStatus?DistrictID=${id}&UserKeyID=${UserKeyID}`;
  const res = await getListWithAuthenticated(url);
  return res;
};
