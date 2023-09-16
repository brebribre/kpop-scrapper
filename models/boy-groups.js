import mongoose from 'mongoose'

const Schema = mongoose.Schema;

const BoyGroupSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    link: {
        type: String,
        required: true
    },
})

const BoyGroup = mongoose.models.BoyGroup || mongoose.model("BoyGroup", BoyGroupSchema);

export default BoyGroup;