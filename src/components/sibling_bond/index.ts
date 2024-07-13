import React from "react";

/*
	Пользовательский хук, позволяющий дочерним компонентам, находящимся на одном уровне,
	иметь доступ к данным соседних компонентов. Т.е. есть возможность напрямую
	обращаться к их данным расположенным в SiblingT или вызывать объявленные в них
	функции для совершения действий над соседними компонентами.
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

