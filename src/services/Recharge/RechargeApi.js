import { Base_Url } from 'component/Base-Url/BaseUrl';
import { postApiWithAuthenticated, getListWithAuthenticated } from 'services/ApiMethod/ApiMethod';

const rechargeBaseUrl = `${Base_Url}/Recharge`;



export const GetRechargeValidityPlanList = async (params) => {
  const url = `${rechargeBaseUrl}/GetRechargeValidityPlanList`;
  const res = await postApiWithAuthenticated(url, params);

  return res;
};

export const AddUpdateRechargeValidityPlan = async (url = '', params) => {
  
  const res = await postApiWithAuthenticated(`${rechargeBaseUrl}${url}`, params);
  return res;
};


export const GetRechargeValidityPlanModel = async (id) => {
    let url = `${rechargeBaseUrl}/GetRechargeValidityPlanModel?RechargeValidityPlanKeyID=${id}`;
  
    const res = await getListWithAuthenticated(url);
    return res;
  };


export const GetStateLookupList = async () => {
    const url = `${rechargeBaseUrl}/GetStateLookupList`;
  
    const res = await getListWithAuthenticated(url );
    return res;
  };
export const GetRechargeValidityPlanLookupList = async (SimOperatorID) => {
    const url = `${rechargeBaseUrl}/GetRechargeValidityPlanLookupList?SimOperatorID=${SimOperatorID}`;
  
    const res = await getListWithAuthenticated(url );
    return res;
  };

  
  export const ChangeStateStatus = async (id,UserKeyID) => {
    let url = `${rechargeBaseUrl}/ChangeStateStatus?StateID=${id}&UserKeyID=${UserKeyID}`;
    const res = await getListWithAuthenticated(url);
    return res;
  };