import {useState, useCallback} from "react";

export const useHttp = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const request = useCallback(async (url, method = 'GET', body = null, headers = {'Content-Type': 'application/json'}) => {

        setLoading(true); //перед отправкой запроса загрузка ставится в true

        try {
            const response = await fetch(url, {method, body, headers});

            if (!response.ok) {
                throw new Error(`Can not fetch ${url}, status : ${response.status}`);
            }

            const data = await response.json(); //в проекте работа только с json

            setLoading(false);

            return data; //загрузка завершается и, если всё ок, возвращаются "чистые" данные (не из MarvelService) от API
        } catch (error) {
            setLoading(false);
            setError(error.message);
            throw error;
        }

    }, []);

    const clearError = useCallback(() => {setError(null)}, []); //уберет ошибку, которая может появиться из-за отсутствия id персонажа на сервере, чтобы компонент загружал новых

    return {loading, request, error, clearError};
}