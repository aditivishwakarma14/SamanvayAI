import React, { useState } from "react";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "./utils/firebase.js";

function App() {

  const [loading, setLoading] = useState(false);

  const googleLogin = async () => {

    if (loading) return;

    try {
      setLoading(true);

      const result = await signInWithPopup(
        auth,
        googleProvider
      );

      console.log("Logged in user:", result.user);

    } catch (error) {
      console.error("Google Login Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">

      <button
        onClick={googleLogin}
        disabled={loading}
        className="m-5 p-3 bg-blue-500 text-white font-semibold
                   active:scale-95 hover:bg-blue-400
                   rounded-xl text-2xl
                   disabled:opacity-50"
      >
        {loading ? "Signing in..." : "Continue With Google"}
      </button>

    </div>
  );
}

export default App;