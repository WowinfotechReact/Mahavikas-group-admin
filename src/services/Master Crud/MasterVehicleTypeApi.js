import { Base_Url } from "component/Base-Url/BaseUrl";
import { postApiWithAuthenticated, getListWithAuthenticated } from 'services/ApiMethod/ApiMethod';

const MasterVehicleTypeBaseUrl = `${Base_Url}/VehicleType`;


export const GetVehicleTypeList = async (params) => {
  let url = `${MasterVehicleTypeBaseUrl}/GetVehicleTypeList`;

  const res = await postApiWithAuthenticated(url, params);
  return res;
};
export const AddUpdateVehicleTypeApi = async (url = '', params) => {
  if (params.vehicleTypeKeyID === null || params.vehicleTypeKeyID === undefined) {
    delete params.vehicleTypeKeyID;
  }

  const res = await postApiWithAuthenticated(`${MasterVehicleTypeBaseUrl}${url}`, params);
  return res;
};


export const GetVehicleTypeModel = async (id) => {
    let url = `${MasterVehicleTypeBaseUrl}/GetVehicleTypeModel?VehicleTypeKeyID=${id}`;  
    const res = await getListWithAuthenticated(url);
    return res;
  };

  export const GetVehicleTypeLookupList = async () => {
    const url = `${MasterVehicleTypeBaseUrl}/GetVehicleTypeLookupList`;  
    const res = await getListWithAuthenticated(url);
    return res;
  };

 
  
  
  
  export const ChangeVehicleTypeStatus = async (id, UserKeyID) => {
    let url = `${MasterVehicleTypeBaseUrl}/ChangeVehicleTypeStatus?VehicleTypeKeyID=${id}&UserKeyID=${UserKeyID}`;
    const res = await getListWithAuthenticated(url);
    return res;
  };
  