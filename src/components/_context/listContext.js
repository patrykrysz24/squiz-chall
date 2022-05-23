import React, { useState } from 'react';

export const ListContext = React.createContext();



export const ListProvider = ({ children }) => {

	const [listData, setListData] = useState([]);
	const [listDataFiltered, setListDatalistDataFiltered] = useState([]);
	const [activeSort, setActiveSort] = useState('name-a');

	const getList = async () => {
		try {
			const response = await fetch(`https://dujour.squiz.cloud/developer-challenge/data`);
			const list = await response.json();
			setListData({ list: list });
			sortList(list);
		} catch (err) {
			const message = `An error occured: ${err.statusText}`;
			window.alert(message);
			return;
		}

	}

	const sortList = (list, type) => {
		let sortedList;
		switch (type) {
			case 'name-a':
				sortedList = list.sort((a, b) => a.name.localeCompare(b.name));
				break;
			case 'name-d':
				sortedList = list.sort((a, b) => a.name.localeCompare(b.name)).reverse();
				break;
			case 'emp-a':
				sortedList = list.sort((a, b) => a.numberOfEmployees - b.numberOfEmployees);
				break;
			case 'emp-d':
				sortedList = list.sort((a, b) => b.numberOfEmployees - a.numberOfEmployees);
				break;
			default:
				sortedList = list.sort((a, b) => a.name.localeCompare(b.name));
		}
		setListDatalistDataFiltered({ listFiltered: sortedList });
	}


	return (
		<ListContext.Provider value={{ ...listData, ...listDataFiltered, activeSort, getList, sortList, setActiveSort}}>
			{children}
		</ListContext.Provider>
	)
};