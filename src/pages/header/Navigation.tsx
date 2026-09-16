import { useState } from "react";
import { CSSProperties } from "react";
import { Link } from "react-router-dom";
import BookTravelMenu from "./mega/BookTravelMenu";
import {
  Menu,
  ChevronDown,
  ArrowRight,
} from "lucide-react";
import BrandLogo from "../../components/BrandLogo";
interface NavigationProps {
  mobileOpen: boolean;
  setMobileOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Navigation({
  mobileOpen,
  setMobileOpen,
}: NavigationProps) {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  let closeTimeout: ReturnType<typeof setTimeout>;
  const styles: Record<string, CSSProperties> = {
    nav: {
      position: "sticky",
      top: 42,
      zIndex: 999,
      width: "100%",
      background: "rgba(255,255,255,.92)",
      backdropFilter: "blur(18px)",
      borderBottom: "1px solid rgba(226,232,240,.8)",
      display: "flex",
      justifyContent: "center",
      transition: "all .35s ease",
    },

    container: {
      width: "100%",
      maxWidth: "1400px",
      height: "86px",
      padding: "0 42px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    },

    logo: {
      display: "flex",
      alignItems: "center",
      flexShrink: 0,
    },

    links: {
      display: "flex",
      alignItems: "center",
      gap: "42px",
      flex: 1,
      justifyContent: "center",
    },

    link: {
      display: "flex",
      alignItems: "center",
      gap: "6px",
      color: "#334155",
      fontWeight: 600,
      fontSize: "15px",
      textDecoration: "none",
      cursor: "pointer",
      transition: ".25s ease",
      position: "relative",
    },
    actions: {
      display: "flex",
      alignItems: "center",
      gap: "16px",
    },

    signIn: {
      color: "#334155",
      fontWeight: 600,
      fontSize: "15px",
      textDecoration: "none",
      transition: ".25s",
    },
dropdownWrapper: {
  position: "absolute",
  top: "calc(100% + 22px)",
  left: "50%",
  transform: "translateX(-50%)",
  zIndex: 9999,
},
    button: {
      display: "flex",
      alignItems: "center",
      gap: "10px",
      background: "linear-gradient(135deg,#0077B6,#0096C7)",
      color: "#fff",
      border: "none",
      borderRadius: "999px",
      padding: "15px 28px",
      cursor: "pointer",
      fontWeight: 700,
      fontSize: "15px",
      boxShadow: "0 18px 40px rgba(0,119,182,.30)",
      transition: "all .3s ease",
    },

    mobileButton: {
      display: "none",
      background: "transparent",
      border: "none",
      cursor: "pointer",
    },
  };
  return (
    <nav style={styles.nav}>
      <div style={styles.container}>
        {/* Logo */}

        <Link to="/" style={styles.logo}>
          <BrandLogo imageWidth={220} imageHeight={70} />
        </Link>

        {/* Desktop */}

        <div style={styles.links}>
          <Link
            to="/"
            style={styles.link}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "#0077B6";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "#334155";
            }}
          >
            Home
          </Link>

          <div
  style={{
    ...styles.link,
    position: "relative",
  }}
 onMouseEnter={() => {
  clearTimeout(closeTimeout);
  setActiveMenu("travel");
}}
onMouseLeave={() => {
  closeTimeout = setTimeout(() => {
    setActiveMenu(null);
  }, 150);
}}
>
  <span>Book Travel</span>

  <ChevronDown size={16} />

  {activeMenu === "travel" && (
    <div style={styles.dropdownWrapper}>
      <BookTravelMenu />
    </div>
  )}
</div>

          <div style={styles.link}>
            Companies
            <ChevronDown size={16} />
          </div>

          <div style={styles.link}>
            Live Tracking
            <ChevronDown size={16} />
          </div>

          <Link
            to="/pricing"
            style={styles.link}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "#0077B6";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "#334155";
            }}
          >
            Pricing
          </Link>

          <Link style={styles.link} to="/about">
            About
          </Link>
        </div>

        {/* Right */}

        <div style={styles.actions}>
          <Link to="/login" style={styles.signIn}>
            Sign In
          </Link>

          <button style={styles.button}>
            Book Ticket
            <ArrowRight size={18} />
          </button>
        </div>

        {/* Mobile */}

        <button
          style={styles.mobileButton}
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          <Menu size={28} />
        </button>
         </div>
    </nav>
  );
}
