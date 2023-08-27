export default {
  notes: async (_, __, { models }) => {
    const records = await models.Note.find();

    return records;
  },

  note: async (_, { id }, { models }) => {
    const note = await models.Note.findById(id);

    return note;
  },

  user: async (_, { username }, { models }) => {
    const _user = await models.User.findOne({ username });

    return _user;
  },

  users: async (_, __, { models }) => {
    const users = await models.User.find({});

    return users;
  },

  me: async (_, __, { models, user }) => {
    const me = await models.User.findById(user?.id);

    return me;
  },
};
