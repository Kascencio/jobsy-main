// src/components/Header.tsx

"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import Style from "./componets.module.css";

export default function Header() {
  const { data: session } = useSession();

  return (
    <header className={Style.header}>
      <div className={Style.img_container}>
        <Link href="/">
          <svg
            width="40"
            height="36"
            viewBox="0 0 29 30"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0.00683594 13.3442H1.41843C2.21503 6.87801 7.73145 1.8831 14.413 1.8831C20.2356 1.8831 25.324 5.71296 26.9768 11.2606C27.1922 11.9352 27.3142 12.641 27.3764 13.3442H28.8165C27.9888 6.11256 21.8599 0.502686 14.413 0.502686C6.96599 0.502686 0.837162 6.10996 0.00943323 13.3442H0.00683594Z"
              fill="black"
            />
            <path
              d="M27.0374 16.6559C26.0877 20.0888 23.1764 22.6628 19.0066 22.0193C17.045 21.7131 15.4518 20.5169 14.746 19.0145C14.624 19.0145 14.5332 19.0457 14.4087 19.0457C12.6935 19.0457 11.2534 17.974 10.6696 16.4717C9.90417 17.5148 9.47344 18.8615 9.56685 20.6389C9.8419 25.6961 18.3942 28.2389 24.2765 23.6436C24.0923 23.8564 23.8769 24.0717 23.6927 24.256C21.3029 26.6457 18.0232 28.117 14.4061 28.117C7.72461 28.117 2.20813 23.1221 1.41153 16.6559H0C0.827729 23.8901 6.95656 29.4974 14.4035 29.4974C18.4176 29.4974 22.0347 27.8731 24.6709 25.2679C26.9076 23.0001 28.4411 19.9954 28.8096 16.6559H27.0322H27.0374Z"
              fill="black"
            />
            <path
              d="M24.1573 16.4399C25.8128 14.2629 25.2601 11.2296 23.9134 9.02403C22.3202 6.32808 18.672 4.27302 15.2703 4.18221C1.72301 3.78261 1.72303 22.1717 7.70136 16.7175C8.71332 15.799 9.54102 15.0932 10.3999 14.5742C10.6153 12.5503 12.3304 10.9571 14.414 10.9571C16.6507 10.9571 18.4592 12.7657 18.4592 15.0024C18.4592 15.677 18.275 16.3205 18 16.8706C19.562 18.4352 22.5641 18.5572 24.1599 16.4425L24.1573 16.4399Z"
              fill="black"
            />
          </svg>
        </Link>
        <h1>Jobsy</h1>
      </div>
      <nav>
        {session ? (
          <>
          <ul>
            <li>
            <Link href="/dashboard">
              <span>Herramientas</span>
            </Link>
            </li>
          </ul> 
            <Link href="/perfil">
              <span className="mr-4">Perfil</span>
            </Link>
            <a onClick={() => signOut()}>
              Cerrar Sesión
            </a>
          </>
        ) : (
          <>
            <Link href="/login">
              <span className="mr-4">Iniciar Sesión</span>
            </Link>
            <Link href="/registro">
              <span>Registrarse</span>
            </Link>
          </>
        )}
      </nav>
    </header>
  );
}
