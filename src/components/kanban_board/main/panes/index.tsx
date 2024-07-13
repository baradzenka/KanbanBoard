import style from "./index.module.scss";

import { Sibling, useSiblingBond, Pane } from "./pane";


export function Panes(): JSX.Element
{
	const sibling1: Sibling = useSiblingBond(null);
	const sibling2: Sibling = useSiblingBond(sibling1);
	const sibling3: Sibling = useSiblingBond(sibling2);
	const sibling4: Sibling = useSiblingBond(sibling3);

	return (
		<main className={style.panes}>
			<Pane name="Backlog" myself={sibling1} />
			<Pane name="Ready" myself={sibling2} />
			<Pane name="In Progress" myself={sibling3} />
			<Pane name="Finished" myself={sibling4} />
		</main>
	);
}

