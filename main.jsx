import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import styled from 'styled-components'
import {SlotMachine} from './src/machine.jsx'


createRoot(document.getElementById('root')).render(
  <div>
    <SlotMachine/>
  </div>
)


