// server.js - simple proxy to generate quests via AI provider
const { type = 'english', difficulty = 1 } = req.body;
const provider = process.env.AI_PROVIDER || 'mock';


if(provider === 'mock'){
// quick mock
const payload = mockGenerate(type);
return res.json({ success: true, payload });
}


const prompt = buildPrompt(type, difficulty);


// Example for OpenAI-like API (you must adapt to your provider)
const apiKey = process.env.AIzaSyA1qz0SSfgtykSctZ35rhLI1IesiSxN4UQ;
if(!apiKey){
return res.status(500).json({ success: false, error: 'AI provider key not set' });
}


// Example: call a generic text-generation endpoint
const endpoint = process.env.AI_ENDPOINT || 'https://api.openai.com/v1/completions';


const body = {
model: process.env.AI_MODEL || 'text-davinci-003',
prompt,
max_tokens: 400,
temperature: 0.2
};


const r = await fetch(endpoint, {
method: 'POST',
headers: {
'Content-Type': 'application/json',
'Authorization': `Bearer ${apiKey}`
},
body: JSON.stringify(body)
});


if(!r.ok){
const t = await r.text();
console.error('AI provider error:', t);
return res.status(500).json({ success: false, error: 'AI provider returned error' });
}


const json = await r.json();
// parse the text part (this will vary by provider)
const text = (json.choices && json.choices[0] && json.choices[0].text) || json.output || json.data;
let parsed;
try{
parsed = JSON.parse(text.trim());
} catch (e){
// If parsing fails, return raw text in question
parsed = { question: String(text).slice(0,200), choices: [], answer: null, explanation: '' };
}


res.json({ success: true, payload: parsed });


} catch (err){
console.error(err);
res.status(500).json({ success: false, error: err.message });
}
});


app.listen(PORT, ()=>console.log(`Backend proxy running on port ${PORT}`));
