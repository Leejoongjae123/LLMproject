import React, { useState } from 'react';
import { EditorState, ContentState, Modifier, convertFromHTML } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

function TextEditor() {
  const [editorState, setEditorState] = useState(() => {
    const defaultContent = `(가) Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

(나) Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit.

(다) At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus.

(라) Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae. Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.`;

    // HTML 형식으로 콘텐츠 생성
    const contentWithIds = defaultContent.split('\n\n').map((paragraph, index) => 
      `<p id="paragraph-${index}">${paragraph}</p>`
    ).join('');

    // HTML을 ContentState로 변환
    const blocksFromHTML = convertFromHTML(contentWithIds);
    const contentState = ContentState.createFromBlockArray(
      blocksFromHTML.contentBlocks,
      blocksFromHTML.entityMap
    );

    return EditorState.createWithContent(contentState);
  });

  // 선택된 단락의 ID를 추적하는 state
  const [selectedParagraphId, setSelectedParagraphId] = useState(null);

  const onEditorStateChange = (newEditorState) => {
    setEditorState(newEditorState);
  };

  // 단락 클릭 핸들러 수정
  const handleParagraphClick = (event) => {
    const clickedElement = event.target;
    const clickedParagraphId = clickedElement.id || clickedElement.closest('p')?.id;
    if (clickedParagraphId && clickedParagraphId.startsWith('paragraph-')) {
      setSelectedParagraphId(clickedParagraphId);
      console.log('Clicked paragraph:', clickedParagraphId);
      
      // 모든 단락의 하이라이트 제거
      let newContentState = editorState.getCurrentContent();
      newContentState.getBlockMap().forEach((block) => {
        newContentState = Modifier.removeInlineStyle(newContentState, SelectionState.createEmpty(block.getKey()).merge({
          anchorOffset: 0,
          focusOffset: block.getLength(),
        }), 'HIGHLIGHT');
      });

      // 선택된 단락에 하이라이트 적용
      const blockKey = newContentState.getFirstBlock().getKey();
      const blockMap = newContentState.getBlockMap();
      const targetBlock = blockMap.find((block) => block.getData().get('id') === clickedParagraphId);
      
      if (targetBlock) {
        const targetKey = targetBlock.getKey();
        newContentState = Modifier.applyInlineStyle(newContentState, SelectionState.createEmpty(targetKey).merge({
          anchorOffset: 0,
          focusOffset: targetBlock.getLength(),
        }), 'HIGHLIGHT');
      }

      const newEditorState = EditorState.push(editorState, newContentState, 'change-inline-style');
      setEditorState(newEditorState);
    }
  };

  // 커스텀 스타일맵 수정
  const customStyleMap = {
    HIGHLIGHT: {
      backgroundColor: 'lightyellow',
      padding: '2px',
      borderRadius: '4px',
    },
  };

  // 박스 스타일을 위한 CSS 클래스
  const boxStyle = {
    border: '1px solid #ccc',
    borderRadius: '4px',
    padding: '10px',
    marginBottom: '10px',
  };

  const selectedBoxStyle = {
    ...boxStyle,
    borderColor: 'blue',
    boxShadow: '0 0 5px rgba(0, 0, 255, 0.5)',
  };

  // 에디터 컨텐츠를 렌더링하는 함수
  const renderContent = () => {
    const contentState = editorState.getCurrentContent();
    const blocks = contentState.getBlocksAsArray();

    return blocks.map((block, index) => {
      const text = block.getText();
      const key = block.getKey();
      const isSelected = `paragraph-${index}` === selectedParagraphId;

      return (
        <div
          key={key}
          id={`paragraph-${index}`}
          style={isSelected ? selectedBoxStyle : boxStyle}
          onClick={handleParagraphClick}
        >
          {text}
        </div>
      );
    });
  };

  return (
    <div className="text-editor">
      <Editor
        editorState={editorState}
        onEditorStateChange={onEditorStateChange}
        wrapperClassName="wrapper-class"
        editorClassName="editor-class"
        toolbarClassName="toolbar-class"
        customStyleMap={customStyleMap}
        readOnly={false}
        onClick={handleParagraphClick}
      />
      {selectedParagraphId && <p>Selected paragraph: {selectedParagraphId}</p>}
    </div>
  );
}

export default TextEditor;
