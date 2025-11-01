/* eslint-disable @typescript-eslint/no-explicit-any */
// src/pages/CodePage.tsx
"use client";
import React, { useEffect, useRef, useState } from "react";
import BaseScreen from "EmoEase/layout/BaseScreen";
import Editor, { OnMount } from "@monaco-editor/react";
import { FiFile, FiChevronDown, FiPlay, FiSettings } from "react-icons/fi";
import { useTheme } from "EmoEase/Provider/ThemeProvider";
import { Layout, Button, Select, Input, Card, Dropdown, Spin, Tag, message } from "antd";
import BaseControlSplit from "EmoEase/components/BaseControl/BaseControlSplit";

const { Header, Content } = Layout;
const { Option } = Select;

/** ===== Types khớp với API JudgeController.Run ===== */
type JudgeTest = {
  name: string;
  status: string;
  time: number;
  memory_kb: number;
  stdout?: string | null;
  stderr?: string | null;
};

type JudgeRunRes = {
  overall: string;
  max_time: number;
  max_memory_kb: number;
  tests: JudgeTest[];
};

export default function CodePage() {
  const { isDarkMode } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<JudgeRunRes | null>(null);
  const [errMsg, setErrMsg] = useState<string | null>(null);

  const editorRef = useRef<import("monaco-editor").editor.IStandaloneCodeEditor | null>(null);

  const onEditorMount: OnMount = (editor) => {
    editorRef.current = editor;
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  const apiBase = "https://localhost:7206";

  const runCode = async () => {
    const code = editorRef.current?.getValue() ?? "";
    if (!code.trim()) {
      message.warning("Bạn chưa nhập code.");
      return;
    }
    setLoading(true);
    setErrMsg(null);
    message.open({ type: "loading", content: "Đang chạy code…", key: "run", duration: 0 });

    try {
      // Gửi đúng schema: { LanguageId?: number, SourceCode: string }
      const resp = await fetch(`${apiBase}/api/judge/run`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // Không gửi LanguageId để BE dùng default (_opt.LanguageId). Nếu muốn ép C#, thêm LanguageId: 51.
        body: JSON.stringify({ LanguageId: 51, SourceCode: code }),
        cache: "no-store",
      });

      // Thử parse JSON; nếu fail thì đọc text để báo lỗi có ngữ cảnh
      let data: any;
      const text = await resp.text();
      try {
        data = JSON.parse(text);
      } catch {
        throw new Error(text || "Server trả về dữ liệu không phải JSON.");
      }

      if (!resp.ok) {
        throw new Error(data?.detail || data?.error || "Run failed");
      }

      setResult(data as JudgeRunRes);
      message.open({ type: "success", content: "Đã chạy xong ✔", key: "run", duration: 1.2 });
    } catch (e: any) {
      const msg = e?.message || "Có lỗi khi chạy code.";
      setErrMsg(msg);
      setResult(null);
      message.open({ type: "error", content: msg, key: "run", duration: 2.2 });
    } finally {
      setLoading(false);
    }
  };

  const statusTag = (s: string) => {
    const lower = s.toLowerCase();
    let color: "success" | "error" | "warning" | "processing" | "default" = "default";
    if (lower.includes("accepted")) color = "success";
    else if (lower.includes("compilation") || lower.includes("runtime") || lower.includes("http")) color = "error";
    else if (lower.includes("time limit") || lower.includes("memory limit")) color = "warning";
    else if (lower.includes("processing") || lower.includes("queue")) color = "processing";
    return <Tag color={color}>{s}</Tag>;
  };

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
                  { type: "divider" },
                  {
                    key: "lang",
                    label: (
                      <Select size="small" defaultValue="C# (.NET/Mono)" style={{ minWidth: 160 }} suffixIcon={<FiChevronDown />}>
                        <Option value="csharp">C# (.NET/Mono)</Option>
                        <Option value="cpp">C++ (GCC 14.1.0)</Option>
                        <Option value="java">Java (OpenJDK 23)</Option>
                        <Option value="python">Python 3.11</Option>
                      </Select>
                    ),
                  },
                  {
                    key: "run",
                    label: (
                      <Button type="primary" icon={<FiPlay />} onClick={runCode}>
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
            <Button type="text" icon={<FiChevronDown className="ml-1" />} className="text-sm md:text-base">
              Help
            </Button>
          </div>
          <div className="hidden md:flex md:items-center space-x-2 w-full md:w-auto">
            <Select defaultValue="C# (.NET/Mono)" style={{ minWidth: 160, width: "100%" }} suffixIcon={<FiChevronDown />} className="w-full md:w-auto">
              <Option value="csharp">C# (.NET/Mono)</Option>
              <Option value="cpp">C++ (GCC 14.1.0)</Option>
              <Option value="java">Java (OpenJDK 23)</Option>
              <Option value="python">Python 3.11</Option>
            </Select>
            <Button type="primary" icon={<FiPlay />} onClick={runCode} className="whitespace-nowrap" loading={loading}>
              Run Code
            </Button>
          </div>
        </Header>

        <Content className="flex flex-col md:grid md:grid-cols-[3fr_1fr] gap-4 md:gap-6 p-4 md:p-6 h-[calc(100vh-3.5rem)] bg-gray-50 dark:bg-gray-900">
          <div className="w-full h-[500px] md:h-full">
            <Editor
              height="100%"
              defaultLanguage="csharp"
              defaultValue={`using System;
class Program {
  static void Main() {
    // Paste C# solution here
    Console.WriteLine("Hello");
  }
}`}
              onMount={onEditorMount}
              theme={isDarkMode ? "vs-dark" : "vs-light"}
              options={{ automaticLayout: true }}
            />
          </div>

          {/* Side panels */}
          <div className="flex flex-col h-full min-h-0 overflow-hidden">
            <BaseControlSplit layout="vertical" style={{ flex: 1, overflow: "hidden" }} panelStyle={{ padding: 8, overflow: "auto" }}>
              <div className="flex flex-col flex-1 min-h-0">
                <Card title="AI Assistant" className="flex-1 overflow-auto !bg-gray-50 dark:!bg-[#020712] !text-black dark:!text-white">
                  <div className="!text-gray-600 dark:!text-gray-400">…Chat history…</div>
                </Card>
                <Input.Search placeholder="Sign in to chat with AI" enterButton="Send" className="w-full bg-white dark:bg-gray-800 rounded-lg mt-2" />
              </div>

              <Card title="Console I/O" className="text-sm mt-4 md:mt-0">
                {loading ? (
                  <div className="flex items-center justify-center py-6">
                    <Spin />
                  </div>
                ) : errMsg ? (
                  <div className="text-red-500 break-words">{errMsg}</div>
                ) : result ? (
                  <div className="space-y-3">
                    {/* Summary */}
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-medium">Overall:</span>
                      {statusTag(result.overall)}
                      <span>Max Time: {result.max_time.toFixed(3)}s</span>
                      <span>Max Mem: {result.max_memory_kb} KB</span>
                    </div>

                    {/* Per test */}
                    <div className="space-y-2 max-h-64 md:max-h-96 overflow-auto">
                      {result.tests.map((t, i) => (
                        <div key={i} className="rounded border border-gray-200 dark:border-gray-700 p-2">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-medium">{t.name}</span>
                            {statusTag(t.status)}
                            <span>t={t.time.toFixed(3)}s</span>
                            <span>mem={t.memory_kb} KB</span>
                          </div>
                          {(t.stdout || t.stderr) && (
                            <div className="mt-1 grid grid-cols-2 gap-3 text-xs font-mono">
                              <div>
                                <div className="opacity-70">stdout</div>
                                <pre className="whitespace-pre-wrap">{t.stdout || ""}</pre>
                              </div>
                              <div>
                                <div className="opacity-70">stderr</div>
                                <pre className="whitespace-pre-wrap">{t.stderr || ""}</pre>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Raw JSON (tham khảo / debug) */}
                    <details className="mt-2">
                      <summary className="cursor-pointer select-none">JSON (debug)</summary>
                      <pre className="text-xs font-mono whitespace-pre-wrap">{JSON.stringify(result, null, 2)}</pre>
                    </details>
                  </div>
                ) : (
                  <div className="text-gray-500">Nhấn “Run Code” để chấm với bộ test mặc định.</div>
                )}
              </Card>
            </BaseControlSplit>
          </div>
        </Content>
      </Layout>
    </BaseScreen>
  );
}
