import { Box, Container, Stack, Typography } from '@mui/material';
import Head from 'next/head';
import CourseGenerationForm from '../src/components/CourseGenerationForm';
import { uiTokens } from '../src/lib/designTokens';

export default function HomePage() {
  return (
    <>
      <Head>
        <title>Course creation form</title>
      </Head>
      <Box sx={{ minHeight: '100vh', py: { xs: 3, md: 5 } }}>
        <Container
          maxWidth={false}
          sx={{
            maxWidth: uiTokens.layout.contentMaxWidth,
            px: { xs: uiTokens.layout.mobilePadding, md: uiTokens.layout.desktopPadding },
          }}
        >
          <Stack spacing={1.5} mb={4}>
            <Typography component="h1" variant="h1">
              Course creation workflow
            </Typography>
            <Typography color="text.secondary">
              Define your audience and context, choose a structure, and generate a complete course in one guided flow.
            </Typography>
          </Stack>
          <CourseGenerationForm />
        </Container>
      </Box>
    </>
  );
}
