"use client";

import { useState, useEffect } from "react";

import PromptCard from "./PromptCard";




const PromptCardList = ({data, handleTagClick}) => {
  return (
    <div className="mt-16 prompt_layout">
      {data.map((post) => (
        <PromptCard
        key={post._id}
        post={post}
        handleTagClick={()=>handleTagClick(post)}
        />
    ))}
    </div>
  )
}



const Feed = () => {
  const [searchText, setSearchText] = useState("");
  const [searchTimeOut, setSearchTimeOut] = useState(null);
  const [searchResults, setSearchResults] = useState([]);

  const [posts, setPosts] = useState([])



  const fetchPosts = async () => {
    const response = await fetch("/api/prompt");
    const data = await response.json();
    setPosts(data);
  }
  
  useEffect(() => {
    fetchPosts();
  }, [])


  const filterPrompts = (searchtext) => {
    const regex = new RegExp(searchtext, "i");
    return posts.filter((item) =>
      regex.test(item.creator.username) ||
      regex.test(item.prompt) ||
      regex.test(item.tag)
    );
  };


  const handleSearchChange = (e) => {
    clearTimeout(searchTimeOut);
    setSearchText(e.target.value);

    setSearchTimeOut(
      setTimeout(() => {
        const searchResult = filterPrompts(e.target.value);
        setSearchResults(searchResult);
      }, 500)
    );
  };

  const handleTagClick = (tagname) => {
    setSearchText(tagname);

    const searchResult = filterPrompts(tagname);
    setSearchResults(searchResult);
  };

  return (
    <section className="feed">
      <form className="relative w-full flex-center">
        <input
          type="text"
          placeholder="Search for a tag or a username"
          value={searchText}
          onChange={handleSearchChange}
          required
          className="search_input peer"
        />
      </form>


      {searchText ? (
        <PromptCardList
          data={searchResults}
          handleTagClick={handleTagClick}
        />
      ) : (
        <PromptCardList data={posts} handleTagClick={handleTagClick} />
      )}

    </section>
  );
};

export default Feed;
