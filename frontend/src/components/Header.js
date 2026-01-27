import React, {useState} from 'react';
import {AppBar, Toolbar, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Box} from '@mui/material';
import {useAuth} from '../contexts/AuthContext.js';

function Header() {
  const {isAuthenticated, setAuth} = useAuth();
  const [openDialog, setOpenDialog] = useState(false);
  const [token, setToken] = useState('');

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setToken('');
  };

  const handleLogin = () => {
    if (!token.trim()) {
      alert('토큰을 입력해주세요.');
      return;
    }

    localStorage.setItem('auth_token', token.trim());
    setAuth(true);
    handleCloseDialog();
  };

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    setAuth(false);
    handleCloseDialog();
  };

  return (
    <>
      <AppBar position="sticky" sx={{bgcolor: 'primary.main', borderRadius: 0}}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{flexGrow: 1, textAlign: 'center', fontWeight: 500}}>
            호돌이와 돌돌이 가계부
          </Typography>
          <Button
            variant="outlined"
            size="small"
            onClick={handleOpenDialog}
            sx={{
              bgcolor: 'background.paper',
              color: 'text.primary',
              '&:hover': {
                bgcolor: 'background.default'
              }
            }}
          >
            누구냐 넌
          </Button>
        </Toolbar>
      </AppBar>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="xs" fullWidth>
        <DialogTitle>{isAuthenticated ? '인증 정보' : '토큰 입력'}</DialogTitle>
        <DialogContent>
          {isAuthenticated ? (
            <Box sx={{py: 2}}>
              <Typography variant="body2" color="text.secondary">
                인증된 사용자입니다.
              </Typography>
            </Box>
          ) : (
            <TextField
              autoFocus
              margin="dense"
              label="토큰"
              type="text"
              fullWidth
              variant="outlined"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleLogin();
                }
              }}
              sx={{mt: 1}}
            />
          )}
        </DialogContent>
        <DialogActions>
          {isAuthenticated ? (
            <Button onClick={handleLogout} color="error">
              로그아웃
            </Button>
          ) : (
            <>
              <Button onClick={handleCloseDialog}>취소</Button>
              <Button onClick={handleLogin} variant="contained">
                확인
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>
    </>
  );
}

export default Header;
