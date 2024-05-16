import axios from "axios"
import { useState, useEffect } from "react";

const meNowApi = axios.create({
    baseURL: 'http://localhost:8080',
});

// change the format of the url of the photos from google drive so they will be presented properly
const reformatUrl = (url) =>{
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
                const url = reformatUrl(response.data[0].path);
                setImageUrl(url);
            })
            .catch(error => {
                console.log(error);
            });
    },[index])

    return <img src={imageUrl} alt='jsonImage' />;
}

const ImageDisplay = (props) =>{
    return(
        <div className='images'>
            {props.indices.map(index =>(
                <ImageLoader key={index} index={index} ></ImageLoader>
            ))}
        </div>
    )
}

export default ImageDisplay;