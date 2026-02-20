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

  // 선택된 값이 목록에 없어도 표시 (카테고리 수정 직후). 바뀐 이름을 포함한 전체 옵션이 보이도록 하고 중복만 제거
  const majorOptions = majorCategory && !majorCategories.includes(majorCategory)
    ? [majorCategory, ...majorCategories.filter((c) => c !== majorCategory)]
    : majorCategories;
  const minorOptions = minorCategory && !minorCategories.includes(minorCategory)
    ? [minorCategory, ...minorCategories.filter((c) => c !== minorCategory)]
    : minorCategories;

  // MUI Select는 value가 반드시 옵션 목록에 있어야 함. 위에서 목록에 없으면 옵션에 추가해 둠
  const safeMajorValue = majorCategory && majorOptions.includes(majorCategory) ? majorCategory : '';
  const safeMinorValue = minorCategory && minorOptions.includes(minorCategory) ? minorCategory : '';

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
          {majorOptions.map((category) => (
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
          {minorOptions.map((category) => (
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
