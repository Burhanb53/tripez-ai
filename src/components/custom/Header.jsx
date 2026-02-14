import { useEffect,useState } from "react";
import "../../index.css"
import { Button } from '../ui/button'
import { googleLogout, useGoogleLogin , } from "@react-oauth/google";
import axios from "axios";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
} from "@/components/ui/dialog"
import { useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";

import { Link } from "react-router-dom";
function Header() {
  const user = JSON.parse(localStorage.getItem('user'));
  const [openDailog, setOpenDailog] = useState(false);

  useEffect(() => {
    // console.log(user);
  }, [user])
  const login = useGoogleLogin({
    onSuccess: (codeResp) => GetUserProfile(codeResp),
    onError: (error) => console.log(error),
  })

  // const logout = useGoogleLogout({
  //   onSuccess: (codeResp) => console.log(codeResp),
  //   onError: (error) => console.log(error),
  // })

  // use axios for get http request

  const GetUserProfile = (tokenInfo) => {
    axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${tokenInfo?.access_token}`, {


      headers: {
        Authorization: `Bearer ${tokenInfo?.access_token}`,
        Accept: 'application/json'
      }
    }).then((resp) => {
      console.log(resp);
      localStorage.setItem('user', JSON.stringify(resp.data));
      setOpenDailog(false)
      window.location.reload();
    })
  }
  const navigate = useNavigate();

  const handleLogout = () => {
    googleLogout();
    localStorage.clear();
    // window.location.reload();
    navigate('/');
  };



  return (
    <div className='  flex justify-between items-center px-5'>
      <Link to="/">
      <img src='/logo.png' />
      </Link>
      <div className=''>
        {user ?
          <div className="flex items-center gap-3">
            <Link to="/my-trips">
            <Button  variant="outline" className=" text-orange-500 border-orange-500" >MyTrips</Button>
             </Link>
             <Button onClick={handleLogout} className="cursor-pointer">
      Logout
    </Button>

            {/* <Button onClick={()=>{
              const navigate=useNavigate();
              googleLogout();
              localStorage.clear();
              window.location.reload();
              navigate('/')
            
            }} 
            className="cursor-pointer"  >Logout</Button> */}
            
            
            <img src={user?.picture} className="rounded-full h-10 w-10" />
          </div>

          :
          <Button onClick={() =>setOpenDailog(true)} >SignIn</Button>
        }
          <Dialog open={openDailog}>
        <DialogContent>
          <Button onClick={() => setOpenDailog(false)} className="bg-white h-1 flex flex-row justify-end hy hover:bg-white">❌</Button>
          <DialogHeader>

            <DialogDescription>

              <img src="/logo.png" />
              <h2 className="font-bold text-lg mt-7">Sign In With Google</h2>
              <p>Sign in to the App with Google authentication secuarly</p>
              <Button

                onClick={login}
                className="w-full mt-5 flex gap-4 items-center">
                <FcGoogle />
                Sign In with Google
              </Button>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
       
      </div>
    </div>
  )
}

export default Header
