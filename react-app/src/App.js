import React, { useState, useEffect } from 'react';
import './App.css';

const hnApiUrl = "https://hacker-news.firebaseio.com/v0";

async function fetchTopStories() {
  try {
    const response = await fetch(`${hnApiUrl}/topstories.json`);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const topStoryIds = await response.json();
    const top100StoryIds = topStoryIds.slice(0, 100);

    const storyPromises = top100StoryIds.map(async (storyId) => {
      const storyResponse = await fetch(`${hnApiUrl}/item/${storyId}.json`);
      if (!storyResponse.ok) {
        throw new Error(`HTTP error! Status: ${storyResponse.status}`);
      }
      return storyResponse.json();
    });

    const stories = await Promise.all(storyPromises);
    return stories;
  } catch (error) {
    console.error("Error fetching top stories:", error);
    return [];
  }
}

function App() {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTopStories()
      .then((fetchedStories) => {
        setStories(fetchedStories);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching top stories:', error);
        setLoading(false);
      });
  }, []);

  return (
    <div>
      <h1>Hacker News Top 100 Stories</h1>
      <p className="generated-by">This page was completely generated by ChatGPT-4.</p>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <ol>
          {stories.map((story) => (
            <li key={story.id}>
              <a href={story.url} target="_blank" rel="noopener noreferrer">
                {story.title}
              </a>
              <p>by {story.by}</p>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}

export default App;
