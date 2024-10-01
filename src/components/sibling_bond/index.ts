import React from "react";

/*
	A custom hook that allows child components located at the same level
	to have access to the data of neighboring components. That is,
	it is possible to directly access their data located in SiblingT or
	call functions declared in them to perform actions on neighboring components.
*/

export type SiblingT<TData> =
{
	setData: (d: TData) => void;
	getData: () => TData | null;

	setNextSibling: (s: SiblingT<TData>) => void;

	getPrevSibling: () => SiblingT<TData> | null;
	getNextSibling: () => SiblingT<TData> | null;

	getPrevSiblingData: () => TData | null;
	getNextSiblingData: () => TData | null;
};

export function useSiblingBondT<TData>(prevSibling: SiblingT<TData> | null): SiblingT<TData>
{
	const data = React.useRef<TData | null>(null);
	const nextSibling = React.useRef<SiblingT<TData> | null>(null);

	const thisSibling = {
		setData: (d: TData) => data.current = d,
		getData: (): TData | null => data.current,

		setNextSibling: (s: SiblingT<TData>) => nextSibling.current = s,

		getPrevSibling: (): SiblingT<TData> | null => prevSibling,
		getNextSibling: (): SiblingT<TData> | null => nextSibling.current,

		getPrevSiblingData: (): TData | null => prevSibling && prevSibling.getData(),
		getNextSiblingData: (): TData | null => nextSibling.current && nextSibling.current.getData()
	};

	if(prevSibling)
		prevSibling.setNextSibling(thisSibling);

	return thisSibling;
}

