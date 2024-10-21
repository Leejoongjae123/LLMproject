import React, { useState, useEffect } from 'react';
import { EditorState, ContentState, Modifier } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

function TextEditor() {
  const [editorState, setEditorState] = useState(() => {
    const defaultContent = `(가) Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

(나) Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit.

(다) At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus.

(라) Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae. Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.`;

    return EditorState.createWithContent(ContentState.createFromText(defaultContent));
  });

  const [sections, setSections] = useState([]);
  const [focusedSection, setFocusedSection] = useState(null);

  useEffect(() => {
    const content = editorState.getCurrentContent().getPlainText();
    const newSections = content.split(/\([가-힣]\)\s/).filter(Boolean);
    setSections(newSections);
  }, [editorState]);

  const onEditorStateChange = (newEditorState) => {
    setEditorState(newEditorState);
  };

  const handleSectionClick = (index) => {
    setFocusedSection(index);
    
    // 선택된 섹션의 텍스트를 에디터에서 선택 상태로 만듭니다.
    const content = editorState.getCurrentContent();
    const selection = editorState.getSelection();
    
    let startOffset = 0;
    for (let i = 0; i < index; i++) {
      startOffset += sections[i].length + 4; // 4는 "(가) "와 같은 구분자의 길이
    }
    const endOffset = startOffset + sections[index].length;

    const newSelection = selection.merge({
      anchorOffset: startOffset,
      focusOffset: endOffset,
    });

    const newEditorState = EditorState.forceSelection(editorState, newSelection);
    setEditorState(newEditorState);
  };

  return (
    <div className="text-editor">
      <Editor
        editorState={editorState}
        onEditorStateChange={onEditorStateChange}
        wrapperClassName="wrapper-class"
        editorClassName="editor-class"
        toolbarClassName="toolbar-class"
      />
      <div className="sections-container">
        {sections.map((section, index) => (
          <div
            key={index}
            className={`section ${focusedSection === index ? 'has-focus' : ''}`}
            onClick={() => handleSectionClick(index)}
          >
            {section}
          </div>
        ))}
      </div>
    </div>
  );
}

export default TextEditor;
