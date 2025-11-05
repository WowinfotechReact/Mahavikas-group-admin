import { Base_Url } from "component/Base-Url/BaseUrl";
import { postApiWithAuthenticated, getListWithAuthenticated } from 'services/ApiMethod/ApiMethod';

const ZoneDistrictBaseUrl = `${Base_Url}/ZoneDistrictMap`;



export const GetZoneMappingDistrictLookup = async (zoneKeyID) => {
    const url = `${ZoneDistrictBaseUrl}/GetZoneMappingDistrictLookup?ZoneKeyID=${zoneKeyID}`;  
    const res = await getListWithAuthenticated(url );
    return res;
  };
  
 
  export const GetZoneDistrictLookup = async (zoneKeyID) => {
    const url = `${ZoneDistrictBaseUrl}/GetZoneDistrictLookup?ZoneKeyID=${zoneKeyID}`;
  
    const res = await getListWithAuthenticated(url);
    return res;
  };


  export const AddDeleteZoneDistrictMapping = async (url = '', params) => {
    
  
    const res = await postApiWithAuthenticated(`${ZoneDistrictBaseUrl}${url}`, params);
    return res;
  };