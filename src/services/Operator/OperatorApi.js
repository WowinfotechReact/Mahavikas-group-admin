import { Base_Url } from "component/Base-Url/BaseUrl";
import { postApiWithAuthenticated, getListWithAuthenticated } from 'services/ApiMethod/ApiMethod';

const MasterOperatorBaseUrl = `${Base_Url}/SimOperator`;


export const GetSimOperatorList = async (params) => {
  let url = `${MasterOperatorBaseUrl}/GetSimOperatorList`;

  const res = await postApiWithAuthenticated(url, params);
  return res;
};
export const AddUpdateSimOperator = async (url = '', params) => {
  

  const res = await postApiWithAuthenticated(`${MasterOperatorBaseUrl}${url}`, params);
  return res;
};


export const GetSimOperatorModel = async (id) => {
    let url = `${MasterOperatorBaseUrl}/GetSimOperatorModel?SimOperatorID=${id}`;
  
    const res = await getListWithAuthenticated(url);
    return res;
  };


export const GetStateLookupList = async () => {
    const url = `${MasterOperatorBaseUrl}/GetStateLookupList`;
  
    const res = await getListWithAuthenticated(url );
    return res;
  };
  
  export const ChangeSimOperatorStatus = async (id,UserKeyID) => {
    let url = `${MasterOperatorBaseUrl}/ChangeSimOperatorStatus?SimOperatorID=${id}&UserKeyID=${UserKeyID}`;
    const res = await getListWithAuthenticated(url);
    return res;
  };