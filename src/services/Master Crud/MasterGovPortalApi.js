import { Base_Url } from "component/Base-Url/BaseUrl";
import { postApiWithAuthenticated, getListWithAuthenticated } from 'services/ApiMethod/ApiMethod';

const MasterGovPortalBaseUrl = `${Base_Url}/GovtPortal`;


export const MasterStatGetStateList = async (params) => {
  let url = `${MasterGovPortalBaseUrl}/GetGovtPortalList`;

  const res = await postApiWithAuthenticated(url, params);
  return res;
};
export const AddUpdateStateApi = async (url = '', params) => {
  if (params.stateID === null || params.stateID === undefined) {
    delete params.stateID;
  }

  const res = await postApiWithAuthenticated(`${MasterGovPortalBaseUrl}${url}`, params);
  return res;
};


export const GetStateModel = async (id) => {
    let url = `${MasterGovPortalBaseUrl}/GetGovtPortalModel?GovernmentPortalKeyID=${id}`;
  
    const res = await getListWithAuthenticated(url);
    return res;
  };


export const GetGovtPortalLookupList = async () => {
    const url = `${MasterGovPortalBaseUrl}/GetGovtPortalLookupList`;
  
    const res = await getListWithAuthenticated(url);
    return res;
  };
  
  export const ChangeStateStatus = async (id,UserKeyID) => {
    let url = `${MasterGovPortalBaseUrl}/ChangeStateStatus?StateID=${id}&UserKeyID=${UserKeyID}`;
    const res = await getListWithAuthenticated(url);
    return res;
  };