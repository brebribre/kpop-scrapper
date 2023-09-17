import puppeteer from "puppeteer";
import { formatMembers, removeTagsFromHTML, getDataOnKeyword, getDataOnKeywords, getImgSrcFromHTML, formatOfficialSites } from "./utils.js";

const scrapeGirlGroups = async () => {
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
  
const scrapeBoyGroups = async () => {
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
  
const scrapeIndividualGroup = async (childLink) => {
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
  
      const doc = document.querySelector(uniqueId + ' > div > div.col-lg-9.col-md-9.col-mod-single.col-mod-main > div > div.col-lg-10.col-md-10.col-sm-10 > div');
      const docLen = doc.querySelectorAll('p').length;
  
      //2. get important elements like group name and group img
      let groupName = document.querySelector(uniqueId + ' > div > div.col-lg-9.col-md-9.col-mod-single.col-mod-main > header > h1').textContent;
      groupName = groupName.replace("Members Profile", '').trim();
      const groupImg = document.querySelector(uniqueId + ' > div > div.col-lg-9.col-md-9.col-mod-single.col-mod-main > div > div.col-lg-10.col-md-10.col-sm-10 > div > p:nth-child(1)').querySelector('img').getAttribute('src');
  
      //4. push all lines of content 
      const contentLines = [];
      let tmp;
      for(let i = 5 ; i < docLen ; i++){
        tmp = document.querySelector(uniqueId + ' > div > div.col-lg-9.col-md-9.col-mod-single.col-mod-main > div > div.col-lg-10.col-md-10.col-sm-10 > div > p:nth-child(' + i + ')');
        if(tmp){
          contentLines.push(tmp.innerHTML)
        }
        
      }
  
      return {
        groupName:groupName,
        groupImg:groupImg,
        contentLines:contentLines,
        members:null,
        officialSites:[]
      };
  
    });
  
    //5. format all of the lines inside contentLines
    for(let i = 0; i < groupBio.contentLines.length ; i++){
      //TODO get the image of members
      let img = getImgSrcFromHTML(groupBio.contentLines[i]);
      //get the bio
      groupBio.contentLines[i] = removeTagsFromHTML(groupBio.contentLines[i]);
      if(img){
        groupBio.contentLines[i].push(img);
      }
    }
  
  
    //6. Clean the data
    const members = getDataOnKeyword(groupBio.contentLines, "birth name");
    groupBio.members = formatMembers(members);
  
    let uncleanedSites = getDataOnKeyword(groupBio.contentLines, "official account");
    if(uncleanedSites.length < 1){
      uncleanedSites = getDataOnKeyword(groupBio.contentLines, "official sites");
    }
    
  
    groupBio.officialSites = formatOfficialSites(uncleanedSites);
    
    const finalData = {
      groupName: groupBio.groupName,
      groupImg: groupBio.groupImg,
      members: groupBio.members,
      officialSites: groupBio.officialSites
    }
    return finalData;   
};

export {scrapeIndividualGroup,scrapeBoyGroups,scrapeGirlGroups}