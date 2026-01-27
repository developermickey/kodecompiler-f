
const ContestTabs = ({ activeTab, setActiveTab }) => {
  const tabs = [
    {
      id: "weekly",
      label: "Weekly Contests",
      icon: Trophy,
      badge: "NEW",
    },
    {
      id: "normal",
      label: "All Challenges",
      icon: Target,
    },
    {
      id: "past",
      label: "Past Archive",
      icon: Clock,
    },
    {
      id: "leaderboard",
      label: "Global Ranking",
      icon: Award,
    },
  ];

  return (
    <div className="border-b border-blue-200 mb-6 bg-white rounded-t-xl px-4 sm:px-0 sm:bg-transparent">
      <nav
        className="-mb-px flex space-x-8 overflow-x-auto scrollbar-hide"
        aria-label="Tabs"
      >
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-all duration-200 outline-none
                ${
                  isActive
                    ? "border-blue text-blue"
                    : "border-transparent text-blue-500 hover:text-blue-700 hover:border-blue-300"
                }
              `}
              aria-current={isActive ? "page" : undefined}
            >
              <Icon
                className={`
                  mr-2 h-4 w-4 transition-colors
                  ${isActive ? "text-blue" : "text-blue-400 group-hover:text-blue-500"}
                `}
              />
              <span>{tab.label}</span>

              {/* Optional Badge */}
              {tab.badge && (
                <span
                  className={`
                  ml-2 py-0.5 px-2 rounded-full text-[10px] font-bold
                  ${
                    isActive
                      ? "bg-blue text-white"
                      : "bg-blue-100 text-blue-600 group-hover:bg-blue-200"
                  }
                `}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
};