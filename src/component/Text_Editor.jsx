import React from 'react';
import JoditEditor from 'jodit-react';
const editorConfig = {
  minHeight: '300px',
  // toolbarSticky: true,
  maxlength: 10, // Set your max character limit (adjust as needed)
  height: 350, // fixed height in px (number)
  minHeight: 350,
  maxHeight: 350, // optional, to lock height
  // toolbarSticky: true,
  maxlength: 10,
  uploader: {
    insertImageAsBase64URI: true,
    enter: 'DIV',
    direction: 'ltr'
  },
  activeButtonsInReadOnly: ['source', 'fullsize', 'print', 'about'],
  disablePlugins: ['paste', 'stat'],
  askBeforePasteHTML: true, // Prevents the link popup model from auto shutdown
  buttons:
    'bold,italic,underline,strikethrough,eraser,ul,ol,font,fontsize,paragraph,lineHeight,superscript,subscript,classSpan,file,image,video,speechRecognize,spellcheck,table,source,fullsize, about, outdent, indent, print, table, fontsize, superscript, subscript,file,cut,selectall'
  // };
};

export default function Text_Editor({ editorState, handleContentChange }) {
  return <JoditEditor value={editorState} onBlur={handleContentChange} config={editorConfig} />;
}
