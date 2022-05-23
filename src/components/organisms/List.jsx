import React, { useState } from 'react'

import DataList from '../mollecules/DataList'
import SortingOptions from '../mollecules/SortingOptions'
import FilterOptions from '../mollecules/FilterOptions'

const List = () => {

	const [openSort, setOpenSort] = useState(false);
	const [openFilters, setOpenFilters] = useState(false);

	const handleClick = (type) => {
		switch (type) {
			case 'sorting':
				setOpenSort(!openSort);
				break;
			case 'filters':
				setOpenFilters(!openFilters);
				break;
			default:
				setOpenSort(false);
				setOpenFilters(false);
				break;
		}
	};

	return (
		
		<div className='content'>

			<div className='sort-filter-wrapper'>

				<div className='buttons'>
					<button onClick={() => handleClick('sorting')} type='button' className='btn --inverse'>Sorting</button>
					<button onClick={() => handleClick('filters')} type='button' className='btn --inverse'>Filters</button>
				</div>

				<div className={openSort ? 'sort --active' : 'sort'}>
					<div className='sort__options'>
						<button className='filters__options__close' onClick={() => handleClick()}>&#10005;</button>
						<SortingOptions />
					</div>
				</div>

				<div className={openFilters ? 'filters --active' : 'filters'}>
					<div className='filters__options'>
						<button className='filters__options__close' onClick={() => handleClick()}>&#10005;</button>
						{/* Pass filter properties to component*/}
						<FilterOptions filters={['country', 'industry']} />
					</div>
				</div>

			</div>

			<div className='list'>
				<DataList />
			</div>

		</div>
	)
}

export default List