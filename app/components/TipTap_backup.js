"use client";
import React, { useState, useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Extension } from "@tiptap/core";
import { Plugin, PluginKey } from "prosemirror-state";
import { Decoration, DecorationSet } from "prosemirror-view";
import HardBreak from "@tiptap/extension-hard-break";
import "./EditorStyles.css";

// shadcn UI 컴포넌트 import
import { Toggle } from "./ui/toggle";
import { Separator } from "./ui/separator";
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Table as TableIcon,
  Grid,
} from "lucide-react";
import Table from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import TableCreationModal from "./TableCreationModal";
import { useDisclosure } from "@nextui-org/react";
import styled from "styled-components";

// 선택 상태를 추적하는 새로운 플러그인
const SelectionPlugin = new Plugin({
  key: new PluginKey("selection"),
  state: {
    init() {
      return { from: 0, to: 0 };
    },
    apply(tr, prev) {
      const { selection } = tr;
      return { from: selection.from, to: selection.to };
    },
  },
});

// CustomFocus 확장 수정
const CustomFocus = Extension.create({
  name: "customFocus",

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey("custom-focus"),
        props: {
          decorations: (state) => {
            const { doc, selection } = state;
            const decorations = [];

            doc.descendants((node, pos) => {
              if (node.type.name === "paragraph") {
                const from = pos;
                const to = pos + node.nodeSize;
                const nodeText = node.textContent;

                if (/\([가-하]\)/.test(nodeText)) {
                  const isSelected = selection.from < to && selection.to > from;
                  if (isSelected) {
                    decorations.push(
                      Decoration.node(from, to, {
                        class: "has-focus orange",
                      })
                    );
                  }
                }
              }
            });

            return DecorationSet.create(doc, decorations);
          },
        },
      }),
    ];
  },
});

function decorateGroup(group, startPos, endPos, decorations, selectionState) {
  const markerRegex = /\([가-하]\)/;
  const markerMatch = group.match(markerRegex);

  if (markerMatch) {
    // 선택 영역이 현재 그룹과 겹치는지 확인
    const isSelected =
      selectionState.from < endPos && selectionState.to > startPos;

    if (isSelected) {
      decorations.push(
        Decoration.node(startPos, endPos, {
          class: "has-focus orange",
        })
      );
    }
  }
}

// Styled component for the editor content
const StyledEditorContent = styled(EditorContent)`
  .ProseMirror {
    > * + * {
      margin-top: 0.75em;
      

    }

    table {
      border-collapse: collapse;
      margin: 0;
      overflow: hidden;
      table-layout: fixed;
      width: 100%;

      td,
      th {
        border: 2px solid #ced4da;
        box-sizing: border-box;
        min-width: 1em;
        padding: 3px 5px;
        position: relative;
        vertical-align: top;

        > * {
          margin-bottom: 0;
        }
      }

      th {
        background-color: #f1f3f5;
        font-weight: bold;
        text-align: left;
      }
    }
  }
`;

// Styled component for the table
const StyledTable = styled.table`
  border-collapse: collapse;
  width: 100%;

  td, th {
    border: 1px solid black;
    padding: 5px;
  }

  th {
    font-weight: bold;
  }
`;

const CustomEditor = ({ category, setCategory, selectedItem,selectedText,setSelectedText }) => {
  const [isFocused, setIsFocused] = useState(false);
  const [inputContents, setInputContents] = useState('');

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const handleCategoryChange = () => {
    setCategory("");
    const categories = {
      "(가)": "가",
      "(나)": "나",
      "(다)": "다",
      "(라)": "라",
      "(마)": "마",
      "(바)": "바",
      "(사)": "사",
      "(아)": "아",
      "(자)": "자",
      "(차)": "차",
      "(카)": "카",
      "(타)": "타",
      "(파)": "파",
      "(하)": "하",
    };

    for (const [key, value] of Object.entries(categories)) {
      if (selectedText.includes(key)) {
        setCategory(value);
        break;
      }
    }
  };
  useEffect(() => {
    handleCategoryChange(category);
  }, [selectedText]);
  console.log("selectedItem",selectedItem)
  useEffect(() => {
    if (selectedItem === "weather") {
      setInputContents(`
        <h1 style="font-weight: 700;">거버넌스</h1>
        <h2>기후 관련 위험 및 기회에 관한 관리 감독 기구</h2>
        <p>(가) 첫 번째 문단입니다, 두 번째 부분입니다, 세 번째 부분입니다.</p>
        <p>(나) 다른 문단입니다, 이것도 쉼표로 구분됩니다.</p>
        <p>(다) 세번째로 존재하는 문단입니다.</p>
        <p>(라) 네번째로 구분하였습니다.</p>
        <p>(마) 다섯번째로 존재하는 문단이에요.</p>
      `);
    } else {
      setInputContents(`
        <h1 style="font-weight: 700;">거버넌스</h1>
        <h2>경영진의 역할 및 감독 방법</h2>
        <p>(가) 첫 번째 문단입니다, 두 번째 부분입니다, 세 번째 부분입니다.</p>
        <p>(나) 다른 문단입니다, 이것도 쉼표로 구분됩니다.</p>
      `);
    }
  }, [selectedItem]);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        paragraph: {
          keepMarks: true,
        },
      }),
      CustomFocus,
      HardBreak.extend({
        addKeyboardShortcuts() {
          return {
            Enter: () => this.editor.commands.setHardBreak(),
          };
        },
      }),
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
    ],
    content: '', // 초기 내용을 비워둡니다.
    onFocus: () => setIsFocused(true),
    onBlur: () => setIsFocused(false),
  });

  // 선택된 텍스트를 가져오는 함수
  const getSelectedText = () => {
    if (editor) {
      const { from, to } = editor.state.selection;
      if (from !== to) {
        return editor.state.doc.textBetween(from, to, " ");
      }
    }
    return "";
  };



  useEffect(() => {
    if (editor) {
      const updateSelectedText = () => {
        const hasFocusElement = document.querySelector(".has-focus");
        if (hasFocusElement) {
          setSelectedText(hasFocusElement.textContent || "");
        } else {
          setSelectedText("");
        }
      };

      editor.on("selectionUpdate", updateSelectedText);
      editor.on("update", updateSelectedText);

      return () => {
        editor.off("selectionUpdate", updateSelectedText);
        editor.off("update", updateSelectedText);
      };
    }
  }, [editor]);



  // selectedItem이 변경될 때마다 에디터 내용을 업데이트하는 useEffect
  useEffect(() => {
    if (editor) {
      const content = inputContents;
      editor.commands.setContent(content);
    }
  }, [editor, selectedItem,inputContents]);

  // 툴바 아이템 컴포넌트 수정
  const ToolbarItem = ({ icon, label, action, isActive }) => (
    <Toggle
      size="sm"
      pressed={isActive}
      onPressedChange={action}
      aria-label={label}
    >
      {icon}
    </Toggle>
  );

  const tableItem = editor && (
    <Toggle
      size="sm"
      pressed={editor.isActive("table")}
      onPressedChange={onOpen}
      aria-label="테이블 삽입"
    >
      <TableIcon className="h-4 w-4" />
    </Toggle>
  );

  const handleCreateDefaultTable = () => {
    if (!editor) return;

    editor
      .chain()
      .focus()
      .insertContent([
        {
          type: 'paragraph',
          content: [{ type: 'text', text: '◼ Scope 1, 2' }]
        },
        {
          type: 'table',
          content: [
            {
              type: 'tableRow',
              content: [
                { type: 'tableHeader', attrs: { colspan: 1, rowspan: 2 }, content: [{ type: 'paragraph', content: [{ type: 'text', text: '구분' }] }] },
                { type: 'tableHeader', attrs: { colspan: 1, rowspan: 2 }, content: [{ type: 'paragraph', content: [{ type: 'text', text: '항목' }] }] },
                { type: 'tableHeader', attrs: { colspan: 1, rowspan: 2 }, content: [{ type: 'paragraph', content: [{ type: 'text', text: '단위' }] }] },
                { type: 'tableHeader', attrs: { colspan: 1, rowspan: 1 }, content: [{ type: 'paragraph', content: [{ type: 'text', text: '2022' }] }] },
                { type: 'tableHeader', attrs: { colspan: 1, rowspan: 1 }, content: [{ type: 'paragraph', content: [{ type: 'text', text: '2023 (각주1)' }] }] },
                { type: 'tableHeader', attrs: { colspan: 6, rowspan: 1 }, content: [{ type: 'paragraph', content: [{ type: 'text', text: '2024 (각주 1)' }] }] },
              ],
            },
            {
              type: 'tableRow',
              content: [
                { type: 'tableHeader', content: [{ type: 'paragraph', content: [{ type: 'text', text: '합계' }] }] },
                { type: 'tableHeader', content: [{ type: 'paragraph', content: [{ type: 'text', text: '합계' }] }] },
                { type: 'tableHeader', content: [{ type: 'paragraph', content: [{ type: 'text', text: '합계' }] }] },
                { type: 'tableHeader', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'A회사' }] }] },
                { type: 'tableHeader', content: [{ type: 'paragraph', content: [{ type: 'text', text: '중속기업1' }] }] },
                { type: 'tableHeader', content: [{ type: 'paragraph', content: [{ type: 'text', text: '중속기업2' }] }] },
                { type: 'tableHeader', content: [{ type: 'paragraph', content: [{ type: 'text', text: '중속기업3' }] }] },
                { type: 'tableHeader', content: [{ type: 'paragraph', content: [{ type: 'text', text: '중속기업4' }] }] },
              ],
            },
            // Data rows for Scope 1
            {
              type: 'tableRow',
              content: [
                { type: 'tableCell', attrs: { colspan: 1, rowspan: 3 }, content: [{ type: 'paragraph', content: [{ type: 'text', text: '온실가스 직접배출 (Scope 1)' }] }] },
                { type: 'tableCell', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'CO2 총 배출량' }] }] },
                { type: 'tableCell', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'tCO2eq' }] }] },
                { type: 'tableCell', content: [{ type: 'paragraph', content: [{ type: 'text', text: '128.00' }] }] },
                { type: 'tableCell', content: [{ type: 'paragraph', content: [{ type: 'text', text: '154.00' }] }] },
                { type: 'tableCell', content: [{ type: 'paragraph', content: [{ type: 'text', text: '209.00' }] }] },
                { type: 'tableCell', content: [{ type: 'paragraph', content: [{ type: 'text', text: '50.00' }] }] },
                { type: 'tableCell', content: [{ type: 'paragraph', content: [{ type: 'text', text: '70.00' }] }] },
                { type: 'tableCell', content: [{ type: 'paragraph', content: [{ type: 'text', text: '30.00' }] }] },
                { type: 'tableCell', content: [{ type: 'paragraph', content: [{ type: 'text', text: '28.00' }] }] },
                { type: 'tableCell', content: [{ type: 'paragraph', content: [{ type: 'text', text: '31.00' }] }] },
              ],
            },
            {
              type: 'tableRow',
              content: [
                { type: 'tableCell', content: [{ type: 'paragraph', content: [{ type: 'text', text: '집약도' }] }] },
                { type: 'tableCell', content: [{ type: 'paragraph', content: [{ type: 'text', text: '배출 10억원당 기준' }] }] },
                { type: 'tableCell', content: [{ type: 'paragraph', content: [{ type: 'text', text: '3.37' }] }] },
                { type: 'tableCell', content: [{ type: 'paragraph', content: [{ type: 'text', text: '3.14' }] }] },
                { type: 'tableCell', content: [{ type: 'paragraph', content: [{ type: 'text', text: '3.37' }] }] },
                { type: 'tableCell', content: [{ type: 'paragraph', content: [{ type: 'text', text: '2.50' }] }] },
                { type: 'tableCell', content: [{ type: 'paragraph', content: [{ type: 'text', text: '3.50' }] }] },
                { type: 'tableCell', content: [{ type: 'paragraph', content: [{ type: 'text', text: '5.00' }] }] },
                { type: 'tableCell', content: [{ type: 'paragraph', content: [{ type: 'text', text: '4.00' }] }] },
                { type: 'tableCell', content: [{ type: 'paragraph', content: [{ type: 'text', text: '3.44' }] }] },
              ],
            },
            {
              type: 'tableRow',
              content: [
                { type: 'tableCell', content: [{ type: 'paragraph', content: [{ type: 'text', text: '집약도' }] }] },
                { type: 'tableCell', content: [{ type: 'paragraph', content: [{ type: 'text', text: '직원1인당 기준' }] }] },
                { type: 'tableCell', content: [{ type: 'paragraph', content: [{ type: 'text', text: '0.62' }] }] },
                { type: 'tableCell', content: [{ type: 'paragraph', content: [{ type: 'text', text: '0.73' }] }] },
                { type: 'tableCell', content: [{ type: 'paragraph', content: [{ type: 'text', text: '0.99' }] }] },
                { type: 'tableCell', content: [{ type: 'paragraph', content: [{ type: 'text', text: '1.11' }] }] },
                { type: 'tableCell', content: [{ type: 'paragraph', content: [{ type: 'text', text: '1.27' }] }] },
                { type: 'tableCell', content: [{ type: 'paragraph', content: [{ type: 'text', text: '0.94' }] }] },
                { type: 'tableCell', content: [{ type: 'paragraph', content: [{ type: 'text', text: '0.93' }] }] },
                { type: 'tableCell', content: [{ type: 'paragraph', content: [{ type: 'text', text: '0.62' }] }] },
              ],
            },
            // Data rows for Scope 2
            {
              type: 'tableRow',
              content: [
                { type: 'tableCell', attrs: { colspan: 1, rowspan: 3 }, content: [{ type: 'paragraph', content: [{ type: 'text', text: '온실가스 간접배출 (Scope 2)' }] }] },
                { type: 'tableCell', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'CO2 총 배출량' }] }] },
                { type: 'tableCell', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'tCO2eq' }] }] },
                { type: 'tableCell', content: [{ type: 'paragraph', content: [{ type: 'text', text: '2,580.00' }] }] },
                { type: 'tableCell', content: [{ type: 'paragraph', content: [{ type: 'text', text: '3,020.00' }] }] },
                { type: 'tableCell', content: [{ type: 'paragraph', content: [{ type: 'text', text: '3,210.00' }] }] },
                { type: 'tableCell', content: [{ type: 'paragraph', content: [{ type: 'text', text: '650.00' }] }] },
                { type: 'tableCell', content: [{ type: 'paragraph', content: [{ type: 'text', text: '700.00' }] }] },
                { type: 'tableCell', content: [{ type: 'paragraph', content: [{ type: 'text', text: '550.00' }] }] },
                { type: 'tableCell', content: [{ type: 'paragraph', content: [{ type: 'text', text: '530.00' }] }] },
                { type: 'tableCell', content: [{ type: 'paragraph', content: [{ type: 'text', text: '780.00' }] }] },
              ],
            },
            {
              type: 'tableRow',
              content: [
                { type: 'tableCell', content: [{ type: 'paragraph', content: [{ type: 'text', text: '집약도' }] }] },
                { type: 'tableCell', content: [{ type: 'paragraph', content: [{ type: 'text', text: '배출 10억원당 기준' }] }] },
                { type: 'tableCell', content: [{ type: 'paragraph', content: [{ type: 'text', text: '67.89' }] }] },
                { type: 'tableCell', content: [{ type: 'paragraph', content: [{ type: 'text', text: '61.63' }] }] },
                { type: 'tableCell', content: [{ type: 'paragraph', content: [{ type: 'text', text: '51.77' }] }] },
                { type: 'tableCell', content: [{ type: 'paragraph', content: [{ type: 'text', text: '32.50' }] }] },
                { type: 'tableCell', content: [{ type: 'paragraph', content: [{ type: 'text', text: '35.00' }] }] },
                { type: 'tableCell', content: [{ type: 'paragraph', content: [{ type: 'text', text: '91.67' }] }] },
                { type: 'tableCell', content: [{ type: 'paragraph', content: [{ type: 'text', text: '75.71' }] }] },
                { type: 'tableCell', content: [{ type: 'paragraph', content: [{ type: 'text', text: '86.67' }] }] },
              ],
            },
            {
              type: 'tableRow',
              content: [
                { type: 'tableCell', content: [{ type: 'paragraph', content: [{ type: 'text', text: '집약도' }] }] },
                { type: 'tableCell', content: [{ type: 'paragraph', content: [{ type: 'text', text: '직원1인당 기준' }] }] },
                { type: 'tableCell', content: [{ type: 'paragraph', content: [{ type: 'text', text: '12.59' }] }] },
                { type: 'tableCell', content: [{ type: 'paragraph', content: [{ type: 'text', text: '14.25' }] }] },
                { type: 'tableCell', content: [{ type: 'paragraph', content: [{ type: 'text', text: '15.14' }] }] },
                { type: 'tableCell', content: [{ type: 'paragraph', content: [{ type: 'text', text: '14.44' }] }] },
                { type: 'tableCell', content: [{ type: 'paragraph', content: [{ type: 'text', text: '12.73' }] }] },
                { type: 'tableCell', content: [{ type: 'paragraph', content: [{ type: 'text', text: '17.19' }] }] },
                { type: 'tableCell', content: [{ type: 'paragraph', content: [{ type: 'text', text: '17.67' }] }] },
                { type: 'tableCell', content: [{ type: 'paragraph', content: [{ type: 'text', text: '15.60' }] }] },
              ],
            },
          ],
        },
        {
          type: 'paragraph',
          content: [{ type: 'text', text: '* 각 연도별 합계 원단위는 A회사의 연결 기준 매출 및 구성원 수 적용' }]
        },
        {
          type: 'paragraph',
          content: [{ type: 'text', text: '각주 1) 2023년 이전은 관할 당국에서 요구받은 방법으로 산정하였고, 2024년은 GHG 프로토콜로 산정함' }]
        },
        {
          type: 'paragraph',
          content: [{ type: 'text', text: '각주 2) 지역 기반 배출량 기준' }]
        },
      ])
      .run();
  };

  const handleCreateOptionalTable = () => {
    if (!editor) return;

    editor
      .chain()
      .focus()
      .insertContent([
        {
          type: 'paragraph',
          content: [{ type: 'text', text: '◼ Scope 3' }]
        },
        {
          type: 'table',
          content: [
            {
              type: 'tableRow',
              content: [
                { type: 'tableHeader', content: [{ type: 'paragraph', content: [{ type: 'text', text: '구분' }] }] },
                { type: 'tableHeader', content: [{ type: 'paragraph', content: [{ type: 'text', text: '2022' }] }] },
                { type: 'tableHeader', content: [{ type: 'paragraph', content: [{ type: 'text', text: '2023' }] }] },
                { type: 'tableHeader', content: [{ type: 'paragraph', content: [{ type: 'text', text: '2024' }] }] },
              ],
            },
            {
              type: 'tableRow',
              content: [
                { type: 'tableCell', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Scope3' }] }] },
                { type: 'tableCell', content: [{ type: 'paragraph', content: [{ type: 'text', text: '3,133' }] }] },
                { type: 'tableCell', content: [{ type: 'paragraph', content: [{ type: 'text', text: '3,218' }] }] },
                { type: 'tableCell', content: [{ type: 'paragraph', content: [{ type: 'text', text: '6,897' }] }] },
              ],
            },
            {
              type: 'tableRow',
              content: [
                { type: 'tableCell', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Category 1 제품 서비스 구매' }] }] },
                { type: 'tableCell', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Not Available' }] }] },
                { type: 'tableCell', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Not Available' }] }] },
                { type: 'tableCell', content: [{ type: 'paragraph', content: [{ type: 'text', text: '2,350' }] }] },
              ],
            },
            {
              type: 'tableRow',
              content: [
                { type: 'tableCell', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Category 2 자본재' }] }] },
                { type: 'tableCell', content: [{ type: 'paragraph', content: [{ type: 'text', text: '25' }] }] },
                { type: 'tableCell', content: [{ type: 'paragraph', content: [{ type: 'text', text: '30' }] }] },
                { type: 'tableCell', content: [{ type: 'paragraph', content: [{ type: 'text', text: '34' }] }] },
              ],
            },
            {
              type: 'tableRow',
              content: [
                { type: 'tableCell', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Category 3 구매연료/에너지' }] }] },
                { type: 'tableCell', content: [{ type: 'paragraph', content: [{ type: 'text', text: '39' }] }] },
                { type: 'tableCell', content: [{ type: 'paragraph', content: [{ type: 'text', text: '44' }] }] },
                { type: 'tableCell', content: [{ type: 'paragraph', content: [{ type: 'text', text: '45' }] }] },
              ],
            },
            {
              type: 'tableRow',
              content: [
                { type: 'tableCell', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Category 4 Upstream 운송&유통' }] }] },
                { type: 'tableCell', content: [{ type: 'paragraph', content: [{ type: 'text', text: '41' }] }] },
                { type: 'tableCell', content: [{ type: 'paragraph', content: [{ type: 'text', text: '40' }] }] },
                { type: 'tableCell', content: [{ type: 'paragraph', content: [{ type: 'text', text: '52' }] }] },
              ],
            },
            {
              type: 'tableRow',
              content: [
                { type: 'tableCell', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Category 5 사업장 발생 폐기물' }] }] },
                { type: 'tableCell', content: [{ type: 'paragraph', content: [{ type: 'text', text: '18' }] }] },
                { type: 'tableCell', content: [{ type: 'paragraph', content: [{ type: 'text', text: '21' }] }] },
                { type: 'tableCell', content: [{ type: 'paragraph', content: [{ type: 'text', text: '25' }] }] },
              ],
            },
            {
              type: 'tableRow',
              content: [
                { type: 'tableCell', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Category 6 임직원 출장' }] }] },
                { type: 'tableCell', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Not Available' }] }] },
                { type: 'tableCell', content: [{ type: 'paragraph', content: [{ type: 'text', text: '55' }] }] },
                { type: 'tableCell', content: [{ type: 'paragraph', content: [{ type: 'text', text: '65' }] }] },
              ],
            },
            {
              type: 'tableRow',
              content: [
                { type: 'tableCell', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Category 7 통근' }] }] },
                { type: 'tableCell', content: [{ type: 'paragraph', content: [{ type: 'text', text: '110' }] }] },
                { type: 'tableCell', content: [{ type: 'paragraph', content: [{ type: 'text', text: '120' }] }] },
                { type: 'tableCell', content: [{ type: 'paragraph', content: [{ type: 'text', text: '170' }] }] },
              ],
            },
            {
              type: 'tableRow',
              content: [
                { type: 'tableCell', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Category 8 리스자산(Upstream)' }] }] },
                { type: 'tableCell', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Not Relevant' }] }] },
                { type: 'tableCell', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Not Relevant' }] }] },
                { type: 'tableCell', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Not Relevant' }] }] },
              ],
            },
            {
              type: 'tableRow',
              content: [
                { type: 'tableCell', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Category 9 Downstream 운송&유통' }] }] },
                { type: 'tableCell', content: [{ type: 'paragraph', content: [{ type: 'text', text: '290' }] }] },
                { type: 'tableCell', content: [{ type: 'paragraph', content: [{ type: 'text', text: '280' }] }] },
                { type: 'tableCell', content: [{ type: 'paragraph', content: [{ type: 'text', text: '300' }] }] },
              ],
            },
            {
              type: 'tableRow',
              content: [
                { type: 'tableCell', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Category 10 판매제품 가공' }] }] },
                { type: 'tableCell', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Not Relevant' }] }] },
                { type: 'tableCell', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Not Relevant' }] }] },
                { type: 'tableCell', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Not Relevant' }] }] },
              ],
            },
            {
              type: 'tableRow',
              content: [
                { type: 'tableCell', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Category 11 판매 제품 사용' }] }] },
                { type: 'tableCell', content: [{ type: 'paragraph', content: [{ type: 'text', text: '2,021' }] }] },
                { type: 'tableCell', content: [{ type: 'paragraph', content: [{ type: 'text', text: '2,045' }] }] },
                { type: 'tableCell', content: [{ type: 'paragraph', content: [{ type: 'text', text: '3,241' }] }] },
              ],
            },
            {
              type: 'tableRow',
              content: [
                { type: 'tableCell', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Category 12 판매 제품 폐기' }] }] },
                { type: 'tableCell', content: [{ type: 'paragraph', content: [{ type: 'text', text: '60' }] }] },
                { type: 'tableCell', content: [{ type: 'paragraph', content: [{ type: 'text', text: '25' }] }] },
                { type: 'tableCell', content: [{ type: 'paragraph', content: [{ type: 'text', text: '20' }] }] },
              ],
            },
            {
              type: 'tableRow',
              content: [
                { type: 'tableCell', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Category 13 리스자산(Downstream)' }] }] },
                { type: 'tableCell', content: [{ type: 'paragraph', content: [{ type: 'text', text: '130' }] }] },
                { type: 'tableCell', content: [{ type: 'paragraph', content: [{ type: 'text', text: '150' }] }] },
                { type: 'tableCell', content: [{ type: 'paragraph', content: [{ type: 'text', text: '169' }] }] },
              ],
            },
            {
              type: 'tableRow',
              content: [
                { type: 'tableCell', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Category 14 프랜차이즈' }] }] },
                { type: 'tableCell', content: [{ type: 'paragraph', content: [{ type: 'text', text: '357' }] }] },
                { type: 'tableCell', content: [{ type: 'paragraph', content: [{ type: 'text', text: '368' }] }] },
                { type: 'tableCell', content: [{ type: 'paragraph', content: [{ type: 'text', text: '378' }] }] },
              ],
            },
            {
              type: 'tableRow',
              content: [
                { type: 'tableCell', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Category 15 투자' }] }] },
                { type: 'tableCell', content: [{ type: 'paragraph', content: [{ type: 'text', text: '42' }] }] },
                { type: 'tableCell', content: [{ type: 'paragraph', content: [{ type: 'text', text: '40' }] }] },
                { type: 'tableCell', content: [{ type: 'paragraph', content: [{ type: 'text', text: '48' }] }] },
              ],
            },
          ],
        },
        {
          type: 'paragraph',
          content: [{ type: 'text', text: '* 집계 범위: A회사 및 자회사(종속기업 1, 2, 3, 4)' }]
        }
      ])
      .run();
  };

  return (
    <div>
      {editor && (
        <div className="toolbar flex flex-row items-center gap-1 p-1 border border-input bg-transparent rounded-md m-5">
          <ToolbarItem
            icon={<Bold className="h-4 w-4" />}
            label="굵게"
            action={() => editor.chain().focus().toggleBold().run()}
            isActive={editor.isActive("bold")}
          />
          <ToolbarItem
            icon={<Italic className="h-4 w-4" />}
            label="기울임"
            action={() => editor.chain().focus().toggleItalic().run()}
            isActive={editor.isActive("italic")}
          />
          <ToolbarItem
            icon={<Underline className="h-4 w-4" />}
            label="밑줄"
            action={() => editor.chain().focus().toggleUnderline().run()}
            isActive={editor.isActive("underline")}
          />
          <Separator orientation="vertical" className="w-[1px] h-8" />
          <ToolbarItem
            icon={<Strikethrough className="h-4 w-4" />}
            label="취소선"
            action={() => editor.chain().focus().toggleStrike().run()}
            isActive={editor.isActive("strike")}
          />
          <Separator orientation="vertical" className="w-[1px] h-8" />
          {tableItem}
          {/* <Toggle
            size="sm"
            onPressedChange={handleCreateDefaultTable}
            aria-label="기본 테이블 삽입"
          >
            <Grid className="h-4 w-4" />
          </Toggle>
          <Toggle
            size="sm"
            onPressedChange={handleCreateOptionalTable}
            aria-label="Optional Table"
          >
            <Grid className="h-4 w-4" />
          </Toggle> */}
        </div>
      )}
      <div className={`editor-container p-5`}>
        <StyledEditorContent editor={editor} />
      </div>

      {/* <div className="selected-text-container">
        <h3>선택된 텍스트:</h3>
        <p className="selected-text">{selectedText}</p>
      </div> */}
      <TableCreationModal
        isOpen={isOpen}
        onOpen={onOpen}
        onOpenChange={onOpenChange}
        createDefaultTable={handleCreateDefaultTable}
        createOptionalTable={handleCreateOptionalTable}
      />
    </div>
  );
};

export default CustomEditor;
