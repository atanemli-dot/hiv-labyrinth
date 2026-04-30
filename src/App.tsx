import React, { useState } from 'react';
import { GameProvider } from './context/GameContext';
import { NavigateArgs } from './types/game';
import { MainMenu } from './screens/MainMenu';
import { ModulSec } from './screens/ModulSec';
import { Exploration } from './screens/Exploration';
import { Scenario } from './screens/Scenario';
import { Feedback } from './screens/Feedback';
import { BossBattle } from './screens/BossBattle';
import { ReportCard } from './screens/ReportCard';

type ScreenName = 'MainMenu' | 'ModulSec' | 'Exploration' | 'Scenario' | 'Feedback' | 'BossBattle' | 'ReportCard';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenName>('MainMenu');
  const [screenArgs, setScreenArgs] = useState<NavigateArgs>({});

  const handleNavigate = (screen: string, args?: NavigateArgs) => {
    setCurrentScreen(screen as ScreenName);
    setScreenArgs(args ?? {});
  };

  return (
      <GameProvider>
        <div className="flex items-center justify-center min-h-screen bg-black w-full select-none text-on-background font-body">
          <div className="w-full h-[100dvh] md:max-w-none max-w-[390px] mx-auto bg-[#0D0D1A] overflow-hidden relative md:border-x-0 border-x border-[#343342]/20">
            {currentScreen === 'MainMenu'   && <MainMenu   onNavigate={handleNavigate} />}
            {currentScreen === 'ModulSec'  && <ModulSec   onNavigate={handleNavigate} />}
            {currentScreen === 'Exploration'&& <Exploration onNavigate={handleNavigate} />}
            {currentScreen === 'Scenario'  && <Scenario   onNavigate={handleNavigate} args={screenArgs} />}
            {currentScreen === 'Feedback'  && <Feedback   onNavigate={handleNavigate} isCorrect={screenArgs?.isCorrect ?? true} />}
            {currentScreen === 'BossBattle'&& <BossBattle onNavigate={handleNavigate} />}
            {currentScreen === 'ReportCard'&& <ReportCard onNavigate={handleNavigate} />}
          </div>
        </div>
      </GameProvider>
  );
}

