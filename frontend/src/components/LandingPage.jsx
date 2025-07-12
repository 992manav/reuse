import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./LandingPage.css";

export default function LandingPage() {
  const [items, setItems] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await axios.get(`${"http://localhost:8080"}/api/items`);
        const approved = res.data.filter((item) => item.approved);
        setItems(approved.slice(0, 6)); // top 6 approved items
      } catch (err) {
        console.error("Failed to load items:", err);
      }
    };

    fetchItems();
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % Math.max(1, items.length - 2));
  };

  const prevSlide = () => {
    setCurrentSlide(
      (prev) =>
        (prev - 1 + Math.max(1, items.length - 2)) %
        Math.max(1, items.length - 2)
    );
  };

  useEffect(() => {
    const autoSlide = setInterval(nextSlide, 5000);
    return () => clearInterval(autoSlide);
  }, [items.length]);

  return (
    <div className="landing-container">
      <section className="landing-hero">
        <div className="landing-hero-content">
          <h1>
            Sustainable Fashion <span>Starts Here</span>
          </h1>
          <p>
            Join ReWear's community to exchange unused clothing through direct
            swaps or our point-based system. Reduce textile waste while
            discovering new styles.
          </p>
          <div className="landing-hero-actions">
            <Link to="/browse" className="landing-hero-btn green">
              Start Swapping
            </Link>
            <Link to="/browse" className="landing-hero-btn">
              Browse Items
            </Link>
          </div>
        </div>
      </section>

      <section className="landing-features">
        <div className="landing-features-content">
          <h2>How ReWear Works</h2>
          <p>Simple steps to sustainable fashion</p>
          <div className="landing-features-list">
            <div className="feature-card">
              <h3>List Your Items</h3>
              <p>
                Upload photos and details of clothing you no longer wear. Earn
                points for each approved item.
              </p>
            </div>
            <div className="feature-card">
              <h3>Browse & Request</h3>
              <p>
                Discover amazing pieces from other community members. Request
                swaps or use points to claim items.
              </p>
            </div>
            <div className="feature-card">
              <h3>Complete Swaps</h3>
              <p>
                Connect with other users to arrange exchanges. Build your
                sustainable wardrobe together.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="landing-featured">
        <h2>Featured Items</h2>
        <div className="landing-featured-slider">
          {items.length === 0 ? (
            <div className="empty-list">No featured items yet.</div>
          ) : (
            <>
              <button onClick={prevSlide} className="slider-btn">
                ←
              </button>
              <div className="slider-items">
                {items
                  .slice(currentSlide, currentSlide + 3)
                  .map((item, index) => (
                    <Link
                      to={`/item/${item._id}`}
                      key={item._id || index}
                      className="slider-item-card"
                    >
                      <img
                        src={item.images?.[0] || "/default-item.png"}
                        alt={item.title}
                        onError={(e) => {
                          e.target.src = "/default-item.png";
                        }}
                      />
                      <div className="slider-item-title">{item.title}</div>
                    </Link>
                  ))}
              </div>
              <button onClick={nextSlide} className="slider-btn">
                →
              </button>
            </>
          )}
        </div>
      </section>
    </div>
  );
}
