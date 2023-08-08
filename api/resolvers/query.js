export default {
  notes: async (_, __, { models }) => {
    const records = await models.Note.find();

    return records;
  },

  note: async (_, { id }, { models }) => {
    const note = await models.Note.findById(id);

    return note;
  },
};
