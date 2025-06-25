// src/pages/_app.tsx
import '@/styles/globals.css'
import type { AppProps } from 'next/app'
//import Layout from '../layouts/Layout'

export default function App({ Component, pageProps }: AppProps) {
  return (
      <Component {...pageProps} />
  )
}