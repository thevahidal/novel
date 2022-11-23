import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import Story from '../../components/Story';

const StoryPage = (props) => {
  const [story, setStory] = useState({});
  const [storyLoading, setStoryLoading] = useState(true);

  const router = useRouter();
  const { id: storyId } = router.query;

  const fetchStory = async (id) => {
    const res = await fetch(`/api/stories/${id}`, {
      method: 'GET',
    });
    const { data } = await res.json();
    setStory(data);
    setStoryLoading(false);
  };

  useEffect(() => {
    fetchStory(storyId)
  }, [])

  return <Story story={story} loading={storyLoading} />;
};

export default StoryPage;
