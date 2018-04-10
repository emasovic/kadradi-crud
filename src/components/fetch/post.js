const server = 'http://localhost:8081';

export default {
    async secure(uri, payload) {
        let send;
        payload.token = localStorage.getItem("token");
        await fetch(server+uri, {
            method: 'POST',
            headers: {'content-type': 'application/json'},
            method: "post",
            body: JSON.stringify(payload),
        }).then((response) => response.text())
        .then((responseText) => {
            send = JSON.parse(responseText);
            if(send.newToken) {
                localStorage.setItem("token", responseText.newToken);
            }
        })
        return send;
    },

    async unsecure(uri, payload) {
        let send;
        await fetch(server+uri, {
            method: 'POST',
            headers: {'content-type': 'application/json'},
            method: "post",
            body: JSON.stringify(payload),
        }).then((response) => response.text()).then((responseText) => {
            send = JSON.parse(responseText)
        })
        return send;
    }
}