import { useEffect, useState } from 'react'
import './App.css'
import Navigator from './components/Navigator'
import Renshi from './components/Renshi'
import chef from './assets/chef.png'
import { getMe, login, register, type User } from './adapters/auth-adapters'
import LogIn from './components/Login'
import Kitchen from './components/Kitchen'
import Home, { type CookingSystemState } from './components/Home'
import { AnimatePresence, motion } from 'framer-motion'

export type Screen = 'login' | 'home' | 'kitchen' | 'shop';

const colors = {
  rice: '#f3f4f6',
  salmon: '#f87171',
  tuna: '#f9c80e',
  pepper: '#1f2937',
  soy: '#fef3c7',
  avocado: '#10b981',
} as const;

function App() {
  const [screen, setScreen] = useState<Screen>('login')
  const [color, setColor] = useState<string>(colors['salmon'])
  const [sushitrix, setSushitrix] = useState<string[][]|null>(null)
  const [currentUser,setCurrentUser] = useState<User|null>(null);
  const [cookingState, setCookingState] = useState<CookingSystemState>({
    selectedSushiId: null,
    cookingQueue: [],
    chefEnergy: 100,
    stage: 'idle',
    cookedCount: 0,
  });

   useEffect(() => {
      const checkForSession = async () => {
        const { data: user } = await getMe();
        setCurrentUser(user);
        setScreen(user ? 'kitchen' : 'login');
      };
      checkForSession();
    }, []);

    // Handlers that manage updating the current user. 
    // Defined in App to ensure that child components only                       
    // update the current user in a controlled manner.  
    const handleLogin = async (username:string, password:string): Promise<Error | undefined> => {
      const { data: user, error } = await login(username, password);
      if (error) return error;
      setCurrentUser(user);
      setScreen('kitchen');
    };
  
    const handleRegister = async (username:string, password:string): Promise<Error | undefined> => {
      const { data: user, error } = await register(username, password);
      if (error) return error;
      setCurrentUser(user);
      setScreen('kitchen');
    };

    const visibleScreen = currentUser ? screen : 'login';
      
  return (
    <div className='app'>
      <div className={visibleScreen+'bg'}/>
    <Navigator setScreen = {setScreen}/>
    <div className='navigator-spacer'></div>
    
     {(visibleScreen==='login') && <LogIn handleLogin={handleLogin} handleRegister={handleRegister}/>}

      <section className='app-container'>
      <AnimatePresence>
      {(visibleScreen === 'home') &&
      <Home cookingState={cookingState} setCookingState={setCookingState} />
      }
      {(visibleScreen === 'kitchen') &&
      <Kitchen colors={colors} color={color} setColor={setColor} setSushitrix={setSushitrix} />
      }</AnimatePresence>
      <Renshi sushitrix={sushitrix} onDismiss={() => setSushitrix(null)}/>
      </section>
      {/* <LogIn handleLogin={handleLogin} handleRegister={handleRegister}/> */}

      {/* alooping animation stretching vertically back and forth */}
      
      <motion.img className='chef' src={chef} alt="Chef" initial={{ scale: 1 }} animate={{ scale: 1.1 }} exit={{ scale: 1 }} transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }} />

      </div>
      
  )
}

export default App
