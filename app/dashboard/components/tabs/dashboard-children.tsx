import type { DashboardTab } from "../sidebar";
import DashboardTabContent from "./dashboard-tab";
import WebsitesTab from "./websites-tab";
import PlansTab from "./plans-tab";
import BillingTab from "./billing-tab";
import ProfileTab from "./profile-tab";

type UserProfile = { name: string; email: string; password?: string; avatar?: string };

export default function DashboardChildren({ activeTab, user, onUserSave, onNavigate }: { activeTab: DashboardTab; user: UserProfile; onUserSave: (user: UserProfile) => void; onNavigate: (tab: DashboardTab) => void }) {
  switch (activeTab) {
    case "My Websites":
      return <WebsitesTab />;
    case "Plan":
      return <PlansTab />;
    case "Billing":
      return <BillingTab onNavigate={onNavigate} />;
    case "Profile":
      return <ProfileTab user={user} onSave={onUserSave} />;
    default:
      return (
        <DashboardTabContent
          userName={user.name}
          onManageWebsites={() => onNavigate("My Websites")}
        />
      );
  }
}
