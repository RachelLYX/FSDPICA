const express = require('express');
const router = express.Router();
const { Programs } = require('../models');
const { Op } = require("sequelize");
const yup = require("yup");

router.post("/", async (req, res) => {
    let data = req.body;

    const isFutureOrToday = (value) => {
        const currentDate = new Date();
        const inputDate = new Date(value);
        return inputDate >= currentDate;
    }

    const isValidMonth = (value) => {
        const month = parseInt(value.split('-')[1], 10);
        return month >= 1 && month <= 12;
    };
    // Input validation
    let programSchema = yup.object({
        Program: yup.string().trim().min(10, "Program must be at least 10 characters").required(),
        Venue: yup.string().trim().min(10, "Venue must be at least 10 characters").required(),
        Time: yup.string().matches(/^(?:[01]\d|2[0-3]):[0-5]\d:[0-5]\d$/, 'Invalid time format. Please enter in HH:mm:ss format.')
            .required('Time is required'),
        Date: yup.string().trim().matches(/^\d{4}-\d{2}-\d{2}$/, 'Invalid format. Please enter in yyyy-mm-dd format.')
            .test('is-future-or-today', 'Date must be today or in the future', isFutureOrToday)
            .test('is-valid-month', 'Invalid month. Please ensure month is between 01 and 12.', isValidMonth)
            .required(),
        Lunch: yup.string().matches(/^(?:[01]\d|2[0-3]):[0-5]\d:[0-5]\d$/, 'Invalid time format. Please enter in HH:mm:ss format.')
            .required('Lunch timing is required')
    });

    try {
        data = await programSchema.validate(data, { abortEarly: false });

        const result = await Programs.create(data);
        res.json(result);
    } catch (err) {
        res.status(400).json({ errors: err.errors });
    }
});

router.get("/", async (req, res) => {
    let condition = {};
    let search = req.query.search;
    if (search) {
        condition[Op.or] = [
            { Program: { [Op.like]: `%${search}%` } },
            { Venue: { [Op.like]: `%${search}%` } },
            { Time: { [Op.like]: `%${search}%` } },
            { Date: { [Op.like]: `%${search}%` } },
            { Lunch: { [Op.like]: `%${search}%` } }
        ];
    }
    let list = await Programs.findAll({
        where: condition,
        order: [['createdAt', 'DESC']]
    });
    res.json(list);
});

router.get("/:id", async (req, res) => {
    let id = req.params.id;
    let programs = await Programs.findByPk(id);
    if (!programs) {
        res.sendStatus(404);
        return;
    }
    res.json(programs);
});

router.put("/:id", async (req, res) => {
    let id = req.params.id;
    let data = req.body;
    const isFutureOrToday = (value) => {
        const currentDate = new Date();
        const inputDate = new Date(value);
        return inputDate >= currentDate;
    }

    const isValidMonth = (value) => {
        const month = parseInt(value.split('-')[1], 10);
        return month >= 1 && month <= 12;
    };
    // Input validation
    let programSchema = yup.object({
        Program: yup.string().trim().min(10, "Program must be at least 10 characters").required(),
        Venue: yup.string().trim().min(10, "Venue must be at least 10 characters").required(),
        Time: yup.string().matches(/^(?:[01]\d|2[0-3]):[0-5]\d:[0-5]\d$/, 'Invalid time format. Please enter in HH:mm:ss format.')
            .required('Time is required'),
        Date: yup.string().trim().matches(/^\d{4}-\d{2}-\d{2}$/, 'Invalid format. Please enter in yyyy-mm-dd format.')
            .test('is-future-or-today', 'Date must be today or in the future', isFutureOrToday)
            .test('is-valid-month', 'Invalid month. Please ensure month is between 01 and 12.', isValidMonth)
            .required(),
        Lunch: yup.string().matches(/^(?:[01]\d|2[0-3]):[0-5]\d:[0-5]\d$/, 'Invalid time format. Please enter in HH:mm:ss format.')
            .required('Lunch timing is required')
    });
    try {
        data = await programSchema.validate(data, { abortEarly: false });

        let programNum = await Programs.update(data, {
            where: { id: id }
        });
        if (programNum == 1) {
            res.json({
                message: "The program is successfully updated."
            });
        }
        else {
            res.status(400).json({
                message: `The program with id: ${id} cannot be updated, sorry`
            })
        }
    }
    catch (error) {
        res.status(400).json({ errors: error.errors });
    }

});

router.delete("/:id", async (req, res) => {
    let id = req.params.id;
    let program = await Programs.findByPk(id);
    if (!program) {
        res.sendStatus(404);
        return;
    }
    let programNum = await Programs.destroy({
        where: { id: id }
    })
    if (programNum == 1) {
        res.json({
            message: "The program is successfully deleted."
        });
    } else {
        res.status(400).json({
            message: `Program ${id} cannot be deleted, so sorry.`
        });
    }
});

module.exports = router;