export default {
  newNote: async (_, { content }, { models }) => {
    let newNoteValues = {
      content: content,
      author: "Adam Scott",
    };

    const note = await models.Note.create(newNoteValues);

    return note;
  },

  updateNote: async (_, { id, content }, { models }) => {
    const note = await models.Note.findByIdAndUpdate(
      id,
      { $set: { content } },
      { returnDocument: "after" }
    );

    return note;
  },

  removeNote: async (_, { id }, { models }) => {
    try {
      await models.Note.findByIdAndRemove(id);

      return true;
    } catch {
      return false;
    }
  },
};
