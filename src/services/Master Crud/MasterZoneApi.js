import { Base_Url } from "component/Base-Url/BaseUrl";
import { postApiWithAuthenticated, getListWithAuthenticated } from 'services/ApiMethod/ApiMethod';

const MasterZoneBaseUrl = `${Base_Url}/Zone`;


export const GetZoneList = async (params) => {
  let url = `${MasterZoneBaseUrl}/GetZoneList`;

  const res = await postApiWithAuthenticated(url, params);
  return res;
};

export const AddUpdateZone = async (params) => {
  if (params.zoneKeyID === null || params.zoneKeyID === undefined) {
    delete params.zoneKeyID;
  }

  const res = await postApiWithAuthenticated(`${MasterZoneBaseUrl}/AddUpdateZone`, params);
  return res;
};
export const AddUpdateZoneDistrictMapping = async (url = '', params) => {
  if (params.zoneKeyID === null || params.zoneKeyID === undefined) {
    delete params.zoneKeyID;
  }

  const res = await postApiWithAuthenticated(`${MasterZoneBaseUrl}${url}`, params);
  return res;
};


export const GetZoneModel = async (id) => {
    let url = `${MasterZoneBaseUrl}/GetZoneModel?ZoneKeyID=${id}`;
  
    const res = await getListWithAuthenticated(url);
    return res;
  };


export const GetZoneLookupList = async (CompanyID, ProjectID) => {
  let url = `${MasterZoneBaseUrl}/GetZoneLookupList`;

  // Build query params conditionally
  const queryParams = [];

  if (CompanyID) queryParams.push(`CompanyID=${CompanyID}`);
  if (ProjectID) queryParams.push(`ProjectID=${ProjectID}`);

  // If any params exist, append them
  if (queryParams.length > 0) {
    url += `?${queryParams.join("&")}`;
  }

  const res = await getListWithAuthenticated(url);
  return res;
};

export const GetAssignedZoneDistrictList = async (ZoneID) => {
    const url = `${MasterZoneBaseUrl}/GetAssignedZoneDistrictList?ZoneID=${ZoneID}`;
  
    const res = await getListWithAuthenticated(url);
    return res;
  };
  
  export const ChangeZoneStatus = async (id,UserKeyID) => {
    let url = `${MasterZoneBaseUrl}/ChangeZoneStatus?ZoneKeyID=${id}&UserKeyID=${UserKeyID}`;
    const res = await getListWithAuthenticated(url);
    return res;
  };