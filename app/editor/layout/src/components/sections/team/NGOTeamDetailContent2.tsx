"use client";

import type { SectionProps } from "../../../types/section";
import NGOTeamDetailProfile2 from "./NGOTeamDetailProfile2";
import NGOTeamDetailAbout2 from "./NGOTeamDetailAbout2";
import NGOTeamDetailExperience2 from "./NGOTeamDetailExperience2";
import NGOTeamDetailAchievements2 from "./NGOTeamDetailAchievements2";

export default function NGOTeamDetailContent2({ data = {} }: SectionProps) {
  return (
    <>
      <NGOTeamDetailProfile2 data={data} />
      <NGOTeamDetailAbout2 data={data} />
      <NGOTeamDetailExperience2 data={data} />
      <NGOTeamDetailAchievements2 data={data} />
    </>
  );
}
