export default {
  author: async (note, _, { models }) => {
    const authorOfNote = await models.User.findById(note.author);

    return authorOfNote;
  },

  inFavorite: async (note, _, { models }) => {
    const usersWithNoteInFavoriteList = await models.User.find({
      _id: { $in: note.inFavorite },
    });

    return usersWithNoteInFavoriteList;
  },
};
