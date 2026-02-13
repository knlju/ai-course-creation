import { Box, Container, Typography } from '@mui/material';
import Head from 'next/head';
import CourseGenerationForm from '../src/components/CourseGenerationForm';

export default function HomePage() {
  return (
    <>
      <Head>
        <title>Course creation form</title>
      </Head>
      <Box sx={{ minHeight: '100vh', py: 5 }}>
        <Container maxWidth="xl">
          <Typography variant="h3" mb={3}>
            Course creation workflow
          </Typography>
          <CourseGenerationForm />
        </Container>
      </Box>
    </>
  );
}
