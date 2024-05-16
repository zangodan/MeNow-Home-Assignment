import { useState } from "react";
import axios from "axios";

const meNowApi = axios.create({
    baseURL: "http://localhost:8080",
  });

const SearchKeyword = (props) =>{
    const [keyword, setKeyword] = useState('');
    
    const handleInputChange = (event) => {
        setKeyword(event.target.value);
    };

    // The images will be sorted from left to right (the left image has the lowest score while the right image has the highest score)
    const handleSubmit = (event) =>{
        event.preventDefault();
        if(keyword === ''){
            alert("Insert A keyword");
        }
        else{
            meNowApi.post(`/${keyword}`)
            .then(response =>{
                if(response.data.length === 0){
                    alert("No matching images for keyword: " + keyword);
                }
                else{
                    props.setIndices(response.data);
                }
            })
            setKeyword('');
        }
    }

    return(
        <div className='search'>
            <form onSubmit={handleSubmit}>
                <label htmlFor="keyword" id="textbox">Enter keyword: </label>
                <input type="text" id="keyword" name="keyword" value={keyword} onChange={handleInputChange}/>
                <input type="submit" id="submit" value="Submit"/>
            </form>
        </div>
    )
}

export default SearchKeyword;