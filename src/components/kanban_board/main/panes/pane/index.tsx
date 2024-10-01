import React from "react";

import style from "./index.module.scss";

import { SiblingT, useSiblingBondT } from "../../../../sibling_bond";
import * as storage from "../../../local_storage";
import { Task } from "../../../";
import { DropDownList } from "./dropdown_list";

import * as ReactRouterDOM from 'react-router-dom';
const { v4: CreateUUID } = require('uuid');


type SharedData =
{
	GetName: () => string;
	GetTaskList: () => Task[];
	DeleteTask: (idx: number) => void;
	Update: () => void;
};
export type Sibling = SiblingT<SharedData>;
export const useSiblingBond = (prevSibling: Sibling | null): Sibling => 
	useSiblingBondT<SharedData>(prevSibling);



export function Pane(props: {name: string, myself: Sibling}): JSX.Element
{
	const taskList = React.useRef<Task[]>(storage.GetTasks(props.name) ?? []);

	const [, Update] = React.useState<{}>();

	const data = React.useRef<SharedData>({
		GetName: (): string => props.name,
		GetTaskList: (): Task[] => taskList.current!,
		DeleteTask: (idx: number): void => { taskList.current.splice(idx,1) },
		Update: (): void => Update({})
	});


	props.myself.setData(data.current);   // we pass our Sibling object a reference to our data.


	const CreateTask = React.useCallback((taskName: string): Task => {
			return {id: CreateUUID(), name: taskName.trimEnd(), desc: ""}; }, []);		
	const AddTask = React.useCallback((task: Task): void => {
			taskList.current.push(task); }, []);
			
	const GetNextPane = React.useCallback((): SharedData | null =>
		props.myself.getNextSiblingData(), [props.myself]);
	const GetPrevPane = React.useCallback((): SharedData | null =>
		props.myself.getPrevSiblingData(), [props.myself]);


	const enum Mode { Default, EnterNewTask, SelectTask };   // the component operating modes.
	const [mode, setMode] = React.useState<Mode>(Mode.Default);

	const thisPaneRef = React.useRef<HTMLElement>(null);
	const taskListRef = React.useRef<HTMLDivElement>(null);
	const newTaskTextAreaRef = React.useRef<HTMLTextAreaElement>(null);
	const dropDownListOwnerRef = React.useRef<HTMLDivElement>(null);


	const [scrollToEnd, setScrollToEnd] = React.useState<boolean | undefined>();
	const ScrollToEnd = () => setScrollToEnd(v => !v);
	React.useEffect(() => {
		if(scrollToEnd !== undefined)   // skip the first trigger after mounting.
			taskListRef.current?.scrollTo(0, taskListRef.current.scrollHeight);   // scroll to the very end.
	}, [scrollToEnd]);


	const [dropDownListAllowed, AllowDropDownList] = React.useState<boolean>(false);	

	const Reset = React.useCallback(() => {
			setMode(Mode.Default);
			AllowDropDownList(false);
			ScrollToEnd();
		}, [Mode.Default]);



	React.useEffect(() => {
		if(newTaskTextAreaRef.current !== null ||
			dropDownListAllowed)
		{
			const OnDocumentKeyDown = (e : KeyboardEvent): void => {
				e.key==="Escape" && Reset(); };
			const OnDocumentMouseDown = (e: MouseEvent): void => {
				if(!thisPaneRef.current?.contains(e.target as Node))   // click outside Pane.
					Reset();
			};
			document.addEventListener("keydown", OnDocumentKeyDown);
			document.addEventListener("mousedown", OnDocumentMouseDown);
			dropDownListAllowed && window.addEventListener('resize', Reset);
			return () => {
					document.removeEventListener("keydown", OnDocumentKeyDown);
					document.removeEventListener("mousedown", OnDocumentMouseDown);
					dropDownListAllowed && window.removeEventListener('resize', Reset);
				};
		}
	}, [mode,Mode.Default,Reset,dropDownListAllowed]);


 	React.useEffect(() => {
		if(mode === Mode.SelectTask)
			if(!dropDownListAllowed)
				AllowDropDownList(true);
			else
			{
				const OnScroll = () => {
					const atBottom: boolean = (taskListRef.current!.scrollHeight - taskListRef.current!.scrollTop) <= 
						taskListRef.current!.offsetHeight;   // whether the task list vertical scroll is at the bottom?
					if(!atBottom)
						Reset();
				};
				const taskListRefCopy = taskListRef.current!;
				taskListRefCopy.addEventListener('scroll', OnScroll);
				return () => taskListRefCopy.removeEventListener('scroll', OnScroll);
			}
	}, [mode,Mode.SelectTask,dropDownListAllowed,Reset]);


	const MakeAddCartBtn = React.useCallback((): JSX.Element => {
			const OnBtnClick = (): void => {
					(GetPrevPane() == null ?   // click 'Add cart' button in the Backlog pane.
						setMode(Mode.EnterNewTask) :
						setMode(Mode.SelectTask));
					ScrollToEnd();
				};

			const btnDisabled: boolean = GetPrevPane()?.GetTaskList().length===0 ||   // the previous pane exists and does not contain any tasks.
				mode === Mode.SelectTask;   // the drop-down menu for selecting a task from the previous pane is opened.
			return (
				<button type="button" className={style.addCartBtn} onClick={OnBtnClick} disabled={btnDisabled}>
					<div className={style.addCartBtnImg}></div>
					Add cart
				</button>
			);
		}, [mode,Mode.EnterNewTask,Mode.SelectTask,GetPrevPane]);

	const MakeSubmitBtn = React.useCallback((): JSX.Element => {
			const OnBtnClick = (): void => {
					if(newTaskTextAreaRef.current!.value.trim() !== "")
					{
						const task: Task = CreateTask(newTaskTextAreaRef.current!.value);
						storage.AssignTask(props.name,task);
						AddTask(task);
						GetNextPane()?.Update();
						Reset();
					}
				};
			return <button type="button" className={style.submitBtn} onClick={OnBtnClick}>Submit</button>;
		}, [props.name,AddTask,CreateTask,Reset,GetNextPane]);

	const MakeNewTaskTextArea = React.useCallback((): JSX.Element => {
			const OnKeyDown = (e: React.KeyboardEvent): void => {
					if(e.code==="Enter" && !e.shiftKey)
						if(newTaskTextAreaRef.current!.value.trim() !== "")
						{
							const task: Task = CreateTask(newTaskTextAreaRef.current!.value);
							storage.AssignTask(props.name,task);
							AddTask(task);
							GetNextPane()?.Update();
							Reset();
						}
						else
							e.preventDefault();
				};
			return <textarea autoFocus ref={newTaskTextAreaRef} className={style.newTaskTextArea}
				onKeyDown={OnKeyDown}></textarea>;
		}, [props.name,AddTask,CreateTask,Reset,GetNextPane]);

	const MakeSelectTaskElement = React.useCallback((): JSX.Element =>
		<div ref={dropDownListOwnerRef} className={style.dropDownListOwner}></div>, []);

	const OnDropDownListSelect = React.useCallback((i: number): void => {
		const prevPane: SharedData = GetPrevPane()!;

		const task: Task = prevPane.GetTaskList()[i];
		storage.AssignTask(props.name,task);
		storage.DeleteTask(prevPane.GetName(),task);
		
		AddTask(task);
		prevPane.DeleteTask(i);
		prevPane.Update();
		GetNextPane()?.Update();
		Reset();
	}, [props.name,AddTask,Reset,GetPrevPane,GetNextPane]);

	return (
		<section ref={thisPaneRef} className={style.pane}>
			<div className={style.title}>{props.name}</div>

			<div ref={taskListRef} className={style.taskList}>

				{taskList.current.map(t => 
					<ReactRouterDOM.Link key={t.id} to={`/tasks/${t.id}`} tabIndex={-1}>
						<div className={style.taskListItem}>{t.name}</div>
					</ReactRouterDOM.Link>)}

				{mode === Mode.EnterNewTask && MakeNewTaskTextArea()}
				{mode === Mode.SelectTask && MakeSelectTaskElement()}

				{(mode === Mode.Default || mode === Mode.SelectTask) && MakeAddCartBtn()}
				{mode === Mode.EnterNewTask && MakeSubmitBtn()}
			</div>

			{mode === Mode.SelectTask && dropDownListAllowed &&
				<DropDownList owner={thisPaneRef.current!} showUnder={dropDownListOwnerRef.current!}
					options={GetPrevPane()!.GetTaskList()} onSelect={OnDropDownListSelect}/>}
		</section>
	);
}

