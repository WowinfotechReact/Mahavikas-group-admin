import { Base_Url } from 'component/Base-Url/BaseUrl';
import { postApiWithAuthenticated, getListWithAuthenticated } from 'services/ApiMethod/ApiMethod';

const MasterVillageBaseUrl = `${Base_Url}/Village`;

export const GetVillageList = async (params) => {
  let url = `${MasterVillageBaseUrl}/GetVillageList`;

  const res = await postApiWithAuthenticated(url, params);
  return res;
};
export const AddUpdateVillage = async (url = '', params) => {
  if (params.villageID === null || params.villageID === undefined) {
    delete params.villageID;
  }

  const res = await postApiWithAuthenticated(`${MasterVillageBaseUrl}${url}`, params);
  return res;
};

export const GetVillageModel = async (id) => {
  let url = `${MasterVillageBaseUrl}/GetVillageModel?VillageID=${id}`;

  const res = await getListWithAuthenticated(url);
  return res;
};

export const GetVillageLookupList = async (id) => {
  const url = `${MasterVillageBaseUrl}/GetVillageLookupList?TalukaKeyID=${id}`;

  const res = await getListWithAuthenticated(url);
  return res;
};

export const ChangeVillageStatus = async (id, UserKeyID) => {
  let url = `${MasterVillageBaseUrl}/ChangeVillageStatus?VillageID=${id}&UserKeyID=${UserKeyID}`;
  const res = await getListWithAuthenticated(url);
  return res;
};
