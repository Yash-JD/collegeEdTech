import axios from "axios";

export const axiosInstance = axios.create({});

export const apiConnector = (
  method,
  url,
  bodyData,
  headers,
  params,
  withCredentials = true
) => {
  return axiosInstance({
    method: `${method}`,
    url: `${url}`,
    data: bodyData || null,
    headers: headers || null,
    params: params || null,
    withCredentials,
  });
};
