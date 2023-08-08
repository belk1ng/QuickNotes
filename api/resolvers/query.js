export default {
    notes: async (_, __, { models }) => {
        console.log(models)
        const records = await models.Note.find();
        
        return records;
    },

    note: async (_, args, { models }) => {
        const note = await models.Note.findById(args.id);

        return note
    },
}
