import mongoose from 'mongoose'

const Schema = mongoose.Schema;

const BoyGroupBioSchema = new Schema({
    groupName: {
        type: String,
        required: true
    },
    groupImg: {
        type: String,
        required: false
    },
    members: [
        {
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
            img: {
                type: String,
                required: false
            },
        }
      ],
    officialSites: [
        {
            type: {
                type: String,
                required:true
            },
            links: [String]
        }
    ]
})



const BoyGroupBio = mongoose.models.BoyGroupBio || mongoose.model("BoyGroupBio", BoyGroupBioSchema);

export default BoyGroupBio;