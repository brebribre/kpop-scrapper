import mongoose from 'mongoose'
import findOrCreate from 'mongoose-find-or-create'

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

const GirlGroup = mongoose.model("GirlGroup", GirlGroupSchema);
GirlGroupSchema.plugin(findOrCreate)
export default GirlGroup;