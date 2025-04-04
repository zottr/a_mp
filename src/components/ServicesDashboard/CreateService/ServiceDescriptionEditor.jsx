import { Box } from '@mui/material';
import React, { useEffect, useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import 'react-quill/dist/quill.bubble.css';
import './quillstyles.css';

function ServiceDescriptionEditor({ value, setValue, error }) {
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
      <Box
        width="100%"
        height="215px"
        sx={{ border: error && '1.4px solid red', borderRadius: '10px' }}
      >
        <ReactQuill
          theme="snow"
          value={value}
          onChange={setDescription}
          style={{ height: '150px', width: '100%' }}
          modules={modules}
          placeholder="Add few lines describing the service..."
        />
      </Box>
    </>
  );
}

export default ServiceDescriptionEditor;
