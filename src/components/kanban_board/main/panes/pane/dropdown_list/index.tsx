import React from "react";
import ReactDOM from "react-dom";

import style from "./index.module.scss";

import { Task } from "../../../../index";



export function DropDownList(props: {owner: HTMLElement, showUnder: HTMLElement,
	options: Task[], onSelect: (idx: number)=>void}): JSX.Element
{
	const OnOptionClick = React.useCallback((e: React.MouseEvent<HTMLElement>): void => {
			props.onSelect( parseInt(e.currentTarget.dataset.index!) );
		}, [props]);

	const rcTarget: DOMRect = props.showUnder.getBoundingClientRect();
	const extraStyles: React.CSSProperties = {left: `${rcTarget.left}px`,
		top: `${window.scrollY + rcTarget.bottom + 2}px`, width: `${rcTarget.width}px`};

	const list = 
		<div className={style.dropDownList} style={extraStyles}>
			{props.options.map((o,i) => <div key={o.id} className={style.dropDownListOption}
				onClick={OnOptionClick} data-index={i}>{o.name}</div>)}
		</div>;
 	return ReactDOM.createPortal(list,props.owner);
};

