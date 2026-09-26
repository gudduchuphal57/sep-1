"use client";

import { Handshake, Target, Trophy, Users } from "lucide-react";
import type { SectionProps } from "../../../types/section";

type AchievementItem = { title?: string; description?: string };

const achievementIcons = [
  <Trophy key="award" className="h-8 w-8 text-orange-500" />,
  <Users key="users" className="h-8 w-8 text-orange-500" />,
  <Target key="target" className="h-8 w-8 text-orange-500" />,
  <Handshake key="handshake" className="h-8 w-8 text-orange-500" />,
];

export default function NGOTeamDetailAchievements2({
  data = {},
}: SectionProps) {
  const achievements = Array.isArray(data.achievements)
    ? (data.achievements as AchievementItem[])
    : [];

  if (achievements.length === 0) return null;

  return (
    <section
      data-editor-section-label="Achievements"
      data-editor-fields="achievements"
      data-editor-card-fields="title description"
      className="bg-slate-50/50 pb-16"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold text-slate-900">Achievements</h2>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {achievements.map((achievement, idx) => (
            <div
              key={`${achievement.title}-${idx}`}
              className="flex flex-col items-center rounded-xl border border-slate-100 bg-white p-8 text-center shadow-sm transition duration-300 hover:-translate-y-1"
            >
              <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-50">
                {achievementIcons[idx % achievementIcons.length]}
              </div>
              <h3 className="mb-2 text-lg font-bold text-slate-900">
                {achievement.title}
              </h3>
              {achievement.description ? (
                <p className="text-sm leading-relaxed text-slate-600">
                  {achievement.description}
                </p>
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
