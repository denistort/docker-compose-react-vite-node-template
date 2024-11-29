import axios from "axios";

const httpTransportService = axios.create({
  baseURL: '/'
});
httpTransportService.interceptors.response.use((response) => response.data);
export default httpTransportService;