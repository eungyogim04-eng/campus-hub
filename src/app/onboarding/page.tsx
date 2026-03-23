'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { DEPARTMENTS } from '@/types'
import { ToastProvider, useToast } from '@/components/ui/Toast'

function OnboardingContent() {
  const [step, setStep] = useState(0)
  const [name, setName] = useState('')
  const [selectedDept, setSelectedDept] = useState<string | null>(null)
  const { updateProfile } = useAuth()
  const router = useRouter()
  const { showToast } = useToast()

  const handleNext = () => {
    if (step === 1 && !name.trim()) return
    setStep(step + 1)
  }

  const handleFinish = async () => {
    if (!selectedDept) return
    await updateProfile({
      name: name.trim(),
      department: selectedDept,
      onboarded: true,
    })
    showToast(`🎉 환영해요, ${name}님! ${selectedDept} 맞춤 정보를 확인해보세요`)
    router.push('/')
    router.refresh()
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg)]" style={{ animation: 'fadeIn .3s ease' }}>
      <div className="bg-[var(--sur)] rounded-2xl p-10 w-[480px] max-w-[95vw] shadow-xl text-center">
        {/* Progress dots */}
        <div className="flex gap-1.5 justify-center mb-7">
          {[0, 1, 2].map(i => (
            <div key={i} className={`w-2 h-2 rounded-full transition-colors ${i <= step ? 'bg-[var(--p)]' : 'bg-[var(--bor2)]'}`} />
          ))}
        </div>

        {step === 0 && (
          <div>
            <div className="text-5xl mb-4">🎓</div>
            <div className="text-[22px] font-bold mb-2">캠퍼스 허브에 오신 걸 환영해요!</div>
            <div className="text-sm text-[var(--tx2)] leading-relaxed mb-7">공모전·자격증·대외활동 정보를 한 곳에서.<br />딱 1분이면 설정 완료돼요.</div>
            <button className="btn w-full justify-center py-3" onClick={handleNext}>시작하기 →</button>
          </div>
        )}

        {step === 1 && (
          <div>
            <div className="text-5xl mb-4">👋</div>
            <div className="text-[22px] font-bold mb-2">이름을 알려주세요</div>
            <div className="text-sm text-[var(--tx2)] mb-7">대시보드 인사말에 사용돼요</div>
            <input
              className="w-full border border-[var(--bor2)] rounded-lg px-4 py-3 text-base bg-[var(--sur)] text-[var(--txt)] outline-none text-center mb-6 focus:border-[var(--p)] focus:shadow-[0_0_0_3px_var(--pl)]"
              type="text" placeholder="이름 입력" maxLength={10}
              value={name} onChange={e => setName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleNext()}
              autoFocus
            />
            <button className="btn w-full justify-center py-3" onClick={handleNext}>다음 →</button>
          </div>
        )}

        {step === 2 && (
          <div>
            <div className="text-5xl mb-4">📚</div>
            <div className="text-[22px] font-bold mb-2">학과 계열을 선택해주세요</div>
            <div className="text-sm text-[var(--tx2)] mb-7">맞춤 공모전·자격증 정보를 보여드릴게요</div>
            <div className="grid grid-cols-2 gap-2.5 mb-6 text-left">
              {DEPARTMENTS.map(dept => (
                <div
                  key={dept.id}
                  onClick={() => setSelectedDept(dept.id)}
                  className={`ob-card ${selectedDept === dept.id ? 'selected' : ''}`}
                >
                  <div className="text-2xl mb-1.5" style={{ transition: 'transform .14s', transform: selectedDept === dept.id ? 'scale(1.1)' : 'none' }}>{dept.emoji}</div>
                  <div className="text-[13px] font-semibold">{dept.name}</div>
                  <div className="text-[10px] text-[var(--tx3)] mt-0.5">{dept.sub}</div>
                </div>
              ))}
            </div>
            <button
              className="btn w-full justify-center py-3"
              disabled={!selectedDept}
              style={{ opacity: selectedDept ? 1 : .4 }}
              onClick={handleFinish}
            >
              시작하기 🚀
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default function OnboardingPage() {
  return (
    <ToastProvider>
      <OnboardingContent />
    </ToastProvider>
  )
}
