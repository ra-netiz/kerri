export default function Footer() {
    return (
        <footer className="footer">
            <div className="footer__inner">
                <span className="footer__brand">Kerri Cleaner</span>
                <span className="footer__copy">© {new Date().getFullYear()} Kerri Cleaner. All rights reserved.</span>
            </div>
        </footer>
    )
}