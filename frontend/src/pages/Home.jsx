import { signInWithPopup } from "firebase/auth";
import React from "react";
import api from "../utils/axios.js";
import { auth, googleProvider } from "../utils/firebase.js";
import { FcGoogle } from "react-icons/fc";
import { useDispatch, useSelector } from "react-redux";
import { setUserdata } from "../state/slices/userSlice.js";

import SideBar from "../components/SideBar.jsx";
import ChatArea from "../components/ChatArea.jsx";
import Artifact from "../components/Artifact.jsx";

function Home() {
  const { userData } = useSelector((state) => state.user);
  const dispatch = useDispatch();


  const handleLogin = async (token) => {
    try {
      const { data } = await api.post("/api/auth/login", { token });
      dispatch(setUserdata(data));
    } catch (error) {
      console.log(error);
    }
  };

  const googleLogin = async () => {
    const data = await signInWithPopup(auth, googleProvider);
    const token = await data.user.getIdToken();

    
    await handleLogin(token);

  };

  return (
    <div className="h-screen flex bg-black text-white overflow-hidden">

      <SideBar />

      <ChatArea />

      <Artifact />

      {!userData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur">
          <div className="w-[340px] bg-[#13151c] border-white/[0.08] rounded-2xl p-7 flex flex-col gap-5">

            <div className="flex flex-col gap-1">
              <h2 className="text-[17px] font-semibold text-slate-100 tracking-tight">
                Welcome to Samanvay AI
              </h2>

              <p className="text-[13px] text-slate-500">
                Please login to continue using the app.
              </p>
            </div>

            <button
              className="
                w-full flex items-center
                justify-center gap-3
                py-[11px] rounded-xl
                text-sm font-medium
                text-black/80 bg-white
                hover:bg-gray-200
                transition-all duration-150
                cursor-pointer
              "
              onClick={googleLogin}
            >
              <FcGoogle />
              Continue With Google
            </button>

          </div>
        </div>
      )}

    </div>
  );
}

export default Home;