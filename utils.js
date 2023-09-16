import { JSDOM } from 'jsdom';

export function formatText(input){
   // Define a regular expression to match text inside angle brackets
  var regex = /<[^>]+>/g;

  // Replace all matches with an empty string
  var result = input.replace(regex, '');
  result = result.split('\n');

  return result;
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
      //check all elements within input[i] and check if any of them contains any keywords
      for(let j = 0; j < tmp.length; j++){
         let element = tmp[j].toLowerCase();

         if(element.includes(keyword)){
            output.push(tmp);
         }
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
   const output = []
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
         img: null
      }
      
      for(let j = 0; j < tmp.length ; j++){
         let line = tmp[j].toLowerCase();
         if(line.includes("stage name")){
            member.stageName = tmp[j].substring(tmp[j].indexOf(":") + 1).trim();
         }else if(line.includes("birth name")){
            member.birthName = tmp[j].substring(tmp[j].indexOf(":") + 1).trim();
         }else if(line.includes("position")){
            member.position = tmp[j].substring(tmp[j].indexOf(":") + 1).trim();
         }else if(line.includes("birthday")){
            member.birthday = tmp[j].substring(tmp[j].indexOf(":") + 1).trim();
         }else if(line.includes("nationality")){
            member.nationality = tmp[j].substring(tmp[j].indexOf(":") + 1).trim();
         }else if(line.includes("weight")){
            member.weight = tmp[j].substring(tmp[j].indexOf(":") + 1).trim();
         }else if(line.includes("height")){
            member.height = tmp[j].substring(tmp[j].indexOf(":") + 1).trim();
         }else if(line.includes("image")){
            member.img = tmp[j].substring(tmp[j].indexOf(":") + 1).trim();
         }
      }
      output.push(member);
   }
 
   return output;
 }