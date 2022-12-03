import { Auth, ThemeSupa } from "@supabase/auth-ui-react";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import Account from "../../components/Account";
import { useEffect } from "react";

const Login = () => {
  const session = useSession();
  const supabase = useSupabaseClient();

  useEffect(() => {
    if (session) {
      window.location.href = "/";
    }
  }, [session]);

  return (
    <div
      className="container"
      style={{ width: "50%", padding: "50px 0 100px 0" }}
    >
      {!session ? (
        <Auth
          supabaseClient={supabase}
          appearance={{ theme: ThemeSupa }}
          theme="dark"
        />
      ) : (
        <Account session={session} />
      )}
    </div>
  );
};

export default Login;
