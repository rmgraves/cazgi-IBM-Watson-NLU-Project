const express = require('express');
const dotenv = require('dotenv');
dotenv.config();

function getNLUInstance()
{
    let api_key = process.env.API_KEY;
    let api_url = process.env.API_URL;

    const nluV1 = require('ibm-watson/natural-language-understanding/v1');
    const { IamAuthenticator } = require('ibm-watson/auth');

    const nlu = new nluV1({
        version: '2020-08-01', 
        authenticator: new IamAuthenticator({
            apikey: api_key,
        }),
        serviceUrl: api_url,
    });

    return nlu;
}

const emotionParams = {
  'features': {
    'entities': {
      'emotion': true,
      'limit': 2,
    },
    'keywords': {
      'emotion': true,
      'limit': 2,
    },
  },
}

const sentimentParams = {
  'features': {
    'entities': {
      'sentiment': true,
      'limit': 2,
    },
    'keywords': {
      'sentiment': true,
      'limit': 2,
    },
  },
}


const app = new express();

app.use(express.static('client'))

const cors_app = require('cors');
app.use(cors_app());

app.get("/",(req,res)=>{
    res.render('index.html');
  });

app.get("/url/emotion", (req,res) => {
    
    const nlu = getNLUInstance();

    delete emotionParams.url;
    delete emotionParams.text;
    emotionParams["url"] = req.query.url;

     console.log("Sending: " + JSON.stringify(emotionParams), null, 2);

    const nluPromise = nlu.analyze(emotionParams);

     nluPromise.then(
        results => {
            console.log("Results: " + JSON.stringify(results.result.keywords[0].emotion), null, 2);
            return res.send(results.result.keywords[0].emotion);
        }
        ).catch(
            err => {
                    console.log('error:', err);
                    return res.send("ERROR: ");
                }
            );
});

app.get("/url/sentiment", (req,res) => {
    const nlu = getNLUInstance();

    delete sentimentParams.url;
    delete sentimentParams.text;  

    sentimentParams["url"] = req.query.url;

    console.log("Sending: " + JSON.stringify(sentimentParams), null, 2);

    const nluPromise = nlu.analyze(sentimentParams);

    nluPromise.then(
        results => {
            console.log("Results: " + JSON.stringify(results.result), null, 2);
            return res.send(results.result.keywords[0].sentiment.label);
        }
        ).catch(
            err => {
                    console.log('error:', err);
                    return res.send("ERROR: ");
                }
            );
});

app.get("/text/emotion", (req,res) => {
   const nlu = getNLUInstance();

    delete emotionParams.url;
    delete emotionParams.text;

    emotionParams["text"] = req.query.text;

    console.log("Sending: " + JSON.stringify(emotionParams), null, 2);

    const nluPromise = nlu.analyze(emotionParams);

    nluPromise.then(
        results => {
            console.log("Results: " + JSON.stringify(results.result.keywords[0].emotion), null, 2);
            return res.send(results.result.keywords[0].emotion);
        }
        ).catch(
            err => {
                    console.log('error:', err);
                    return res.send("ERROR: ");
                }
            );
});

app.get("/text/sentiment", (req,res) => {
    const nlu = getNLUInstance();

    delete sentimentParams.url;
    delete sentimentParams.text; 
    sentimentParams["text"] = req.query.text;

    console.log("Sending: " + JSON.stringify(sentimentParams), null, 2);

    const nluPromise = nlu.analyze(sentimentParams);

    nluPromise.then(
        results => {
            console.log("Results: " + JSON.stringify(results.result), null, 2);
            return res.send(results.result.keywords[0].sentiment.label);
        }
        ).catch(
            err => {
                    console.log('error:', err);
                    return res.send("ERROR: ");
                }
            );
});

let server = app.listen(8080, () => {
    console.log('Listening', server.address().port)
})

