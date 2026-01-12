import React, {useState} from 'react';
import {
  Box,
  Typography,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  CircularProgress,
  Alert
} from '@mui/material';
import {Add, Edit, Delete} from '@mui/icons-material';
import {useCategories} from '../hooks/useCategories.js';

function CategoryPage() {
  const {categories, majorCategories, loading, error, addCategory, deleteCategory, updateCategory} = useCategories();
  const [openDialog, setOpenDialog] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({mainCategory: '', subCategory: ''});

  const handleOpenAdd = () => {
    setEditingCategory(null);
    setFormData({mainCategory: '', subCategory: ''});
    setOpenDialog(true);
  };

  const handleOpenEdit = (categoryId, mainCategory, subCategory) => {
    setEditingCategory({id: categoryId, mainCategory, subCategory});
    setFormData({mainCategory, subCategory});
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingCategory(null);
    setFormData({mainCategory: '', subCategory: ''});
  };

  const handleSubmit = async () => {
    if (!formData.mainCategory || !formData.subCategory) {
      alert('대분류와 소분류를 모두 입력해주세요.');
      return;
    }

    const result = editingCategory?.id
      ? await updateCategory(editingCategory.id, formData.mainCategory, formData.subCategory)
      : await addCategory(formData.mainCategory, formData.subCategory);

    if (result.success) {
      handleCloseDialog();
    } else {
      alert('오류가 발생했습니다: ' + result.error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('정말 삭제하시겠습니까?')) {
      await deleteCategory(id);
    }
  };

  if (loading) {
    return (
      <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px'}}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box>
        <Alert severity="error">데이터를 불러오는 중 오류가 발생했습니다: {error}</Alert>
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3}}>
        <Typography variant="h5" sx={{fontWeight: 600, color: 'text.primary'}}>
          카테고리 관리
        </Typography>
        <Button variant="contained" startIcon={<Add />} onClick={handleOpenAdd}>
          카테고리 추가
        </Button>
      </Box>

      <Paper elevation={1}>
        <Box sx={{overflowX: 'auto'}}>
          <Table>
            <TableHead>
              <TableRow sx={{bgcolor: 'grey.100'}}>
                <TableCell sx={{fontWeight: 600, textAlign: 'center'}}>대분류</TableCell>
                <TableCell colSpan={6} sx={{fontWeight: 600, textAlign: 'center'}}>소분류</TableCell>
                <TableCell sx={{fontWeight: 600, textAlign: 'center', minWidth: 100}}>관리</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {majorCategories.map((major) => (
                <TableRow key={major} sx={{'&:hover': {bgcolor: 'grey.50'}}}>
                  <TableCell sx={{fontWeight: 500, textAlign: 'center', minWidth: 140, bgcolor: 'grey.50'}}>
                    {major}
                  </TableCell>
                  {categories[major]?.map((item, index) => (
                    <TableCell key={item.id} sx={{textAlign: 'center', minWidth: 120, position: 'relative'}}>
                      {item.sub_category}
                      <IconButton
                        size="small"
                        sx={{position: 'absolute', right: 4, top: '50%', transform: 'translateY(-50%)'}}
                        onClick={() => handleOpenEdit(item.id, major, item.sub_category)}
                      >
                        <Edit fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        sx={{position: 'absolute', right: 32, top: '50%', transform: 'translateY(-50%)'}}
                        onClick={() => handleDelete(item.id)}
                      >
                        <Delete fontSize="small" />
                      </IconButton>
                    </TableCell>
                  ))}
                  {Array(Math.max(0, 6 - (categories[major]?.length || 0)))
                    .fill(null)
                    .map((_, index) => (
                      <TableCell key={`empty-${index}`} sx={{textAlign: 'center', minWidth: 120}}></TableCell>
                    ))}
                  <TableCell sx={{textAlign: 'center'}}></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </Paper>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{editingCategory ? '카테고리 수정' : '카테고리 추가'}</DialogTitle>
        <DialogContent>
          <Box sx={{display: 'flex', flexDirection: 'column', gap: 2, pt: 1}}>
            <TextField
              label="대분류"
              value={formData.mainCategory}
              onChange={(e) => setFormData({...formData, mainCategory: e.target.value})}
              fullWidth
            />
            <TextField
              label="소분류"
              value={formData.subCategory}
              onChange={(e) => setFormData({...formData, subCategory: e.target.value})}
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>취소</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingCategory ? '수정' : '추가'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default CategoryPage;
