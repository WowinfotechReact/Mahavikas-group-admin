import { Base_Url } from "component/Base-Url/BaseUrl";
import { postApiWithAuthenticated, getListWithAuthenticated } from 'services/ApiMethod/ApiMethod';

const MasterStateBaseUrl = `${Base_Url}/State`;


export const GetStateList = async (params) => {
  
  let url = `${MasterStateBaseUrl}/GetStateList`;

  const res = await postApiWithAuthenticated(url, params);
  return res;
};
// export const AddUpdateState = async (url = '', params) => {
//   if (params.stateID === null || params.stateID === undefined) {
//     delete params.stateID;
//   }

//   const res = await postApiWithAuthenticated(`${MasterStateBaseUrl}${url}`, params);
//   return res;
// };

export const AddUpdateStateApi = async (requestJson) => {
    const res = await postApiWithAuthenticated(
    `${Base_Url}/State/AddUpdateState`, requestJson
  );
  return res;
};


export const GetStateModel = async (stateKeyID) => {
    let url = `${MasterStateBaseUrl}/GetStateModel?StateKeyID=${stateKeyID}`;
  
    const res = await getListWithAuthenticated(url);
    return res;
  };


export const GetStateLookupList = async (ZoneIDs) => {
  let url = `${MasterStateBaseUrl}/GetStateLookupList`;

  // ✅ Only append query param if ZoneIDs has a valid value
  if (ZoneIDs) {
    url += `?ZoneIDs=${Array.isArray(ZoneIDs) ? ZoneIDs.join(',') : ZoneIDs}`;
  }

  const res = await getListWithAuthenticated(url);
  return res;
};

  
  export const ChangeStateStatus = async (StateKeyID) => {
    let url = `${MasterStateBaseUrl}/ChangeStateStatus?StateKeyID=${StateKeyID}`;
    const res = await getListWithAuthenticated(url);
    return res;
  };