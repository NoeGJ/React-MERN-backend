/*
    Events
    Host + /api/events
*/

const { Router } = require("express");
const { check } = require("express-validator");
const { validarJWT } = require('../middlewares/validar-jwt');
const { validateField } = require("../middlewares/field-validators");
const { isDate } = require("../helpers/isDate");
const {
        getEvents,
        createEvent,
        updateEvent,
        deleteEvent
} = require('../controllers/events');

const router = Router();

router.use( validarJWT );

// Obtener eventos
router.get('/', getEvents );

router.post(
    '/',     
    [
    check('title', 'El titulo es obligatorio').not().isEmpty(),
    check('start', 'Fecha de inicio es obligatoria').custom( isDate ),
    check('end', 'Fecha de finalización es obligatoria').custom( isDate ),
    validateField
    ], 
    createEvent 
);

router.put('/:id', updateEvent );

router.delete('/:id', deleteEvent );

module.exports = router;