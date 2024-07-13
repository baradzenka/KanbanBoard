import React from "react";
import * as ReactRouterDOM from 'react-router-dom';

import style from "./index.module.scss";

import * as storage from "../../local_storage"
import { Task } from "../../";



export function TaskDetails(): JSX.Element
{
	const [editMode, SetEditMode] = React.useState(false);

	const params = ReactRouterDOM.useParams<{id: string}>();
	let task: Task | null = storage.GetTask(params.id!);


	let descStaticRef = React.useRef<HTMLDivElement>(null);
	let descEditorRef = React.useRef<HTMLTextAreaElement>(null);
	let descEditorPrimaryHeight = React.useRef<number>(0);   // первичная высота редактора описания.


	const MakeDescStatic = React.useCallback((): JSX.Element => {
		const OnClick = () => {
				descEditorPrimaryHeight.current = descStaticRef.current!.scrollHeight;
				SetEditMode(true);
			};
		return <div ref={descStaticRef} className={style.descStatic}
			onClick={OnClick}>{task!.desc || "This task has no description"}</div>
	}, [task]);

	const MakeDescEditor = React.useCallback((): JSX.Element => {
		const OnInput = (): void => {
				descEditorRef.current!.style.height = `${descEditorRef.current!.scrollHeight}px`;
			};
		const OnKeyDown = (e: React.KeyboardEvent): void => {
				if(e.code==="Enter" && !e.shiftKey)
				{
					task!.desc = descEditorRef.current!.value.trim();
					storage.SetTask(task!.id,task!);
					SetEditMode(false);
				}
			};

		return <textarea autoFocus ref={descEditorRef} className={style.descEdit}
			style={{height: `${descEditorPrimaryHeight.current}px`}}
			defaultValue={task!.desc} onKeyDown={OnKeyDown} onInput={OnInput}></textarea>;
	}, [task]);

	React.useEffect(() => {
		if(editMode)
		{
			const OnDocumentKeyDown = (e : KeyboardEvent): void => {
					if(e.key==="Escape")
						SetEditMode(false);
				};
			const OnDocumentMouseDown = (e: MouseEvent): void => {
					if(!descEditorRef.current!.contains(e.target as Node))   // нажатие за приделами textarea.
						SetEditMode(false);
				};
			document.addEventListener("keydown", OnDocumentKeyDown);
			document.addEventListener("mousedown", OnDocumentMouseDown);
			return () => {
					document.removeEventListener("keydown", OnDocumentKeyDown);
					document.removeEventListener("mousedown", OnDocumentMouseDown);
				};
		}
	}, [editMode]);


	if(!task)
		return <main className={style.taskNotFound}>
			Ошибка: Задача с идентификатором '{`${params.id!}`}' не найдена</main>;

	return (
		<main className={style.taskDetailes}>
			<div className={style.sheet}>
				<div className={style.sheetScroll}>
					<div className={style.title}>
						<div className={style.name}>{task.name}</div>
						<ReactRouterDOM.Link to="/">
							<div className={style.closeBtn}></div>
						</ReactRouterDOM.Link>
					</div>
					{!editMode ? <MakeDescStatic/> : <MakeDescEditor/>}
				</div>
			</div>
		</main>
	);
}

