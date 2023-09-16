import mongoose from 'mongoose'

const Schema = mongoose.Schema;

const GirlGroupSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    link: {
        type: String,
        required: true
    },
})

const GirlGroup = mongoose.models.GirlGroup || mongoose.model("GirlGroup", GirlGroupSchema);

export default GirlGroup;