import React from "react";

import style from "./index.module.scss";

import classNames from "classnames";


export function HeaderMenu({options}: {options: string[]}): JSX.Element
{
	const [menuVisible, ShowMenu] = React.useState<boolean>(false);

	const avatarRef = React.useRef<HTMLDivElement>(null);
	const dropDownListWrapperRef = React.useRef<HTMLDivElement>(null);

	React.useEffect(() => {
		if(menuVisible)
		{
			const OnDocumentKeyDown = (e : KeyboardEvent): void => {
				e.key==="Escape" && ShowMenu(false); };
			const OnDocumentMouseDown = (e: MouseEvent): void => {
				if(!dropDownListWrapperRef.current?.contains(e.target as Node) &&   // click outside dropDownListWrapper.
					!avatarRef.current?.contains(e.target as Node))   // click outside the avatar.
				{
					ShowMenu(false);
				}
			};
			document.addEventListener("keydown", OnDocumentKeyDown);
			document.addEventListener("mousedown", OnDocumentMouseDown);
			return () => {
					document.removeEventListener("keydown", OnDocumentKeyDown);
					document.removeEventListener("mousedown", OnDocumentMouseDown);
				};
		}
	}, [menuVisible]);

	return (
		<div className={style.menu}>
			<div ref={avatarRef} className={style.avatar} onClick={() => ShowMenu(!menuVisible)}></div>
			<div className={classNames(style.arrow, menuVisible && style.arrowUp)}></div>

			{menuVisible &&
				<div ref={dropDownListWrapperRef} className={style.dropDownListWrapper}>
					<div className={style.dropDownList}>
						{options.map((o,i) => <div key={i} className={style.dropDownListOption}>{o}</div>)}
					</div>
				</div>
			}
		</div>
	);
}
