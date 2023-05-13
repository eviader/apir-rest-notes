const express = require('express');
const classP = require('./products/products')
const { Router } = express;

const app = express();
const productos = Router()

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static("public"))

//Router de productos

//Lista todos los productos
productos.get('/', async (req, res, next) =>{
    try{
        const objs = await classP.method.getAll();
        res.send(objs);
    }catch(error){
        throw new Error(`Error al leer articulos`);
    }
});

//lista los productos por id
productos.get('/:id', async (req, res, next) =>{

    if(req.params.id != 0){
        try{
            let productoId = req.params.id;
            const objs = await classP.method.getById(productoId);
            res.send(objs);
        }catch(error){
            throw new Error(`Error al leer articulos`);
        }
    }else{
        try{
            const objs = await classP.method.getAll();
            res.send(objs);
        }catch(error){
            throw new Error(`Error al leer articulos`);
        }
    }   
});

//Incorpora nuevos productos
productos.post('/', async (req, res) => {
    try{
        const { title, note } = req.body;
        const now = new Date().toString()

        const newPost = await classP.method.saveProduct(title, note, now);
        console.log(`Productos guardada con exito. El id del producto es: ${newPost}`);
    }catch(error){
        throw new Error(`Error al cargar producto`);
    }
});

//modifica los productos por id
productos.put('/:id', async (req, res) => {

    const id = req.params.id
    const { nombre, descripcion, codigo, precio, img, stock } = req.body;

    const now = new Date().toString()
    const put = {timestamp: now,
                nombre: nombre,
                descripcion: descripcion,
                codigo:codigo,
                precio: precio,
                img: img,
                stock:stock};
    try{
        await classP.method.editProduct(id, put)
    }catch(error){
        throw new Error(`Error al modificar el producto`);
    }
    
});

//elimina los productos por id
productos.delete('/:id', async (req, res) => {
    try{
        const productoId = req.params.id;
        await classP.method.deleteById(parseInt(productoId))
        res.send(`Se elimino correctamente el producto con el id: ${productoId}`)

    }catch(error){
        throw new Error("Error al aliminar producto");
    }
});

app.use('/notes', productos);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server on PORT:${PORT}`) 
});

