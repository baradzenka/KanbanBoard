import * as ReactRouterDOM from 'react-router-dom';
import { render } from '@testing-library/react'
import '@testing-library/jest-dom'

import { KanbanBoardProps, KanbanBoard } from "./";
import { panesExample } from "./local_storage";

import headerStyle from "./header/index.module.scss";
import panesStyle from "./main/panes/index.module.scss";
import paneStyle from "./main/panes/pane/index.module.scss";
import footerStyle from "./footer/index.module.scss";



const kanbanBoardProps: KanbanBoardProps = {
	title: "Kanban Board",
	menuOptions: ["Profile", "Log Out"],
	user: "User",
	panes: panesExample
};

function Render(): HTMLElement
{
	return render(
			<ReactRouterDOM.HashRouter>
				<KanbanBoard {...kanbanBoardProps} />
			</ReactRouterDOM.HashRouter>
		).container;
}

describe("Site detailes:", () => {

	it('Main.Header', () => {
		const container: HTMLElement = Render();

 		const header: HTMLCollection = container.getElementsByClassName(headerStyle.header);
		expect(header).toHaveLength(1);
 		const title: HTMLCollection | undefined = header.item(0)?.getElementsByClassName(headerStyle.title);
		expect(title).toHaveLength(1);
		expect(title?.item(0)).toHaveTextContent(kanbanBoardProps.title);
	})

	it('Main.Panes', () => {
		const container: HTMLElement = Render();

 		const panes: HTMLCollection = container.getElementsByClassName(panesStyle.pane);
		expect(panes).toHaveLength(  panesExample.length );

		expect(panes.item(0)?.className).toEqual(panesStyle.pane);

		const pane0: HTMLCollection | undefined = panes.item(0)?.getElementsByClassName(paneStyle.title);
		expect(pane0).toHaveLength(1);
		expect(pane0?.item(0)).toHaveTextContent( panesExample[0].name );

		const pane1: HTMLCollection | undefined = panes.item(1)?.getElementsByClassName(paneStyle.title);
		expect(pane1).toHaveLength(1);
		expect(pane1?.item(0)).toHaveTextContent( panesExample[1].name );
		const taskListItems: HTMLCollection | undefined = panes.item(1)?.getElementsByClassName(paneStyle.taskListItem);
		expect(taskListItems).toHaveLength( panesExample[1].tasks.length );

		const pane2: HTMLCollection | undefined = panes.item(2)?.getElementsByClassName(paneStyle.title);
		expect(pane2).toHaveLength(1);
		expect(pane2?.item(0)).toHaveTextContent( panesExample[2].name );

		const pane3: HTMLCollection | undefined = panes.item(3)?.getElementsByClassName(paneStyle.title);
		expect(pane3).toHaveLength(1);
		expect(pane3?.item(0)).toHaveTextContent( panesExample[3].name );
	})

	it('Main.Footer', () => {
		const container: HTMLElement = Render();

 		const panes: HTMLCollection = container.getElementsByClassName(panesStyle.pane);
		expect(panes).toHaveLength( panesExample.length );

		const pane0: HTMLCollection | undefined = panes.item(0)?.getElementsByClassName(paneStyle.title);
		expect(pane0).toHaveLength(1);
		expect(pane0?.item(0)).toHaveTextContent( panesExample[0].name );
		const taskListItems0: HTMLCollection | undefined = panes.item(0)?.getElementsByClassName(paneStyle.taskListItem);
		expect(taskListItems0).toHaveLength( panesExample[0].tasks.length );

		const pane3: HTMLCollection | undefined = panes.item(3)?.getElementsByClassName(paneStyle.title);
		expect(pane3).toHaveLength(1);
		expect(pane3?.item(0)).toHaveTextContent( panesExample[3].name );
		const taskListItems3: HTMLCollection | undefined = panes.item(3)?.getElementsByClassName(paneStyle.taskListItem);
		expect(taskListItems3).toHaveLength( panesExample[3].tasks.length );


		const footer: HTMLCollection = container.getElementsByClassName(footerStyle.footer);
		expect(footer).toHaveLength(1);
		expect(footer.item(0)?.children).toHaveLength(3);
		expect(footer.item(0)?.children.item(0)).toHaveTextContent(`Active tasks: ${panesExample[0].tasks.length}`);
		expect(footer.item(0)?.children.item(1)).toHaveTextContent(`Finished tasks: ${panesExample[3].tasks.length}`);		
	})
});

