import Link from 'next/link';
import { useEffect, useState } from 'react';
import styles from '../styles/FeaturedStories.module.css';

const FeaturedStories = ({title, ...props}) => {
  const [featured, setFeatured] = useState(props.stories);
  const [featuredLoading, setFeaturedLoading] = useState(props.loading);

  useEffect(() => {
    setFeatured(props.stories);
  }, [props.stories]);

  useEffect(() => {
    setFeaturedLoading(props.loading);
  }, [props.loading]);

  return (
    <div className={styles.featured}>
      <h2>{title || 'Featured Stories'}</h2>
      <div className={styles.items}>
        {featuredLoading ? (
          <div>Fetching {title?.toLowerCase() || 'featured stories'}...</div>
        ) : (
            featured.length > 0 ? featured.map((story) => (
            <Link key={story.id} className={styles.card} href={`/stories/${story.id}`}>
              <h4 className={styles.title}>{story.title}</h4>

              <div className={styles.author}>{story.author?.full_name}</div>
              <div className={styles.timestamp}>{new Intl.DateTimeFormat('en-US', {
                dateStyle: 'medium', 
              }).format(new Date(story.created_at))}</div>
            </Link>
          )) : <div>No {title?.toLowerCase() || 'featured stories'} available yet.</div>
        )}
      </div>
    </div>
  );
};

export default FeaturedStories;
