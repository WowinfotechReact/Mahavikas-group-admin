
import { Base_Url } from "component/Base-Url/BaseUrl";
import { postApiWithAuthenticated, getListWithAuthenticated } from 'services/ApiMethod/ApiMethod';

const servicesBaseURI = `${Base_Url}/Services`;




export const GetServiceList = async (params) => {
  let url = `${servicesBaseURI}/GetServiceList`;

  const res = await postApiWithAuthenticated(url, params);
  return res;
};
export const GetServiceLookupList = async () => {
    const url = `${servicesBaseURI}/GetServiceLookupList`;
  
    const res = await getListWithAuthenticated(url );
    return res;
  };
  
  

  export const AddUpdateService = async (params) => {
  if (params.zoneKeyID === null || params.zoneKeyID === undefined) {
    delete params.zoneKeyID;
  }

  const res = await postApiWithAuthenticated(`${servicesBaseURI}/AddUpdateService`, params);
  return res;
};
 

export const ChangeServiceStatus = async (id
 ) => {
    let url = `${servicesBaseURI}/ChangeServiceStatus?ServiceKeyID=${id}`;
    const res = await getListWithAuthenticated(url);
    return res;
};
  

export const GetServiceModel = async (id) => {
    let url = `${servicesBaseURI}/GetServiceModel?ServiceKeyID=${id}`;
  
    const res = await getListWithAuthenticated(url);
    return res;
  };
