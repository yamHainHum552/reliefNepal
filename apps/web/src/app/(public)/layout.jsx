import Footer from '../../components/layout/Footer.jsx';

export default function PublicLayout({ children }) {
  return (
    <>
      {children}
      <Footer />
    </>
  );
}
