import { useState } from "react";
import { NavBar } from "../shared/components/menus/NavBar";
import { DashboardPage } from "../dashboard/DashboardPage";
import { MainMenu } from "../menu/MainMenu";

export const HomePage = () => {
const [page, setPage] = useState<JSX.Element|JSX.Element[]>(<DashboardPage/>)
  return (
    <>
      {/* LAYOUT DE APP */}
      <NavBar />
      <div className="flex-start align-items-start flex-nowrap">
        <MainMenu setPage={setPage} />
        {/* CONTENIDO */}
        <div className="flex-grow-1">
        {!!page && page}
        </div>
      </div>
    </>
  );
};