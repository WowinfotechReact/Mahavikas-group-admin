import { Base_Url } from "component/Base-Url/BaseUrl";
import { postApiWithAuthenticated, getListWithAuthenticated } from 'services/ApiMethod/ApiMethod';

const OEMInstallationBaseUrl = `${Base_Url}/OEMInstallation`;
const OriginalEquipmentManufacturerBaseURI = `${Base_Url}/OriginalEquipmentManufacturer`;


export const GetOEMList = async (params) => {
  let url = `${OriginalEquipmentManufacturerBaseURI}/GetOEMList`;

  const res = await postApiWithAuthenticated(url, params);
  return res;
};
export const GetOEMInstallationList = async (params) => {
  let url = `${OEMInstallationBaseUrl}/GetOEMInstallationList`;

  const res = await postApiWithAuthenticated(url, params);
  return res;
};
export const GetOEMInstallationReportList = async (params) => {
  let url = `${OEMInstallationBaseUrl}/GetOEMInstallationReportList`;

  const res = await postApiWithAuthenticated(url, params);
  return res;
};
export const AddUpdateOEMInstallation = async (url = '', params) => {
  

  const res = await postApiWithAuthenticated(`${OEMInstallationBaseUrl}${url}`, params);
  return res;
};
export const AddUpdateOEM = async (url = '', params) => {
  

  const res = await postApiWithAuthenticated(`${OriginalEquipmentManufacturerBaseURI}${url}`, params);
  return res;
};


export const GetOEMInstallationModel = async (id) => {
    let url = `${OEMInstallationBaseUrl}/GetOEMInstallationModel?OEMInstallationKeyID=${id}`;
  
    const res = await getListWithAuthenticated(url);
    return res;
  };
export const GetOEMModel = async (id) => {
    let url = `${OriginalEquipmentManufacturerBaseURI}/GetOEMModel?OEMKeyID=${id}`;
  
    const res = await getListWithAuthenticated(url);
    return res;
  };


export const GetStateLookupList = async () => {
    const url = `${OEMInstallationBaseUrl}/GetStateLookupList`;
  
    const res = await getListWithAuthenticated(url );
    return res;
  };
  
export const GetOEMLookupList = async () => {
    const url = `${OriginalEquipmentManufacturerBaseURI}/GetOEMLookupList`;
  
    const res = await getListWithAuthenticated(url );
    return res;
  };
  
  export const ChangeStateStatus = async (id,UserKeyID) => {
    let url = `${OEMInstallationBaseUrl}/ChangeStateStatus?StateID=${id}&UserKeyID=${UserKeyID}`;
    const res = await getListWithAuthenticated(url);
    return res;
  };
  export const ChangeOEMStatus = async (id,UserKeyID) => {
    let url = `${OriginalEquipmentManufacturerBaseURI}/ChangeOEMStatus?OEMKeyID=${id}&UserKeyID=${UserKeyID}`;
    const res = await getListWithAuthenticated(url);
    return res;
  };
  export const SendToDispatched = async (UserKeyID,id) => {
    let url = `${OEMInstallationBaseUrl}/SendToDispatched?UserKeyID=${UserKeyID}&PurchaseOrderKeyID=${id}`;
    const res = await getListWithAuthenticated(url);
    return res;
  };