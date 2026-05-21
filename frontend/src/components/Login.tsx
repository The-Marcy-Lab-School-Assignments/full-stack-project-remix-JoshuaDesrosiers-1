import { useState } from 'react';
import type { FormEvent } from 'react';
import LogIm from '../assets/Login.png'

type LoginProps = {
    handleLogin: (username: string, password: string) => Promise<Error | undefined>;
    handleRegister: (username: string, password: string) => Promise<Error | undefined>;
};

export default function LogIn({handleLogin, handleRegister}: LoginProps) {
    const [isLogin, setIsLogin] = useState(true);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError(null);

        const authError = isLogin
            ? await handleLogin(username, password)
            : await handleRegister(username, password);

        if (authError) {
            setError(authError.message);
        }
    };

    return (
    
       <section className="login">
            
            <form onSubmit={handleSubmit}>
                <label htmlFor="username">Username:</label>
                <input type="text" id="username" name="username" value={username} onChange={(event) => setUsername(event.target.value)} required />
                <label htmlFor="password">Password:</label>
                <input type="password" id="password" name="password" value={password} onChange={(event) => setPassword(event.target.value)} required />
                {error && <p role="alert">{error}</p>}
                <button type="submit">{isLogin ? 'Log In' : 'Register' }</button>
                  <button onClick={() => setIsLogin(!isLogin)}>{isLogin ? 'Switch to Register' : 'Switch to Log In'}</button>
            </form>
          
            <img src={LogIm} alt="Login"/>
            {/* <motion.div className='boy' initial={{ right: '-100%' }} animate={{ right: '-2%' }} transition={{ duration: 2 }}/> */}
            
        </section>
    );
}
