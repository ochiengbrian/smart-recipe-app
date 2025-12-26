export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__inner">
        <p>© {new Date().getFullYear()} Smart Recipe</p>
        <p className="footer__muted">Cook smarter. Waste less. Eat better.</p>
        <p className="footer__muted">Made by +254 716 800 723</p>
      </div>
    </footer>
  );
}
