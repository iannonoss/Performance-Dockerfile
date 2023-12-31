const  natural = require('natural');
const stopwords = require('stopwords').english;
const fs = require("fs");
const {parse} = require("csv-parse");
var Snowball = require('snowball');
var stemmer = new Snowball('English');

const final = [];
const stemmedToPass = [];
const stemmedTarget = [];
const stemmedTarget1 = [];
const stemmedTarget2 = [];
const target = ['image'];
const target1 = ['size'];
const target2 = ['decrease','reduce','cut','small','drop','optimize'];
const tokenizer = new natural.WordTokenizer();
let i = 1;

target.forEach(element => {
    stemmer.setCurrent(element)
    stemmer.stem(element);
    const targetStemmed = stemmer.getCurrent();
    stemmedTarget.push(targetStemmed);
});  
target1.forEach(element => {
    stemmer.setCurrent(element)
    stemmer.stem(element);
    const targetStemmed = stemmer.getCurrent();
    stemmedTarget1.push(targetStemmed);
});  
target2.forEach(element => {
    stemmer.setCurrent(element)
    stemmer.stem(element);
    const targetStemmed = stemmer.getCurrent();
    stemmedTarget2.push(targetStemmed);
});
const stream = fs.createReadStream("/Users/ianno/Desktop/git_commit_all.csv")
    .pipe(parse({delimiter: ",", from_line: 2}))
    .on("data", function (row) {
        if(final.length < 5000 ) {
        const tokenized = tokenizer.tokenize(row[4]);
        const filteredTokens = tokenized.filter(token => !stopwords.includes(token));
        filteredTokens.forEach(element => {
            stemmer.setCurrent(element)
            stemmer.stem(element);
            const stemmed = stemmer.getCurrent();
            stemmedToPass.push(stemmed);
        });
    
        if ((stemmedTarget.some(target => stemmedToPass.includes(target))) &&
         (stemmedTarget1.some(target1 => stemmedToPass.includes(target1))) && 
         (stemmedTarget2.some(target2 => stemmedToPass.includes(target2)))) {
                
        final.push({
            sha1: row[1],
            repository_name: row[0],
            index: i
        });
         i++;
         }
        stemmedToPass = [];
        }
    })
    .on("end", function () {
        fs.writeFileSync('imageSizeResult.txt', JSON.stringify(final));

    })
    .on("error", function (error) {
        console.log(error.message);
    });
