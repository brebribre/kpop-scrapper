import { JSDOM } from 'jsdom';

export function removeTagsFromHTML(input){
   // Define a regular expression to match text inside angle brackets
  var regex = /<[^>]+>/g;

  // Replace all matches with an empty string
  var result = input.replace(regex, '');
  result = result.split('\n');

  return result;
}

export function cutStringAfterKeyword(inputString, keyword) {
   const keywordIndex = inputString.indexOf(keyword);
   
   if (keywordIndex !== -1) {
     return inputString.slice(keywordIndex + keyword.length);
   }
   
   return "Keyword not found in the string";
 }



export function removeKeywordFromString(inputString, keywordToRemove) {
  // Use a regular expression with the 'g' flag to replace all occurrences of the keyword
  const regex = new RegExp(keywordToRemove, 'g');
  
  // Use the replace method to remove the keyword
  const resultString = inputString.replace(regex, '');
  return resultString;
}

function removeNbspFromString(inputString) {
   var outputString = inputString.replace(/&nbsp;/g, '');
 
   return outputString;
 }

export function getImgSrcFromHTML(input){
   // Create a virtual DOM using jsdom
   const dom = new JSDOM(input);

   // Find the first <img> tag in the virtual DOM
   const imgTag = dom.window.document.querySelector('img');

   // Check if an <img> tag was found and if it has a src attribute
   if (imgTag && imgTag.hasAttribute('src')) {
      // Get the value of the src attribute
      const srcAttribute = imgTag.getAttribute('src');
      return "Image: " + srcAttribute;
   } else {
      return null; // Return null if no img tag with a src attribute is found
   }
}

export function getDataOnKeyword(input, keyword){ 
   const output = []
   let tmp;
 
   for(let i = 0; i < input.length ; i++){
       tmp = input[i];
       for(let j = 0; j < tmp.length; j++){
          let element = tmp[j].toLowerCase();
 
          if(element.includes(keyword)){
             output.push(tmp);
          }

       }
   }
   return output;
}

export function getDataOnKeywords(input, keywords){ 
   const output = [];

   //var for validation of data
   let v1 = false;
   let v2 = false;

   let tmp;
 
   for(let i = 0; i < input.length ; i++){
       tmp = input[i];
       for(let j = 0; j < tmp.length; j++){
          let element = tmp[j].toLowerCase();
 
          if(element.includes(keywords[0])){
             v1 = true
          }else if(element.includes(keywords[1])){
             v2 = true
          }
          
       }
       if(v1 && v2){
         output.push(tmp);
       }
       
   }
   return output;
}



/* 
param: 
   input:receives uncleaned array of strings of members

returns: a Member[] object with clean attributes
*/
export function formatMembers(input){ 
   const output = [];
 
   for(let i = 0; i < input.length ; i++){
      let tmp = input[i];
      let member = {
         stageName: null,
         birthName: null,
         position: null,
         birthday: null,
         nationality: null,
         height: null,
         weight: null,
         img: null,
      }
      
      for(let j = 0; j < tmp.length ; j++){
         let line = tmp[j].toLowerCase();
         
         //Find member informations based on specific keywords, then format it to fit DB.
         if(line.includes("stage name")){
            member.stageName = removeNbspFromString(tmp[j].substring(tmp[j].indexOf(":") + 1).trim());
         }else if(line.includes("birth name")){
            member.birthName = removeNbspFromString(tmp[j].substring(tmp[j].indexOf(":") + 1).trim());
         }else if(line.includes("position")){
            member.position = removeNbspFromString(tmp[j].substring(tmp[j].indexOf(":") + 1).trim());
         }else if(line.includes("birthday")){
            member.birthday = removeNbspFromString(tmp[j].substring(tmp[j].indexOf(":") + 1).trim());
         }else if(line.includes("nationality")){
            member.nationality = removeNbspFromString(tmp[j].substring(tmp[j].indexOf(":") + 1).trim());
         }else if(line.includes("weight")){
            member.weight = removeNbspFromString(tmp[j].substring(tmp[j].indexOf(":") + 1).trim());
         }else if(line.includes("height")){
            member.height = removeNbspFromString(tmp[j].substring(tmp[j].indexOf(":") + 1).trim());
         }else if(line.includes("image")){
            member.img = removeNbspFromString(tmp[j].substring(tmp[j].indexOf(":") + 1).trim());
         }

      }

      output.push(member);
   }
 
   return output;
}

/* 
param: 
   input:receives uncleaned array of strings of sites string[]

returns: a Sites[] object with clean attributes
*/
export function formatOfficialSites(input){
   input = input[0];
   const websites = [];
   const instagrams = [];
   const twitters = [];
   const youtubes = [];
   //check if input is valid
   if(input){
      for(let j = 0; j < input.length ; j++){
         let line = input[j];
         
         //Find member informations based on specific keywords, then format it to fit DB.
         if(line.includes("YouTube")){
            let formatting = removeNbspFromString(input[j].substring(input[j].indexOf(":") + 1).trim());
            youtubes.push(formatting);
         
         }else if(line.includes("Instagram")){
            let formatting = removeNbspFromString(input[j].substring(input[j].indexOf(":") + 1).trim());
            instagrams.push(formatting);
            
         }else if(line.includes("Twitter")){
            let formatting = removeNbspFromString(input[j].substring(input[j].indexOf(":") + 1).trim());
            twitters.push(formatting);
          
         }else if(line.includes("Website")){
            let formatting = removeNbspFromString(input[j].substring(input[j].indexOf(":") + 1).trim());
            websites.push(formatting);
            
         
         }
         
      }
   }

   

   let allSites = [
      {
         type : "twitter",
         links : twitters
      },
      {
         type : "website",
         links: websites
      },
      {
         type : "instagram",
         links : instagrams
      },
      {
         type : "youtube",
         links : youtubes
      },
   ]
 
   return allSites;
}

