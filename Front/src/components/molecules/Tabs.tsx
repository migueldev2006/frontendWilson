import { Tabs, Tab } from "@heroui/react";
import { Card } from "@/components/atoms/Card";
import React, { useState } from "react";

type TabItem = {
  key: string;
  title: string;
  content: React.ReactNode;
};

type Props = {
  tabs: TabItem[];
};

export default function Tap({ tabs }: Props) {
  const [selectedKey, setSelectedKey] = useState(tabs[0]?.key || "");

  const selectedTab = tabs.find((tab) => tab.key === selectedKey);

  return (
    <div className="flex w-full flex-col gap-4">
      <div className="overflow-x-auto whitespace-nowrap scrollbar-hide px-2">
        <Tabs
          selectedKey={selectedKey}
          onSelectionChange={(key) => setSelectedKey(String(key))}
          variant="light"
          aria-label="Report Tabs"
        >
          {tabs.map(({ key, title }) => (
            <Tab
              key={key}
              title={
                <span
                  className={`px-4 py-2  text-sm transition-colors whitespace-nowrap`}
                >
                  {title}
                </span>
              }
            />
          ))}
        </Tabs>
      </div>
      {selectedTab && (
        <Card>
          {selectedTab.content}
        </Card>
      )}
    </div>
  );
}