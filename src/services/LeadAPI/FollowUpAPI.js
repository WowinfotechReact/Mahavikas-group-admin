import { Base_Url } from 'component/Base-Url/BaseUrl';
import { postApiWithAuthenticated, getListWithAuthenticated } from 'services/ApiMethod/ApiMethod';

const FollowUpBaseUrl = `${Base_Url}/FollowUp`;
const FollowTypeUpBaseUrl = `${Base_Url}/FollowUpType`;


export const GetFollowUpList = async (params,LeadKeyID) => {
  let url = `${FollowUpBaseUrl}/GetFollowUpList?LeadKeyID=${LeadKeyID}`;

  const res = await postApiWithAuthenticated(url, params);
  return res;
};
export const AddUpdateFollowUp = async (url = '', params) => {
 

  const res = await postApiWithAuthenticated(`${FollowUpBaseUrl}${url}`, params);
  return res;
};
export const ChangeLeadFollowUpStatus = async (url = '', params) => {
 

  const res = await postApiWithAuthenticated(`${FollowUpBaseUrl}${url}`, params);
  return res;
};


export const GetFollowUpTypeLookupList = async () => {
    const url = `${FollowTypeUpBaseUrl}/GetFollowUpTypeLookupList`;
  
    const res = await getListWithAuthenticated(url );
    return res;
  };
export const GetFollowUpModel = async (id) => {
  let url = `${FollowUpBaseUrl}/GetFollowUpModel?FollowUpKeyID=${id}`;

  const res = await getListWithAuthenticated(url);
  return res;
};





