import { Link } from "react-router-dom"
import { SiGithub, SiLinkedin, SiX } from "react-icons/si";

function Footer() {
  const social = [
    {
      link: 'https://www.linkedin.com/in/burhanb53/',
      label: "Linkedin",
      Icon: SiLinkedin,
    },
    {
      link: 'https://github.com/burhanb53',
      label: "Github",
      Icon: SiGithub,
    },

  ]

  return (
    <>

      {/* <div className="flex justify-center items-center">
  <iframe className="-mb-12 xl:hidden md:hidden" src="https://lottie.host/embed/1563e308-b03d-4c53-9c81-510ca83578da/Yy6PxIJtQ3.json"></iframe>
</div> */}
      <hr className="border-t-1 border-orange-500 -mb-4" />


      <div className="flex justify-between items-center mt-6">
        <h1 className="text-sm sm:text-base">
          Created with ❤️ by{" "}
          <Link
            className="text-orange-500 hover:underline"
            to="https://burhanb53.github.io/portfolio/"
            target="_blank"
          >
            Burhanuddin
          </Link>
        </h1>

        <div className="flex items-center gap-5">
          {social.map((social, index) => (
            <Link
              to={social.link}
              key={index}
              target="_blank"
              className="hover:text-orange-500 transition-colors"
            >
              <social.Icon className="w-5 h-5 hover:scale-125 transition-transform" />
            </Link>
          ))}
        </div>
      </div>




    </>
  )
}

export default Footer
