import { Base_Url } from 'component/Base-Url/BaseUrl';
import { postApiWithAuthenticated, getListWithAuthenticated } from 'services/ApiMethod/ApiMethod';

const MasterTalukaBaseUrl = `${Base_Url}/Taluka`;

export const GetTalukaList = async (params) => {
  let url = `${MasterTalukaBaseUrl}/GetTalukaList`;

  const res = await postApiWithAuthenticated(url, params);
  return res;
};
export const AddUpdateTaluka = async (url = '', params) => {
  if (params.stateID === null || params.stateID === undefined) {
    delete params.stateID;
  }

  const res = await postApiWithAuthenticated(`${MasterTalukaBaseUrl}${url}`, params);
  return res;
};

export const GetTalukaModel = async (id) => {
  let url = `${MasterTalukaBaseUrl}/GetTalukaModel?TalukaID=${id}`;

  const res = await getListWithAuthenticated(url);
  return res;
};

export const GetTalukaLookupList = async (id) => {
  const url = `${MasterTalukaBaseUrl}/GetTalukaLookupList?DistrictKeyID=${id}`;

  const res = await getListWithAuthenticated(url);
  return res;
};

export const ChangeTalukaStatus = async (id, UserKeyID) => {
  let url = `${MasterTalukaBaseUrl}/ChangeTalukaStatus?TalukaID=${id}&UserKeyID=${UserKeyID}`;
  const res = await getListWithAuthenticated(url);
  return res;
};
