import React, { useState, useMemo, useEffect } from 'react';
import { 
  CheckCircle, 
  Circle, 
  Search,
  LayoutDashboard,
  ShieldCheck,
  RefreshCw,
  Heart,
  Copy,
  BookOpen,
  Award,
  Zap,
  ChevronRight,
  GanttChart
} from 'lucide-react';

/**
 * 경찰대학 졸업 학점 가이드 (44기 전용)
 * - 법학과 범죄수사학 트랙 등 세부 전공 반영
 * - UI 가독성 및 간격 최적화
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
      { id: 'l_coding', name: '코딩과알고리즘', credit: 2 },
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
      { id: 'le_e1', name: '비판적 사고와 논쟁', credit: 2 },
      { id: 'le_e2', name: '글로벌리더십', credit: 2 },
      { id: 'le_e3', name: '실용영어', credit: 2 },
    ]
  },
  generalMajor: {
    foundation: [
      { id: 'gf_1', name: '법학개론', credit: 2 }, { id: 'gf_2', name: '행정학개론', credit: 2 },
      { id: 'gf_3', name: '범죄학개론', credit: 2 }, { id: 'gf_4', name: '경찰학개론', credit: 2 },
      { id: 'gf_5', name: '수사학개론', credit: 3 }, { id: 'gf_6', name: '경찰행정법', credit: 3 },
      { id: 'gf_7', name: '헌법 I', credit: 3 }, { id: 'gf_8', name: '헌법 II', credit: 3, code: 'H' },
      { id: 'gf_9', name: '경찰민법 I', credit: 3 }, { id: 'gf_10', name: '조직행정론', credit: 3 },
      { id: 'gf_11', name: '인사행정론', credit: 3 }, { id: 'gf_12', name: '재무행정론', credit: 3 },
    ],
    mandatory: {
      law: [
        { id: 'lm_1', name: '일반행정법', credit: 3 }, 
        { id: 'lm_2', name: '법과학개론', credit: 2 }, 
        { id: 'lm_3', name: '기업법과 범죄', credit: 3 }, 
        { id: 'lm_4', name: '경찰민법 II', credit: 3 },
        { id: 'lm_5', name: '민사소송법', credit: 3 },
        { id: 'lm_6', name: '상법총칙', credit: 3 },
      ],
      admin: [
        { id: 'am_1', name: '사회과학방법론', credit: 3 }, 
        { id: 'am_2', name: '정책형성론', credit: 3 }, 
        { id: 'am_3', name: '정책평가론', credit: 2 }, 
        { id: 'am_4', name: '범죄예방론', credit: 3 },
        { id: 'am_5', name: '공공관리론', credit: 3 },
        { id: 'am_6', name: '지방행정론', credit: 3 },
      ]
    },
    // 법학 - 범죄수사학 트랙 전용 과목
    investigationTrack: [
        { id: 'it_1', name: '강력범죄수사론', credit: 3 },
        { id: 'it_2', name: '지능범죄수사론', credit: 3 },
        { id: 'it_3', name: '마약범죄수사론', credit: 2 },
        { id: 'it_4', name: '수사서류작성실무', credit: 2 },
        { id: 'it_5', name: '디지털포렌식실습', credit: 3 },
        { id: 'it_6', name: '증거법세미나', credit: 2 },
    ]
  },
  policeMajor: {
    foundation: [
      { id: 'pf_1', name: '형법총론', credit: 3 }, 
      { id: 'pf_2', name: '형법각론 I', credit: 3 }, 
      { id: 'pf_3', name: '형법각론 II', credit: 2 }, 
      { id: 'pf_4', name: '형사소송법 I', credit: 3 }, 
      { id: 'pf_5', name: '형사소송법 II', credit: 2 },
      { id: 'pf_6', name: '범죄수사론', credit: 3 },
    ],
    mandatory: [
      { id: 'pm_1', name: '생활안전론', credit: 2 }, 
      { id: 'pm_2', name: '범죄피해자보호론', credit: 2 }, 
      { id: 'pm_3', name: '경비경찰론', credit: 2 }, 
      { id: 'pm_4', name: '경찰교통론', credit: 2 },
      { id: 'pm_5', name: '경찰작전론', credit: 2 },
    ],
    mandatoryOption: [
      { id: 'pmo_1', name: '공공안녕정보론', credit: 2 }, 
      { id: 'pmo_2', name: '안보수사론', credit: 2 }, 
      { id: 'pmo_3', name: '국제경찰론', credit: 2 }, 
      { id: 'pmo_4', name: '경찰경무론', credit: 2 },
      { id: 'pmo_5', name: '사이버수사론', credit: 2 },
      { id: 'pmo_6', name: '과학수사론', credit: 2 },
    ],
    electives: [
      { id: 'pe_1', name: '경찰관직무집행법', credit: 2 }, 
      { id: 'pe_2', name: '범죄수사기법', credit: 2 },
      { id: 'pe_3', name: '자치경찰론', credit: 2 },
      { id: 'pe_4', name: '테러리즘론', credit: 2 },
      { id: 'pe_5', name: '소년범죄론', credit: 2 },
      { id: 'pe_6', name: '비교경찰론', credit: 2 },
      { id: 'pe_7', name: '범죄심리학', credit: 2 },
      { id: 'pe_8', name: '경찰통계학', credit: 2 },
    ]
  }
};

export default function App() {
  // --- State Management ---
  const [dept, setDept] = useState('law');
  const [track, setTrack] = useState('none'); // none, investigation(법학), publicAdmin(행정)
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

  // --- Local Storage ---
  useEffect(() => {
    const saved = localStorage.getItem('knpu_planner_data_v2');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setDept(parsed.dept || 'law');
        setTrack(parsed.track || 'none');
        setCompleted(new Set(parsed.completed || []));
        setServiceHours(parsed.serviceHours || 0);
        if (parsed.nonCredit) setNonCredit(parsed.nonCredit);
      } catch (e) { console.error(e); }
    }
  }, []);

  useEffect(() => {
    const dataToSave = { dept, track, completed: Array.from(completed), serviceHours, nonCredit };
    localStorage.setItem('knpu_planner_data_v2', JSON.stringify(dataToSave));
  }, [dept, track, completed, serviceHours, nonCredit]);

  // --- Calculations ---
  const stats = useMemo(() => {
    let counts = { total: 0, liberal: 0, genMajor: 0, polMajor: 0, r: 0, g: 0, h: 0, trackCredits: 0 };
    const all = [
      ...DATA_DEFINITION.liberal.mandatory, ...DATA_DEFINITION.liberal.electives,
      ...DATA_DEFINITION.generalMajor.foundation, 
      ...DATA_DEFINITION.generalMajor.mandatory.law, ...DATA_DEFINITION.generalMajor.mandatory.admin,
      ...DATA_DEFINITION.generalMajor.investigationTrack,
      ...DATA_DEFINITION.policeMajor.foundation, ...DATA_DEFINITION.policeMajor.mandatory, 
      ...DATA_DEFINITION.policeMajor.mandatoryOption, ...DATA_DEFINITION.policeMajor.electives
    ];
    
    completed.forEach(id => {
      const c = all.find(x => x.id === id);
      if (c) {
        counts.total += c.credit;
        if (id.startsWith('l') || id.startsWith('m')) counts.liberal += c.credit;
        else if (id.startsWith('gf') || id.startsWith('lm') || id.startsWith('am')) counts.genMajor += c.credit;
        else if (id.startsWith('it')) {
            counts.genMajor += c.credit;
            counts.trackCredits += c.credit;
        }
        else if (id.startsWith('p')) counts.polMajor += c.credit;
        
        if (c.code === 'R') counts.r += c.credit;
        if (c.code === 'G') counts.g += c.credit;
        if (c.code === 'H') counts.h += c.credit;
      }
    });
    return counts;
  }, [completed]);

  const toggleCourse = (id) => {
    const next = new Set(completed);
    if (next.has(id)) next.delete(id); else next.add(id);
    setCompleted(next);
  };

  const ProgressBar = ({ label, current, target, color = "bg-blue-600" }) => (
    <div className="mb-4 text-left group">
      <div className="flex justify-between text-[10px] font-black mb-1.5 text-slate-500 uppercase tracking-widest">
        <span>{label}</span>
        <span className={current >= target ? "text-emerald-600" : ""}>{current} / {target}</span>
      </div>
      <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-50">
        <div 
          className={`h-full transition-all duration-1000 ease-out ${current >= target ? 'bg-emerald-500' : color}`}
          style={{ width: `${Math.min(100, (current/target)*100)}%` }}
        />
      </div>
    </div>
  );

  const CourseItem = ({ course }) => {
    const isDone = completed.has(course.id);
    return (
      <button 
        onClick={() => toggleCourse(course.id)}
        className={`p-4 rounded-2xl border-2 transition-all flex items-center gap-4 w-full text-left mb-1 ${
          isDone ? 'bg-blue-50 border-blue-400 shadow-md translate-y-[-1px]' : 'bg-white border-slate-100 hover:border-slate-300'
        }`}
      >
        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
          isDone ? 'bg-blue-600 border-blue-600 text-white' : 'border-slate-200'
        }`}>
          {isDone && <CheckCircle size={16} strokeWidth={3} />}
        </div>
        <div className="flex-grow min-w-0">
          <div className={`text-sm font-bold truncate ${isDone ? 'text-blue-900' : 'text-slate-700'}`}>{course.name}</div>
          <div className="flex gap-2 mt-1">
            <span className="text-[10px] px-1.5 bg-slate-100 rounded text-slate-500 font-black">{course.credit}학점</span>
            {course.code && <span className="text-[10px] font-black text-blue-500 opacity-70">{course.code}-CODE</span>}
          </div>
        </div>
      </button>
    );
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans selection:bg-blue-100">
      <div className="max-w-6xl mx-auto p-4 md:p-12">
        
        {/* Header Section */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-8">
          <div className="flex items-center gap-5">
            <div className="bg-blue-900 p-3 rounded-2xl shadow-xl shadow-blue-200/50">
              <ShieldCheck className="text-white" size={36} />
            </div>
            <div className="text-left">
              <h1 className="text-3xl font-black tracking-tighter text-slate-900 leading-none mb-1">경찰대학 졸업 학점</h1>
              <p className="text-sm font-bold text-blue-600 uppercase tracking-widest">44기 졸업하자!</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
            <button onClick={() => setShowSyncModal(true)} className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-2xl text-xs font-black text-slate-600 hover:bg-slate-50 transition-all shadow-sm">
              <RefreshCw size={14} /> 데이터 백업
            </button>
            <div className="flex bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm w-full sm:w-auto">
              {['law', 'admin'].map(d => (
                <button 
                  key={d} onClick={() => { setDept(d); setTrack('none'); }}
                  className={`flex-1 sm:w-28 py-2.5 rounded-xl text-xs font-black transition-all ${dept === d ? 'bg-blue-900 text-white shadow-lg' : 'text-slate-400 hover:text-slate-500'}`}
                >
                  {d === 'law' ? '법학과' : '행정학과'}
                </button>
              ))}
            </div>
          </div>
        </header>

        {/* Track Selector (Law only for now) */}
        {dept === 'law' && (
          <div className="mb-10 p-5 bg-white rounded-3xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center gap-4 animate-in fade-in slide-in-from-top-4 duration-500">
             <div className="flex items-center gap-2 text-sm font-black text-slate-600 shrink-0">
               <GanttChart size={18} className="text-blue-500" /> 세부 전공 트랙:
             </div>
             <div className="flex flex-wrap gap-2 w-full">
               {['none', 'investigation'].map(t => (
                 <button 
                   key={t} onClick={() => setTrack(t)}
                   className={`px-5 py-2 rounded-xl text-xs font-bold border transition-all ${track === t ? 'bg-blue-600 border-blue-600 text-white shadow-md' : 'bg-slate-50 border-transparent text-slate-400 hover:bg-slate-100'}`}
                 >
                   {t === 'none' ? '일반 법학' : '범죄수사학 트랙'}
                 </button>
               ))}
             </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Sidebar */}
          <aside className="lg:col-span-4 space-y-8">
            <div className="bg-white rounded-[2rem] p-8 shadow-xl shadow-slate-200/50 border border-slate-100">
              <h2 className="text-lg font-black mb-8 flex items-center gap-2 uppercase tracking-tighter text-slate-700 text-left border-b pb-4">
                <LayoutDashboard size={20} className="text-blue-600" /> Summary
              </h2>
              <ProgressBar label="전체 총학점 (140)" current={stats.total} target={140} color="bg-indigo-600" />
              <div className="mt-8 space-y-2">
                <ProgressBar label="교양 영역 (38)" current={stats.liberal} target={38} />
                <ProgressBar label="일반전공 (64)" current={stats.genMajor} target={64} />
                <ProgressBar label="경찰전공 (38)" current={stats.polMajor} target={38} />
              </div>

              {track === 'investigation' && (
                <div className="mt-8 pt-6 border-t border-slate-50">
                  <ProgressBar label="수사학 트랙 학점" current={stats.trackCredits} target={15} color="bg-amber-500" />
                  <p className="text-[9px] text-slate-400 font-bold mt-1 leading-relaxed">* 수사학 트랙은 전공 선택 중 특정 수사 과목들을 이수해야 인정됩니다.</p>
                </div>
              )}
            </div>

            <div className="bg-white rounded-[2rem] p-8 shadow-xl shadow-slate-200/50 border border-slate-100 text-left">
              <h2 className="text-lg font-black mb-6 text-slate-700">졸업 요건 체크</h2>
              <div className="grid grid-cols-1 gap-1.5">
                {Object.keys(nonCredit).map(key => (
                  <button 
                    key={key} 
                    onClick={() => setNonCredit(prev => ({...prev, [key]: !prev[key]}))}
                    className={`flex items-center justify-between p-4 rounded-2xl text-[11px] font-bold border transition-all ${
                      nonCredit[key] ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-slate-50 border-transparent text-slate-400'
                    }`}
                  >
                    <span className="capitalize">{key.replace('_', ' ')}</span>
                    {nonCredit[key] ? <CheckCircle size={18} /> : <Circle size={18} />}
                  </button>
                ))}
              </div>
              <div className="mt-6 p-4 bg-slate-50 rounded-2xl">
                <div className="flex justify-between text-[10px] font-black mb-3 text-slate-500 uppercase tracking-widest">
                  <span>Volunteer ({serviceHours}/96H)</span>
                </div>
                <input 
                  type="range" min="0" max="150" value={serviceHours} 
                  onChange={(e) => setServiceHours(parseInt(e.target.value) || 0)}
                  className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-8 space-y-8">
            <div className="flex items-center gap-2 mb-4 bg-white p-2.5 rounded-2xl shadow-sm border border-slate-200 overflow-x-auto no-scrollbar">
              {['liberal', 'general', 'police'].map(tab => (
                <button 
                  key={tab} onClick={() => setActiveTab(tab)}
                  className={`px-8 py-3 rounded-xl text-xs font-black whitespace-nowrap transition-all uppercase tracking-widest ${
                    activeTab === tab ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  {tab === 'liberal' ? '교양' : tab === 'general' ? '일반전공' : '경찰전공'}
                </button>
              ))}
              <div className="ml-auto hidden sm:flex items-center bg-slate-100 rounded-xl px-4 py-2">
                <Search size={14} className="text-slate-400 mr-2" />
                <input 
                  type="text" 
                  placeholder="Search..." 
                  value={searchTerm} 
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-transparent text-xs font-bold outline-none w-28 md:w-32"
                />
              </div>
            </div>

            {/* 과목 리스트 - 탭 아래 충분한 여백 확보 */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in duration-700">
              {activeTab === 'liberal' && (
                <>
                  <div className="md:col-span-2 text-left text-[11px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2 px-2">
                    <BookOpen size={14} /> Mandatory & Martial Arts
                  </div>
                  {DATA_DEFINITION.liberal.mandatory.filter(c => c.name.includes(searchTerm)).map(c => <CourseItem key={c.id} course={c} />)}
                  <div className="md:col-span-2 text-left text-[11px] font-black text-slate-400 uppercase tracking-widest mt-8 mb-3 flex items-center gap-2 px-2">
                    <Award size={14} /> Elective Liberal Arts
                  </div>
                  {DATA_DEFINITION.liberal.electives.filter(c => c.name.includes(searchTerm)).map(c => <CourseItem key={c.id} course={c} />)}
                </>
              )}
              {activeTab === 'general' && (
                <>
                  <div className="md:col-span-2 text-left text-[11px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2 px-2">
                    <ShieldCheck size={14} /> Major Foundations (전공기초)
                  </div>
                  {DATA_DEFINITION.generalMajor.foundation.filter(c => c.name.includes(searchTerm)).map(c => <CourseItem key={c.id} course={c} />)}
                  
                  <div className="md:col-span-2 text-left text-[11px] font-black text-slate-400 uppercase tracking-widest mt-8 mb-3 flex items-center gap-2 px-2">
                    <Zap size={14} /> {dept === 'law' ? 'Law' : 'Admin'} Major Core (전공심화)
                  </div>
                  {DATA_DEFINITION.generalMajor.mandatory[dept].filter(c => c.name.includes(searchTerm)).map(c => <CourseItem key={c.id} course={c} />)}

                  {track === 'investigation' && (
                    <>
                      <div className="md:col-span-2 text-left text-[11px] font-black text-amber-500 uppercase tracking-widest mt-8 mb-3 flex items-center gap-2 px-2">
                        <Zap size={14} /> Investigation Track Specialized (범죄수사학 트랙)
                      </div>
                      {DATA_DEFINITION.generalMajor.investigationTrack.filter(c => c.name.includes(searchTerm)).map(c => <CourseItem key={c.id} course={c} />)}
                    </>
                  )}
                </>
              )}
              {activeTab === 'police' && (
                <>
                  <div className="md:col-span-2 text-left text-[11px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2 px-2">
                    <ShieldCheck size={14} /> Police Science Core (형사법 등)
                  </div>
                  {DATA_DEFINITION.policeMajor.foundation.filter(c => c.name.includes(searchTerm)).map(c => <CourseItem key={c.id} course={c} />)}
                  
                  <div className="md:col-span-2 text-left text-[11px] font-black text-slate-400 uppercase tracking-widest mt-8 mb-3 flex items-center gap-2 px-2">
                    <Zap size={14} /> Practical Police Studies (경찰실무)
                  </div>
                  {[...DATA_DEFINITION.policeMajor.mandatory, ...DATA_DEFINITION.policeMajor.mandatoryOption].filter(c => c.name.includes(searchTerm)).map(c => <CourseItem key={c.id} course={c} />)}
                </>
              )}
            </div>
            
            {/* 본문 하단 여백용 투명 div */}
            <div className="h-40"></div>
          </main>
        </div>
      </div>

      {/* Footer - 하단에 고정하되 본문 여백 확보 */}
      <footer className="fixed bottom-0 left-0 w-full bg-white/80 backdrop-blur-xl border-t border-slate-200 py-8 px-10 z-50">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1.5 flex items-center justify-center md:justify-start gap-1">
              Made with <Heart size={10} className="text-rose-500 fill-rose-500" /> by 
              <span className="text-slate-800 ml-1">경찰대학 44기 20240017 민유정</span>
            </div>
            <p className="text-[9px] text-slate-300 font-bold uppercase tracking-widest">© 2024 KNPU Graduation Management System</p>
          </div>
          
          <div className="flex items-center gap-10">
            <div className="flex flex-col items-end">
              <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-0.5">Total Progress</span>
              <div className="text-2xl font-black text-slate-900 tracking-tighter">
                {stats.total} <span className="text-sm text-slate-300">/ 140 학점</span>
              </div>
            </div>
            <div className="h-10 w-px bg-slate-200 hidden sm:block"></div>
            <div className="bg-blue-600 text-white px-8 py-3 rounded-2xl font-black text-sm shadow-xl shadow-blue-600/30">
              {Math.round((stats.total/140)*100)}% 완료
            </div>
          </div>
        </div>
      </footer>

      {/* Sync Modal */}
      {showSyncModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-[2.5rem] p-10 max-w-md w-full shadow-2xl border border-slate-100 text-left animate-in zoom-in-95 duration-300">
            <h3 className="text-2xl font-black mb-2 tracking-tighter">데이터 동기화</h3>
            <p className="text-xs text-slate-400 mb-8 font-bold uppercase tracking-tight">다른 기기에서 내 데이터를 불러오거나 내보냅니다.</p>
            
            <div className="space-y-6">
              <button 
                onClick={exportData}
                className="w-full py-5 bg-blue-900 text-white rounded-3xl font-black text-sm flex items-center justify-center gap-3 hover:bg-blue-800 transition-all shadow-xl shadow-blue-900/20"
              >
                <Copy size={18} /> 현재 데이터 코드로 복사
              </button>

              <div className="relative py-2 text-center">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100"></div></div>
                <div className="relative inline-block bg-white px-4 text-[10px] font-black text-slate-300 uppercase tracking-widest">OR</div>
              </div>

              <div>
                <textarea 
                  value={syncCode} 
                  onChange={(e) => setSyncCode(e.target.value)}
                  placeholder="복사한 코드를 여기에 붙여넣으세요..."
                  className="w-full h-32 p-5 bg-slate-50 border border-slate-100 rounded-3xl text-[10px] font-mono outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all mb-4"
                />
                <button 
                  onClick={importData}
                  className="w-full py-5 bg-slate-100 text-slate-600 rounded-3xl font-black text-sm flex items-center justify-center gap-3 hover:bg-slate-200 transition-all"
                >
                  <RefreshCw size={18} /> 코드에서 데이터 불러오기
                </button>
              </div>
            </div>

            <button 
              onClick={() => setShowSyncModal(false)}
              className="mt-8 w-full text-[11px] font-black text-slate-400 hover:text-slate-600 transition-all uppercase tracking-widest"
            >
              닫기
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
