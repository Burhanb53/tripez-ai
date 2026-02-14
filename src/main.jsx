import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { createBrowserRouter, RouterProvider, createRoutesFromElements, Route } from 'react-router-dom'
import CreateTrip from './create-trip/index.jsx'
import Hero from './components/custom/Hero.jsx'
import MyTrips from './my-trips/index.jsx'
import { Toaster } from 'sonner'
import { GoogleOAuthProvider } from '@react-oauth/google';
import Viewtrip from './view-trip/[tripId]/index.jsx'
import PublicTrip from './public-trip/[tripId]/index.jsx'

// const router = createBrowserRouter([

//   {
//       path:"/",
//       element: <App/>
//   },
//   {
//     path:"/create-trip",
//     element: <CreateTrip/>
//   },
// ])


const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route path="/create-trip" element={<CreateTrip />} />
      <Route path="/" element={<Hero />} />
      <Route path="/view-trip/:tripId" element={<Viewtrip />} />
      <Route path="/public-trip/:tripId" element={<PublicTrip />} />
      <Route path="/my-trips" element={<MyTrips />} />
    </Route>
  )
)



createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_AUTH_CLIENT_ID}>
      <Toaster />
      <RouterProvider router={router} />
    </GoogleOAuthProvider>
  </StrictMode>,
)
