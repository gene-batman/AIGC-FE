'use client'

import { useState } from 'react';
import { Box, Container, Tab, Tabs, Typography } from '@mui/material'

import Tasks from '../components/tasks'
import Text2Img from '../components/text2img'
import Img2Img from '../components/img2img'

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export default function Main() {
  const [value, setValue] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <main className='min-h-screen'>
      <Container sx={{ height: '100%' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
            <Tab label="Home" {...a11yProps(0)} />
            <Tab label="Text2Img" {...a11yProps(1)} />
            <Tab label="Img2Img" {...a11yProps(2)} />
          </Tabs>
        </Box>
        <CustomTabPanel value={value} index={0}>
          <Tasks />
        </CustomTabPanel>
        <CustomTabPanel value={value} index={1}>
          <Text2Img />
        </CustomTabPanel>
        <CustomTabPanel value={value} index={2}>
          <Img2Img />
        </CustomTabPanel>
      </Container>
    </main>
  )
}
