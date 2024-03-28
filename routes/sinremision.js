var express = require("express");
var router = express.Router();
var url = "https://aplicaciones.ambato.gob.ec:8443";



router.get("/", function (req, res, next) {
    console.log("entraaaa")
  const agent = new https.Agent({
    rejectUnauthorized: false,
  });
  axios
    .get(url + `/WsCuenta/estado/cuenta/${req.body.cedula}`, {
      httpsAgent: agent,
      headers: {
        "Content-Type": "application/json",

        "X-API-KEY": req.body.token,
      },
    })
    .then((response) => {
        console.log("responde:")
      console.log(JSON.stringify(response.data));
      return res.status(response.status).json(response.data);
    })
    .catch((error) => {
      console.log(error);
      return res.status(error.response.status);
    });
});


module.exports = router;