import React from "react";
import ReactDOM from "react-dom/client";
import * as ReactRouterDOM from 'react-router-dom';

import "./index.scss";
import { KanbanBoardProps, KanbanBoard } from "./components/kanban_board";
//import { panesExample } from "./components/kanban_board/local_storage";



const kanbanBoardProps: KanbanBoardProps = {
	title: "Kanban Board",
	menuOptions: ["Profile", "Log Out"],
	user: "User",
//	panes: panesExample
};

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(
	<React.StrictMode>
		<ReactRouterDOM.HashRouter>
			<KanbanBoard {...kanbanBoardProps}/>
		</ReactRouterDOM.HashRouter>
	</React.StrictMode>
);

