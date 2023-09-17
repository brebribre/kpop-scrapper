import mongoose from 'mongoose'

const Schema = mongoose.Schema;

const BoyGroupBioSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    link: {
        type: String,
        required: true
    },
})

const BoyGroupBio = mongoose.models.BoyGroupBio || mongoose.model("BoyGroupBio", BoyGroupBioSchema);

export default BoyGroupBio;