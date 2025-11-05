import { Base_Url } from "component/Base-Url/BaseUrl";
import { postApiWithAuthenticated, getListWithAuthenticated } from 'services/ApiMethod/ApiMethod';

const InstallationBaseUrl = `${Base_Url}/Installation`;
const InstallationBaseUrlLookup = `${Base_Url}`;


export const GetAvailableStockList = async (params) => {
  let url = `${InstallationBaseUrl}/GetAvailableStockList`;
  const res = await postApiWithAuthenticated(url, params);
  return res;
};
export const GetInstalledDeviceList = async (params) => {
  let url = `${InstallationBaseUrl}/GetInstalledDeviceList`;
  const res = await postApiWithAuthenticated(url, params);
  return res;
};
export const GetSaleReturnList = async (params) => {
  let url = `${InstallationBaseUrl}/GetSaleReturnList`;
  const res = await postApiWithAuthenticated(url, params);
  return res;
};


export const GetInstallationList = async (params) => {
  let url = `${InstallationBaseUrl}/GetInstallationList`;
  const res = await postApiWithAuthenticated(url, params);
  return res;
};

export const AddUpdateInstallationApi = async (url = '', params) => {
  if (params.installationKeyID === null || params.installationKeyID === undefined) {
    delete params.installationKeyID;
  }

  const res = await postApiWithAuthenticated(`${InstallationBaseUrl}${url}`, params);
  return res;
};

export const GetInstallationModel = async (id) => {
  let url = `${InstallationBaseUrl}/GetInstallationModel?InstallationKeyID=${id}`;

  const res = await getListWithAuthenticated(url);
  return res;
};

export const ChangeInstallationStatus = async (id, UserKeyID) => {
  let url = `${InstallationBaseUrl}/ChangeInstallationStatus?InstallationKeyID=${id}&UserKeyID=${UserKeyID}`;
  const res = await getListWithAuthenticated(url);
  return res;
};

export const ChangeRegistrationStatus = async (id, CompanyID,type) => {
  let url = `${InstallationBaseUrl}/ChangeRegistrationStatus?InstallationKeyID=${id}&CompanyKeyID=${CompanyID}&RegistrationType=${type}`;
  const res = await getListWithAuthenticated(url);
  return res;
};

export const GetInstallationViewDetails = async (installationKeyID) => {
  const url = `${InstallationBaseUrl}/GetInstallationViewDetails?InstallationKeyID=${installationKeyID}`;

  const res = await getListWithAuthenticated(url);
  return res;
};


export const GetDeviceLookupList = async (employeeKeyID) => {
  const url = `${InstallationBaseUrlLookup}/Device/GetDeviceLookupList?EmployeeKeyID=${employeeKeyID}`;

  const res = await getListWithAuthenticated(url);
  return res;
};

export const GetEmployeeInstallationTypeMapping = async (employeeKeyID) => {
  const url = `${InstallationBaseUrl}/GetEmployeeInstallationTypeMapping?EmployeeKeyID=${employeeKeyID}`;

  const res = await getListWithAuthenticated(url);
  return res;
};

export const GetInstallationLookupList = async (CompanyKeyID) => {
  const url = `${InstallationBaseUrl}/GetInstallationLookupList?CompanyKeyID=${CompanyKeyID}`;

  const res = await getListWithAuthenticated(url);
  return res;
};