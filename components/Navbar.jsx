import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import Image from "next/image";
import Link from "next/link";

import styles from "../styles/Navbar.module.css";
import CreateStory from "./CreateStory";

const Navbar = () => {
  const session = useSession();
  const supabase = useSupabaseClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();

    window.location.href = "/";
  };

  return (
    <nav className={styles.navbar}>
      <div className="container">
        <div className={styles.brand}>
          <div className={styles.logo}>
            <Image src="/logo.png" fill={true} objectFit="contain" />
          </div>

          <div>
            <Link href="/">
              <h1>Novel</h1>
            </Link>
            <p className={styles.slogan}>A collaborative story-telling</p>
          </div>
        </div>
        <div className={styles.links}>
          {!session ? (
            <Link href="/auth/login">Login</Link>
          ) : (
            <a onClick={handleLogout}>Logout</a>
          )}
          <CreateStory />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
