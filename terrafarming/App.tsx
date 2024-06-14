import '@/styles/global.css'

import { StatusBar } from 'expo-status-bar'
import { HomeDashboard } from '@/app/HomeDashboard'

export default function App() {
  return (
    <>
      <HomeDashboard />
      <StatusBar style="auto" />
    </>
  )
}