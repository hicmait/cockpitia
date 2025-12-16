import axios from "axios";

export const tamtamIt = (apiUrl, token, url) => {
  const requestUrl = `${apiUrl}/blog/parser/parse`;

  var formData = new FormData();
  formData.append("access_token", token);
  formData.append("url", url);

  return axios.post(requestUrl, formData);
};
