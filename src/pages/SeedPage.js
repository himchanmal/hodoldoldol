import React, {useState} from 'react';
import {Box, Button, Typography, Paper, Alert} from '@mui/material';
import {seedCategories} from '../utils/seedCategories.js';

function SeedPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleSeed = async () => {
    if (!window.confirm('기존 카테고리 데이터를 Supabase에 넣으시겠습니까?')) {
      return;
    }

    setLoading(true);
    setResult(null);

    const seedResult = await seedCategories();
    setResult(seedResult);
    setLoading(false);
  };

  return (
    <Box sx={{p: 3}}>
      <Typography variant="h5" sx={{mb: 3, fontWeight: 600}}>
        초기 데이터 설정
      </Typography>
      <Paper sx={{p: 3}}>
        <Typography variant="body1" sx={{mb: 2}}>
          기존 카테고리 데이터를 Supabase 데이터베이스에 넣습니다.
        </Typography>
        <Button
          variant="contained"
          onClick={handleSeed}
          disabled={loading}
          sx={{mb: 2}}
        >
          {loading ? '처리 중...' : '카테고리 데이터 넣기'}
        </Button>
        {result && (
          <Alert severity={result.success ? 'success' : 'error'}>
            {result.success
              ? '카테고리 데이터가 성공적으로 추가되었습니다!'
              : `오류: ${result.error?.message || '알 수 없는 오류'}`}
          </Alert>
        )}
      </Paper>
    </Box>
  );
}

export default SeedPage;
