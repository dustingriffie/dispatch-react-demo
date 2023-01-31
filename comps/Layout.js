import Footer from "./Footer.js";
import Navbar from "./Navbar.js";

const Layout = ({ children }) => {
    return (         
        <div className="content">
            <Navbar />
            { children }
            <Footer />
        </div>
     );
}
 
export default Layout;