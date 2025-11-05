import { Base_Url } from 'component/Base-Url/BaseUrl';
import { postApiWithAuthenticated, getListWithAuthenticated } from 'services/ApiMethod/ApiMethod';

const ZoneStateBaseUrl = `${Base_Url}/ZoneStateMap`;

export const GetZoneMappingStateLookup = async (zoneKeyID) => {
  const url = `${ZoneStateBaseUrl}/GetZoneMappingStateLookup?ZoneKeyID=${zoneKeyID}`;
  const res = await getListWithAuthenticated(url);
  return res;
};

export const GetZoneStateLookup = async (zoneKeyID) => {
  const url = `${ZoneStateBaseUrl}/GetZoneStateLookup?ZoneKeyID=${zoneKeyID}`;

  const res = await getListWithAuthenticated(url);
  return res;
};

export const AddDeleteZoneStateMapping = async (url = '', params) => {
  const res = await postApiWithAuthenticated(`${ZoneStateBaseUrl}${url}`, params);
  return res;
};
