import HomePage from "./(landing)/home-page/page" 
import Services from "./(landing)/services/page"
import Portfolio from "./(landing)/portfolio/page"
import Walkthrough from "./(landing)/walkthrough/page"
import Testimonials from "./(landing)/testimonials/page"
import About from "./(landing)/about/page"
import Contact from "./(landing)/contact/page"
import Footer from "../components/footer"
import Navbar from "../components/navbar"

const Home = () => {
  return (
   <>
   <Navbar/>
   <HomePage/>
   <Services/>
   <Portfolio/>
   <Walkthrough/>
   <About/>
   <Testimonials/>
   <Contact/>
    {/* <Footer/> */}
   </>
   
  );
}

export default Home