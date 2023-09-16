export function formatText(input){
   // Define a regular expression to match text inside angle brackets
  var regex = /<[^>]+>/g;

  // Replace all matches with an empty string
  var result = input.replace(regex, '');
  result = result.split('\n');

  return result;
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