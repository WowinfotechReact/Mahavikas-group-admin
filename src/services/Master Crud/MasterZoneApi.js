import { Base_Url } from "component/Base-Url/BaseUrl";
import { postApiWithAuthenticated, getListWithAuthenticated } from 'services/ApiMethod/ApiMethod';

const MasterZoneBaseUrl = `${Base_Url}/Zone`;


export const GetZoneList = async (params) => {
  let url = `${MasterZoneBaseUrl}/GetZoneList`;

  const res = await postApiWithAuthenticated(url, params);
  return res;
};
export const AddUpdateZone = async (url = '', params) => {
  if (params.zoneKeyID === null || params.zoneKeyID === undefined) {
    delete params.zoneKeyID;
  }

  const res = await postApiWithAuthenticated(`${MasterZoneBaseUrl}${url}`, params);
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


export const GetZoneLookupList = async () => {
    const url = `${MasterZoneBaseUrl}/GetZoneLookupList`;
  
    const res = await getListWithAuthenticated(url );
    return res;
  };
  
  export const ChangeZoneStatus = async (id,UserKeyID) => {
    let url = `${MasterZoneBaseUrl}/ChangeZoneStatus?ZoneKeyID=${id}&UserKeyID=${UserKeyID}`;
    const res = await getListWithAuthenticated(url);
    return res;
  };