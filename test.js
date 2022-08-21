var axios = require('axios');

var config = {
  method: 'get',
  url: 'http://localhost:3000/',
  // header: {},
};

let counter = 0;
let ok = 0;
let fail = 0;

let againTime = 0;
getStartPoint();
function getStartPoint() {
  setTimeout(() => {
    let now = Date.now();
    let starter = now % 1000;
    againTime = 1000 - starter;
    // starter < 100
    if (starter > 800) {
      console.log('start attack: ', now);
      initAttack();
    } else {
      getStartPoint();
    }
  }, 10);
}

function initAttack() {
  for (let i = 0; i < 6; i++) {
    console.log('init ', Date.now());
    axios(config)
      .then(function (response) {
        console.log('attack +', i, 'ok', ++ok);
        //   console.log(response.data);
      })
      .catch(function (error) {
        console.log('error', ++fail, error.response.status);
        //   console.log(error);
      });
  }
  setTimeout(() => {
    // attack();
    for (let i = 0; i < 6; i++) {
      console.log('attack ', Date.now());
      axios(config)
        .then(function (response) {
          console.log('attack +', i, 'ok', ++ok);
          //   console.log(response.data);
        })
        .catch(function (error) {
          console.log('error', ++fail, error.response.status);
          //   console.log(error);
        });
    }
  }, againTime);
}

let globalI = 0;
function attack() {
  setTimeout(() => {
    for (let i = 0; i < 2; i++) {
      console.log('again ', Date.now());
      axios(config)
        .then(function (response) {
          console.log('attack +', ++globalI, 'ok', ++ok);
          //   console.log(response.data);
        })
        .catch(function (error) {
          console.log('error', ++fail, error.response.status);
          //   console.log(error);
        });
    }
    if (++counter < 5) {
      attack();
    }
  }, 100);
}

/*
setTimeout(() => {
  for (let i = 0; i < 30; i++) {
    counter = i;
    axios(config)
      .then(function (response) {
        console.log('attack +', i, 'ok', ++ok);
        //   console.log(response.data);
      })
      .catch(function (error) {
        console.log('error', ++fail, error.response.status);
        //   console.log(error);
      });
  }
}, 1000);

setTimeout(() => {
  for (let i = 0; i < 15; i++) {
    counter = i;
    axios(config)
      .then(function (response) {
        console.log('attack +', i, 'ok', ++ok);
        //   console.log(response.data);
      })
      .catch(function (error) {
        console.log('error', ++fail, error.response.status);
        //   console.log(error);
      });
  }
}, 500);

setTimeout(() => {
  for (let i = 0; i < 15; i++) {
    counter = i;
    axios(config)
      .then(function (response) {
        console.log('attack +', i, 'ok', ++ok);
        //   console.log(response.data);
      })
      .catch(function (error) {
        console.log('error', ++fail, error.response.status);
        //   console.log(error);
      });
  }
}, 1000);

setTimeout(() => {
  for (let i = 0; i < 15; i++) {
    counter = i;
    axios(config)
      .then(function (response) {
        console.log('attack +', i, 'ok', ++ok);
        //   console.log(response.data);
      })
      .catch(function (error) {
        console.log('error', ++fail, error.response.status);
        //   console.log(error);
      });
  }
}, 1000);
*/
