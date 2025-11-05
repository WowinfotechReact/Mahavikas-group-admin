import { generatePdf_Url } from "component/Base-Url/BaseUrl";
import { postApiWithAuthenticated } from "services/ApiMethod/ApiMethod";


const GeneratePDFBaseUrl = `${generatePdf_Url}`;


export const GeneratePDFApi = async (params) => {
  let url = `${GeneratePDFBaseUrl}`;
  const res = await postApiWithAuthenticated(url, params);
  return res;
};