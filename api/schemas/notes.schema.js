const Joi = require('joi');

const noteId = Joi.string();
const hospitalId = Joi.string();
const doctorId = Joi.string();
const patientId = Joi.string();
const note = Joi.string();
const speciality = Joi.string();
const healthState = Joi.string();
const date = Joi.date();
const validity = Joi.boolean();
const hospitalNote = Joi.string();


const createNoteSchema = Joi.object({
  hospitalId: hospitalId.required(),
  doctorId: doctorId.required(),
  patientId: patientId.required(),
  note: note.required(),
  speciality: speciality.required(),
  healthState: healthState.required(),
  date: date.required(),
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
