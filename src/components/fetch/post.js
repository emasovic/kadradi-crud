const server = 'http://localhost:8081';

export default {
  async secure(uri, payload) {
    console.log("USAO U SECURE")
    let send;
    payload.token = localStorage.getItem("token");
    await fetch(server + uri, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      method: "post",
      body: JSON.stringify(payload),
    }).then((response) => response.text())
      .then((responseText) => {
        send = JSON.parse(responseText);
        if (send.token.success) {
          if (send.token.token != localStorage.getItem("token")) {
            localStorage.setItem("token", send.token.token);
            PubSub.publish('TOKEN', { success: true, token: send.token.token })
          } else {
            PubSub.publish('TOKEN', { success: true, token: send.token.token })
          }
        } else {
          PubSub.publish('TOKEN', { success: false })
        }
      })
    return send;
  },

  async unsecure(uri, payload) {
    let send;
    await fetch(server + uri, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      method: "post",
      body: JSON.stringify(payload),
    }).then((response) => response.text()).then((responseText) => {
      send = JSON.parse(responseText)
    })
    return send;
  }
}