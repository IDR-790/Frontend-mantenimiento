import React, { useContext, useState } from 'react'
import './styles.css'
//@ts-ignore
// import insitraText from '/assets/images/insitra-text.png';
// import background from '../assets/images/img-mexico-city-xl.jpg';
import { InputText } from 'primereact/inputtext'
import { Password } from 'primereact/password'
import { Button } from 'primereact/button'
import { Card } from 'primereact/card'
import { FloatLabel } from 'primereact/floatlabel'
import { AuthContext } from '../auth/context/AuthContext'
const insitraLogo = new URL('/g68.png', import.meta.url).href;
const nucleoLogo = new URL('/logo.png', import.meta.url).href;
const graphics = new URL('/graphics.png', import.meta.url).href;
const metrics = new URL('/metrics.png', import.meta.url).href;
const background = new URL('/img-mexico-city-xl.jpg', import.meta.url).href;


export const LoginPage = () => {
  const { login } = useContext(AuthContext)
  const [error, setError] = useState<string>('')
  const [invalid, setInvalid] = useState<boolean>(true)
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  

  return (
    <div className='flex' style={{
      backgroundImage: `url(${background})`,
      backgroundSize: 'cover', // Add this to prevent repeating
      backgroundPosition: 'center', // Center the image
      height: '100vh', // Set the height to 100vh
      width: '100vw' // Set the width to 100vw
    }}>
      <div className='flex flex-1 align-content-end flex-wrap gap-3 justify-content-center'>
        {/* <img src={graphics} width={"500px"} height={"200px"}></img>
                <img src={metrics} width={"250px"} height={"200px"}></img> */}
      </div>

      <div className='w-full flex flex-column justify-content-center align-items-center' style={{ background: "linear-gradient(135deg,#b10f5c 0%,#6a1b6f 35%,#2b2f77 65%,#0f4c81 100%)" }}>
        <Card className='w-3 shadow-8'>
          <div className='flex flex-column align-items-center text-center'>
            <img src={nucleoLogo} width={"150px"} />
            <h2 className="text-4xl font-bold m-0">NÚCLEO</h2>
            <p className="text-s text-gray-400 m-0">
              Sistema Integral de Gestión de Flota
            </p>
          </div>

          <div className='mt-4'>
            <h3 className='text-center'>Iniciar Sesión</h3>

            <form onSubmit={async(e) => {
              e.preventDefault();
              const message = await login({email, password})
              setError(message)
            }}>

              <FloatLabel className='w-full mb-4 mt-4'>
                <InputText
                  id="username"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className='w-full'
                  invalid={invalid}
                />
                <label htmlFor="username">Usuario</label>
              </FloatLabel>

              <FloatLabel className='mb-4'>
                <Password
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  feedback={false}
                  className="w-full"
                  inputClassName='w-full'
                  toggleMask
                  invalid={invalid}
                />
                <label htmlFor="password">Contraseña</label>
              </FloatLabel>

              <p className='text-center text-pink-500'>{error}</p>

              <div className='flex justify-content-center gap-3'>
                <Button
                  icon='pi pi-unlock'
                  severity='success'
                  type="submit"
                  label='Ingresar'
                  iconPos='right'
                />
                {/* <Button
                                    icon='pi pi-times'
                                    severity='danger'
                                    type="button"
                                    onClick={() => {
                                        setUser('');
                                        setPassword('');
                                        setError('')
                                    }}
                                /> */}
              </div>

            </form>
          </div>
        </Card>
        <p className="text-center text-xs text-gray-500 mt-6">
          © {new Date().getFullYear()} INSITRA · Todos los derechos reservados
        </p>
      </div>



    </div>
  )
}
