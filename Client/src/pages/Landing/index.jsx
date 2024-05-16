import { useEffect, useState } from 'react';
import './index.css';
import axios from 'axios';

const numOfImagesDisplayed = 5;
const defaultImages = [0,1,2,3,4]

const meNowApi = axios.create({
    baseURL: 'http://localhost:8080',
});

const Landing = () =>{
    const [indices, setIndices] = useState(defaultImages);
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

    // change the format of the url of the photos from google drive so they will be presented properly
    const formatUrl = (url) =>{
        const newUrl = "https://drive.google.com/thumbnail?id=";
        const sizeOf_slash_d_slash = 3
        const imgId = url.substring(url.indexOf('/d/') + sizeOf_slash_d_slash, url.indexOf('/view'));
        return newUrl + imgId;
    }

    // get the image from the server by her index in the json file, and show it in the website
    const ImageLoader = ({ index }) => {
        const [imageUrl, setImageUrl] = useState(null);
        useEffect(() =>{
            meNowApi.get(`/${index}`)
                .then(response => {
                    const url = formatUrl(response.data[0].path);
                    setImageUrl(url);
                })
                .catch(error => {
                    console.log(error);
                });
        },[index])
    
        return <img src={imageUrl} alt='jsonImage' />;
    }

    const [keyword, setKeyword] = useState('');

    const handleInputChange = (event) => {
        setKeyword(event.target.value);
    };

    // The images will be sorted from left to right (the left image has the lowest score while the right image has the highest score)
    const handleSubmit = (event) =>{
        event.preventDefault();
        meNowApi.post(`/${keyword}`)
            .then(response =>{
                if(response.data.length === 0){
                    alert("No matching images for keyword: " + keyword);
                }
                else{
                    setIndices(response.data);
                }
            })
        setKeyword('');
    }

    const displayImages = () =>{
        return(
            <div className='images'>
                {
                    indices.map(index =>(
                        <ImageLoader key={index} index={index} ></ImageLoader>
                    ))
                }
            </div>
        )
    }
    

    return(
        <>
            <h1>MeNow</h1>
            <div className='body'>
                <div className='search'>
                    <form onSubmit={handleSubmit}>
                        <label htmlFor="keyword" id="textbox">Enter keyword: </label>
                        <input type="text" id="keyword" name="keyword" value={keyword} onChange={handleInputChange}/>
                        <input type="submit" id="submit" value="Submit"/>
                    </form>
                </div>

                <div className='shuffle'>
                    <button className='shuffle' onClick={handleShuffle}>Shuffle</button>
                </div>
            </div>
            
            {displayImages()}
            
            {/* <displayImages></displayImages> */}
            
            {/* <div className='images'>

                {
                    indices.map(index =>(
                        <ImageLoader key={index} index={index} ></ImageLoader>
                    ))
                }
            </div> */}
        </>
    )
}

export default Landing;

