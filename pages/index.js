import Link from 'next/link';
import Head from 'next/head';
import React, { useEffect, useState } from 'react';
import {
  useUser,
  useSupabaseClient,
  useSession,
} from '@supabase/auth-helpers-react';

import { useUserColorStore, useUserStore } from '../store/store';
import styles from '../styles/Home.module.css';
import Story from '../components/Story';
import FeaturedStories from '../components/FeaturedStories';

export default function Home() {
  const [story, setStory] = useState({});
  const [storyLoading, setStoryLoading] = useState(true);

  const [featured, setFeatured] = useState([]);
  const [featuredLoading, setFeaturedLoading] = useState(true);

  const setUser = useUserStore((state) => state.setUser);
  const getUserColor = useUserColorStore((state) => state.getUserColor);

  const session = useSession();
  const supabase = useSupabaseClient();

  const user = useUser();

  const fetchUserData = async () => {
    let { data, error, status } = await supabase
      .from('profiles')
      .select(`username, full_name, avatar_url`)
      .eq('id', user.id)
      .single();

    setUser({
      ...data,
    });
    getUserColor(user.id);
  };

  const fetchStories = async () => {
    const res = await fetch('/api/stories', {
      method: 'GET',
    });
    const { data } = await res.json();
    setFeatured(data);
    const featuredStory = data[0];
    setStory(featuredStory);

    getUserColor(featuredStory.author?.id);
    setStoryLoading(false);
    setFeaturedLoading(false);
  };

  useEffect(() => {
    if (!user) return;

    fetchUserData();
  }, [user]);

  useEffect(() => {
    fetchStories();
  }, []);

  return (
    <>
      <Head>
        <title>Novel</title>
        <meta name='description' content='A collaborative story-telling' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <Story story={story} loading={storyLoading} isMain={true} />
      <FeaturedStories stories={featured} loading={featuredLoading} />
    </>
  );
}
