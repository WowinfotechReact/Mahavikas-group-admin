import { Base_Url } from 'component/Base-Url/BaseUrl';
import { postApiWithAuthenticated, getListWithAuthenticated } from 'services/ApiMethod/ApiMethod';

const EmployeeUrl = `${Base_Url}/Employee`;
const DesignationUrl = `${Base_Url}/Designation`;
const EmployeeTypeUrl = `${Base_Url}/EmployeeType`;



export const GetEmployeeList = async (params) => {
  const res = await postApiWithAuthenticated(`${EmployeeUrl}/GetEmployeeList`, params);
  return res;
};

export const AddUpdateEmployee = async (params) => {
  const res = await postApiWithAuthenticated(`${EmployeeUrl}/AddUpdateEmployee`, params);
  return res;
};
export const GetEmployeeModel = async (EmployeeKeyID) => {
  const res = await getListWithAuthenticated(`${EmployeeUrl}/GetEmployeeModel?EmployeeKeyID=${EmployeeKeyID}`);
  return res;
};

export const ChangeRoleTypeStatus = async (ModuleName, KeyID, AdminKeyID) => {
  const res = await getListWithAuthenticated(
    `${EmployeeUrl}/ChangeRoleTypeStatus?ModuleName=${ModuleName}&AdminKeyID=${AdminKeyID}&RoleTypeKeyID=${KeyID}`
  );
  return res;
};

export const DeleteRoleType = async (ModuleName, KeyID, AdminKeyID) => {
  const res = await getListWithAuthenticated(
    `${EmployeeUrl}/DeleteRoleType?ModuleName=${ModuleName}&AdminKeyID=${AdminKeyID}&RoleTypeKeyID=${KeyID}`
  );
  return res;
};
export const GetRoleTypeLookupList = async (ModuleName, AdminKeyID) => {
  const res = await getListWithAuthenticated(`${EmployeeUrl}/GetRoleTypeLookupList?ModuleName=${ModuleName}&AdminKeyID=${AdminKeyID}`);
  return res;
};

export const GetDesignationLookupList = async () => {
    const url = `${DesignationUrl}/GetDesignationLookupList`;
  
    const res = await getListWithAuthenticated(url );
    return res;
  };
  export const GetEmployeeTypeLookupList = async () => {
    const url = `${EmployeeTypeUrl}/GetEmployeeTypeLookupList`;
  
    const res = await getListWithAuthenticated(url );
    return res;
  };