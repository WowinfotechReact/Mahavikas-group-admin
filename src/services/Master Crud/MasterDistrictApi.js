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
  let url = `${MasterDistrictBaseUrl}/GetDistrictModel?DistrictKeyID=${id}`;

  const res = await getListWithAuthenticated(url);
  return res;
};

// export const GetDistrictLookupList = async (ZoneIDs,companyID, projectID,userID, StateID) => {
//   let url = `${MasterDistrictBaseUrl}/GetDistrictLookupList`;

//   let params = [];

//   if (ZoneIDs) params.push(`ZoneIDs=${ZoneIDs}`);
//   if (companyID) params.push(`CompanyID=${companyID}`);
//   if (projectID) params.push(`ProjectID=${projectID}`);
//   if (userID) params.push(`userID=${userID}`);
//   if (StateID) params.push(`StateID=${StateID}`);

//   if (params.length > 0) {
//     url += `?${params.join("&")}`;
//   }

//   const res = await getListWithAuthenticated(url);
//   return res;
// };
export const GetDistrictLookupList = async ({
  stateID,
  ZoneIDs,
  userID,
  StateID,
  ProjectID,
  ModuleName
} = {}) => {

  const url = `${MasterDistrictBaseUrl}/GetDistrictLookupList`;
  const params = new URLSearchParams();

  if (stateID) params.append("stateID", stateID);

  if (ZoneIDs) {
    params.append(
      "ZoneIDs",
      Array.isArray(ZoneIDs) ? ZoneIDs.join(",") : ZoneIDs
    );
  }

  if (userID) params.append("userID", userID);
  if (StateID) params.append("StateID", StateID);
  if (ProjectID) params.append("ProjectID", ProjectID);
  if (ModuleName) params.append("ModuleName", ModuleName);

  const finalUrl = params.toString() ? `${url}?${params.toString()}` : url;

  return await getListWithAuthenticated(finalUrl);
};



export const ChangeDistrictStatus = async (id) => {
  let url = `${MasterDistrictBaseUrl}/ChangeDistrictStatus?DistrictKeyID=${id}`;
  const res = await getListWithAuthenticated(url);
  return res;
};
