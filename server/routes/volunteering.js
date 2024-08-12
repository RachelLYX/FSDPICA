const express = require('express');
const router = express.Router();
const { Volunteering } = require('../models');
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
    let volunteerSchema = yup.object({
        Program: yup.string().trim().min(10).required(),
        Name: yup.string().trim().matches(/^[A-Za-z\s]+$/, "Name must be alphabetic").required(),
        Contact_Number: yup.number().integer().test('len', 'Contact number must have exactly 8 digits', val => val.toString().length === 8).required(),
        Date: yup.string().trim().matches(/^\d{4}-\d{2}-\d{2}$/, 'Invalid format. Please enter in yyyy-mm-dd format.')
            .test('is-future-or-today', 'Date must be today or in the future', isFutureOrToday)
            .test('is-valid-month', 'Invalid month. Please ensure month is between 01 and 12.', isValidMonth)
            .required()
    });

    try {
        data = await volunteerSchema.validate(data, { abortEarly: false });

        const result = await Volunteering.create(data);
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
            { Program: { [Op.like]: `%${search}%` }},
            { Name: { [Op.like]: `%${search}%` }},
            { Contact_Number: { [Op.like]: `%${search}%` }},
            { Date: { [Op.like]: `%${search}%` }}
        ];
    }
    let list = await Volunteering.findAll({
        where: condition,
        order: [['createdAt', 'DESC']]
    });
    res.json(list);
});

router.get("/:id", async (req, res) => {
    let id = req.params.id;
    let volunteering = await Volunteering.findByPk(id);
    if (!volunteering) {
        res.sendStatus(404);
        return;
    }
    res.json(volunteering);
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
    let volunteerSchema = yup.object({
        Program: yup.string().trim().min(10),
        Name: yup.string().trim().matches(/^[A-Za-z\s]+$/, "Name must be alphabetic"),
        Contact_Number: yup.number().integer().test('len', 'Contact number must have exactly 8 digits', val => val.toString().length === 8),
        Date: yup.string().trim().matches(/^\d{4}-\d{2}-\d{2}$/, 'Invalid format. Please enter in yyyy-mm-dd format.')
            .test('is-future-or-today', 'Date must be today or in the future', isFutureOrToday)
            .test('is-valid-month', 'Invalid month. Please ensure month is between 01 and 12.', isValidMonth)
    });
    try {
        data = await volunteerSchema.validate(data, { abortEarly: false });

        let volunteerNum = await Volunteering.update(data, {
            where: { id: id }
        });
        if (volunteerNum == 1) {
            res.json({
                message: "The volunteering program is successfully updated."
            });
        }
        else {
            res.status(400).json({
                message: `The volunteering program with id: ${id} cannot be updated, sorry`
            })
        }
    }
    catch (error) {
        res.status(400).json({ errors: error.errors });
    }

});

router.delete("/:id", async (req, res) => {
    let id = req.params.id;
    let volunteering = await Volunteering.findByPk(id);
    if (!volunteering) {
        res.sendStatus(404);
        return;
    }
    let volunteerNum = await Volunteering.destroy({
        where: { id: id }
    })
    if (volunteerNum == 1) {
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