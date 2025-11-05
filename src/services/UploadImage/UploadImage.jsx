import { uploadPdf_Url } from 'component/Base-Url/BaseUrl';
import { postApiWithAuthenticated } from 'services/ApiMethod/ApiMethod';

export const uploadPdfWithNodeApi = async (params) => {
  const url = `${uploadPdf_Url}/uploadExcel`;
  try {
    const formData = new FormData();

    formData.append("excelFile", params.pdfFile);
    formData.append("moduleName", params.moduleName);
    formData.append("projectName", params.projectName);
    formData.append("userId", params.userId);

    if (!(params.pdfFile instanceof File)) {
      console.error("PDF file object is invalid");
      return;
    }

    const response = await postApiWithAuthenticated(url, formData);
    return response;
  } catch (error) {
    console.error("Error uploading PDF file:", error);
    throw error;
  }
};
