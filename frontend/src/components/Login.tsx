import { useState } from 'react';
import LogIm from '../assets/Login.png'
import {motion} from 'framer-motion'
export default function LogIn({handleLogin, handleRegister}:{handleLogin: (username: string, password: string) => void, handleRegister: (username: string, password: string) => void}) {
    const [logorRegister, setLogorRegister] = useState(true) // true :login, false :register;
    return (
    
       <section className="login">
            
            <form>
                <label htmlFor="username">Username:</label>
                <input type="text" id="username" name="username" required />
                <label htmlFor="password">Password:</label>
                <input type="password" id="password" name="password" required />
                <button type="submit" onClick={(e) => {
                    e.preventDefault();
                    handleRegister((document.getElementById('username') as HTMLInputElement).value, (document.getElementById('password') as HTMLInputElement).value); }}>Log In</button>
            </form>
            <img src={LogIm} alt="Login"/>
            {/* <motion.div className='boy' initial={{ right: '-100%' }} animate={{ right: '-2%' }} transition={{ duration: 2 }}/> */}
        </section>
    );
}