import { Base_Url } from 'component/Base-Url/BaseUrl';
import { postApiWithAuthenticated, getListWithAuthenticated } from 'services/ApiMethod/ApiMethod';

const ModelStockBaseUrl = `${Base_Url}/ModelStock`;

export const GetModelStockList = async (params) => {
  let url = `${ModelStockBaseUrl}/GetModelStockList`;

  const res = await postApiWithAuthenticated(url, params);
  return res;
};
export const AddUpdateModelStock = async (url = '', params) => {
  

  const res = await postApiWithAuthenticated(`${ModelStockBaseUrl}${url}`, params);
  return res;
};

export const GetModelStockModel = async (id) => {
  let url = `${ModelStockBaseUrl}/GetModelStockModel?StockKeyID=${id}`;

  const res = await getListWithAuthenticated(url);
  return res;
};

export const GetDistrictLookupList = async (stateID) => {
  const url = `${ModelStockBaseUrl}/GetDistrictLookupList?StateID=${stateID}`;

  const res = await getListWithAuthenticated(url);
  return res;
};

export const ChangeDistrictStatus = async (id, UserKeyID) => {
  let url = `${ModelStockBaseUrl}/ChangeDistrictStatus?DistrictID=${id}&UserKeyID=${UserKeyID}`;
  const res = await getListWithAuthenticated(url);
  return res;
};
