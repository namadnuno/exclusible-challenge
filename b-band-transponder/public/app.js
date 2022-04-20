let token = "";
let user = null;
let isTrading = false;
let socket = null;
let loading = true;
loadTokenFromStorage();

function loadUser() {
  return fetch("http://localhost:8000/me", {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "X-TOKEN": token,
    },
  })
    .then(function (response) {
      return response.json();
    })
    .then(function (json) {
      console.log({ json });
      user = json.me;
    });
}

function toggleTradeButton() {
  if (!isTrading) {
    document.getElementById("trade").classList.add("hidden");
    document.getElementById("cancel").classList.remove("hidden");
  } else {
    document.getElementById("trade").classList.remove("hidden");
    document.getElementById("cancel").classList.add("hidden");
  }
  isTrading = !isTrading;
}

function loadTokenFromStorage() {
  let storageToken = localStorage.getItem("token");

  if (storageToken) {
    token = storageToken;
    loadUser().then(() => {
      showPairBox();
    });
  }
}

function priceLoading(isLoading = false) {
  if (isLoading) {
    document.getElementById("loading-box").classList.remove("hidden");
  } else {
    document.getElementById("loading-box").classList.add("hidden");
  }
}

function updatePairPrice(data) {
  priceLoading(false);
  document.getElementById("currentPrice").classList.remove("in");
  setTimeout(() => {
    document.getElementById("pair-title").innerHTML = data.pair;
    document.getElementById("currentPrice").innerHTML =
      Intl.NumberFormat().format(data.value);
    document.getElementById("spread_percent").innerHTML =
      "Spread: " + data.spread_percent + "%";
    document.getElementById("currentPrice").classList.add("in");
  }, 500);
}

function saveToken(tokenToSave) {
  localStorage.setItem("token", tokenToSave);
}

document
  .getElementById("sign-in-form")
  .addEventListener("submit", function (e) {
    e.preventDefault();

    let email = document.getElementById("email-address").value;
    let password = document.getElementById("password").value;

    fetch("http://localhost:8000/login", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: email, password: password }),
    })
      .then(function (response) {
        return response.json();
      })
      .then(function (json) {
        token = json.token;
        user = json.user;
        saveToken(token);
        showPairBox();
      });
  });

function showPairBox() {
  document.getElementById("sign-in-box").classList.add("hidden");
  document.getElementById("trade-box").classList.remove("hidden");

  document.getElementById("user-welcome").innerHTML = user.name;
}

document.getElementById("trade-form").addEventListener("submit", function (e) {
  socket = new WebSocket("ws://localhost:7071");

  let pair = document.getElementById("pair").value;
  e.preventDefault();

  let payload = {
    type: "subscribe",
    token: token,
    pair: pair,
  };

  socket.onopen = function () {
    document.getElementById("pair-box").classList.add("hidden");
    socket.send(JSON.stringify(payload));
    priceLoading(true);

    toggleTradeButton();
  };

  socket.onmessage = function (data) {
    document.getElementById("pair-box").classList.remove("hidden");
    updatePairPrice(JSON.parse(data.data));
  };
});

document.getElementById("cancel").addEventListener("click", function (e) {
  let payload = {
    type: "unsubscribe",
    token: token,
  };
  if (socket) {
    socket.send(JSON.stringify(payload));
    socket.close();
  }
  document.getElementById("pair-box").classList.add("hidden");

  toggleTradeButton();
});
