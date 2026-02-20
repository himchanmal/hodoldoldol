import React, {useState, useMemo} from 'react';
import {
  Box,
  Typography,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  CircularProgress,
  Alert
} from '@mui/material';
import {Add, MoreVert, Edit, Delete} from '@mui/icons-material';
import {useCategoryContext} from '../contexts/CategoryContext.js';
import {useAuth} from '../contexts/AuthContext.js';
import {AUTH_REQUIRED_MESSAGE, isAuthError} from '../utils/error.js';

function CategoryPage({onCategoryUpdated}) {
  const {categories, majorCategories, loading, error, addCategory, deleteCategory, updateCategory} = useCategoryContext();
  const {canWrite} = useAuth();
  const [openDialog, setOpenDialog] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({mainCategory: '', subCategory: ''});
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [menuTarget, setMenuTarget] = useState(null);

  const handleOpenAdd = () => {
    setEditingCategory(null);
    setFormData({mainCategory: '', subCategory: ''});
    setOpenDialog(true);
  };

  const handleOpenEdit = (categoryId, mainCategory, subCategory) => {
    if (!canWrite) {
      alert(AUTH_REQUIRED_MESSAGE);
      return;
    }
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
    if (!canWrite) {
      alert(AUTH_REQUIRED_MESSAGE);
      return;
    }

    if (!formData.mainCategory || !formData.subCategory) {
      alert('대분류와 소분류를 모두 입력해주세요.');
      return;
    }

    const main = formData.mainCategory.trim();
    const sub = formData.subCategory.trim();
    if (!main || !sub) {
      alert('대분류와 소분류를 입력해주세요.');
      return;
    }

    // 대분류/소분류 조합 중복 검사
    const subList = categories[main] || [];
    const isDuplicate = subList.some(
      (item) =>
        item.sub_category === sub &&
        (editingCategory?.id ? item.id !== editingCategory.id : true)
    );
    if (isDuplicate) {
      alert('이미 존재하는 대분류/소분류 조합입니다.');
      return;
    }

    try {
      const result = editingCategory?.id
        ? await updateCategory(editingCategory.id, main, sub)
        : await addCategory(main, sub);

      if (result.success) {
        if (editingCategory?.id) onCategoryUpdated?.();
        handleCloseDialog();
      } else {
        alert('오류가 발생했습니다: ' + result.error);
      }
    } catch (error) {
      alert(isAuthError(error) ? error.message : '오류가 발생했습니다: ' + error.message);
    }
  };

  const handleDelete = async (id) => {
    if (!canWrite) {
      alert(AUTH_REQUIRED_MESSAGE);
      return;
    }

    if (window.confirm('정말 삭제하시겠습니까?')) {
      try {
        await deleteCategory(id);
        onCategoryUpdated?.();
      } catch (error) {
        alert(isAuthError(error) ? error.message : '오류가 발생했습니다: ' + error.message);
      }
    }
  };

  const handleOpenMenu = (e, item) => {
    e.stopPropagation();
    setMenuAnchor(e.currentTarget);
    setMenuTarget({id: item.id, major: item.major, sub: item.sub_category});
  };

  const handleCloseMenu = () => {
    setMenuAnchor(null);
    setMenuTarget(null);
  };

  const handleMenuEdit = () => {
    if (menuTarget) handleOpenEdit(menuTarget.id, menuTarget.major, menuTarget.sub);
    handleCloseMenu();
  };

  const handleMenuDelete = () => {
    if (menuTarget) handleDelete(menuTarget.id);
    handleCloseMenu();
  };

  // 카테고리 데이터 가나다 순으로 정렬
  const sortedMajorCategories = useMemo(() => {
    return [...majorCategories].sort((a, b) => a.localeCompare(b, 'ko'));
  }, [majorCategories]);

  const sortedCategories = useMemo(() => {
    const sorted = {};
    sortedMajorCategories.forEach(major => {
      if (categories[major]) {
        sorted[major] = [...categories[major]].sort((a, b) => 
          a.sub_category.localeCompare(b.sub_category, 'ko')
        );
      }
    });
    return sorted;
  }, [categories, sortedMajorCategories]);

  // 최대 소분류 개수 계산
  const maxSubCategoryCount = useMemo(() => {
    if (!sortedMajorCategories.length) return 0;
    return Math.max(...sortedMajorCategories.map(major => sortedCategories[major]?.length || 0));
  }, [sortedMajorCategories, sortedCategories]);

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
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography
          variant="h6"
          sx={{ fontWeight: 600, color: "text.primary" }}
        >
          카테고리 관리
        </Typography>
        <Button
          variant="outlined"
          size="small"
          startIcon={<Add />}
          onClick={handleOpenAdd}
          disabled={!canWrite}
        >
          카테고리 추가
        </Button>
      </Box>


      <Box sx={{ overflowX: "auto" }}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: "grey.100" }}>
              <TableCell
                sx={{ fontWeight: 600, textAlign: "center", px: 1, py: 0.75 }}
              >
                대분류
              </TableCell>
              <TableCell
                colSpan={maxSubCategoryCount || 1}
                sx={{ fontWeight: 600, textAlign: "center", px: 1, py: 0.75 }}
              >
                소분류
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedMajorCategories.map((major) => {
              const subCategories = sortedCategories[major] || [];
              const emptyCellCount =
                maxSubCategoryCount - subCategories.length;
              return (
                <TableRow
                  key={major}
                  sx={{ "&:hover": { bgcolor: "grey.50" } }}
                >
                  <TableCell
                    sx={{
                      fontWeight: 500,
                      textAlign: "center",
                      minWidth: 140,
                      bgcolor: "grey.50",
                      px: 1,
                      py: 0.75,
                    }}
                  >
                    {major}
                  </TableCell>
                  {subCategories.map((item) => (
                    <TableCell
                      key={item.id}
                      sx={{
                        textAlign: "center",
                        whiteSpace: "nowrap",
                        py: 1,
                        px: 0,
                      }}
                    >
                      <Box
                        sx={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 0.5,
                        }}
                      >
                        <span>{item.sub_category}</span>
                        <IconButton
                          size="small"
                          sx={{ p: 0.25 }}
                          onClick={(e) => handleOpenMenu(e, {...item, major})}
                          disabled={!canWrite}
                          aria-label="카테고리 메뉴"
                        >
                          <MoreVert fontSize="small" />
                        </IconButton>
                      </Box>
                    </TableCell>
                  ))}
                  {Array(emptyCellCount)
                    .fill(null)
                    .map((_, index) => (
                      <TableCell
                        key={`empty-${index}`}
                        sx={{ textAlign: "center", px: 1, py: 0.75 }}
                      ></TableCell>
                    ))}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Box>

      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={handleCloseMenu}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        PaperProps={{ sx: { minWidth: 80 } }}
      >
        <MenuItem onClick={handleMenuEdit} dense>
          <ListItemIcon sx={{ "& .MuiSvgIcon-root": { fontSize: 16 } }}>
            <Edit />
          </ListItemIcon>
          <ListItemText primary="수정" primaryTypographyProps={{ fontSize: "14" }} />
        </MenuItem>
        <MenuItem onClick={handleMenuDelete} dense sx={{ color: "error.main" }}>
          <ListItemIcon sx={{ color: "inherit", "& .MuiSvgIcon-root": { fontSize: 16 } }}>
            <Delete />
          </ListItemIcon>
          <ListItemText primary="삭제" primaryTypographyProps={{ fontSize: "14" }} />
        </MenuItem>
      </Menu>

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {editingCategory ? "카테고리 수정" : "카테고리 추가"}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 1 }}>
            <TextField
              label="대분류"
              value={formData.mainCategory}
              onChange={(e) =>
                setFormData({ ...formData, mainCategory: e.target.value })
              }
              fullWidth
            />
            <TextField
              label="소분류"
              value={formData.subCategory}
              onChange={(e) =>
                setFormData({ ...formData, subCategory: e.target.value })
              }
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>취소</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingCategory ? "수정" : "추가"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default CategoryPage;
