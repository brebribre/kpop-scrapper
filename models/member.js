import mongoose from 'mongoose'

const Schema = mongoose.Schema;

const MemberSchema = new Schema({
    stageName: {
        type: String,
        required: false
    },
    birthName: {
        type: String,
        required: false
    },
    position: {
        type: String,
        required: false
    },
    birthday: {
        type: String,
        required: false
    },
    nationality: {
        type: String,
        required: false
    },
    height: {
        type: String,
        required: false
    },
    weight: {
        type: String,
        required: false
    },
    img: {
        type: String,
        required: false
    },
})

const  Member = mongoose.models. Member || mongoose.model(" Member",  MemberSchema);

export default  Member;