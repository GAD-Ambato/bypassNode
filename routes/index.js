var express = require('express');
var router = express.Router();
const https = require('https')
const axios = require('axios');
const multer  = require('multer')

const path = require('path');
const fs = require('fs')
var FormData = require('form-data');

const dotenv = require('dotenv');
dotenv.config();


const username = process.env.USERNAME;
const password = process.env.PASS;

console.log(username, password)
// Configuracion para subida de archivos 
const uploadDir = path.join(__dirname, 'uploads');

// Crear el directorio de carga si no existe
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}
// Configurar Multer para manejar múltiples archivos
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const extname = path.extname(file.originalname);
    cb(null, Date.now() + extname);
  },
});

const upload = multer({ storage: storage })
// Fin de la configuracion de subida de archivos

// const authString = Buffer.from(`${username}:${password}`).toString('base64');
const authString = 'Basic RklOQURPUzpHeWZsXDdDWTlxOTM=';
console.log(authString);
// const headers = {
//   'Authorization': `Basic ${authString}` // Ajusta el tipo de contenido según tus necesidades
// };
const headers = {
  'Authorization': 'Basic RklOQURPUzpHeWZsXDdDWTlxOTM='// Ajusta el tipo de contenido según tus necesidades
};
/* GET home page. */
router.get('/api/WsFinados/rest/metodo/:event', function(req, res, next) {
// At instance level
var event = req.params.event;



// At request level
const agent = new https.Agent({  
  rejectUnauthorized: false
});
axios.get(process.env.BASE_URL+event, { httpsAgent: agent, headers: headers })
.then((response) => {
  console.log(JSON.stringify(response.data));
  return res.status(response.status).json(response.data);
})
.catch((error) => {
  console.log(error);
  return res.status(error.response.status)
});

});

router.get('/api/WsFinados/rest/metodo/:event/:event2', function(req, res, next) {
  // At instance level
  var event = req.params.event;
  var event2 = req.params.event2;

  // At request level
  const agent = new https.Agent({  
    rejectUnauthorized: false
  });
  axios.get(process.env.BASE_URL+event+'/'+event2, { httpsAgent: agent, headers: { 
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

router.post('/api/WsFinados/rest/metodo/:event', function(req, res, next) {
  // At instance level
  var event = req.params.event;
  const instance = axios.create({
    httpsAgent: new https.Agent({  
      rejectUnauthorized: false
    })
  });
 
  

  var body = req.body;

  console.log(body);
  instance.post(process.env.BASE_URL+event,  body, {headers:headers} )


  .then((response) => {
    console.log(JSON.stringify(response.data));
    

    console.log(body)
    return res.status(response.status).json(response.data);
  })
  .catch((error) => {
    // console.log(error);
    
    console.log('=============ERROR==================');
    console.log(error);
    console.log('====================================');

   
    return res.status(error.response.status).json(error);
  });
  
  });

router.post('/api/WsFinados/rest/metodo/:event/:event2', function(req, res, next) {
    // At instance level
    var event = req.params.event;
    var event2 = req.params.event2;
    const instance = axios.create({
      httpsAgent: new https.Agent({  
        rejectUnauthorized: false
      })
    });
   
    
    
  
    var body = req.body;
  
    console.log(body);
    instance.post(process.env.BASE_URL+event+'/'+event2,  body, {headers:headers} )
  
  
    .then((response) => {
      console.log(JSON.stringify(response.data));
      console.log(body)
      return res.json(response.data);
    })
    .catch((error) => {
      // console.log(error);
      console.log('====================================');
  
      console.log(body);
      console.log('====================================');
      return res.status(error.response.status).json(error);
    });
    
    });
  

  router.post('/WsFinados/SrvFiles', upload.single('rec_1') ,(req,res,next)=>{
    // process.env.FILE_SERVER


    const instance = axios.create({
    });
    console.log("Datos desde el formulario ");
    console.log(body);
    console.log("Datos desde el file ");
    console.log(req.file);
    
   
    var body = req.body;
    
    var formSend = new FormData();
    formSend.append('file', req.file);
   
  
    instance.post(process.env.FILE_SERVER,  formSend, {headers:headers} )
    .then((response) => {
      console.log(JSON.stringify(response.data));
      console.log(body)
      return res.status(response.status).json(response.data);
    })
    .catch((error) => {
      // console.log(error);
      console.log('=================================');
  
      console.log(body);
      console.log('====================================');
      return res.status(error.response.status).json(error);
    });
  })


  router.post('/upload',upload.array('imagenes', 5),async (req,res)=>{
try {
  const uploadedFiles = req.files;
  console.log('BODY')
  console.log(req.body)
  if (!uploadedFiles || uploadedFiles.length === 0) {
    return res.status(400).json({ error: 'No se proporcionaron archivos para cargar.' });
  }

  const imagePaths = uploadedFiles.map((file) => file.path);
  var dta = await enviarImagenServer(imagePaths, req.body.ids);
  // console.log(dta)
  return res.status(dta.status).json(dta.data);
  // res.status(200).json({ message: 'Imágenes subidas con éxito', imagePaths: imagePaths });
  
} catch (error) {
    console.log(error)
    return res.status(500).json({ error: error.message });
}
    
  
})

router.post('/upload-unique',upload.single('imagenes'),async (req,res)=>{
  try {
    const uploadedFiles = [req.file];
    // console.log(uploadedFiles)
    console.log('BODY')
    console.log(req.body)
    console.log('File')
    console.log(uploadedFiles)
    if (!uploadedFiles || uploadedFiles.length === 0) {
      return res.status(400).json({ error: 'No se proporcionaron archivos para cargar.' });
    }
  
    const imagePaths = uploadedFiles.map((file) => file.path);
    console.log(imagePaths)

    var dta = await enviarImagenServer(imagePaths, [ req.body.ids ] );
    return res.status(dta.status).json(dta.data);
    // res.status(200).json({ message: 'Imágenes subidas con éxito', imagePaths: imagePaths });
    
  } catch (error) {
      console.log(error)
      return res.status(500).json({ error: error.message });
  }
      
    
  })



async function enviarImagenServer(imagePaths, imageNames) {
  try {

    //Intancia de axios 
    const instance = axios.create({
      httpsAgent: new https.Agent({  
        rejectUnauthorized: false
      })
    });
    // Crear una instancia de FormData
    const form = new FormData();

    // Agregar las imágenes al formulario
    imagePaths.forEach((imagePath, index) => {
      const imageStream = fs.createReadStream(imagePath);
      // const imageName = path.basename(imagePath);
      console.log(imageNames[index],imagePath[index])
      form.append(imageNames[index], imageStream);
    });

    // Realizar una solicitud POST al servidor de destino
    const response = await instance.post(process.env.FILE_SERVER, form, {
      headers: {
        'Authorization': authString,
        ...form.getHeaders(),
      },
    });

    // Manejar la respuesta del servidor de destino
    console.log('Respuesta del servidor de destino:');
    // console.log(response.data);
    return response;
  } catch (error) {
    // Manejar errores
    console.error('Error al enviar imágenes al servidor de destino:', error.message);
    if (error.response) {
      console.log('Estado de respuesta:');
      console.log(error.response.status); // Devuelve el estado HTTP de la respuesta de error
      console.log('Cuerpo de respuesta de error:');
      console.log(error.response.data);
      return  error.response// Devuelve el cuerpo de la respuesta de error
    }
  }
}



module.exports = router;
