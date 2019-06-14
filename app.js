
const mongoose = require('mongoose');
const mongoUrl = 'mongodb+srv://<tuUsuario>:<tuPassword>@cluster0-u6wpp.mongodb.net/test?retryWrites=true&w=majority';

mongoose.connect(mongoUrl, {useNewUrlParser: true}, (err) => {
    if(!err){
        console.log('Conexion a mongo exitosa');
    }
});

const express = require('express');
const bodyParser = require('body-parser');
const PORT = 3000;

const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send({message:'Eres un master'})
});

// Crear una Pelicula
app.post('/create/pelicula', (req, res)=> {
    const { titulo,genero,duracion,actores} = req.body;
    const newMovie = Pelicula({
        titulo,
        genero,
        duracion,
        actores
    });
    newMovie.save((err, pelicula) => {
        if(err) {
            res.status(400).send(err)
        }
        res.status(201).send(pelicula)
    });
});

// Consultar Peliculas Creadas (Todas)
app.get('/peliculas',(req,res) => {
    Pelicula.find().exec()
        .then(peliculas => res.send(peliculas))
        .catch(err => res.status(409).send(err))
});

// Consultar Pelicula por Id
app.get('/pelicula/:id',(req,res)=> {
    const {id} = req.params;
    Pelicula.findById(id).exec()
        .then(pelicula => pelicula ? res.send(pelicula) : res.status(404).send({message:'Pelicula no Encontrada'}))
        .catch(err => res.status(409).send(err))
});

const Schema = mongoose.Schema;

const movies = new Schema({
    titulo: String,
    genero: {
        type: String
    },
    duracion: {
        type: Number,
        time: 90
    },
    actores: {
        type: [{
            nombre: String,
            edad: {
                type: Number,
                default: 18
            }
        }]
    }
},{timestamps: true});

const Pelicula = mongoose.model('Pelicula', movies);





app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
})