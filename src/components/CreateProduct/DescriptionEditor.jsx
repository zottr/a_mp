import { Box } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import 'react-quill-new/dist/quill.bubble.css';
import './quillstyles.css';

function DescriptionEditor({ value, setValue }) {
  const quillRef = useRef(null);

  const setDescription = (html) => {
    setValue(html);
  };

  const handleFocus = () => {
    // If empty, force Quill to consider it active
    if (!value || value === '<p><br></p>') {
      const editor = quillRef.current?.getEditor();
      editor?.insertText(0, ' ');
      editor?.deleteText(0, 1);
    }
  };

  const modules = {
    toolbar: [
      { header: [1, 2, 3, false] },
      'bold',
      'italic',
      'underline',
      'strike',
      { list: 'ordered' },
      { list: 'bullet' },
      { color: [] },
      { background: [] },
      { indent: '-1' },
      { indent: '+1' },
    ],
  };

  return (
    <>
      <Box width="100%" height="215px">
        <ReactQuill
          ref={quillRef}
          theme="snow"
          value={value}
          onChange={setDescription}
          style={{ height: '150px', width: '100%' }}
          modules={modules}
          placeholder="Add few lines about the product..."
        />
      </Box>
    </>
  );
}

export default DescriptionEditor;
