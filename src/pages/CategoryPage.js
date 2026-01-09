import React from 'react';
import {Box, Typography, Table, TableHead, TableBody, TableRow, TableCell, Paper} from '@mui/material';
import {categories, majorCategories} from '../data/categories.js';

function CategoryPage() {
  return (
    <Box>
      <Typography variant="h5" sx={{mb: 3, fontWeight: 600, color: 'text.primary'}}>
        카테고리 관리
      </Typography>
      <Paper elevation={1}>
        <Box sx={{overflowX: 'auto'}}>
          <Table>
            <TableHead>
              <TableRow sx={{bgcolor: 'grey.100'}}>
                <TableCell sx={{fontWeight: 600, textAlign: 'center'}}>대분류</TableCell>
                <TableCell colSpan={6} sx={{fontWeight: 600, textAlign: 'center'}}>소분류</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {majorCategories.map((major) => (
                <TableRow key={major} sx={{'&:hover': {bgcolor: 'grey.50'}}}>
                  <TableCell sx={{fontWeight: 500, textAlign: 'center', minWidth: 140, bgcolor: 'grey.50'}}>
                    {major}
                  </TableCell>
                  {categories[major].map((minor, index) => (
                    <TableCell key={index} sx={{textAlign: 'center', minWidth: 120}}>
                      {minor}
                    </TableCell>
                  ))}
                  {Array(Math.max(0, 6 - categories[major].length))
                    .fill(null)
                    .map((_, index) => (
                      <TableCell key={`empty-${index}`} sx={{textAlign: 'center', minWidth: 120}}></TableCell>
                    ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </Paper>
    </Box>
  );
}

export default CategoryPage;
