
function getNewRandomCharacter(probabilityList){
    const randomIndex = Math.floor(Math.random()*probabilityList.length);
    return probabilityList[randomIndex];
}

function getModifier(character, difficulty){

    // console.log('getting modifier')
    //make character a number for comparison with these number lists:
    character = parseInt(character);


    //generate list of hard and very hard chars as ascii numbers
    // there is no list for lowercase consonants, those are always default value of 1 modifier
    //easy list is just lowercase vowels
    let easyChars = [97,101,105,111,117];
    //is just uppercase letters
    let medChars = [];
    for (let i = 65; i<91; i++){
        medChars.push(i);
    }
    // inculdes !, ", and most special characters (except the really hard ones) and all numbers
    let hardChars = [33,34];
    for (let i = 39; i<64; i++){
        hardChars.push(i);
    }
    //is just the most difficult special characters (depends on keyboard layout though)
    let veryHardChars = [35,36,37,38,64,91,92,93,94,95,96,123,124,125,126];
   
    //check if character is in hardchars, voryhard, or medium list
    //alters the frequency of its appearance based on the combination of 
    //which list it is in and the actual difficulty mode selected
    //these ratios are set manually in the code here, for now
    if (easyChars.includes(character)){
        return difficulty === 'veryEasy'? 10:
                difficulty === 'easy'? 5:
                difficulty === 'medium'? 3:
                difficulty === 'hard'? 1: null;
    }
    else if (medChars.includes(character)){
        return difficulty === 'veryEasy'? 0.6:
                difficulty === 'easy'? 1:
                difficulty === 'medium' ? 0.8:
                difficulty === 'hard' ? 1: null;
    }
    if (hardChars.includes(character)){
       return difficulty === 'veryEasy'? 0.1:
                difficulty === 'easy' ? 0.35:
                difficulty === 'medium' ? 0.5:
                difficulty === 'hard' ? 1: null; 
    }
    else if (veryHardChars.includes(character)){
        return difficulty === 'veryEasy'? 0.0005:
                difficulty === 'easy' ? 0.005:
                difficulty === 'medium' ? 0.2:
                difficulty === 'hard' ? 1: null;
    }
   
    else return 1;
}


export function applyDifficulty(probabilityList, difficulty){
        //!HACKY JOB HERE:
        //!set space character to show up way more often than normal
        let spaceModifier =10;
        if (difficulty === 'veryEasy') spaceModifier = 15;
        if (difficulty === 'medium') spaceModifier = 4;
        if (difficulty === 'hard') spaceModifier = 2;
        probabilityList[32] *= spaceModifier;

        let smallestValue = 9999;

        Object.keys(probabilityList).forEach(character => {
                    //only apply this to characters that are enabled:
                    if (probabilityList[character]>0){
                        //! another hacky modification to make the difficulty less prominent, so that 
                        //! priority ratings are more important
                    probabilityList[character] = probabilityList[character] * (getModifier(character,difficulty)*0.5);
                    if (probabilityList[character] < smallestValue && probabilityList[character]) {
                        smallestValue = probabilityList[character];
                    }
                    }
        });

        // find the smallest non-zero value in the list and multiply all list items so that the smallest value is at least 1
        const globalModifier = 1.0 / smallestValue;
        
        Object.keys(probabilityList).forEach(character => {
            probabilityList[character] = Math.round(probabilityList[character] *1.0 * globalModifier);
        } 
        )

        return probabilityList;
    }

//*MAIN FUNCTION HERE...

export default function generateNewTTT(difficulty, TTTLength, priorityList) {
    console.log('generating new TTT', difficulty, TTTLength );
    //check input structure
    if (
        typeof difficulty !== 'string' ||
        typeof TTTLength !== 'number' ||
        typeof priorityList !== 'object'
    ) {
        console.log('invalid currentSettings received by generateNewTTT');
        return;
    }
    //apply difficulty modifiers to priorityList
    const modifiedPriorityList = applyDifficulty(priorityList, difficulty);

    //generate probability list
    const probabilityList = [];
    Object.keys(modifiedPriorityList).forEach(charCode => {
        for (let i = 0; i<= modifiedPriorityList[charCode];i++){
            probabilityList.push(charCode);
        }
    } )
    //generate a random list based on the probability list and settings:
    let nextTTT = [];

    //Moke sure space ' ' character doesn't appear twice in a row
    ///and make sure space character isn't the first character
    //and make sure there is a space character at least evere 'x' characters
    const maxWordLength = 8;
    let currentWordLength = 0;
    let lastChar = '';
    let newChar = '';
    while (TTTLength--){
        newChar = getNewRandomCharacter(probabilityList);
        if(currentWordLength > maxWordLength) {newChar = '32'; currentWordLength = 0};
        while ((lastChar === '32' && newChar === '32') || (lastChar === '' && newChar === '32')) {
            newChar = getNewRandomCharacter(probabilityList);
        }
        currentWordLength ++;
        nextTTT.push(String.fromCharCode(newChar));
        lastChar = newChar;
    }

    //return type is list of string characters

return nextTTT;
    
}