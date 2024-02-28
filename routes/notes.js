var express = require('express');
var router = express.Router();

const Validator = require('fastest-validator');
const v = new Validator();
const {Notes} = require('../models');

// GET
router.get("/", async (req, res, next) => {
    const notes = await Notes.findAll();
    return res.json({
        status: 200, 
        message: "Success Get All Data",
        data: notes
    });
});

// GET DATA BY ID
router.get("/:id", async (req, res, next) => {
    const id = req.params.id;
    // Check id in table note
    let note = await Notes.findByPk(id);
    if(!note) {
        return res.status(404).json({
            status: 404,
            message: "Data Not Found"
        }); 
    } else {
        return res.json({
            status: 200,
            message: "Success Get Data",
            data: note
        });
    } 
});

// POST
router.post("/", async (req, res, next) => {
    // Validation
    const schema = {
        title: "string",
        description: "string|optional"
    };
    const validate = v.validate(req.body, schema);
    if (validate.length) {
        return res.status(400).json(validate);
    }

    // Console log untuk melihat data yang dikirim
    console.log("Data yang dikirim:", req.body);

    // Proses Create
    const { title, description } = req.body;
    const note = await Notes.create({ title, description });
    res.json({
        status: 200,
        message: "Success Create Data",
        data: note
    });
});



// PUT
router.put("/:id", async (req, res, next) => {
    const id = req.params.id;
    let note = await Notes.findByPk(id);
    if(!note) {
        return res.status(404).json({
            status: 404,
            message: "Data Not Found"
        });
    }
    // Validation
    const schema = {
        title: "string|optional",
        description: "string|optional"
    };
    const validate = v.validate(req.body, schema)
    if (validate.length) {
        return res.status(400).json(validate);
    }
    // Proses Update
    note = await note.update(req.body);
    res.json({
        status: 200,
        message: "Success Update Data",
        data: note
    });
});

// DELETE
router.delete("/:id", async (req, res, next) => {
    const id = req.params.id;
    // Check id in table note
    let note = await Notes.findByPk(id);
    if(!note) {
        return res.status(404).json({
            status: 404,
            message: "Data Not Found"
        }); 
    } 
    
    // Proses Delete Data
    await note.destroy();
    res.json({
        status: 200,
        message: "Success Delete Data",
        data: note
    });
});

module.exports = router;