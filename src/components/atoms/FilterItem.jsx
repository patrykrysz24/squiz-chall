import React from 'react'

const FilterItem = ({ filter, group, checked, active, className, handleChange}) => {

    return (
        <div className={checked ? `btn --active ${className}` : active ? className : `btn --disabled ${className}`}>
            <label><span>{filter}</span><input type="checkbox" value={`${group}_${filter}`} onChange={e => handleChange(e, checked)} checked={checked} disabled={!active} /></label>
        </div>
    )
}

export default FilterItem