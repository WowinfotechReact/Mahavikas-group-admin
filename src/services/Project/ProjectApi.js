
import { Base_Url } from "component/Base-Url/BaseUrl";
import { postApiWithAuthenticated, getListWithAuthenticated } from 'services/ApiMethod/ApiMethod';

const projectBaseURI = `${Base_Url}/Project`;


export const GetProjectList = async (params) => {
  let url = `${projectBaseURI}/GetProjectList`;

  const res = await postApiWithAuthenticated(url, params);
  return res;
};
export const AddUpdateProject = async (url = '', params) => {
  if (params.ProductID === null || params.ProductID === undefined) {
    delete params.ProductID;
  }

  const res = await postApiWithAuthenticated(`${projectBaseURI}${url}`, params);
  return res;
};


export const GetMappedProjectLookupList = async (id,CompanyID) => {
    let url = `${projectBaseURI}/GetMappedProjectLookupList?UserDetailsKeyID=${id}&CompanyID=${CompanyID}`;
  
    const res = await getListWithAuthenticated(url);
    return res;
  };
export const GetProjectModel = async (id) => {
    let url = `${projectBaseURI}/GetProjectModel?ProjectKeyID=${id}`;
  
    const res = await getListWithAuthenticated(url);
    return res;
  };


export const GetProjectLookupList = async (UserID, CompanyID) => {
  const params = new URLSearchParams();

  if (UserID) params.append("UserID", UserID);
  if (CompanyID) params.append("CompanyID", CompanyID);

  const url = `${projectBaseURI}/GetAdminProjectLookupList?${params.toString()}`;

  const res = await getListWithAuthenticated(url);
  return res;
};

  
  export const ChangeProjectStatus = async (id) => {
    let url = `${projectBaseURI}/ChangeProjectStatus?ProjectKeyID=${id}`;
    const res = await getListWithAuthenticated(url);
    return res;
  };