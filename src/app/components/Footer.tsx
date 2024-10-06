import Style from './componets.module.css'


export default function Footer() {
    return (
      <footer className={Style.footer_container}>
        &copy; {new Date().getFullYear()} Jobsy
      </footer>
    );
  }
  