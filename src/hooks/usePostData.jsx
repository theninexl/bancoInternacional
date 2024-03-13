import { useEffect, useState } from "react";
import Api from "../services/api";
import { useRetrieveApiHeaders } from "./useRetrieveApiHeaders";

export const usePostData = (endpoint,parameters) => {
  const {headers} = useRetrieveApiHeaders();
  const [responsePostData, setResponsePostData] = useState(null);  

  const postData = async (endpoint, parameters) => {
    await Api.call.post(endpoint,parameters,{ headers:headers})
    .then(response => {
        setResponsePostData(response);
    })
    .catch(err => {
        setResponsePostData(err)
    })
  }

  return { postData, responsePostData };
}