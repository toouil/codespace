import { useEffect, useState, useCallback } from "react";
import axios from "axios";

export default function useApi({
    dataTemplate = {},
    autoFetch = () => {},
    onSuccess = (res) => {},
    onError = (err) => {},
}) {
    const [requestData, setRequestData] = useState(dataTemplate);
    const [fetched, setFetched] = useState(false);
    const [fetching, setFetching] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(null);
    const [response, setResponse] = useState(null);

    const setData = (key, value) => {
        setRequestData((prevData) => ({ ...prevData, [key]: value }));
    };

    useEffect(() => {
        autoFetch();
    }, []);

    const handleResponse = useCallback(
        (res) => {
            setSuccess(true);
            setResponse(res);
            onSuccess(res);
        },
        [onSuccess]
    );

    const handleError = useCallback(
        (err) => {
            setError(err);
            onError(err);
        },
        [onError]
    );

    const makeRequest = useCallback(
        async (method, url, forceData = {}) => {
            setFetched(false);
            setFetching(true);
            setSuccess(false);
            setError(null);
            try {
                const res = await axios({
                    headers: {
                        "Content-Type" : "application/json",
                        "Accept" : "application/json"
                    },
                    method,
                    url,
                    data: { ...requestData, ...forceData },
                    params:
                        method === "get"
                            ? { ...requestData, ...forceData }
                            : {},
                });
                const resData = res.data;
                handleResponse(resData);
            } catch (err) {
                handleError(err);
            } finally {
                setFetching(false);
                setFetched(true);
            }
        },
        [requestData, handleResponse, handleError]
    );

    const getRequest = (url, forceData = {}) =>
        makeRequest("get", url, forceData);
    const postRequest = (url, forceData = {}) =>
        makeRequest("post", url, forceData);
    const putRequest = (url, forceData = {}) =>
        makeRequest("put", url, forceData);
    const patchRequest = (url, forceData = {}) =>
        makeRequest("patch", url, forceData);
    const deleteRequest = (url, forceData = {}) =>
        makeRequest("delete", url, forceData);

    return {
        data: requestData,
        setData,
        getRequest,
        postRequest,
        putRequest,
        patchRequest,
        deleteRequest,
        fetched,
        fetching,
        error,
        success,
        response,
    };
}
