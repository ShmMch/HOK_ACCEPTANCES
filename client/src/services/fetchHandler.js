export default class FetchHandler {


    fetch(url, options) {
        return fetch(url, options)
            .then(response => {
                if (!response.ok) {
                    throw Error(response.status);
                }
                return response;
            })
            .then((response) => response.json());
    }
}