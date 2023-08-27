export default {
  notes: async (user, _, { models }) => {
    const notesOfUser = await models.Note.find({ author: user._id });

    return notesOfUser;
  },

  favoriteNotes: async (user, _, { models }) => {
    const userFavoritesNotes = await models.Note.find({ inFavorite: user._id });

    return userFavoritesNotes;
  },
};
