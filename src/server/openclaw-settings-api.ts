import express from 'express';
import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);
const router = express.Router();

const openclawDir = path.join(os.homedir(), '.openclaw');
const workspaceDir = path.join(openclawDir, 'workspace');
const envPath = path.join(openclawDir, '.env');

async function readText(filePath: string) {
  try {
    return await fs.readFile(filePath, 'utf8');
  } catch {
    return '';
  }
}

async function runOpenClaw(args: string[]) {
  const { stdout } = await execFileAsync('openclaw', args, { timeout: 30000 });
  return stdout;
}

router.get('/api/openclaw/prompts', async (_req, res) => {
  res.json({
    soulPrompt: await readText(path.join(workspaceDir, 'SOUL.md')),
    agentPrompt: await readText(path.join(workspaceDir, 'AGENTS.md')),
    userProfile: await readText(path.join(workspaceDir, 'USER.md')),
  });
});

router.put('/api/openclaw/prompts', async (req, res) => {
  const { soulPrompt = '', agentPrompt = '', userProfile = '' } = req.body ?? {};
  await fs.mkdir(workspaceDir, { recursive: true });
  await fs.writeFile(path.join(workspaceDir, 'SOUL.md'), soulPrompt, 'utf8');
  await fs.writeFile(path.join(workspaceDir, 'AGENTS.md'), agentPrompt, 'utf8');
  await fs.writeFile(path.join(workspaceDir, 'USER.md'), userProfile, 'utf8');
  res.json({ ok: true });
});

router.get('/api/openclaw/config', async (_req, res) => {
  const stdout = await runOpenClaw(['gateway', 'call', 'config.get', '--params', '{}']);
  res.type('json').send(stdout);
});

router.patch('/api/openclaw/config', async (req, res) => {
  const { providerId, baseUrl, apiKey, primaryModel, fallbackModels = [] } = req.body ?? {};

  if (!providerId || !baseUrl || !primaryModel) {
    return res.status(400).json({ error: 'providerId, baseUrl, primaryModel are required' });
  }

  await fs.mkdir(openclawDir, { recursive: true });

  const envName = `${String(providerId).toUpperCase()}_API_KEY`;
  if (apiKey) {
    const currentEnv = await readText(envPath);
    const nextLine = `${envName}=${apiKey}`;
    const filtered = currentEnv
      .split('\n')
      .filter((line) => !line.startsWith(`${envName}=`))
      .join('\n');
    await fs.writeFile(envPath, `${filtered}\n${nextLine}\n`, 'utf8');
  }

  const configPayload = JSON.parse(await runOpenClaw(['gateway', 'call', 'config.get', '--params', '{}']));
  const baseHash = configPayload?.payload?.hash ?? configPayload?.hash;

  const modelId = `${providerId}/${primaryModel}`;
  const patch = {
    models: {
      providers: {
        [providerId]: {
          baseUrl,
          apiKey: `\${${envName}}`,
        },
      },
    },
    agents: {
      defaults: {
        model: {
          primary: modelId,
          fallbacks: fallbackModels,
        },
        models: {
          [modelId]: { alias: primaryModel },
        },
      },
    },
  };

  const stdout = await runOpenClaw([
    'gateway',
    'call',
    'config.patch',
    '--params',
    JSON.stringify({ raw: JSON.stringify(patch), baseHash }),
  ]);

  res.type('json').send(stdout);
});

router.post('/api/openclaw/system-event', async (req, res) => {
  const { text } = req.body ?? {};
  if (!text) return res.status(400).json({ error: 'text is required' });

  await runOpenClaw(['system', 'event', '--text', text, '--mode', 'now']);
  res.json({ ok: true });
});

router.get('/api/openclaw/agents', async (_req, res) => {
  res.json({
    agents: [
      { id: 'one', name: 'One', status: 'idle', role: 'general' },
      { id: 'leo', name: 'Leo', status: 'idle', role: 'planner' },
      { id: 'coder', name: 'Coder', status: 'busy', role: 'coding' },
      { id: 'researcher', name: 'Researcher', status: 'idle', role: 'research' },
    ],
  });
});

export default router;
