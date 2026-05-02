import React, { useMemo, useState } from 'react';
import './openclaw-copilot.css';

type AgentStatus = 'idle' | 'ready' | 'busy';

type Agent = {
  id: string;
  name: string;
  status: AgentStatus;
  color: string;
};

type TaskStep = {
  id: string;
  title: string;
  status: 'done' | 'running' | 'pending';
};

const agents: Agent[] = [
  { id: 'one', name: 'One', status: 'ready', color: '#e2a79b' },
  { id: 'leo', name: 'Leo', status: 'ready', color: '#8db7e8' },
  { id: 'coder', name: 'Coder', status: 'busy', color: '#90d0a6' },
  { id: 'researcher', name: 'Researcher', status: 'idle', color: '#b9a0ff' },
];

const steps: TaskStep[] = [
  { id: 'analysis', title: '需求分析', status: 'done' },
  { id: 'search', title: '搜索参考素材', status: 'done' },
  { id: 'storyboard', title: '生成分镜', status: 'done' },
  { id: 'generate', title: '生成视频', status: 'running' },
  { id: 'export', title: '导出最终视频', status: 'pending' },
];

function AgentAvatar({ agent }: { agent: Agent }) {
  return <span className="oc-avatar" style={{ background: agent.color }}>{agent.name.slice(0, 1)}</span>;
}

export default function OpenClawCopilotLayout() {
  const [activeAgentId, setActiveAgentId] = useState('one');
  const activeAgent = useMemo(() => agents.find((item) => item.id === activeAgentId) ?? agents[0], [activeAgentId]);

  return (
    <div className="oc-shell">
      <aside className="oc-left">
        <div className="oc-brand">OpenClaw</div>
        <button className="oc-primary">＋ 新建任务</button>

        <nav className="oc-nav">
          {['工作台', '对话', '任务', '项目', '模板', '知识库', '工具集', '设置'].map((item) => (
            <button key={item} className="oc-nav-item">{item}</button>
          ))}
        </nav>

        <section className="oc-agents">
          <div className="oc-section-title">我的 Agents <span>＋</span></div>
          {agents.map((agent) => (
            <button
              key={agent.id}
              className={`oc-agent-row ${agent.id === activeAgentId ? 'active' : ''}`}
              onClick={() => setActiveAgentId(agent.id)}
            >
              <AgentAvatar agent={agent} />
              <span>{agent.name}</span>
              <small>{agent.status === 'busy' ? '忙碌' : agent.status === 'ready' ? '就绪' : '空闲'}</small>
            </button>
          ))}
        </section>

        <div className="oc-version">OpenClaw v0.1.0</div>
      </aside>

      <main className="oc-center">
        <header className="oc-topbar">
          <div className="oc-tab">{activeAgent.name}</div>
          <div className="oc-title">任务：视频生成 - 城市夜景</div>
          <button className="oc-mode">自动模式</button>
        </header>

        <div className="oc-chat">
          <div className="oc-message user">
            <span className="oc-user-avatar">用</span>
            <div className="oc-bubble">帮我生成一个赛博朋克风格的城市夜景短视频，时长 8 秒，16:9，镜头带运镜。</div>
          </div>

          <div className="oc-message agent">
            <AgentAvatar agent={activeAgent} />
            <div className="oc-task-card">
              <div className="oc-task-title">{activeAgent.name} 正在执行任务</div>
              {steps.map((step) => (
                <div key={step.id} className={`oc-step ${step.status}`}>
                  <span>{step.status === 'done' ? '✓' : step.status === 'running' ? '◌' : '□'}</span>
                  <span>{step.title}</span>
                </div>
              ))}
              <div className="oc-preview-strip">
                <div />
                <div />
                <div />
              </div>
              <div className="oc-progress"><span style={{ width: '60%' }} /></div>
              <small>生成中... 60%</small>
            </div>
          </div>

          <div className="oc-message agent">
            <AgentAvatar agent={activeAgent} />
            <div className="oc-result-card">
              <div className="oc-thumb" />
              <div>
                <strong>video_preview.mp4</strong>
                <p>8.0s · 16:9 · 25MB</p>
              </div>
              <button>播放</button>
            </div>
          </div>
        </div>

        <footer className="oc-inputbar">
          <button>＋</button>
          <input placeholder={`发送消息给 ${activeAgent.name}...`} />
          <select value={activeAgentId} onChange={(event) => setActiveAgentId(event.target.value)}>
            {agents.map((agent) => <option key={agent.id} value={agent.id}>{agent.name}</option>)}
          </select>
          <button className="oc-send">➜</button>
        </footer>
      </main>

      <aside className="oc-right">
        <section className="oc-panel">
          <h3>项目成员</h3>
          <div className="oc-member"><span className="oc-user-avatar">用</span><span>OpenClaw 用户（你）</span><small>Owner</small></div>
          {agents.slice(0, 2).map((agent) => <div className="oc-member" key={agent.id}><AgentAvatar agent={agent} /><span>{agent.name}</span><small>Agent</small></div>)}
        </section>

        <section className="oc-panel">
          <h3>任务状态</h3>
          <div className="oc-status-card">
            <strong>视频生成 - 城市夜景</strong>
            <div className="oc-progress"><span style={{ width: '60%' }} /></div>
            {steps.map((step) => <div key={step.id} className={`oc-step ${step.status}`}><span>{step.status === 'done' ? '✓' : step.status === 'running' ? '◌' : '□'}</span>{step.title}</div>)}
          </div>
        </section>

        <section className="oc-panel">
          <h3>上下文</h3>
          <div className="oc-context-item">📄 Notebook - Page 1</div>
          <div className="oc-context-item">🖼 参考图 - 城市夜景.png</div>
          <div className="oc-context-item">📝 脚本 - cyberpunk.txt</div>
        </section>

        <section className="oc-actions">
          <button>添加参考文件</button>
          <button>创建新任务</button>
          <button>调用工具</button>
          <button>打开设置</button>
        </section>
      </aside>
    </div>
  );
}
