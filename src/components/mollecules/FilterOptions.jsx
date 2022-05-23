import React, { useContext, useState, useEffect } from 'react'

import { ListContext } from '../_context/listContext';

import FilterItem from '../atoms/FilterItem';

const FilterOptions = ({ filters }) => {

    const listContext = useContext(ListContext);
    const [filterObj, setFilterObj] = useState({});
    const [activeGroup, setActiveGroup] = useState(false);
    const [activeFilters, setActiveFilters] = useState([]);
    const [activeList, setActiveList] = useState([]);

    const isLoaded = listContext?.list?.length;

    useEffect(() => {
        createCheckboxes();
        // eslint-disable-next-line
    }, [isLoaded]);

    useEffect(() => {
        updateCheckboxes();
        // eslint-disable-next-line
    }, [activeFilters]);

    const createCheckboxes = () => {
        if (isLoaded) {
            let tempFilterObj = {};
            listContext.list.forEach(item => {
                filters.forEach(key => {
                    if (!tempFilterObj[key]) tempFilterObj[key] = [];
                    if (tempFilterObj[key].find(o => o.name === item[key])) {
                        tempFilterObj[key].find(o => o.name === item[key]).ids.push(item.id)
                    } else {
                        const filterItem = { name: item[key], ids: [item.id], checked: false, active: true };
                        tempFilterObj[key].push(filterItem)
                    }
                });

            })
            Object.entries(tempFilterObj).forEach(entry => {
                const [key, arr] = entry;
                const sortedArr = arr
                sortedArr.sort((a, b) => a.name.localeCompare(b.name))
                tempFilterObj[key] = sortedArr;
            })
            setFilterObj(tempFilterObj);
        }
    };

    const updateCheckboxes = () => {
        // Return if no filters
        if (Object.keys(activeFilters).every(function (key) { return activeFilters[key].length === 0 })) {
            Object.entries(filterObj).forEach(entry => {
                const [key] = entry;
                if (filterObj[key].some(item => item.active === false)) clearFilterObj();
            })
            return;
        }
        // Reset checkboxes if there is no additional filter group
        if (!activeFilters[activeGroup].length && activeGroup !== false) {
            clearFilterObj();
            return;
        }

        // Set active checkboxes
        const matchId = listContext.list.filter(element => {
            return activeFilters[activeGroup].includes(element[activeGroup])
        }).map(id => id.id);

        // Set state of checkboxes
        const newFilterObj = setActiveCheckboxes(matchId);
        setFilterObj(newFilterObj);
    };

    const setActiveCheckboxes = (matchId) => {
        let tempFilterObj = {};
        Object.entries(filterObj).forEach(entry => {
            const [key] = entry;
            let updatedArr = [];
            if (key === activeGroup) {
                updatedArr = filterObj[key];
            } else {
                filterObj[key].forEach(element => {
                    if (matchId.some(item => element.ids.includes(item))) {
                        // Enable matching checkboxes
                        element.active = true;
                    } else {
                        // Disable not matching checkboxes
                        element.checked = false;
                        element.active = false;
                        // Reset list if checkbox is checked and disabled
                        if (activeFilters[key]?.includes(element.name)) {
                            let updatedFilters = {};
                            Object.entries(activeFilters).forEach(entry => {
                                const [key, arr] = entry;
                                let updatedArr = arr;
                                updatedArr = updatedArr.filter(item => {
                                    return item !== element.name
                                })
                                updatedFilters[key] = updatedArr;
                            })
                            const matchList = listContext.list.filter(element => {
                                return activeFilters[activeGroup].includes(element[activeGroup]);
                            })
                            setActiveFilters(updatedFilters);
                            setActiveList(matchList);
                            listContext.sortList(matchList, listContext.activeSort);
                        }
                    }
                    updatedArr.push(element)
                })
            }
            tempFilterObj[key] = updatedArr;
        })
        return tempFilterObj;
    };

    const changeFilters = (e, checked) => {

        checked = !checked;
        const [group, value] = e.target.value.split('_');
        let temp = { ...filterObj };
        const index = temp[group].findIndex(e => e.name === value)
        temp[group][index].checked = checked;
        setFilterObj(temp);

        // Set active filters
        let currentActiveGroup = activeGroup;
        let filters = { ...activeFilters };
        if (checked) {
            if (Object.keys(filters).every(function (key) { return filters[key].length === 0 })) {
                setActiveGroup(group);
                currentActiveGroup = group;
            }
            if (!filters[group]?.length) filters[group] = [];
            filters[group].push(value);
            filters = { ...activeFilters, ...filters }
        } else {
            const index = filters[group].indexOf(value);
            if (index > -1) filters[group].splice(index, 1);
        }
        if (Object.keys(filters).every(function (key) { return filters[key].length === 0 })) {
            setActiveGroup(false);
        }

        // Set state of active filters and generate filters
        setActiveFilters(filters);
        generateFilters(checked, group, value, filters, currentActiveGroup);

    };

    const generateFilters = (checked, group, value, filters, currentActiveGroup) => {

        let currentList = [...activeList];

        // Set filtered list
        if (currentActiveGroup === group) {
            if(checked){
                const results = listContext.list.filter(element => {
                    return element[group] === value;
                });
                currentList = [...currentList, ...results]
            }else{
                currentList = currentList.filter(element => {
                    return element[group] !== value;
                });
            }
        }else{
        
            const arr = Object.entries(filters).find(element => element[0] === currentActiveGroup)[1];
            let matched = listContext.list.filter(element => {
                return arr.includes(element[currentActiveGroup]);
            });
        
            Object.entries(filters).forEach(element => {
                const [name, arr] = element;
                if(checked){
                    if (name === currentActiveGroup) return;
                }else{
                    if (name === currentActiveGroup || !arr.length) return;
                }
                matched = matched.filter(element => {
                    return arr.includes(element[name]);
                });
            });
            if (matched.length) currentList = matched;  
        }        

        // Set state of filtered list and generate
        setActiveList(currentList);
        if (!currentList.length) {
            listContext.sortList(listContext.list, listContext.activeSort);
            return;
        }
        listContext.sortList(currentList, listContext.activeSort);

    };

    const clearFilterObj = () => {
        setActiveGroup(false)
        let clearTempFilterObj = {};
        Object.entries(filterObj).forEach(entry => {
            const [key, arr] = entry;
            arr.forEach(element => element.checked = false);
            arr.forEach(element => element.active = true);
            clearTempFilterObj[key] = arr;
        })
        setFilterObj(clearTempFilterObj);
        setActiveFilters([]);
    };

    const createFilters = () => {

        return Object.entries(filterObj).map((entries) => {
            const [filterGroup, filterValues] = entries
            return (
                <div key={filterGroup} className={activeGroup === filterGroup ? 'filters__options__option --active' : 'filters__options__option'}>
                    <div className='filters__options__option__item --header'><span>{filterGroup}</span></div>
                    {
                        filterValues.map(value => {
                            return <FilterItem filter={value.name} active={value.active} key={value.name} group={filterGroup} handleChange={changeFilters} checked={value.checked} className='btn filters__options__option__item' />
                        })
                    }

                </div>
            );
        });

    };

    return (
        <>
            {isLoaded ? createFilters() : <div className='loading'><img src={`${process.env.PUBLIC_URL}/loader.gif`} alt="loader"></img></div>}
        </>
    )
}

export default FilterOptions