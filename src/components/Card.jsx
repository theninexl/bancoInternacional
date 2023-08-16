import React,{ useState } from 'react';
import axios from 'axios';

const Card = () => {
  const baseURL = "https://jsonplaceholder.typicode.com/posts/1";
  const [count, setCount] = useState(0);

  const [post, setPost] = useState(null);

  React.useEffect(() => {
    axios.get(baseURL).then((response) => {
      setPost(response.data);
    });
  }, []);

  if (!post) return null;

  return (
    <div className="card">
      <button onClick={() => setCount((count) => count + 1)}>
        count is {count}
      </button>
      <h1>{post.title}</h1>
      <p>
        {post.body}
      </p>
    </div>
  )
};

export default Card;