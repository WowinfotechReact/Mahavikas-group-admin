import { Base_Url } from "component/Base-Url/BaseUrl";
import { postApiWithAuthenticated ,getListWithAuthenticated} from "services/ApiMethod/ApiMethod";


const DashboardCountUrl = `${Base_Url}`;

export const GetAdminDashboardCount = async (params) => {
  const res = await postApiWithAuthenticated(
    `${DashboardCountUrl}/Dashboard/GetAdminDashboardCount`,
    params
  );
  return res;
};
