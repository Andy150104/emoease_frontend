// src/pages/CodePage.tsx
"use client";
import React, { useEffect, useState } from "react";
import BaseScreen from "EmoEase/layout/BaseScreen";
import Editor from "@monaco-editor/react";
import { FiFile, FiChevronDown, FiPlay, FiSettings } from "react-icons/fi";
import { useTheme } from "EmoEase/Provider/ThemeProvider";
import { Layout, Button, Select, Input, Card, Dropdown } from "antd";
import BaseControlSplit from "EmoEase/components/BaseControl/BaseControlSplit";

const { Header, Content } = Layout;
const { Option } = Select;

export default function CodePage() {
  const { isDarkMode } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <BaseScreen>
      <Layout>
        <Header className="flex flex-col md:flex-row items-center justify-between !px-1 md:!px-4 py-3 !bg-white dark:!bg-gray-800 shadow-md space-y-2 md:space-y-0">
          {/* Mobile: single settings dropdown */}
          <div className="w-full flex items-center justify-center mt-4 md:hidden !relative !z-10">
            <Dropdown
              trigger={["click"]}
              getPopupContainer={(trigger) => trigger.parentElement!}
              overlayClassName="!z-10"
              menu={{
                items: [
                  {
                    key: "file",
                    label: (
                      <Button type="text" icon={<FiFile />}>
                        File
                      </Button>
                    ),
                  },
                  {
                    key: "help",
                    label: (
                      <Button type="text" icon={<FiChevronDown />}>
                        Help
                      </Button>
                    ),
                  },
                  {
                    type: "divider",
                  },
                  {
                    key: "lang",
                    label: (
                      <Select
                        size="small"
                        defaultValue="C++ (GCC 14.1.0)"
                        style={{ minWidth: 120 }}
                        suffixIcon={<FiChevronDown />}
                      >
                        <Option value="cpp">C++ (GCC 14.1.0)</Option>
                        <Option value="java">Java (OpenJDK 23)</Option>
                        <Option value="python">Python 3.11</Option>
                      </Select>
                    ),
                  },
                  {
                    key: "run",
                    label: (
                      <Button type="primary" icon={<FiPlay />}>
                        Run Code
                      </Button>
                    ),
                  },
                ],
              }}
            >
              <Button type="text" icon={<FiSettings />}>
                Cài đặt
              </Button>
            </Dropdown>
          </div>

          {/* Desktop: individual controls */}
          <div className="hidden md:flex md:items-center space-x-2">
            <Button
              type="text"
              icon={
                <>
                  <FiFile />
                  <FiChevronDown className="ml-1" />
                </>
              }
              className="text-sm md:text-base"
            >
              File
            </Button>
            <Button
              type="text"
              icon={<FiChevronDown className="ml-1" />}
              className="text-sm md:text-base"
            >
              Help
            </Button>
          </div>
          <div className="hidden md:flex md:items-center space-x-2 w-full md:w-auto">
            <Select
              defaultValue="C++ (GCC 14.1.0)"
              style={{ minWidth: 120, width: "100%" }}
              suffixIcon={<FiChevronDown />}
              className="w-full md:w-auto"
            >
              <Option value="cpp">C++ (GCC 14.1.0)</Option>
              <Option value="java">Java (OpenJDK 23)</Option>
              <Option value="python">Python 3.11</Option>
            </Select>
            <Button
              type="primary"
              icon={<FiPlay />}
              className="whitespace-nowrap"
            >
              Run Code
            </Button>
          </div>
        </Header>

        <Content className="flex flex-col md:grid md:grid-cols-[3fr_1fr] gap-4 md:gap-6 p-4 md:p-6 h-[calc(100vh-3.5rem)] bg-gray-50 dark:bg-gray-900">
          <div className="w-full h-[500px] md:h-full">
            <Editor
              height="100%"
              defaultLanguage="javascript"
              defaultValue={`const a = 1;`}
              theme={isDarkMode ? "vs-dark" : "vs-light"}
              options={{ automaticLayout: true }}
            />
          </div>

          {/* Add min-h-0 and overflow-hidden to allow panels to scroll */}
          <div className="flex flex-col h-full min-h-0 overflow-hidden">
            <BaseControlSplit
              layout="vertical"
              style={{ flex: 1, overflow: "hidden" }}
              panelStyle={{ padding: 8, overflow: "auto" }}
            >
              <div className="flex flex-col flex-1 min-h-0">
                <Card
                  title="AI Assistant"
                  className="flex-1 overflow-auto !bg-gray-50 dark:!bg-[#020712] !text-black dark:!text-white"
                >
                  <div className="!text-gray-600 dark:!text-gray-400">
                    …Chat history…
                  </div>
                </Card>
                <Input.Search
                  placeholder="Sign in to chat with AI"
                  enterButton="Send"
                  className="w-full bg-white dark:bg-gray-800 rounded-lg mt-2"
                />
              </div>

              <Card title="Console I/O" className="text-sm mt-4 md:mt-0">
                <div className="grid grid-cols-2 gap-4 font-medium">
                  <div>Input</div>
                  <div>Output</div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>1 ⏎ 2 ⏎ 3</div>
                  <div>12 ⏎ 5 ⏎ NO</div>
                </div>
              </Card>
            </BaseControlSplit>
          </div>
        </Content>
      </Layout>
    </BaseScreen>
  );
}
