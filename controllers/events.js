const Event = require("../models/Event");

const getEvents = async(req, res) => {
    
    const events = await Event.find().populate('user', 'name');
    
    res.json({
        ok: true,
        events
    });
};

const createEvent = async(req, res) => {
    const event = new Event( req.body );

    try {

        event.user = req.uid;

        await event.save();

        res.json({
            ok: true,
            evento: event
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: "Ups algo salio mal",
        });    
    }
};

const updateEvent = async(req, res) => {    
    const eventId = req.params.id;
    const uid = req.uid;

    try {        
        const event = await Event.findById( eventId );

        if ( !event ){
            return res.status(404).json({
                ok: false,
                msg: 'Evento no existe con ese id'
            })
        }

        if( event.user.toString() !== uid ){
            return res.status(401).json({
                ok: false,
                msg: 'No tiene privilegio de editar este evento'                
            })
        }

        const newEvent = {
            ...req.body,
            user: uid
        }

        const updatedEvent = await Event.findByIdAndUpdate( eventId, newEvent, { new: true } );

        res.json({
            ok: true,
            evento: updatedEvent,
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Ups algo salio mal'
        })
    }
    
};

const deleteEvent = async(req, res) => {
   
    const eventId = req.params.id;
    const uid = req.uid;

    try {        
        const event = await Event.findById( eventId );

        if ( !event ){
            return res.status(404).json({
                ok: false,
                msg: 'Evento no existe con ese id'
            })
        }

        if( event.user.toString() !== uid ){
            return res.status(401).json({
                ok: false,
                msg: 'No tiene privilegio de eliminar este evento'                
            })
        }

        await Event.findByIdAndDelete( eventId );

        res.json({
            ok: true
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Ups algo salio mal'
        })
    }
};

module.exports = {
    getEvents,
    createEvent,
    updateEvent,
    deleteEvent
};
