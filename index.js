import puppeteer from "puppeteer";
import express from 'express';
import cors from 'cors'
import mongoose from 'mongoose'

import dotenv from 'dotenv';
import GirlGroup from "./models/girl-groups.js";
import BoyGroup from './models/boy-groups.js'
import { formatText, getDataOnKeyword } from "./utils.js";

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



const getGirlGroups = async () => {
  // Start a Puppeteer session with:
  // - a visible browser (`headless: false` - easier to debug because you'll see the browser in action)
  // - no default viewport (`defaultViewport: null` - website page will in full width and height)
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
  });

  // Open a new page
  const page = await browser.newPage();

  // On this new page:
  // - open the "https://kprofiles.com/k-pop-girl-groups/" website
  // - wait until the dom content is loaded (HTML is ready)
  await page.goto("https://kprofiles.com/k-pop-girl-groups/", {
    waitUntil: "domcontentloaded",
  });

  // Get page data
  const groups = await page.evaluate(() => {
    // Fetch the first element with class "quote"
    const block = document.querySelector('#post-4 > div > div.col-lg-9.col-mod-single.col-mod-main > div.entry-content.herald-entry-content');

    // Fetch the sub-elements from the previously fetched quote element
    // Get the displayed text and return it (`.innerText`)
    const groupNamesSelector = block.querySelectorAll('a');

    // Create an array to store the inner text of all <a> elements
    const names = [];

    // Iterate through the NodeList and extract the inner text of each <a> element
    groupNamesSelector.forEach((element) => {
        const href = element.getAttribute('href');
        const text = element.textContent
        names.push({
            name: text,
            link: href
          });
    });

    return names;
  });

  return groups
  
};

const getBoyGroups = async () => {
    const browser = await puppeteer.launch({
      headless: false,
      defaultViewport: null,
    });
  
    const page = await browser.newPage();
  
    await page.goto("https://kprofiles.com/k-pop-boy-groups/", {
      waitUntil: "domcontentloaded",
    });
  
    // Get page data
    const groups = await page.evaluate(() => {
      const block = document.querySelector('#post-6 > div > div.col-lg-9.col-mod-single.col-mod-main > div.entry-content.herald-entry-content');
      const groupNamesSelector = block.querySelectorAll('a');
  
      const names = [];
  
      groupNamesSelector.forEach((element) => {
          const href = element.getAttribute('href');
          const text = element.textContent
          names.push({
            name: text,
            link: href
          });
      });
  
      return names;
    });
    return groups;   
};

const getIndividualGroup = async (childLink) => {
  //initialize puppeteer and open browser
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
  });

  const page = await browser.newPage();
  const url = "https://kprofiles.com/" + childLink;

  await page.goto(url, {
    waitUntil: "domcontentloaded",
  });

  // Get page data
  const groupBio = await page.evaluate(() => {

    //1. get pageID
    const elements = document.querySelectorAll("article");
    let uniqueId;
    if(elements[0].getAttribute('id')){
      uniqueId = '#' + elements[0].getAttribute('id');
    }

    //2. get all content elements inside <p></p>
    const doc = document.querySelector(uniqueId + ' > div > div.col-lg-9.col-md-9.col-mod-single.col-mod-main > div > div.col-lg-10.col-md-10.col-sm-10 > div');
    const docLen = doc.querySelectorAll('p').length;

    //3. get important elements like title and img
    const title = document.querySelector(uniqueId + ' > div > div.col-lg-9.col-md-9.col-mod-single.col-mod-main > header > h1').textContent;
    const contentBlock = document.querySelector(uniqueId + ' > div > div.col-lg-9.col-md-9.col-mod-single.col-mod-main > div > div.col-lg-10.col-md-10.col-sm-10 > div > p:nth-child(1)');
    const groupImg = contentBlock.querySelector('img').getAttribute('src');

    //4. format all content lines, starting from index 2 
    const contentLines = [];
    let tmp;

    for(let i = 5 ; i < docLen ; i++){
      tmp = document.querySelector(uniqueId + ' > div > div.col-lg-9.col-md-9.col-mod-single.col-mod-main > div > div.col-lg-10.col-md-10.col-sm-10 > div > p:nth-child(' + i + ')');
      if(tmp){contentLines.push(tmp.textContent)};
    }
   
    return {title,groupImg, contentLines};
  });

  //5. format all of the lines
  for(let i = 0; i < groupBio.contentLines.length ; i++){
    groupBio.contentLines[i] = formatText(groupBio.contentLines[i]);
  }

  //TODO erase all unneeded informations
  const informationBlocks = [];

  //get official accounts
  informationBlocks.push(getDataOnKeyword(groupBio.contentLines, "official account"));
  informationBlocks.push(getDataOnKeyword(groupBio.contentLines, "birth name"));
  groupBio.contentLines = informationBlocks;
  console.log(groupBio.contentLines);
  return groupBio;   
};

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
        const girlGroups = await getGirlGroups();

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
    const boyGroups = await getBoyGroups();

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
    const groupBio = await getIndividualGroup(req.params.childLink);
    return res.status(200).json({ message: 'Scrapping Database successful' });    
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
  
});


app.listen(3001, () => {
    console.log('Server started on port 3001');
})
