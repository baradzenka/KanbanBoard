
import { Pane, Task } from "../";


export const panesExample: Pane[] = [
	{
		name: "Backlog",
		tasks: [
			{ id: "6a23222e-8011-4dbd-97f5-8ea6d4e903c5", name: "Login page – performance issues", desc: "bla-bla-bla" },
			{ id: "f8272a7f-f5c4-43f0-8919-587ce06deb44", name: "Sprint bugfix", desc: "Это был темный лес, " +
				"издали казавшийся непроходимым. Там Пахапиль охотился, глушил рыбу, спал на еловых ветках. " +
				"Короче – жил, пока русские не выгнали оккупантов. А когда немцы ушли, Пахапиль вернулся. " +
				"Он появился в Раквере, где советский капитан наградил его медалью. Медаль была украшена " +
				"четырьмя непонятными словами, фигурой и восклицательным знаком."}]
	},
	{
		name: "Ready",
		tasks: [
			{ id: "a5ab2959-3dfd-4b1f-9303-a2b4d45b593a", name: "Shop page – performance issues 1", desc: "" },
			{ id: "c597176b-3db7-4dc4-b420-df5bfb5e47ee", name: "Checkout bugfix", desc: "" },
			{ id: "66d4e14e-76cd-4afd-9454-5b8fa06e7ba8", name: "Shop bug1", desc: "" },
			{ id: "65ee0063-8e7b-46df-8611-14898b572d55", name: "Shop bug2", desc: "" },
			{ id: "bb8cb022-72d6-4da9-8ece-ec772f28028c", name: "Shop bug3", desc: "" },
			{ id: "3196443a-dae7-4a9b-9895-719ee2e22b00", name: "Shop bug4", desc: "" },
			{ id: "243e3307-ff4f-4b43-9cd3-30a7806158f2", name: "Shop bug5", desc: "" },
			{ id: "16815619-b3ba-464b-9d55-2d33063cc087", name: "Shop bug6", desc: "" },
			{ id: "c967f561-8b84-432b-bd86-1cf022249bdf", name: "Shop page – performance issues 2", desc: "desc" }]
	},
	{
		name: "In Progress",
		tasks: [
			{ id: "8594edae-24c6-400e-b49b-e93a61f99f0c", name: "User page – performance issues 3", desc: "" },
			{ id: "d6db51eb-8b49-40c0-bd87-c148fbac74b7", name: "Auth bugfix", desc: "Some desc" }]
	},
	{
		name: "Finished",
		tasks: [
			{ id: "1fc31170-6974-4d61-94e5-973cc0f945c2", name: "Main page – performance issues", desc: "" },
			{ id: "b9010e3b-3585-4947-b719-492fab19bced", name: "Main page bugfix", desc: "" }]
	}
];


const g_localStorageKey: string = "KanbanBoard.{a5ab2959-3dfd-4b1f-9303-a2b4d45b593a}";


const assert = (val: any, msg?: string): void | never =>
	val || (() => { throw Error(); })();



const g_subscribers: (()=>void)[] = [];

export function SubscribeToEvents(sub: ()=>void)
{
	if(!g_subscribers.includes(sub))
		g_subscribers.push(sub);
}



function ReadPanes(): Pane[] | null
{
	const jsonObj: string | null = localStorage.getItem(g_localStorageKey);
	if(!jsonObj)
		return null;

	const obj: any = JSON.parse(jsonObj);
	return (Array.isArray(obj) ? obj : null);
}

function WritePanes(panes: Pane[]): void
{
	const jsonObj: string = JSON.stringify(panes);
	localStorage.setItem(g_localStorageKey,jsonObj);
}


export function SetPrimaryData(panes: Pane[]) : void
{
	WritePanes(panes);
	g_subscribers.forEach(s => s());
}


export function GetPane(name: string): {panes: Pane[] | null, pane: Pane | null}
{
	const panes: Pane[] | null = ReadPanes();
	const o: any = panes?.find(i => { return i.hasOwnProperty("name") && i.name===name; } );
	return {
			panes,
			pane: (o && o.hasOwnProperty("tasks") && Array.isArray(o.tasks) ? o : null)
		};
}

export function GetTasks(paneName: string): Task[] | null
{
	const pane: Pane | null = GetPane(paneName).pane;
	return pane && pane.tasks;
}

export function AssignTask(paneName: string, task: Task): void
{
	let {panes, pane}: {panes: Pane[] | null, pane: Pane | null} = GetPane(paneName);
	if(!panes)
		panes = [{name: paneName, tasks: [task]}];
	else if(!pane)
		panes.push({name: paneName, tasks: [task]});
	else
	{
		let oldTask: Task | undefined = pane.tasks.find(t => t.id===task.id);
		if(!oldTask)
			pane.tasks.push(task);
		else
			oldTask = task;
	}
	WritePanes(panes);
	g_subscribers.forEach(s => s());
}

export function DeleteTask(paneName: string, task: Task): void
{
	let {panes, pane}: {panes: Pane[] | null, pane: Pane | null} = GetPane(paneName);
	assert(panes && pane);

	const taskIdx: number = pane!.tasks.findIndex(t => t.id===task.id);
	assert(taskIdx !== -1);
	pane!.tasks.splice(taskIdx,1);

	WritePanes(panes!);
	g_subscribers.forEach(s => s());
}


export function GetTask(taskID: string) : Task | null
{
	const panes: Pane[] | null = ReadPanes();
	if(panes)
		for(const p of panes)
			for(const t of p.tasks)
				if(t.id.toLowerCase() === taskID.toLowerCase())
					return t;
	return null;
}

export function SetTask(taskID: string, task: Task) : void
{
	const panes: Pane[] | null = ReadPanes();
	if(panes)
		for(const p of panes)
			for(let t of p.tasks)
				if(t.id.toLowerCase() === taskID.toLowerCase())
				{
					Object.assign(t,task);
					WritePanes(panes);
					return;
				}

	assert(false);
}
