import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import { MutableRefObject } from 'react';

const CustomEditor = ({
  description,
  editorRef,
}: {
  description: string;
  editorRef: MutableRefObject<any>;
}) => {
  return (
    <CKEditor
      editor={ClassicEditor}
      data={description}
      onReady={(editor) => {
        editorRef.current = editor;
      }}
    />
  );
};

export default CustomEditor;