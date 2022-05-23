import React, { useContext, useEffect } from 'react'

import { ListContext } from '../_context/listContext'

import ListItem from '../atoms/ListItem';


const DataList = () => {

    const listContext = useContext(ListContext);
    const isLoaded = listContext?.list?.length;

    useEffect(() => {
        const getList = async () => {
            await listContext.getList();
        }
        if (!isLoaded) getList();
        return;
        // eslint-disable-next-line
    }, [isLoaded]);

    const createHeader = () => {
        const list = listContext.list;
        const headerValues = Object.keys(list[0])
        const data = {};
        headerValues.forEach(element => {
            data[element] = element.replace(/([A-Z])/g, ' $1').trim();
        })
        return (
            <ListItem data={data} key={list.id} className='list__item --header' />
        );
    };

    const createList = () => {
        const list = listContext.listFiltered;
        return list.map((list) => {
                return (
                    <ListItem data={list} key={list.id} className='list__item' />
                );

        });
    };

    return (
        <>
            {isLoaded ? createHeader() : ''}
            {isLoaded ? createList() : <div className='loading'><img src={`${process.env.PUBLIC_URL}/loader.gif`} alt="loader"></img></div>}
        </>
    )
}


export default DataList