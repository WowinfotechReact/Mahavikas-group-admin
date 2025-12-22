import { uploadPdf_Url, ProjectName } from 'component/Base-Url/BaseUrl';
import { postApiWithAuthenticated } from 'services/ApiMethod/ApiMethod';

export const uploadPdfWithNodeApi = async (params) => {
  const url = `${uploadPdf_Url}/uploadImage`;
  try {
    const formData = new FormData();

    formData.append("imageFile", params.pdfFile);
    formData.append("moduleName", params.moduleName);
    formData.append("projectName", ProjectName);
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
