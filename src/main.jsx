import React, { useState, useMemo, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { 
  CheckCircle, 
  Circle, 
  Search,
  LayoutDashboard,
  ShieldCheck,
  RefreshCw,
  Heart,
  Copy
} from 'lucide-react';

/**
 * KNPU GRAD TRACKER - 통합 버전
 * 이 코드를 src/main.jsx에 통째로 붙여넣으세요.
 */

const DATA_DEFINITION = {
  liberal: {
    mandatory: [
      { id: 'l_stat', name: '기초통계학', credit: 2, code: 'R' },
      { id: 'l_hist', name: '한국경찰사연구', credit: 2, code: 'R' },
      { id: 'l_ethic', name: '경찰윤리', credit: 2, code: 'R' },
      { id: 'l_psych', name: '심리학', credit: 3 },
      { id: 'l_econ', name: '경제학원론', credit: 3 },
      { id: 'l_leader', name: '리더십아카데미', credit: 2 },
      ...Array.from({ length: 8 }, (_, i) => ({ 
        id: `m_${i+1}`, 
        name: `무도 ${['I','II','III','IV','V','VI','VII','VIII'][i]}`, 
        credit: 1 
      }))
    ],
    electives: [
      { id: 'le_1', name: '공직자의 글쓰기', credit: 2, code: 'R' },
      { id: 'le_2', name: '논리와 비판적 사고', credit: 2, code: 'R' },
      { id: 'le_15', name: '성인지 관점의 이해', credit: 2, code: 'G' },
      { id: 'le_3', name: '사고와 표현 세미나', credit: 2, code: 'R' },
      { id: 'le_9', name: '한국사의 재조명', credit: 2, code: 'R' },
      { id: 'le_10', name: '세계문명의 충돌과 화해', credit: 2, code: 'R' },
    ]
  },
  generalMajor: {
    foundation: [
      { id: 'gf_1', name: '법학개론', credit: 2 }, { id: 'gf_2', name: '행정학개론', credit: 2 },
      { id: 'gf_3', name: '범죄학개론', credit: 2 }, { id: 'gf_4', name: '경찰학개론', credit: 2 },
      { id: 'gf_5', name: '수사학개론', credit: 3 }, { id: 'gf_6', name: '경찰행정법', credit: 3 },
      { id: 'gf_7', name: '헌법 I', credit: 3 }, { id: 'gf_8', name: '헌법 II', credit: 3, code: 'H' },
      { id: 'gf_9', name: '경찰민법 I(또는 민법총칙)', credit: 3 }, { id: 'gf_10', name: '조직행정론', credit: 3 },
      { id: 'gf_11', name: '인사행정론', credit: 3 }, { id: 'gf_12', name: '재무행정론', credit: 3 },
    ],
    mandatory: {
      law: [{ id: 'lm_1', name: '일반행정법', credit: 3 }, { id: 'lm_2', name: '법과학개론', credit: 2 }, { id: 'lm_3', name: '기업법과 범죄', credit: 3 }, { id: 'lm_4', name: '경찰민법 II', credit: 3 }],
      admin: [{ id: 'am_1', name: '사회과학방법론', credit: 3 }, { id: 'am_2', name: '정책형성론', credit: 3 }, { id: 'am_3', name: '정책평가론', credit: 2 }, { id: 'am_4', name: '범죄예방론', credit: 3 }]
    },
    electives: {
      law: [{ id: 'le_l1', name: '전공심화세미나 I', credit: 2 }, { id: 'le_l2', name: '전공심화세미나 II', credit: 2 }, { id: 'le_l3', name: '경찰과 인권', credit: 2, code: 'H' }],
      admin: [{ id: 'le_a1', name: '전공심화세미나 I', credit: 2 }, { id: 'le_a2', name: '전공심화세미나 II', credit: 2 }, { id: 'le_a3', name: '자치행정론', credit: 2 }]
    }
  },
  policeMajor: {
    foundation: [
      { id: 'pf_1', name: '형법총론', credit: 3 }, { id: 'pf_2', name: '형법각론 I', credit: 3 }, { id: 'pf_3', name: '형법각론 II', credit: 2 }, { id: 'pf_4', name: '형사소송법 I', credit: 3 }, { id: 'pf_5', name: '형사소송법 II', credit: 2 },
    ],
    mandatory: [
      { id: 'pm_1', name: '생활안전론', credit: 2 }, { id: 'pm_2', name: '범죄피해자보호론', credit: 2 }, { id: 'pm_3', name: '경비경찰/대테러', credit: 2 }, { id: 'pm_4', name: '경찰교통론', credit: 2 },
    ],
    mandatoryOption: [
      { id: 'pmo_1', name: '공공안녕정보론', credit: 2 }, { id: 'pmo_2', name: '안보수사론', credit: 2 }, { id: 'pmo_3', name: '국제경찰론', credit: 2 }, { id: 'pmo_4', name: '경찰경무론', credit: 2 },
    ],
    electives: [{ id: 'pe_1', name: '경찰관직무집행법', credit: 2 }, { id: 'pe_2', name: '범죄수사기법', credit: 2 }]
  }
};

function App() {
  const [dept, setDept] = useState('law');
  const [completed, setCompleted] = useState(new Set());
  const [serviceHours, setServiceHours] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('liberal');
  const [showSyncModal, setShowSyncModal] = useState(false);
  const [syncCode, setSyncCode] = useState('');
  const [nonCredit, setNonCredit] = useState({
    shooting: false, language: false, it: false, license: false,
    practice: false, martialArts: false, physical: false,
    thesis_plan: false, thesis_mid: false, thesis_final: false
  });

  useEffect(() => {
    const savedData = localStorage.getItem('knpu_planner_data');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        setDept(parsed.dept || 'law');
        setCompleted(new Set(parsed.completed || []));
        setServiceHours(parsed.serviceHours || 0);
        if (parsed.nonCredit) setNonCredit(parsed.nonCredit);
      } catch (e) { console.error(e); }
    }
  }, []);

  useEffect(() => {
    const dataToSave = { dept, completed: Array.from(completed), serviceHours, nonCredit };
    localStorage.setItem('knpu_planner_data', JSON.stringify(dataToSave));
  }, [dept, completed, serviceHours, nonCredit]);

  const stats = useMemo(() => {
    let counts = { total: 0, liberal: 0, genMajor: 0, polMajor: 0, r: 0, g: 0, h: 0 };
    const all = [
      ...DATA_DEFINITION.liberal.mandatory, ...DATA_DEFINITION.liberal.electives,
      ...DATA_DEFINITION.generalMajor.foundation, 
      ...DATA_DEFINITION.generalMajor.mandatory.law, ...DATA_DEFINITION.generalMajor.mandatory.admin,
      ...DATA_DEFINITION.generalMajor.electives.law, ...DATA_DEFINITION.generalMajor.electives.admin,
      ...DATA_DEFINITION.policeMajor.foundation, ...DATA_DEFINITION.policeMajor.mandatory, 
      ...DATA_DEFINITION.policeMajor.mandatoryOption, ...DATA_DEFINITION.policeMajor.electives
    ];
    completed.forEach(id => {
      const c = all.find(x => x.id === id);
      if (c) {
        counts.total += c.credit;
        if (id.startsWith('l') || id.startsWith('m')) counts.liberal += c.credit;
        else if (id.startsWith('gf') || id.startsWith('lm') || id.startsWith('am') || id.startsWith('le_l') || id.startsWith('le_a')) counts.genMajor += c.credit;
        else if (id.startsWith('p')) counts.polMajor += c.credit;
        if (c.code === 'R') counts.r += c.credit;
        if (c.code === 'G') counts.g += c.credit;
        if (c.code === 'H') counts.h += c.credit;
      }
    });
    return counts;
  }, [completed]);

  const ProgressBar = ({ label, current, target }) => (
    <div className="mb-4 text-left">
      <div className="flex justify-between text-[10px] font-black mb-1 text-slate-500 uppercase">
        <span>{label}</span>
        <span>{current} / {target}</span>
      </div>
      <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
        <div className="h-full bg-blue-600 transition-all duration-700" style={{ width: `${Math.min(100, (current/target)*100)}%` }} />
      </div>
    </div>
  );

  const CourseItem = ({ course }) => {
    const isDone = completed.has(course.id);
    return (
      <button onClick={() => {
        const next = new Set(completed);
        if (next.has(course.id)) next.delete(course.id); else next.add(course.id);
        setCompleted(next);
      }} className={`p-3 rounded-xl border-2 transition-all flex items-center gap-3 w-full mb-2 ${isDone ? 'bg-blue-50 border-blue-400' : 'bg-white border-slate-100'}`}>
        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${isDone ? 'bg-blue-600 border-blue-600 text-white' : 'border-slate-300'}`}>
          {isDone && <CheckCircle size={14} />}
        </div>
        <div className="text-left">
          <div className="text-sm font-bold">{course.name}</div>
          <div className="text-[10px] text-slate-400">{course.credit}학점 {course.code && `| ${course.code}-CODE`}</div>
        </div>
      </button>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-10 pb-24 font-sans">
      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-center mb-10">
          <div className="flex items-center gap-3">
            <ShieldCheck className="text-blue-900" size={32} />
            <h1 className="text-2xl font-black">KNPU GRAD TRACKER</h1>
          </div>
          <div className="flex bg-white p-1 rounded-xl border border-slate-200">
            {['law', 'admin'].map(d => (
              <button key={d} onClick={() => setDept(d)} className={`px-4 py-2 rounded-lg text-xs font-bold ${dept === d ? 'bg-blue-900 text-white' : 'text-slate-400'}`}>
                {d === 'law' ? '법학과' : '행정학과'}
              </button>
            ))}
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <aside className="lg:col-span-4 space-y-6">
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
              <h2 className="text-lg font-black mb-4 flex items-center gap-2"><LayoutDashboard size={20}/> Summary</h2>
              <ProgressBar label="전체 학점" current={stats.total} target={140} />
              <ProgressBar label="교양" current={stats.liberal} target={38} />
              <ProgressBar label="일반전공" current={stats.genMajor} target={64} />
              <ProgressBar label="경찰전공" current={stats.polMajor} target={38} />
            </div>
          </aside>

          <main className="lg:col-span-8">
            <div className="flex gap-2 mb-6">
              {['liberal', 'general', 'police'].map(tab => (
                <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-2 rounded-xl text-xs font-bold ${activeTab === tab ? 'bg-blue-600 text-white' : 'bg-white text-slate-500'}`}>
                  {tab === 'liberal' ? '교양' : tab === 'general' ? '일반전공' : '경찰전공'}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {activeTab === 'liberal' && DATA_DEFINITION.liberal.mandatory.map(c => <CourseItem key={c.id} course={c} />)}
              {activeTab === 'general' && DATA_DEFINITION.generalMajor.foundation.map(c => <CourseItem key={c.id} course={c} />)}
              {activeTab === 'police' && DATA_DEFINITION.policeMajor.foundation.map(c => <CourseItem key={c.id} course={c} />)}
            </div>
          </main>
        </div>
      </div>
      <footer className="fixed bottom-0 left-0 w-full bg-white/80 border-t p-4 flex justify-between items-center px-10">
        <div className="text-[10px] font-bold text-slate-400">Made by 민유정 (경찰대학 44기)</div>
        <div className="font-black text-blue-600">{stats.total} / 140 학점 완료</div>
      </footer>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<React.StrictMode><App /></React.StrictMode>);
