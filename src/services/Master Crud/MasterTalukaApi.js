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
  let url = `${MasterTalukaBaseUrl}/GetTalukaModel?TalukaKeyID=${id}`;

  const res = await getListWithAuthenticated(url);
  return res;
};

export const GetTalukaLookupList = async (DistrictIDs, CompanyID, ProjectID) => {
  let url = `${MasterTalukaBaseUrl}/GetTalukaLookupList`;

  const params = [];

  if (DistrictIDs) params.push(`DistrictIDs=${DistrictIDs}`);
  if (CompanyID) params.push(`CompanyID=${CompanyID}`);
  if (ProjectID) params.push(`ProjectID=${ProjectID}`);

  if (params.length > 0) {
    url += `?${params.join("&")}`;
  }

  const res = await getListWithAuthenticated(url);
  return res;
}




export const ChangeTalukaStatus = async (TalukaKeyID) => {
  let url = `${MasterTalukaBaseUrl}/ChangeTalukaStatus?TalukaKeyID=${TalukaKeyID}`;
  const res = await getListWithAuthenticated(url);
  return res;
};
