import mongoose from 'mongoose'

const Schema = mongoose.Schema;

const BoyGroupBioSchema = new Schema({
    
})

const BoyGroupBio = mongoose.models.BoyGroupBio || mongoose.model("BoyGroupBio", BoyGroupBioSchema);

export default BoyGroupBio;
