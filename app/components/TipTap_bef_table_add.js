'use client'
import React, { useState, useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Extension } from '@tiptap/core';
import { Plugin, PluginKey } from 'prosemirror-state';
import { Decoration, DecorationSet } from 'prosemirror-view';
import HardBreak from '@tiptap/extension-hard-break';
import './EditorStyles.css'; // 스타일을 위한 CSS 파일을 생성

// shadcn UI 컴포넌트 import
import { Button } from "./ui/button"
import { Toggle } from "./ui/toggle"
import { Separator } from "./ui/separator"
import { Bold, Italic, Underline, Strikethrough } from 'lucide-react';

// 선택 상태를 추적하는 새로운 플러그인
const SelectionPlugin = new Plugin({
  key: new PluginKey('selection'),
  state: {
    init() { return { from: 0, to: 0 }; },
    apply(tr, prev) {
      const { selection } = tr;
      return { from: selection.from, to: selection.to };
    },
  },
});

// CustomFocus 확장 수정
const CustomFocus = Extension.create({
  name: 'customFocus',

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey('custom-focus'),
        props: {
          decorations: (state) => {
            const { doc } = state;
            const decorations = [];
            const selectionState = SelectionPlugin.getState(state);

            doc.forEach((node, pos) => {
              if (node.type.name === 'paragraph') {
                const nodeText = node.textContent;
                decorateGroup(nodeText, pos, pos + node.nodeSize, decorations, selectionState);
              }
            });

            return DecorationSet.create(doc, decorations);
          },
        },
      }),
      SelectionPlugin,
    ];
  },
});

function decorateGroup(group, startPos, endPos, decorations, selectionState) {
  const markerRegex = /\([가-하]\)/;
  const markerMatch = group.match(markerRegex);
  
  if (markerMatch) {
    // 선택 영역이 현재 그룹과 겹치는지 확인
    const isSelected = selectionState.from < endPos && selectionState.to > startPos;
    
    if (isSelected) {
      decorations.push(
        Decoration.node(startPos, endPos, {
          class: 'has-focus orange',
        })
      );
    }
  }
}

const CustomEditor = ({category, setCategory}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [selectedText, setSelectedText] = useState('');

  const handleCategoryChange = () => {
  setCategory('');
  const categories = {
    '(가)': '가',
    '(나)': '나',
    '(다)': '다',
    '(라)': '라',
    '(마)': '마',
    '(바)': '바',
    '(사)': '사',
    '(아)': '아',
    '(자)': '자',
    '(차)': '차',
    '(카)': '카',
    '(타)': '타',
    '(파)': '파',
    '(하)': '하',
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
            'Enter': () => this.editor.commands.setHardBreak(),
          }
        },
      }),
    ],
    content: `
      <p>(가) 첫 번째 문단입니다, 두 번째 부분입니다, 세 번째 부분입니다.</p>
      <p>(나) 다른 문단입니다, 이것도 쉼표로 구분됩니다.</p>
    `,
    onFocus: () => setIsFocused(true),
    onBlur: () => setIsFocused(false),
  });

  // 선택된 텍스트를 가져오는 함수
  const getSelectedText = () => {
    if (editor) {
      const { from, to } = editor.state.selection;
      if (from !== to) {
        return editor.state.doc.textBetween(from, to, ' ');
      }
    }
    return '';
  };

  useEffect(() => {
    if (editor) {
      const updateSelectedText = () => {
        const hasFocusElement = document.querySelector('.has-focus');
        if (hasFocusElement) {
          setSelectedText(hasFocusElement.textContent || '');
        } else {
          setSelectedText('');
        }
      };

      editor.on('selectionUpdate', updateSelectedText);
      editor.on('update', updateSelectedText);

      return () => {
        editor.off('selectionUpdate', updateSelectedText);
        editor.off('update', updateSelectedText);
      };
    }
  }, [editor]);

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

  return (
    <div>
      {editor && (
        <div className="toolbar flex flex-row items-center gap-1 p-1 border border-input bg-transparent rounded-md">
          <ToolbarItem
            icon={<Bold className="h-4 w-4" />}
            label="굵게"
            action={() => editor.chain().focus().toggleBold().run()}
            isActive={editor.isActive('bold')}
          />
          <ToolbarItem
            icon={<Italic className="h-4 w-4" />}
            label="기울임"
            action={() => editor.chain().focus().toggleItalic().run()}
            isActive={editor.isActive('italic')}
          />
          <ToolbarItem
            icon={<Underline className="h-4 w-4" />}
            label="밑줄"
            action={() => editor.chain().focus().toggleUnderline().run()}
            isActive={editor.isActive('underline')}
          />
          <Separator orientation="vertical" className="w-[1px] h-8" />
          <ToolbarItem
            icon={<Strikethrough className="h-4 w-4" />}
            label="취소선"
            action={() => editor.chain().focus().toggleStrike().run()}
            isActive={editor.isActive('strike')}
          />
        </div>
      )}
      <div className={`editor-container ${isFocused ? 'is-focused' : ''}`}>
        <EditorContent editor={editor} />
      </div>
      
      <div className="selected-text-container">
        <h3>선택된 텍스트:</h3>
        <p className='selected-text'>{selectedText}</p>
      </div>
    </div>
  );
};

export default CustomEditor;
