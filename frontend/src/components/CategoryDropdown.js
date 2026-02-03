import React, {useState, useEffect, memo} from 'react';
import {Box, Select, MenuItem, FormControl} from '@mui/material';
import {useCategoryContext} from '../contexts/CategoryContext.js';

const CategoryDropdown = memo(function CategoryDropdown({onCategoryChange, selectedMajor, selectedMinor, disabled = false}) {
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

  // MUI Select는 value가 반드시 옵션 목록에 있어야 함. 카테고리 로딩 전/삭제된 카테고리면 ''로 표시
  const safeMajorValue = majorCategory && majorCategories.includes(majorCategory) ? majorCategory : '';
  const safeMinorValue = minorCategory && minorCategories.includes(minorCategory) ? minorCategory : '';

  return (
    <Box sx={{display: 'flex', gap: 1}}>
      <FormControl
        size="small"
        sx={{
          flex: 1,
          '& .MuiOutlinedInput-root': {
            bgcolor: 'background.paper',
            '&:hover fieldset': {
              borderColor: 'primary.main'
            }
          }
        }}
        disabled={disabled}
      >
        <Select
          value={safeMajorValue}
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
          flex: 1,
          '& .MuiOutlinedInput-root': {
            bgcolor: 'background.paper'
          }
        }}
        disabled={disabled || !majorCategory}
      >
        <Select
          value={safeMinorValue}
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
