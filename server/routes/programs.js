const express = require('express');
const router = express.Router();
const { Program } = require('../models');
const { Op } = require("sequelize");
const yup = require("yup");

const isValidMonth = (dateString) => {
    const [year, month, day] = dateString.split('-');
    if (parseInt(month, 10) < 1 || parseInt(month, 10) > 12) {
        return false;
    }
    return true;
};

router.post("/", async (req, res) => {
    let data = req.body;
    // Validate request body
    let programSchema = yup.object({
        Program: yup.string().trim().min(10).required(),
        Venue: yup.string().trim().min(10).required(),
        Time: yup.string().trim().matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/, 'Invalid format. Please enter in hh:mm:ss format.').required(),
        Date: yup.string().trim().matches(/^\d{4}-\d{2}-\d{2}$/, 'Invalid format. Please enter in yyyy-mm-dd format.')
                 .test('is-valid-month', 'Invalid month. Please ensure month is between 01 and 12.', isValidMonth).required(),
        Lunch: yup.string().trim().matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/, 'Invalid format. Please enter in hh:mm:ss format.').required()
    });
    try {
        data = await programSchema.validate(data, 
            { abortEarly: false });

        let result = await Program.create(data);
        res.json(result);
    }
    catch (err) {
        res.status(400).json({ errors: err.errors })
    }
});

router.get("/", async (req, res) => {
    let condition = {};
    let search = req.query.search;
    if (search) {
        condition[Op.or] = [
            { Program: { [Op.like]: `%${search}%`} },
            { Venue: { [Op.like]: `%${search}%`} },
            { Time: { [Op.like]: `%${search}%`}},
            { Date: { [Op.like]: `%${search}%`}},
            { Lunch: { [Op.like]: `%${search}%`}}
        ]
    }
    let list = await Program.findAll({
        where: condition,
        order: [['createdAt', 'DESC']]
    });
    res.json(list);
});

router.get("/:id", async (req, res) => {
    let id = req.params.id;
    let program = await Program.findByPk(id);
    if (!program) {
        res.sendStatus(404);
        return;
    }
    res.json(program);
});

router.put("/:id", async (req, res) => {
    let id = req.params.id;
    let data = req.body;
    let programSchema = yup.object({
        Program: yup.string().trim().min(10),
        Venue: yup.string().trim().min(10),
        Time: yup.string().trim().matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/, 'Invalid format. Please enter in hh:mm:ss format.'),
        Date: yup.string().trim().matches(/^\d{4}-\d{2}-\d{2}$/, 'Invalid format. Please enter in yyyy-mm-dd format.')
                 .test('is-valid-month', 'Invalid month. Please ensure month is between 01 and 12.', isValidMonth),
        Lunch: yup.string().trim().matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/, 'Invalid format. Please enter in hh:mm:ss format.')
    });
    try {
        data = await programSchema.validate(data, 
            { abortEarly: false});
        
        let programNum = await Program.update(data, {
            where: { id: id }
        });
        if (programNum == 1) {
            res.json({
                message: "You have successfully updated the program."
            });
        }
        else {
            res.status(400).json({
                message: `Program with id: ${id} cannot be updated, sorry.`
            })
        }
    }
    catch (error) {
        res.status(400).json({ errors: error.errors });
    }
});

router.delete("/:id", async (req, res) => {
    let id = req.params.id;
    let program = await Program.findByPk(id);
    if (!program) {
        res.sendStatus(404);
        return;
    }
    let programNum = await Program.destroy({
        where: { id: id }
    })
    if (programNum == 1) {
        res.json({
            message: "You have successfully deleted the program."
        });
    }
    else {
        res.status(400).json({
            message: `Program with id: ${id} cannot be deleted, sorry.`
        });
    }
});

module.exports = router;