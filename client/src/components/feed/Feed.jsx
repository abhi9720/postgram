import "./feed.css";
import Share from "../share/Share";
import Post from "../post/Post";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import ContentLoader from "react-content-loader";

const Loader = () => {
  return (
    <div style={{ marginTop: "20px" }}>
      <ContentLoader viewBox="0 0 1000 450" height={250} width={"100%"}>
        <circle cx="30" cy="30" r="30" />
        <rect x="70" y="20" rx="15" ry="15" width="40%" height="20" />
        <rect x="0" y="82" rx="5" ry="5" width="100%" height="150" />
      </ContentLoader>
    </div>
  );
};

const Feed = ({ username }) => {
  const [posts, setPosts] = useState([]);
  const { user } = useContext(AuthContext);
  const [fetching, setfetching] = useState(false);
  useEffect(() => {
    const fetchPosts = async () => {
      setfetching(true);
      const res = username
        ? await axios.get("/post/profile/" + username)
        : await axios.get("/post/timeline/" + user?._id);

      setPosts(
        res.data.sort((p1, p2) => {
          return new Date(p2.createdAt) - new Date(p1.createdAt);
        })
      );

      setfetching(false);
    };

    fetchPosts();
  }, [username, user._id]);

  return (
    <div className="feed">
      <div className="feedWrapper">
        {username ? username === user?.username ? <Share /> : "" : <Share />}

        {fetching ? (
          <>
            <Loader />
            <Loader />
            <Loader />
            <Loader />
            <Loader />
            <Loader />
            <Loader />
            <Loader />
            <Loader />
            <Loader />
          </>
        ) : (
          <>
            {posts.map((p) => (
              <Post key={p._id} post={p} />
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default Feed;
