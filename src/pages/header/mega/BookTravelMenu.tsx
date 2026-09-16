import { Link } from "react-router-dom";
import { ArrowRight, Bus, Plane, Ticket, Users } from "lucide-react";
import type { CSSProperties } from "react";


export default function BookTravelMenu() {
  const items = [
    {
      icon: Bus,
      title: "Search Routes",
      description: "Find buses across Rwanda",
      link: "/search",
    },
    {
      icon: Ticket,
      title: "Buy Tickets",
      description: "Digital QR tickets instantly",
      link: "/tickets",
    },
    {
      icon: Users,
      title: "Shared Transport",
      description: "Travel together and save money",
      link: "/shared",
    },
    {
      icon: Plane,
      title: "Airport Transfer",
      description: "Easy airport booking",
      link: "/airport",
    },
  ];
const styles: Record<string, CSSProperties> = {
    wrapper: {
  display: "grid",
  gridTemplateColumns: "2fr 1fr",
  width: "1050px",
  background: "#fff",
  borderRadius: "26px",
  overflow: "hidden",
  boxShadow: "0 35px 80px rgba(15,23,42,.18)",
  border: "1px solid #E5E7EB",
},

left: {
  padding: "42px",
},

right: {
  background:
    "linear-gradient(135deg,#0077B6 0%,#005F8E 60%,#003B5C 100%)",
  color: "#fff",
  padding: "40px",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
},

badge: {
  display: "inline-flex",
  alignItems: "center",
  padding: "8px 18px",
  borderRadius: "999px",
  background: "#E6F4FB",
  color: "#0077B6",
  fontWeight: 700,
  fontSize: "13px",
  marginBottom: "20px",
},

heading: {
  fontSize: "34px",
  lineHeight: 1.2,
  fontWeight: 800,
  color: "#0F172A",
  marginBottom: "14px",
},

description: {
  color: "#64748B",
  lineHeight: 1.8,
  fontSize: "16px",
  maxWidth: "580px",
  marginBottom: "35px",
},

grid: {
  display: "grid",
  gridTemplateColumns: "repeat(2,1fr)",
  gap: "20px",
},

card: {
  background: "#fff",
  borderRadius: "20px",
  padding: "24px",
  border: "1px solid #E5E7EB",
  textDecoration: "none",
  transition: "all .25s ease",
  cursor: "pointer",
  display: "block",
},

icon: {
  width: "60px",
  height: "60px",
  borderRadius: "16px",
  background: "#F1F8FC",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  marginBottom: "18px",
},

title: {
  fontSize: "18px",
  fontWeight: 700,
  color: "#0F172A",
  marginBottom: "8px",
},

text: {
  fontSize: "14px",
  color: "#64748B",
  lineHeight: 1.7,
},

phone: {
  width: "90px",
  height: "90px",
  borderRadius: "24px",
  background: "rgba(255,255,255,.15)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "40px",
  marginBottom: "28px",
},

rightTitle: {
  fontSize: "32px",
  fontWeight: 800,
  marginBottom: "18px",
},

rightText: {
  lineHeight: 1.8,
  opacity: .95,
  marginBottom: "35px",
},

button: {
  display: "flex",
  alignItems: "center",
  gap: "10px",
  background: "#fff",
  color: "#0077B6",
  border: "none",
  borderRadius: "999px",
  padding: "16px 28px",
  fontWeight: 700,
  fontSize: "15px",
  cursor: "pointer",
  width: "fit-content",
},
};

return (
  <div style={styles.wrapper}>
    {/* LEFT */}

    <div style={styles.left}>

      <span style={styles.badge}>
        🚍 Travel Platform
      </span>

      <h2 style={styles.heading}>
        Book your next journey with confidence.
      </h2>

      <p style={styles.description}>
        SafariTix helps passengers discover routes, purchase digital tickets,
        receive QR boarding passes and track buses in real time.
      </p>

      <div style={styles.grid}>
        {items.map((item) => {
          const Icon = item.icon;

          return (
            <Link
              key={item.title}
              to={item.link}
              style={styles.card}
            >
              <div style={styles.icon}>
                <Icon size={24} color="#0077B6" />
              </div>

              <h4 style={styles.title}>
                {item.title}
              </h4>

              <p style={styles.text}>
                {item.description}
              </p>
            </Link>
          );
        })}
      </div>

    </div>

    {/* RIGHT */}

    <div style={styles.right}>

      <div style={styles.phone}>
        📱
      </div>

      <h2 style={styles.rightTitle}>
        Smart Ticketing
      </h2>

      <p style={styles.rightText}>
        Purchase tickets online, receive a QR code instantly,
        track your bus live and travel without queues.
      </p>

      <button style={styles.button}>
        Book Now
        <ArrowRight size={18}/>
      </button>

    </div>

  </div>
);
}
