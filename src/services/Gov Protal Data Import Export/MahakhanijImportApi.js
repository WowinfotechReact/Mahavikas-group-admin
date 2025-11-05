import { postApiWithAuthenticated } from 'services/ApiMethod/ApiMethod';
import { Base_Url } from 'component/Base-Url/BaseUrl';

const MahaKhanijBaseUrl = `${Base_Url}/GovtPortal`;

export const ImportMahakhanijCSV = async (formData, userKeyID, companyKeyID) => {
  try {
    const res = await postApiWithAuthenticated(
      `${MahaKhanijBaseUrl}/ImportMahakhanijCSV?UserKeyID=${userKeyID}&CompanyKeyID=${companyKeyID}`,
      formData
    );
    return res;
  } catch (error) {
    console.error('Error in DeviceImport:', error);
    throw error;
  }
};

export const GetMahakahnijList = async (params) => {
  let url = `${MahaKhanijBaseUrl}/GetMahakahnijList`;
  const res = await postApiWithAuthenticated(url, params);
  return res;
};

export const GetCGMList = async (params) => {
  let url = `${MahaKhanijBaseUrl}/GetCGMList`;
  const res = await postApiWithAuthenticated(url, params);
  return res;
};

export const GetCGMDRList = async (params) => {
  let url = `${MahaKhanijBaseUrl}/GetCGMDRList`;
  const res = await postApiWithAuthenticated(url, params);
  return res;
};
export const GetTransyncList = async (params) => {
  let url = `${MahaKhanijBaseUrl}/GetTransyncList`;
  const res = await postApiWithAuthenticated(url, params);
  return res;
};
export const GetTransyncDRList = async (params) => {
  let url = `${MahaKhanijBaseUrl}/GetTransyncDRList`;
  const res = await postApiWithAuthenticated(url, params);
  return res;
};

export const ImportCGMCSV = async (formData, userKeyID, companyKeyID) => {
  try {
    const res = await postApiWithAuthenticated(
      `${MahaKhanijBaseUrl}/ImportCGMCSV?UserKeyID=${userKeyID}&CompanyKeyID=${companyKeyID}`,
      formData
    );
    return res;
  } catch (error) {
    console.error('Error in DeviceImport:', error);
    throw error;
  }
};

export const ImportCGMDataReportCSV = async (formData, userKeyID, companyKeyID) => {
  try {
    const res = await postApiWithAuthenticated(
      `${MahaKhanijBaseUrl}/ImportCGMDataReportCSV?UserKeyID=${userKeyID}&CompanyKeyID=${companyKeyID}`,
      formData
    );
    return res;
  } catch (error) {
    console.error('Error in DeviceImport:', error);
    throw error;
  }
};
export const ImportTransyncCSV = async (formData, userKeyID, companyKeyID) => {
  try {
    const res = await postApiWithAuthenticated(
      `${MahaKhanijBaseUrl}/ImportTransyncCSV?UserKeyID=${userKeyID}&CompanyKeyID=${companyKeyID}`,
      formData
    );
    return res;
  } catch (error) {
    console.error('Error in DeviceImport:', error);
    throw error;
  }
};
export const ImportTransyncDataReportCSV = async (formData, userKeyID, companyKeyID) => {
  try {
    const res = await postApiWithAuthenticated(
      `${MahaKhanijBaseUrl}/ImportTransyncDataReportCSV?UserKeyID=${userKeyID}&CompanyKeyID=${companyKeyID}`,
      formData
    );
    return res;
  } catch (error) {
    console.error('Error in DeviceImport:', error);
    throw error;
  }
};
