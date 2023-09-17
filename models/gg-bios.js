import mongoose from 'mongoose'

const Schema = mongoose.Schema;

const GirlGroupBioSchema = new Schema({
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
            weight: {
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



const GirlGroupBio = mongoose.models.GirlGroupBio || mongoose.model("GirlGroupBio", GirlGroupBioSchema);

export default GirlGroupBio;