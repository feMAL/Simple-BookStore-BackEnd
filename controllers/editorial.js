'use strict'

var Editorial = require('../models/editorial');
var pagination = require('mongoose-pagination') // <- MONGOOSE PAGINATION

//controlador Editoriales

// Obtener un Autor de la DB con un ID de autor Recibido.
let getEditorial = (req,res) => {
    let editorialId = req.params.id;

    Editorial.findById(editorialId,(err,findit)=>{
        if(err){
            res.status(404).send({message: 'Error al buscar el registro'});
            throw err
        }else{
            if(!findit){
                res.status(404).send({message: 'El registro no ha sido encontrado'});
            }else{
                res.status(200).send({editorial : findit})
            }
        }
    });
}

// Obtener los Autores de la DB con depediendo la cantidad de paginas solicitadas
let getEditorials = (req,res) => {
    if(req.params.page){
        var pages = req.params.page;
    }else{
        var pages = 1;
    }
    var itemsPerPage = 5
    Editorial.find().sort('name').paginate(pages,itemsPerPage,(err,editorials,tot)=>{
        if(err){
            res.status(404).send({message: 'Error al buscar el registros'});
            throw err
        }else{
            if(!editorials){
                res.status(404).send({message: 'El registro no ha sido encontrado'});
            }else{
                res.status(200).send({
                    amount : tot,
                    pages: pages,
                    editorials: editorials
                });
            }
        }
    });
}


let saveEditorial = (req,res) => {
    var editorial = new Editorial();
    let params = req.body;

    editorial.name = params.name;
    editorial.url = params.url;
    editorial.description = params.description;
    editorial.contact = params.contact;
    editorial.logo = 'null';

    if(!editorial.name){
        res.status(404).send({message: 'El campo nombre del autor es requerido para dar de alta el registro'})
    }else{
        Editorial.findOne({name: editorial.name},(err,findit)=>{
            if(err){
                res.status(404).send({message: 'Incidente al cargar un registro'});
            }else{
                if(!findit){
                    editorial.save({editorial},(err, savedEditorial)=>{
                        if(err){
                            res.status(404).send({message: 'Error al dar de alta el registro'});
                        }else{
                            if(!savedEditorial){
                                res.status(404).send({message: 'El registro no se guardo correctamente'});
                            }else{
                                res.status(200).send({newEditorial: savedEditorial});
                            }
                        }
                    })
                }else{
                    res.status(404).send({message: 'El autor ingresado ya existe'});
                }
            }
        })
    }
}

let updateEditorial = (req,res) => {
    var idEditorial = req.params.id;
    var values = req.body;
    if(!idEditorial){
        res.status(404).send({message: "No ha enviado el id del autor que desea actualizar"});
    }else{
        Editorial.findByIdAndUpdate(idEditorial,values,(err,editorialUpdated)=>{
            if(err){
                res.status(404).send({message: 'Error al actualizar el registro'});
            }else{
                if(!editorialUpdated){
                    res.status(404).send({message: 'Registro no actualizado'});
                }else{
                    res.status(200).send({editorialUpdated: editorialUpdated});
                }
            }
        })
    }
}

module.exports = {
    saveEditorial,
    getEditorial,
    getEditorials,
    updateEditorial
}