import { Pane, Task } from "../";
import { panesExample, SetPrimaryData, GetPane,
	GetTasks, GetTask, SetTask, AssignTask, DeleteTask } from "./";



describe("local_storage:", () => {

	it('AssignTask + GetPane', () => {
		const task: Task = {id: "4d38dd4c-4e81-472b-b420-34f3f13e96b1", name: "NameTest", desc: "DescTest"};
		AssignTask("TestPane",task);

		const pane: {panes: Pane[] | null, pane: Pane | null} = GetPane("TestPane");
		expect(pane.panes).toHaveLength(1);
		expect(pane.panes?.[0].name).toEqual("TestPane");
		expect(pane.panes?.[0].tasks).toHaveLength(1);
		expect(pane.panes?.[0].tasks[0].id).toEqual("4d38dd4c-4e81-472b-b420-34f3f13e96b1");
		expect(pane.panes?.[0].tasks[0].name).toEqual("NameTest");
		expect(pane.panes?.[0].tasks[0].desc).toEqual("DescTest");
	})

	it('AssignTask + GetPane + DeleteTask', () => {
		const task: Task = {id: "5f3804f4-4afa-47fd-94ad-98f058d22214", name: "NameTest2", desc: "DescTest2"};
		AssignTask("TestPane",task);

		let pane: {panes: Pane[] | null, pane: Pane | null} = GetPane("TestPane");
		expect(pane.panes).toHaveLength(1);
		expect(pane.panes?.[0].tasks).toHaveLength(2);

		DeleteTask("TestPane",task);

		pane = GetPane("TestPane");
		expect(pane.panes?.[0].tasks).toHaveLength(1);
	})

	it('SetPrimaryData + GetPane', () => {
		SetPrimaryData(panesExample);
		const pane: {panes: Pane[] | null, pane: Pane | null} = GetPane(panesExample[0].name);

		expect(pane.panes).toHaveLength(4);

		expect(pane.panes?.[0].name).toEqual(panesExample[0].name);
		expect(pane.panes?.[0].tasks).toHaveLength(panesExample[0].tasks.length);
		expect(pane.panes?.[0].tasks[0].name).toEqual(panesExample[0].tasks[0].name);
		expect(pane.panes?.[0].tasks[1].id).toEqual(panesExample[0].tasks[1].id);

		expect(pane.panes?.[1].name).toEqual(panesExample[1].name);
		expect(pane.panes?.[1].tasks).toHaveLength(panesExample[1].tasks.length);
		expect(pane.panes?.[1].tasks[3].id).toEqual(panesExample[1].tasks[3].id);
		expect(pane.panes?.[1].tasks[8].desc).toEqual(panesExample[1].tasks[8].desc);

		expect(pane.panes?.[2].name).toEqual(panesExample[2].name);
		expect(pane.panes?.[2].tasks).toHaveLength(panesExample[2].tasks.length);
		expect(pane.panes?.[2].tasks[0].name).toEqual(panesExample[2].tasks[0].name);

		expect(pane.panes?.[3].name).toEqual(panesExample[3].name);
		expect(pane.panes?.[3].tasks).toHaveLength(panesExample[3].tasks.length);
		expect(pane.panes?.[3].tasks[0].id).toEqual(panesExample[3].tasks[0].id);
	})

	it('SetPrimaryData + GetTasks', () => {
		SetPrimaryData(panesExample);

		const tasks: Task[] | null = GetTasks(panesExample[2].name);
		expect(tasks).toHaveLength(panesExample[2].tasks.length);
		expect(tasks?.[0].id).toEqual(panesExample[2].tasks[0].id);
		expect(tasks?.[1].desc).toEqual(panesExample[2].tasks[1].desc);
	})

	it('SetPrimaryData + GetTask', () => {
		SetPrimaryData(panesExample);

		const task: Task | null = GetTask(panesExample[1].tasks[8].id);
		expect(task?.id).toEqual(panesExample[1].tasks[8].id);
		expect(task?.name).toEqual(panesExample[1].tasks[8].name);
		expect(task?.desc).toEqual(panesExample[1].tasks[8].desc);
	})

	it('SetPrimaryData + SetTask', () => {
		SetPrimaryData(panesExample);

		const task: Task = {id: "c967f561-8b84-432b-bd86-1cf022249bdf", name: "Name1", desc: "Desc1"};
		SetTask("c967f561-8b84-432b-bd86-1cf022249bdf",task,);

		const testTask: Task | null = GetTask("c967f561-8b84-432b-bd86-1cf022249bdf");
		expect(testTask?.id).toEqual("c967f561-8b84-432b-bd86-1cf022249bdf");
		expect(testTask?.name).toEqual("Name1");
		expect(testTask?.desc).toEqual("Desc1");		
	})
});

