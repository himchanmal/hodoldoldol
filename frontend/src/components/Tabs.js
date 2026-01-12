import React from 'react';
import {Box, Button} from '@mui/material';

function Tabs({tabs, activeTab, onTabChange}) {
  return (
    <Box sx={{width: '100%', borderBottom: 1, borderColor: 'divider', bgcolor: 'background.paper'}}>
      <Box sx={{display: 'flex', overflowX: 'auto'}}>
        {tabs.map((tab) => (
          <Button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            sx={{
              px: 3,
              py: 1.5,
              minWidth: 'auto',
              borderRadius: 0,
              borderBottom: activeTab === tab.id ? 2 : 0,
              borderColor: activeTab === tab.id ? 'primary.main' : 'transparent',
              color: activeTab === tab.id ? 'primary.main' : 'text.secondary',
              fontWeight: activeTab === tab.id ? 600 : 400,
              whiteSpace: 'nowrap',
              '&:hover': {
                bgcolor: 'rgba(0, 0, 0, 0.02)'
              }
            }}
          >
            {tab.label}
          </Button>
        ))}
      </Box>
    </Box>
  );
}

export default Tabs;
