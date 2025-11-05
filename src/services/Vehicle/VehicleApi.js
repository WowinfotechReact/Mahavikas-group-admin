  import { Base_Url } from "component/Base-Url/BaseUrl";
import { postApiWithAuthenticated, getListWithAuthenticated } from 'services/ApiMethod/ApiMethod';

const VehicleBaseUrl = `${Base_Url}/Vehicle`;


export const GetVehicleList = async (params) => {
  let url = `${VehicleBaseUrl}/GetVehicleList`;

  const res = await postApiWithAuthenticated(url, params);
  return res;
};

export const AddUpdateVehicleApi = async (url = '', params) => {
  if (params.vehicleKeyID === null || params.vehicleKeyID === undefined) {
    delete params.vehicleKeyID;
  }

  const res = await postApiWithAuthenticated(`${VehicleBaseUrl}${url}`, params);
  return res;
};




  export const GetVehicleModel = async (id) => {
      let url = `${VehicleBaseUrl}/GetVehicleModel?VehicleKeyID=${id}`;
    
      const res = await getListWithAuthenticated(url);
      return res;
    };


export const GetTalukaLookupList = async (id) => {
    const url = `${VehicleBaseUrl}/GetTalukaLookupList?DistrictID=${id}`;
  
    const res = await getListWithAuthenticated(url );
    return res;
  };
  
export const ChangeVehicleStatus = async (id, UserKeyID) => {
  let url = `${VehicleBaseUrl}/ChangeVehicleStatus?VehicleKeyID=${id}&UserKeyID=${UserKeyID}`;
  const res = await getListWithAuthenticated(url);
  return res;
};


export const GetVehicleViewDetails = async (customerKeyID) => {
  const url = `${VehicleBaseUrl}/GetVehicleViewDetails?VehicleKeyID=${customerKeyID}`;

  const res = await getListWithAuthenticated(url);
  return res;
};