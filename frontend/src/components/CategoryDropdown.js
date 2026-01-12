import React, {useState, useEffect, memo} from 'react';
import {Box, Select, MenuItem, FormControl} from '@mui/material';
import {useCategoryContext} from '../contexts/CategoryContext.js';

const CategoryDropdown = memo(function CategoryDropdown({onCategoryChange, selectedMajor, selectedMinor}) {
  const {getCategoriesForDropdown, majorCategories} = useCategoryContext();
  const categories = getCategoriesForDropdown();
  
  const [majorCategory, setMajorCategory] = useState(selectedMajor || '');
  const [minorCategory, setMinorCategory] = useState(selectedMinor || '');

  useEffect(() => {
    setMajorCategory(selectedMajor || '');
    setMinorCategory(selectedMinor || '');
  }, [selectedMajor, selectedMinor]);

  const handleMajorChange = (e) => {
    const major = e.target.value;
    setMajorCategory(major);
    setMinorCategory('');
    onCategoryChange({major, minor: ''});
  };

  const handleMinorChange = (e) => {
    const minor = e.target.value;
    setMinorCategory(minor);
    onCategoryChange({major: majorCategory, minor});
  };

  const minorCategories = majorCategory ? (categories[majorCategory] || []) : [];

  return (
    <Box sx={{display: 'flex', gap: 1.5}}>
      <FormControl
        size="small"
        sx={{
          minWidth: 130,
          '& .MuiOutlinedInput-root': {
            bgcolor: 'background.paper',
            '&:hover fieldset': {
              borderColor: 'primary.main'
            }
          }
        }}
      >
        <Select
          value={majorCategory}
          onChange={handleMajorChange}
          displayEmpty
        >
          <MenuItem value="" disabled>
            <em>대분류 선택</em>
          </MenuItem>
          {majorCategories.map((category) => (
            <MenuItem key={category} value={category}>
              {category}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl
        size="small"
        sx={{
          minWidth: 130,
          '& .MuiOutlinedInput-root': {
            bgcolor: 'background.paper'
          }
        }}
        disabled={!majorCategory}
      >
        <Select
          value={minorCategory}
          onChange={handleMinorChange}
          displayEmpty
        >
          <MenuItem value="" disabled>
            <em>소분류 선택</em>
          </MenuItem>
          {minorCategories.map((category) => (
            <MenuItem key={category} value={category}>
              {category}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
});

export default CategoryDropdown;
