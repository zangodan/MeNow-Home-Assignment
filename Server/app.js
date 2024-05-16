import express from 'express';
import fs from 'fs/promises';
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import cors from 'cors';

const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
const port = 8080;

app.use(cors());

const filePath = path.join(__dirname, 'MeNow_product_task.json');

const readJSONFile = async (filePath) => {
    try {
        const dataAsString = await fs.readFile(filePath, 'utf8');
        return JSON.parse(dataAsString);
    } catch (error) {
        console.error('Error reading JSON file:', error);
        return null;
    }
};

const data = await readJSONFile(filePath);

app.get('/', (req, res) =>{
    res.send({size: data.length});
})


for(let i = 0; i < data.length; i++){
    app.get(`/${i}`, (req, res) =>{
        res.send([data[i]]);
    })
}

// search for the keyword in all the image objects in data, sort the image objects by their score and return the top 5 results
// The images will be sorted from left to right (the left image has the lowest score while the right image has the highest score)
app.post('/:keyword', (req, res)=>{
    const keyword = req.params.keyword;
    res.send(
         data.filter((obj) => obj.keywords.includes(keyword))
            .sort((obj1, obj2) => obj1.score - obj2.score)
            .map((obj) => obj.id)
            .splice(0,5)
        );
})

app.listen(port, ()=>{
    console.log(`Listening to port ${port}`);
})