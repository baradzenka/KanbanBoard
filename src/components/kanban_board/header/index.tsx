import style from "./index.module.scss";

import { HeaderMenu } from "./header_menu";


export function Header({title, menuOptions}: {title: string, menuOptions: string[]}): JSX.Element
{
	return (
		<header className={style.header}>
			<div className={style.title}>{title}</div>
			<HeaderMenu options={menuOptions}/>
		</header>
	);
}

