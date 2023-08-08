export default {
    newNote: async (_, args, { models }) => {
        let newNoteValues = {
            content: args.content,
            author: "Adam Scott",
        };  

        const note = await models.Note.create(newNoteValues);

        return note;
    },
}
