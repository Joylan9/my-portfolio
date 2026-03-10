import { useEffect } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import HoverLinks from "./HoverLinks";
import { gsap } from "gsap";
import "./styles/Navbar.css";

gsap.registerPlugin(ScrollTrigger);

/**
 * Lightweight ScrollSmoother replacement.
 * Instead of GSAP's paid ScrollSmoother plugin, we use a simple
 * shim that exposes the same API surface used in this project.
 */
interface SmootherShim {
  paused: (value: boolean) => void;
  scrollTop: (value: number) => void;
  scrollTo: (target: string | null, smooth?: boolean, position?: string) => void;
}

function createSmootherShim(): SmootherShim {
  return {
    paused(value: boolean) {
      const wrapper = document.getElementById("smooth-wrapper");
      if (wrapper) {
        wrapper.style.overflow = value ? "hidden" : "";
      }
      document.body.style.overflow = value ? "hidden" : "";
    },
    scrollTop(value: number) {
      window.scrollTo({ top: value });
    },
    scrollTo(target: string | null, smooth = true) {
      if (!target) return;
      const el = document.querySelector(target);
      if (el) {
        el.scrollIntoView({ behavior: smooth ? "smooth" : "auto", block: "start" });
      }
    },
  };
}

export let smoother: SmootherShim;

const Navbar = () => {
  useEffect(() => {
    smoother = createSmootherShim();

    smoother.scrollTop(0);
    smoother.paused(true);

    let links = document.querySelectorAll(".header ul a");
    links.forEach((elem) => {
      let element = elem as HTMLAnchorElement;
      element.addEventListener("click", (e) => {
        if (window.innerWidth > 1024) {
          e.preventDefault();
          let elem = e.currentTarget as HTMLAnchorElement;
          let section = elem.getAttribute("data-href");
          smoother.scrollTo(section, true, "top top");
        }
      });
    });
    window.addEventListener("resize", () => {
      ScrollTrigger.refresh(true);
    });
  }, []);
  return (
    <>
      <div className="header">
        <a href="/#" className="navbar-title" data-cursor="disable">
          JD
        </a>
        <a
          href="mailto:joylan928@gmail.com"
          className="navbar-connect"
          data-cursor="disable"
        >
          joylan928@gmail.com
        </a>
        <ul>
          <li>
            <a data-href="#about" href="#about">
              <HoverLinks text="ABOUT" />
            </a>
          </li>
          <li>
            <a data-href="#work" href="#work">
              <HoverLinks text="WORK" />
            </a>
          </li>
          <li>
            <a data-href="#contact" href="#contact">
              <HoverLinks text="CONTACT" />
            </a>
          </li>
        </ul>
      </div>

      <div className="landing-circle1"></div>
      <div className="landing-circle2"></div>
      <div className="nav-fade"></div>
    </>
  );
};

export default Navbar;
