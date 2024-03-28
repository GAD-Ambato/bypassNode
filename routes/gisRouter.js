var express = require('express');
var router = express.Router();
var axios = require("axios")
const URLBASE="https://gis.ambato.gob.ec:444/api"
const authString="Basic dGVzdDp0ZXN0"
const https = require('https')
/* GET users listing. */
router.get('/parroquias', function(req, res, next) {
    const agent = new https.Agent({  
        rejectUnauthorized: false
      });
      axios.get(URLBASE+"/Catalogo/Parroquias", { httpsAgent: agent, headers: { 
        'Authorization': authString
      } })
      .then((response) => {
        console.log(JSON.stringify(response.data));
        return res.status(response.status).json(response.data);
      })
      .catch((error) => {
        console.log(error);
        return res.status(error.response.status)
      });
});

router.get('/MapaBase/:predio/:parroquia', function(req, res, next) {
  
  const agent = new https.Agent({  
      rejectUnauthorized: false
    });
    var predio = req.params.predio;
    var parroquia = req.params.parroquia;
  
    console.log(`/Imagen/MapaBase/${predio}/${parroquia}`)

   
    axios.get(`https://gis.ambato.gob.ec:444/api/Imagen/MapaBase/${predio}/${parroquia}/base64`, 
    { httpsAgent: agent, headers: { 
      'Authorization': authString
    } })
    .then((response) => {
      console.log(JSON.stringify(response.data));
      return res.status(response.status).json(response.data);
    })
    .catch((error) => {
      console.log(error);
      return res.status(error.response.status)
    });
});


https://gis.ambato.gob.ec:444/api/Imagen/NombreParroquia/180150


router.get('/Imagen/NombreParroquia/:codigo', function(req, res, next) {
  
  const agent = new https.Agent({  
      rejectUnauthorized: false
    });
    var codigo = req.params.codigo;
   


   
    axios.get(`https://gis.ambato.gob.ec:444/api/Imagen/NombreParroquia/${codigo}`, 
    { httpsAgent: agent, headers: { 
      'Authorization': authString
    } })
    .then((response) => {
      console.log(JSON.stringify(response.data));
      return res.status(response.status).json(response.data);
    })
    .catch((error) => {
      console.log(error);
      return res.status(error.response.status)
    });
});



module.exports = router;
