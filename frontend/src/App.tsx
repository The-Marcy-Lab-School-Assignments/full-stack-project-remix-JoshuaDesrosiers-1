import { useEffect, useState } from 'react'
import './App.css'
import Navigator from './components/Navigator'
import Canvas from './components/Canvas'
import Pallete from './components/Pallete'
import Renshi from './components/Renshi'
import FoodForm from './components/foodForm'
import { fetchAllSushis } from './adapters/sushi-adapters'
import chef from './assets/chef.png'
import startIm from './assets/sushextrude.png'
import { getMe, login, register, logout } from './adapters/auth-adapters'
import LogIn from './components/Login'
import Kitchen from './components/Kitchen'
import { AnimatePresence, motion } from 'framer-motion'
function App() {
  const [screen, setScreen] = useState('login')
  const [focusedText,setFocusedText] = useState('')
  const colors = { 'rice': '#f3f4f6', 'salmon': '#f87171', 'tuna': '#f9c80e', 'pepper': '#1f2937', 'soy': '#fef3c7', 'avocado': '#10b981' }
  const [color, setColor] = useState(colors['salmon'])
  const [sushitrix, setSushitrix] = useState<string[][]|null>(null)
  const [currentUser,setCurrentUser] = useState<string|null>(null);
  const [customers, setCustomers] = useState<string|null>(null);
  const [loading,setIsLoading] = useState(false);
  const [error,setError] = useState<string|null>(null);
  const [sushis, setSushis] = useState<string[][]|null>(null);
  const [cooked,setCooked] = useState(false);
   useEffect(() => {
      const checkForSession = async () => {
        const { data: user } = await getMe();
        setCurrentUser(user);
      };
      checkForSession();
    }, []);
  
    // Handlers that manage updating the current user. 
    // Defined in App to ensure that child components only                       
    // update the current user in a controlled manner.  
    const handleLogin = async (username:string, password:string) => {
      const { data: user, error } = await login(username, password);
      if (error) return error;
      setCurrentUser(user);
    };
  
    const handleRegister = async (username:string, password:string) => {
      const { data: user, error } = await register(username, password);
      if (error) return error;
      setCurrentUser(user);
    };
    
    const handleLogout = async () => {
      await logout();
      setCurrentUser(null);
    };
    const loadSushis = async () => {
        setIsLoading(true);
        setError(null);
        const { data, error: fetchError } = await fetchAllSushis();
        if (fetchError) {
          setError(fetchError.message);
        } else {
          setSushis(data);
        }
        setIsLoading(false);
      };
      //wait 5 seconds async and make a sushi if sushis are loaded and not null and if the sushi is not already cooked
      const makeSushi = async () => {
        //use promise to make a timer
        await new Promise(resolve => setTimeout(resolve, 5000));
        if (sushis && sushis.length > 0 && !cooked) {
          setCooked(true);
        }
      };
      
  return (
    <div className='app'>
      <div className={screen+'bg'}/>
    <Navigator setScreen = {setScreen}/>
    <div className='navigator-spacer'></div>
      {/* {(()=>{if(!currentUser &&(screen !== 'login'))setScreen('login');return(<></>)})()} */}
     

      <section className='app-container'>
        <AnimatePresence>
      {(screen === 'kitchen') &&
      <Kitchen colors={colors} color={color} setColor={setColor} setSushitrix={setSushitrix} setScreen={setScreen} />
      }</AnimatePresence>
      <Renshi sushitrix={sushitrix}/>
      </section>
      {/* <LogIn handleLogin={handleLogin} handleRegister={handleRegister}/> */}

      {/* alooping animation stretching vertically back and forth */}
      
      <motion.img className='chef' src={chef} alt="Chef" initial={{ scale: 1 }} animate={{ scale: 1.1 }} exit={{ scale: 1 }} transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }} />

      </div>
      
  )
}

export default App