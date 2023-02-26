const Joi = require('joi');

const noteId = Joi.string().uuid();
const hospitalId = Joi.string().uuid();
const doctorId = Joi.string().uuid();
const patientId = Joi.string().uuid();
const note = Joi.string();
const speciality = Joi.string();
const healthState = Joi.string();
const validity = Joi.boolean();
const hospitalNote = Joi.string();


const createNoteSchema = Joi.object({
  hospitalId: hospitalId.required(),
  doctorId: doctorId.required(),
  patientId: patientId.required(),
  note: note.required(),
  speciality: speciality.required(),
  healthState: healthState.required(),
});

// la validación y el hospitalNote son requeridos para modificar la nota médica
const updateNoteSchema = Joi.object({
  validity: validity.required(),
  hospitalNote: hospitalNote.required(),
});

const getNoteSchema = Joi.object({
  noteId: noteId.required(),
})


module.exports = {
  createNoteSchema,
  updateNoteSchema,
  getNoteSchema
}
