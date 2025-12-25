export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__inner">
        <p>© {new Date().getFullYear()} Smart Recipe App</p>
        <p className="footer__muted">Cook smarter. Waste less. Eat better.</p>
      </div>
    </footer>
  );
}
