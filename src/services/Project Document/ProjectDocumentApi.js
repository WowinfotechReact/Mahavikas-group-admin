
import { Base_Url } from "component/Base-Url/BaseUrl";
import { postApiWithAuthenticated, getListWithAuthenticated } from 'services/ApiMethod/ApiMethod';

const ProjectDocumentBaseURI = `${Base_Url}/ProjectDocument`;


export const GetProjectDocumentList = async (params) => {
  let url = `${ProjectDocumentBaseURI}/GetProjectDocumentList`;

  const res = await postApiWithAuthenticated(url, params);
  return res;
};

export const DeleteProjectDocument = async (ProjectDocumentMappingKeyID) => {
    const url = `${ProjectDocumentBaseURI}/DeleteProjectDocument?ProjectDocumentMappingKeyID=${ProjectDocumentMappingKeyID}`;
  
    const res = await getListWithAuthenticated(url);
    return res;
  };


export const AddUpdateProjectDocument = async (url = '', params) => {
  if (params.ProductID === null || params.ProductID === undefined) {
    delete params.ProductID;
  }

  const res = await postApiWithAuthenticated(`${ProjectDocumentBaseURI}${url}`, params);
  return res;
};


export const GetMappedProjectLookupList = async (id,CompanyID) => {
    let url = `${ProjectDocumentBaseURI}/GetMappedProjectLookupList?UserDetailsKeyID=${id}&CompanyID=${CompanyID}`;
  
    const res = await getListWithAuthenticated(url);
    return res;
  };
export const GetProjectModel = async (id) => {
    let url = `${ProjectDocumentBaseURI}/GetProjectModel?ProjectKeyID=${id}`;
  
    const res = await getListWithAuthenticated(url);
    return res;
  };


export const GetProjectLookupList = async (UserID, CompanyID) => {
  const params = new URLSearchParams();

  if (UserID) params.append("UserID", UserID);
  if (CompanyID) params.append("CompanyID", CompanyID);

  const url = `${ProjectDocumentBaseURI}/GetAdminProjectLookupList?${params.toString()}`;

  const res = await getListWithAuthenticated(url);
  return res;
};

  
  export const ChangeProjectStatus = async (id) => {
    let url = `${ProjectDocumentBaseURI}/ChangeProjectStatus?ProjectKeyID=${id}`;
    const res = await getListWithAuthenticated(url);
    return res;
  };