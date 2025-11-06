import { Base_Url } from "component/Base-Url/BaseUrl";
import { postApiWithAuthenticated, getListWithAuthenticated } from 'services/ApiMethod/ApiMethod';

const MasterStateBaseUrl = `${Base_Url}/State`;


export const MasterStatGetStateList = async (params) => {
  let url = `${MasterStateBaseUrl}/GetStateList`;

  const res = await postApiWithAuthenticated(url, params);
  return res;
};
export const AddUpdateStateApi = async (url = '', params) => {
  if (params.stateID === null || params.stateID === undefined) {
    delete params.stateID;
  }

  const res = await postApiWithAuthenticated(`${MasterStateBaseUrl}${url}`, params);
  return res;
};


export const GetStateModel = async (id) => {
    let url = `${MasterStateBaseUrl}/GetStateModel?StateID=${id}`;
  
    const res = await getListWithAuthenticated(url);
    return res;
  };


export const GetStateLookupList = async () => {
    const url = `${MasterStateBaseUrl}/GetStateLookupList`;
  
    const res = await getListWithAuthenticated(url );
    return res;
  };
  
  export const ChangeStateStatus = async (id,UserKeyID) => {
    let url = `${MasterStateBaseUrl}/ChangeStateStatus?StateID=${id}&UserKeyID=${UserKeyID}`;
    const res = await getListWithAuthenticated(url);
    return res;
  };