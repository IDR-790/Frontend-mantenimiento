import { useContext } from "react";
import { Menubar } from "primereact/menubar";
import { useNavigate } from "react-router";
import { AuthContext } from "../../../auth/context/AuthContext";

interface Props {
  path?: string;
}

export const NavBar = ({ path = "" }: Props) => {
  const { logout, user } = useContext(AuthContext);

  const Start = (path: string) => {
    const navigate = useNavigate();
    return (
      <div
        className="flex align-items-center gap-2 ml-3 cursor-pointer"
        onClick={() => navigate("/home")}
      >
        <img src={"/logo.png"} height={"40px"} />
        <span className="font-bold text-xl pb-1">NÚCLEO | Sistema Integral de Gestión de Flota {path && `> ${path}`}</span>
      </div>
      // <i className='pi pi-globe' style={{fontSize: '2rem', color: '#D9F'}}/>
    );
  };

  const End = () => {
    return (
      <div className="flex-center gap-2 mr-2">
        <span className="font-semibold">{user?.email}</span>
        <img
          src={user?.email}
          alt="avatar"
          width={30}
          height={30}
          className="border-circle"
        />
        <i
          className="pi pi-sign-out ml-2 cursor-pointer"
          style={{ fontSize: "1.5rem", color: "#c00" }}
          onClick={() => logout()}
        />
      </div>
    );
  };

  return (
    <>
      <Menubar
        start={Start(path)}
        end={End}
        className="w-12 shadow-1"
        style={{ minHeight: "4rem" }}
      />
    </>
  );
};
