import { useEffect } from 'react';
import Home from './pages/Home.jsx'
import getCurrentUser from './features/getCurrentUser.js';
import { useDispatch } from 'react-redux';
import { setUserdata } from './state/slices/userSlice.js';

function App() {
  
  const dispath = useDispatch()

  useEffect(()=>{
    const getUser = async ()=>{
      const data = await getCurrentUser()
      dispath(setUserdata(data))
    }
    getUser()
  } , [])
  
  return (
   <>
   <Home/>
   </>
  );
}

export default App;