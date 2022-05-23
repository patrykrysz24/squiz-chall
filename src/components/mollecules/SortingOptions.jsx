import React, { useContext } from 'react'

import { ListContext } from '../_context/listContext';


const SortingOptions = () => {
    // const [activeSort, setActiveSort] = useState('name-a');
    const listContext = useContext(ListContext);

    const handleClick = (type) => {
        if(listContext.activeSort === type) return;
        listContext.sortList(listContext.listFiltered, type);
        listContext.setActiveSort(type);
    }

    return (
        <>
            <button type='button'
                className={listContext.activeSort === 'name-a' ? 'btn --active' : 'btn'}
                onClick={() => handleClick('name-a')}>
                name ascending
            </button>

            <button type='button'
                className={listContext.activeSort === 'name-d' ? 'btn --active' : 'btn'}
                onClick={() => handleClick('name-d')}>
                name descending
            </button>
            <button type='button'
                className={listContext.activeSort === 'emp-a' ? 'btn --active' : 'btn'}
                onClick={() => handleClick('emp-a')}>
                employees ascending
            </button>
            <button type='button'
                className={listContext.activeSort === 'emp-d' ? 'btn --active' : 'btn'}
                onClick={() => handleClick('emp-d')}>
                employees descending
            </button>
        </>
    )
}

export default SortingOptions