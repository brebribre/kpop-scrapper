import puppeteer from "puppeteer";
import express from 'express';
import cors from 'cors'
import mongoose from 'mongoose'

import dotenv from 'dotenv';
import GirlGroup from "./models/girl-groups.js";
import BoyGroup from './models/boy-groups.js'

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
    await page.goto("https://kprofiles.com/k-pop-boy-groups/", {
      waitUntil: "domcontentloaded",
    });
  
    // Get page data
    const groups = await page.evaluate(() => {
      // Fetch the first element with class "quote"
      const block = document.querySelector('#post-6 > div > div.col-lg-9.col-mod-single.col-mod-main > div.entry-content.herald-entry-content');
  
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


app.get('/boy-groups', async(req,res)=>{
    const artists = await BoyGroup.find();

    res.json(artists);
});

app.put('/girl-groups/update', async (req,res)=>{
    try {
        const girlGroups = await getGirlGroups();

        //check if group exist
        

        for(let i = 0; i < girlGroups.length; i++){
            const e = girlGroups[i];
            const tmp = new GirlGroup({
                name: e.name,
                link: e.link,
            })
            await tmp.save();

    }
    
        return res.status(200).json({ message: 'Artists appended to deck successfully' });
      } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
      }
    
});

app.put('/boy-groups/update', async (req,res)=>{
  try {
    const boyGroups = await getBoyGroups();
    for(let i = 0; i < boyGroups.length; i++){
      const e = boyGroups[i];
      const tmp = new BoyGroup({
          name: e.name,
          link: e.link,
      })
      await tmp.save();
    }
    return res.status(200).json({ message: 'Artists appended to deck successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
  
});







app.listen(3001, () => {
    console.log('Server started on port 3001');
})