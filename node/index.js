const consul = require('consul');

const express = require('express');


const consulApp = consul({
    host: '192.168.18.10',
    port: 8500,
  });

const SERVICE_NAME='microservicio101';
const SERVICE_ID='m'+process.argv[2];
const SCHEME='http';
const HOST=process.env.IP;
const PORT=process.argv[2]*1;

/* Inicializamos server */
const app = express();

app.get('/health', function (req, res) {
    res.end( "Ok." );
    });


app.get('/', function (req, res) {
    var s="<h1>Instancia '"+SERVICE_ID+"' del servicio '"+SERVICE_NAME+"'</h1>";
    s+="<h2>Listado de servicios</h2>";

    consulApp.agent.service.list(function(err, result) {
        try {
            if (err) throw err;
        } catch (error) {
            console.log(error)
        }

      res.end( s+JSON.stringify( result ) );
      });
    });
 
app.listen(PORT, function () {
    console.log('Sistema armado en el puerto '+SCHEME+'://'+HOST+':'+PORT+'!');
    });

/* Registro del servicio */
var check = {
  id: SERVICE_ID,
  name: SERVICE_NAME,
  address: HOST,
  port: PORT, 
  check: {
	   http: SCHEME+'://'+HOST+':'+PORT+'/health',
       dockercontainerid:'containerConsul',
	   ttl: '5s',
	   interval: '5s',
     timeout: '5s',
     deregistercriticalserviceafter: '1m'
	   }
  };
 
  consulApp.agent.service.register(check, function(err) {
    try {
        if (err) throw err;
    } catch (error) {
        console.log(error)
    }
  	
  	});