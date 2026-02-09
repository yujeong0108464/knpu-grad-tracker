import React, { useState, useMemo, useEffect } from 'react';
import { 
  CheckCircle, 
  Circle, 
  Info, 
  LayoutDashboard, 
  BookOpen, 
  Award, 
  Clock,
  Search,
  Settings2,
  AlertTriangle,
  FileText,
  ShieldCheck,
  Save,
  Copy,
  Download,
  Upload,
  RefreshCw,
  Heart
} from 'lucide-react';

const App = () => {
  // --- State Management ---
  const [dept, setDept] = useState('law');
  const [track, setTrack] = useState('none');
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

  // --- Local Storage Logic ---
  useEffect(() => {
    const savedData = localStorage.getItem('knpu_planner_data');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        setDept(parsed.dept || 'law');
        setTrack(parsed.track || 'none');
        setCompleted(new Set(parsed.completed || []));
        setServiceHours(parsed.serviceHours || 0);
        setNonCredit(parsed.nonCredit || {});
      } catch (e) {
        console.error("Failed to load saved data.");
      }
    }
  }, []);

  useEffect(() => {
    const dataToSave = {
      dept,
      track,
      completed: Array.from(completed),
      serviceHours,
      nonCredit
    };
    localStorage.setItem('knpu_planner_data', JSON.stringify(dataToSave));
  }, [dept, track, completed, serviceHours, nonCredit]);

  // --- Sync Logic ---
  const exportData = () => {
    const data = localStorage.getItem('knpu_planner_data');
    const encoded = btoa(encodeURIComponent(data));
    setSyncCode(encoded);
    
    const textArea = document.createElement("textarea");
    textArea.value = encoded;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
    
    alert("내 진행 데이터가 코드로 복사되었습니다! 메모장이나 다른 기기에 붙여넣으세요.");
  };

  const importData = () => {
    if (!syncCode) return alert("코드를 입력해주세요.");
    try {
      const decoded = decodeURIComponent(atob(syncCode));
      const parsed = JSON.parse(decoded);
      setDept(parsed.dept);
      setTrack(parsed.track);
      setCompleted(new Set(parsed.completed));
      setServiceHours(parsed.serviceHours);
      setNonCredit(parsed.nonCredit);
      setShowSyncModal(false);
      alert("데이터를 성공적으로 불러왔습니다!");
    } catch (e) {
      alert("올바르지 않은 코드입니다.");
    }
  };

  // --- Data Definition ---
  const data = {
    liberal: {
      mandatory: [
        { id: 'l_stat', name: '기초통계학', credit: 2, code: 'R' },
        { id: 'l_hist', name: '한국경찰사연구', credit: 2, code: 'R' },
        { id: 'l_ethic', name: '경찰윤리', credit: 2, code: 'R' },
        { id: 'l_psych', name: '심리학', credit: 3 },
        { id: 'l_econ', name: '경제학원론', credit: 3 },
        { id: 'l_leader', name: '리더십아카데미', credit: 2 },
        ...Array.from({ length: 8 }, (_, i) => ({ id: `m_${i+1}`, name: `무도 ${['I','II','III','IV','V','VI','VII','VIII'][i]}`, credit: 1 }))
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

  const stats = useMemo(() => {
    let counts = { total: 0, liberal: 0, genMajor: 0, polMajor: 0, r: 0, g: 0, h: 0, track: 0 };
    const all = [
      ...data.liberal.mandatory, ...data.liberal.electives,
      ...data.generalMajor.foundation, ...data.generalMajor.mandatory.law, ...data.generalMajor.mandatory.admin,
      ...data.generalMajor.electives.law, ...data.generalMajor.electives.admin,
      ...data.policeMajor.foundation, ...data.policeMajor.mandatory, ...data.policeMajor.mandatoryOption, ...data.policeMajor.electives
    ];
    completed.forEach(id => {
      const c = all.find(x => x.id === id);
      if (c) {
        counts.total += c.credit;
        if (id.startsWith('l') || id.startsWith('m')) counts.liberal += c.credit;
        else if (id.startsWith('gf') || id.startsWith('lm') || id.startsWith('am') || id.startsWith('le_l') || id.startsWith('le_a')) {
          counts.genMajor += c.credit;
          if (dept === 'law' && id.startsWith('le_l')) counts.track += c.credit;
          if (dept === 'admin' && id.startsWith('le_a')) counts.track += c.credit;
        }
        else if (id.startsWith('p')) counts.polMajor += c.credit;
        if (c.code === 'R') counts.r += c.credit;
        if (c.code === 'G') counts.g += c.credit;
        if (c.code === 'H') counts.h += c.credit;
      }
    });
    return counts;
  }, [completed, dept]);

  const toggleCourse = (id) => {
    const next = new Set(completed);
    if (next.has(id)) next.delete(id); else next.add(id);
    setCompleted(next);
  };

  const ProgressBar = ({ label, current, target }) => (
    <div className="mb-4">
      <div className="flex justify-between text-[10px] font-black mb-1 text-slate-500 uppercase tracking-tighter">
        <span>{label}</span>
        <span className={current >= target ? "text-emerald-600" : ""}>{current} / {target}</span>
      </div>
      <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-50">
        <div 
          className={`h-full transition-all duration-700 ${current >= target ? 'bg-emerald-500' : 'bg-blue-600'}`}
          style={{ width: `${Math.min(100, (current/target)*100)}%` }}
        />
      </div>
    </div>
  );

  const CourseItem = ({ course }) => {
    const isDone = completed.has(course.id);
    return (
      <div 
        onClick={() => toggleCourse(course.id)}
        className={`p-3 rounded-xl border-2 transition-all cursor-pointer flex items-center gap-3 ${
          isDone ? 'bg-blue-50 border-blue-400 text-blue-900 shadow-sm' : 'bg-white border-slate-100 hover:border-slate-300'
        }`}
      >
        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${isDone ? 'bg-blue-600 border-blue-600 text-white' : 'border-slate-300'}`}>
          {isDone && <CheckCircle size={14} strokeWidth={3} />}
        </div>
        <div className="flex-grow min-w-0 text-left">
          <div className="text-sm font-bold truncate">{course.name}</div>
          <div className="flex gap-1 mt-0.5">
            <span className="text-[9px] px-1 bg-slate-100 rounded text-slate-500 font-bold">{course.credit}학점</span>
            {course.code && <span className={`text-[9px] px-1 rounded font-bold ${course.code === 'R' ? 'bg-purple-100 text-purple-600' : course.code === 'G' ? 'bg-pink-100 text-pink-600' : 'bg-emerald-100 text-emerald-600'}`}>{course.code}-CODE</span>}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans p-4 md:p-10 pb-24">
      <div className="max-w-6xl mx-auto">
        
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
          <div className="flex items-center gap-4">
            <div className="bg-blue-900 p-2.5 rounded-2xl shadow-lg shadow-blue-200"><ShieldCheck className="text-white" size={32} /></div>
            <div className="text-left">
              <h1 className="text-2xl font-black tracking-tighter leading-none mb-1">KNPU GRAD TRACKER</h1>
              <p className="text-xs font-bold text-slate-400">데이터가 브라우저에 자동 저장됩니다.</p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <button 
              onClick={() => setShowSyncModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-black text-slate-600 hover:bg-slate-50 transition-all shadow-sm"
            >
              <RefreshCw size={14} /> 데이터 백업/복구
            </button>
            <div className="flex bg-white p-1 rounded-2xl border border-slate-200 shadow-sm flex-grow md:flex-grow-0">
              {['law', 'admin'].map(d => (
                <button 
                  key={d} onClick={() => setDept(d)}
                  className={`flex-1 md:w-24 py-2 rounded-xl text-xs font-black transition-all ${dept === d ? 'bg-blue-900 text-white shadow-md' : 'text-slate-400'}`}
                >
                  {d === 'law' ? '법학과' : '행정학과'}
                </button>
              ))}
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Sidebar */}
          <aside className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-3xl p-8 shadow-xl shadow-slate-200/50 border border-slate-100 text-left">
              <h2 className="text-lg font-black mb-6 flex items-center gap-2 uppercase tracking-tighter text-slate-700">
                <LayoutDashboard size={20} className="text-blue-600" /> Summary
              </h2>
              <ProgressBar label="Total Credits" current={stats.total} target={140} />
              <ProgressBar label="Liberal Arts" current={stats.liberal} target={38} />
              <ProgressBar label="General Major" current={stats.genMajor} target={64} />
              <ProgressBar label="Police Science" current={stats.polMajor} target={38} />

              <div className="mt-8 pt-6 border-t grid grid-cols-3 gap-2">
                {[{l:'R',c:stats.r,t:12, cl:'purple'}, {l:'H',c:stats.h,t:2, cl:'emerald'}, {l:'G',c:stats.g,t:2, cl:'pink'}].map(item => (
                  <div key={item.l}>
                    <div className={`text-sm font-black text-${item.cl}-600`}>{item.c}/{item.t}</div>
                    <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{item.l}-CODE</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-3xl p-8 shadow-xl shadow-slate-200/50 border border-slate-100 text-left">
              <h2 className="text-lg font-black mb-4 text-slate-700">Requirement Check</h2>
              <div className="grid grid-cols-1 gap-1.5">
                {Object.keys(nonCredit).map(key => (
                  <div 
                    key={key} onClick={() => setNonCredit(prev => ({...prev, [key]: !prev[key]}))}
                    className={`flex items-center justify-between p-3 rounded-xl text-[11px] font-bold border transition-all cursor-pointer ${nonCredit[key] ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-slate-50 border-transparent text-slate-400'}`}
                  >
                    <span className="capitalize">{key.replace('_', ' ')}</span>
                    {nonCredit[key] ? <CheckCircle size={16} /> : <Circle size={16} />}
                  </div>
                ))}
              </div>
              <div className="mt-4">
                <div className="flex justify-between text-[10px] font-black mb-2 text-slate-500">
                  <span>Volunteer Hours ({serviceHours}/96H)</span>
                </div>
                <input 
                  type="range" min="0" max="150" value={serviceHours} 
                  onChange={(e) => setServiceHours(parseInt(e.target.value))}
                  className="w-full h-1 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-8 space-y-6">
            <div className="flex items-center gap-2 mb-4 bg-white p-2 rounded-2xl shadow-sm border border-slate-200 overflow-x-auto no-scrollbar">
              {['liberal', 'general', 'police'].map(tab => (
                <button 
                  key={tab} onClick={() => setActiveTab(tab)}
                  className={`px-6 py-2 rounded-xl text-xs font-black whitespace-nowrap transition-all uppercase tracking-widest ${activeTab === tab ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  {tab === 'liberal' ? '교양' : tab === 'general' ? '일반전공' : '경찰전공'}
                </button>
              ))}
              <div className="ml-auto flex items-center bg-slate-100 rounded-xl px-3 py-1.5">
                <Search size={14} className="text-slate-400 mr-2" />
                <input 
                  type="text" placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-transparent text-xs font-bold outline-none w-24 md:w-32"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {activeTab === 'liberal' && (
                <>
                  <div className="md:col-span-2 text-left text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] mb-1">Mandatory</div>
                  {data.liberal.mandatory.filter(c => c.name.includes(searchTerm)).map(c => <CourseItem key={c.id} course={c} />)}
                  <div className="md:col-span-2 text-left text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] mt-4 mb-1">Electives</div>
                  {data.liberal.electives.filter(c => c.name.includes(searchTerm)).map(c => <CourseItem key={c.id} course={c} />)}
                </>
              )}
              {activeTab === 'general' && (
                <>
                  <div className="md:col-span-2 text-left text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] mb-1">Foundation</div>
                  {data.generalMajor.foundation.filter(c => c.name.includes(searchTerm)).map(c => <CourseItem key={c.id} course={c} />)}
                  <div className="md:col-span-2 text-left text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] mt-4 mb-1">Major Core & Selection</div>
                  {[...data.generalMajor.mandatory[dept], ...data.generalMajor.electives[dept]].filter(c => c.name.includes(searchTerm)).map(c => <CourseItem key={c.id} course={c} />)}
                </>
              )}
              {activeTab === 'police' && (
                <>
                  <div className="md:col-span-2 text-left text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] mb-1">Police Science Core</div>
                  {data.policeMajor.foundation.filter(c => c.name.includes(searchTerm)).map(c => <CourseItem key={c.id} course={c} />)}
                  <div className="md:col-span-2 text-left text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] mt-4 mb-1">Mandatory & Options</div>
                  {[...data.policeMajor.mandatory, ...data.policeMajor.mandatoryOption, ...data.policeMajor.electives].filter(c => c.name.includes(searchTerm)).map(c => <CourseItem key={c.id} course={c} />)}
                </>
              )}
            </div>
          </main>
        </div>
      </div>

      {/* Footer Info with Creator Name */}
      <footer className="fixed bottom-0 left-0 w-full bg-white/80 backdrop-blur-md border-t border-slate-100 p-4 z-50">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1">
             Made with <Heart size={10} className="text-red-500 fill-red-500" /> by <span className="text-slate-700">경찰대학 44기 20240017 민유정</span>
          </div>
          <div className="text-xs font-black text-slate-900 flex items-center gap-4">
             <span>Total: {stats.total}/140</span>
             <span className="text-blue-600">{Math.round((stats.total/140)*100)}% Complete</span>
          </div>
        </div>
      </footer>

      {/* Sync Modal */}
      {showSyncModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl border border-slate-100 text-left">
            <h3 className="text-xl font-black mb-2 tracking-tighter">데이터 동기화</h3>
            <p className="text-xs text-slate-400 mb-6 font-bold uppercase tracking-tight">다른 기기에서 내 데이터를 불러오거나 내보냅니다.</p>
            
            <div className="space-y-6">
              <div>
                <button 
                  onClick={exportData}
                  className="w-full py-4 bg-blue-900 text-white rounded-2xl font-black text-sm flex items-center justify-center gap-2 hover:bg-blue-800 transition-all shadow-lg"
                >
                  <Copy size={16} /> 현재 데이터 코드로 복사
                </button>
              </div>

              <div className="relative py-2">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100"></div></div>
                <div className="relative flex justify-center text-[10px] font-black uppercase text-slate-300 bg-white px-2">OR</div>
              </div>

              <div>
                <textarea 
                  value={syncCode} onChange={(e) => setSyncCode(e.target.value)}
                  placeholder="복사한 코드를 여기에 붙여넣으세요..."
                  className="w-full h-24 p-4 bg-slate-50 border border-slate-100 rounded-2xl text-[10px] font-mono outline-none focus:ring-2 focus:ring-blue-500 transition-all mb-3"
                />
                <button 
                  onClick={importData}
                  className="w-full py-4 bg-slate-100 text-slate-600 rounded-2xl font-black text-sm flex items-center justify-center gap-2 hover:bg-slate-200 transition-all"
                >
                  <RefreshCw size={16} /> 코드에서 데이터 불러오기
                </button>
              </div>
            </div>

            <button 
              onClick={() => setShowSyncModal(false)}
              className="mt-6 w-full text-[10px] font-black text-slate-300 hover:text-slate-500 transition-all"
            >
              닫기
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
