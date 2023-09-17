import express from 'express';
import cors from 'cors'
import mongoose from 'mongoose'

import dotenv from 'dotenv';
import GirlGroup from "./models/girl-groups.js";
import BoyGroup from './models/boy-groups.js'
import GirlGroupBio from './models/gg-bios.js'
import BoyGroupBio from './models/bg-bios.js'
import Member from './models/member.js'
import {scrapeIndividualGroup,scrapeBoyGroups,scrapeGirlGroups} from './scrapping-utils.js'
dotenv.config({ path: '.env.local' });

const app = express();
app.use(express.json());
app.use(express.static("public"));
app.use(cors()); // stop cross-origin errors

const mongoDBURI = process.env.MONGODB_URL;

mongoose.connect(mongoDBURI,{
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log("Connected to DB"))
    .catch(console.eror)



//API Routers

//returns list of boy groups with name and link attributes
app.get('/boy-groups', async(req,res)=>{
    const artists = await BoyGroup.find();

    res.json(artists);
});


//returns list of girl groups with name and link attributes
app.get('/girl-groups', async(req,res)=>{
  const artists = await GirlGroup.find();

  res.json(artists);
});


//Scrapes girl groups informations from 3rd party site, updates all new values on MongoDB
app.put('/girl-groups/update', async (req,res)=>{
    try {
        const girlGroups = await scrapeGirlGroups();

        //check if group exist
        for(let i = 0; i < girlGroups.length; i++){
            
            const e = girlGroups[i];
            const eName = e.name;
            const checkDB = await GirlGroup.findOne({ name: eName })

            if(checkDB){
              //if group exist, only updates the values to the new one
              console.log("Group exist, updating values...")
              checkDB.name = e.name;
              checkDB.link = e.link;
            }else{
              const tmp = new GirlGroup({
                name: e.name,
                link: e.link,
              })
              await tmp.save();
            }
      }
        return res.status(200).json({ message: 'GirlGroup Database updated successfully' });
      } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
      }
    
});


//Scrapes boy groups informations from 3rd party site, updates all new values on MongoDB
app.put('/boy-groups/update', async (req,res)=>{
  try {
    const boyGroups = await scrapeBoyGroups();

    //check if group exist
    for(let i = 0; i < boyGroups.length; i++){
        
        const e = boyGroups[i];
        const eName = e.name;
        const checkDB = await BoyGroup.findOne({ name: eName })

        if(checkDB){
          //if group exist, only updates the values to the new one
          console.log("Group exist, updating values...")
          checkDB.name = e.name;
          checkDB.link = e.link;
        }else{
          const tmp = new BoyGroup({
            name: e.name,
            link: e.link,
          })
          await tmp.save();
        }
  }
    return res.status(200).json({ message: 'BoyGroup Database updated successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
  
});


//Scrapes an individual kpop group site
app.put('/group-bio/:childLink', async (req,res)=>{
  try {
    const groupBio = await scrapeIndividualGroup(req.params.childLink);

    const tmpMembers = [];
    

    for(let i = 0 ; i < groupBio.members.length ; i++){
      let element = groupBio.members[i];
      
      const memberData = new Member({
        stageName: element.stageName,
        birthName: element.birthName,
        position: element.position,
        birthday: element.birthday,
        nationality: element.nationality,
        height: element.height,
        weight: element.weight,
        img: element.image,
      })
      tmpMembers.push(memberData);
    }
    

    const tmp = new GirlGroupBio({
      groupName: groupBio.groupName,
      groupImg: groupBio.groupImg,
      members: tmpMembers,
      officialSites : groupBio.officialSites
    })

    console.log(tmp);
    await tmp.save();

    //TODO Put it into database
    /*
    const checkDB = await GirlGroupBio.findOne({ name: gname })

        if(checkDB){
          //if group exist, only updates the values to the new one
          console.log("Group exist, updating values...")
          //TODO UPDATE VALUES
        }else{
          const tmp = new GirlGroupBio({
            groupName: groupBio.groupName,
            groupImg: groupBio.groupImg,
            members: groupBio.members,
            officialSites : groupBio.officialSites
          })
          await tmp.save();
    }
    */

    return res.status(200).json({ message: 'Scrapping Database successful' });    
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
  
});


app.listen(3001, () => {
    console.log('Server started on port 3001');
})
