import { Box } from '@mui/material';
import React, { useEffect, useState } from 'react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import 'react-quill-new/dist/quill.bubble.css';
import './quillstyles.css';

function DescriptionEditor({ value, setValue }) {
  const setDescription = (html) => {
    setValue(html);
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
