import React from "react";

import style from "./index.module.scss";
import * as storage from "../local_storage";


export function Footer({user}: {user: string}): JSX.Element
{
	const [activeTasks, SetActiveTasksNumber] = React.useState<number>(
		storage.GetTasks("Backlog")?.length ?? 0);
	const [finishedTasks, SetFinishedTasksNumber] = React.useState<number>(
		storage.GetTasks("Finished")?.length ?? 0);

	const OnStorageEvents = React.useCallback(() => {
		SetActiveTasksNumber(storage.GetTasks("Backlog")?.length ?? 0);
		SetFinishedTasksNumber(storage.GetTasks("Finished")?.length ?? 0);
	}, [SetActiveTasksNumber,SetFinishedTasksNumber]);

	storage.SubscribeToEvents(OnStorageEvents);

	const year: number = new Date().getFullYear();

	return (
		<footer className={style.footer}>
			<div>{`Active tasks: ${activeTasks}`}</div>
			<div className={style.leftAlign}>{`Finished tasks: ${finishedTasks}`}</div>
			<div>{`Kanban board by ${user}, ${year}`}</div>
		</footer>
	);
}

