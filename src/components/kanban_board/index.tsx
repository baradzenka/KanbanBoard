import * as ReactRouterDOM from 'react-router-dom';

import style from "./index.module.scss";

import * as storage from "./local_storage"
import { Header } from "./header"
import { Panes } from "./main/panes"
import { TaskDetails } from "./main/task_details"
import { Footer } from "./footer"



export type Task = {
	id: string;
	name: string;
	desc: string;
};
export type Pane = {
	name: string;
	tasks: Task[];
};


export type KanbanBoardProps = {
	title: string;
	menuOptions: string[];
	user: string;
	panes?: Pane[];
};

export function KanbanBoard(props: KanbanBoardProps): JSX.Element
{
	if(props.panes)
		storage.SetPrimaryData(props.panes);

	return (
		<div className={style.content} >
			<Header title={props.title} menuOptions={props.menuOptions}/>
			<ReactRouterDOM.Routes>
				<ReactRouterDOM.Route path='/' element={<Panes/>}/>
				<ReactRouterDOM.Route path='/tasks/:id' element={<TaskDetails/>}/>
			</ReactRouterDOM.Routes>
			<Footer user={props.user} />
		</div>
	);
};

