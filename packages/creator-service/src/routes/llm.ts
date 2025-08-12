import { Router } from 'express';
import { ideationPrompt, structuringPrompt, contentGenerationPrompt, refinementPrompt } from 'llm-service';

const router = Router();

router.post('/packs/:id/ideation', async (req, res) => {
  const { id } = req.params;
  const { idea } = req.body;
  const output = await ideationPrompt(idea);
  res.json({ packId: id, output });
});

router.post('/packs/:id/structure', async (req, res) => {
  const { id } = req.params;
  const { context } = req.body;
  const output = await structuringPrompt(context);
  res.json({ packId: id, output });
});

router.post('/packs/:id/content', async (req, res) => {
  const { id } = req.params;
  const { topic } = req.body;
  const output = await contentGenerationPrompt(topic);
  res.json({ packId: id, output });
});

router.post('/packs/:id/refinement', async (req, res) => {
  const { id } = req.params;
  const { feedback } = req.body;
  const output = await refinementPrompt(feedback);
  res.json({ packId: id, output });
});

export default router;