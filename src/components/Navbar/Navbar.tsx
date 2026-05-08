import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";

//this will be the main navigation bar component for the FuelWise application. It includes links to the home page and dashboard, and it changes its appearance based on the user's scroll position. When the user scrolls down past a certain point, the navbar becomes fixed at the top of the screen with a background and border, providing better visibility and accessibility. When the user is at the top of the page, the navbar is transparent and blends with the background, creating a sleek and modern look. The component uses React's useState and useEffect hooks to manage scroll state and apply conditional styling based on that state.
export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
 //useeffect hook to listen for scroll events and update the isScrolled state accordingly. When the user scrolls down more than 900 pixels, the navbar will switch to a fixed position with a background and border. When the user scrolls back up above that threshold, the navbar will return to its original transparent state. This dynamic behavior enhances the user experience by providing a clear and accessible navigation bar when needed, while maintaining a clean and unobtrusive design when at the top of the page.
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 900);
    };

    //this initial call ensures that the navbar state is correct on page load, in case the user starts at a scroll position that is already past the threshold. By calling handleScroll immediately, we can set the initial state of isScrolled based on the current scroll position, ensuring that the navbar displays correctly from the moment the page loads.
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  //thesevariables are used to conditionally apply CSS classes to the navbar and its elements based on the isScrolled state. The navClassName variable defines the overall styling of the navbar, changing its position, background, and border when scrolled. The innerClassName variable adjusts the text color of the navbar's content based on the scroll state. The brandClassName variable styles the brand/logo link, making it more prominent when scrolled. The linkClassName function generates class names for the navigation links, applying different styles for active and inactive states, as well as adjusting colors based on whether the navbar is scrolled or not. These dynamic class names allow the navbar to adapt its appearance seamlessly as the user interacts with the page.
  const navClassName = [
    "left-0 z-40 w-full border-b transition-all duration-300 ease-out",
    isScrolled
      ? "fixed top-0 translate-y-0 border-white/10 bg-[#111315]/85 backdrop-blur-md"
      : "absolute top-0 -translate-y-2 border-transparent bg-transparent text-white",
  ].join(" ");

  const innerClassName = [
    "mx-auto flex h-16 max-w-7xl items-center justify-between px-6",
    isScrolled ? "text-stone-100" : "text-white",
  ].join(" ");

  const brandClassName = [
    "text-[1.02rem] font-semibold tracking-[0.18em] uppercase transition-colors duration-300 ease-out",
    isScrolled ? "text-stone-100 hover:text-white" : "text-white hover:text-white/90",
  ].join(" ");

  // this function generates class names for the navigation links based on their active state and the scroll state of the navbar. It applies different styles for active and inactive links, as well as adjusting colors and underline effects depending on whether the navbar is scrolled or not. This allows the navigation links to visually indicate which page is currently active while also adapting their appearance to maintain readability and aesthetics in both scroll states.
  //its responisble for styling the navigation links in the navbar. It takes a boolean isActive parameter, which indicates whether the link is currently active (i.e., corresponds to the current page). The function returns a string of class names that apply different styles based on the active state and the scroll state of the navbar. Active links get a full underline and a specific text color, while inactive links have a hover effect that reveals an underline and changes their color when hovered over. The styles also adjust based on whether the navbar is scrolled or not, ensuring good visibility and user experience in both states.
  const linkClassName = (isActive: boolean) =>
    [
      "relative inline-flex items-center py-2 text-[0.72rem] font-medium uppercase tracking-[0.18em] transition-all duration-300 ease-out after:absolute after:bottom-0 after:left-0 after:h-px after:w-full after:origin-center after:transition-transform after:duration-300 after:ease-out",
      isScrolled
        ? "after:bg-stone-100"
        : "after:bg-white",
      isActive
        ? isScrolled
          ? "text-white after:scale-x-100"
          : "text-white after:scale-x-100"
        : isScrolled
          ? "text-stone-300 hover:text-white after:scale-x-0 hover:after:scale-x-100"
          : "text-white/75 hover:text-white after:scale-x-0 hover:after:scale-x-100",
    ].join(" ");

    
  return (
    <nav className={navClassName}>
      <div className={innerClassName}>
        <Link className={brandClassName} to="/">
          FuelWise
        </Link>

        <ul className="flex items-center gap-8 text-sm">
          <li>
            <NavLink className={({ isActive }) => linkClassName(isActive)} to="/" end>
              Home
            </NavLink>
          </li>
          <li>
            <NavLink className={({ isActive }) => linkClassName(isActive)} to="/dashboard">
              Dashboard
            </NavLink>
          </li>
        </ul>
      </div>
    </nav>
  );
}
