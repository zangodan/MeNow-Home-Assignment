import { useEffect, useState } from 'react';
import './index.css';
import axios from 'axios';
import SearchKeyword from './SearchKeyword';
import ImageDisplay from './ImageDisplay';

const numOfImagesDisplayed = 5;
const defaultIndices = [0,1,2,3,4];

const meNowApi = axios.create({
    baseURL: 'http://localhost:8080',
});

const Landing = () =>{
    const [indices, setIndices] = useState(defaultIndices);
    const [numOfImagesInData, setNumOfImagesInData] = useState(0);

    useEffect(() =>{
    meNowApi.get('/')
        .then(response => {
            setNumOfImagesInData(response.data.size)
        })
        .catch(error => {
            console.log(error);
        });
    }, []);

    const handleShuffle = () =>{
        const chosenIndices = [];
        for(let i = 0; i < numOfImagesDisplayed; i++){
            const randomElement = Math.floor(Math.random() * numOfImagesInData);
            if(!chosenIndices.includes(randomElement)){
                chosenIndices.push(randomElement);
            }
            else{
                i--;
            }
        }

        setIndices(chosenIndices);
    }
    
    return(
        <>
            <h1>MeNow</h1>

            <div className='body'>
                <SearchKeyword setIndices={setIndices}/>
                <div className='shuffle'>
                    <button className='shuffle' onClick={handleShuffle}>Shuffle</button>
                </div>
            </div>
            
            <ImageDisplay indices={indices}/>
        </>
    )
}

export default Landing;

