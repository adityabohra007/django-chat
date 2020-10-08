import React from 'react';
import {word, image, excel, datafile} from './../../Common/fileTypes';

import {
  FaFileWord,
  FaFile,
  FaFilePdf,
  FaImage,
  FaFileExcel,
  FaFileCsv,
} from 'react-icons/fa';

const filetypemethod=(file_type)=>{
    var icontype;
    if (file_type) {

      if (file_type === 'application/pdf') {
        icontype = <FaFilePdf style={{color: '#c82020'}} />;
      }
      if (word.includes(file_type)) {
        icontype = <FaFileWord style={{color: '#298bc6'}} />;
        console.log('word');
      }
      if (image.includes(file_type)) {
        icontype = <FaImage />;
      }
      if (excel.includes(file_type)) {
        icontype = <FaFileExcel style={{color: 'green'}} />;
      }
      if (datafile.includes(file_type)) {
        icontype = <FaFileCsv style={{color: 'orange'}} />;
      }
      if (file_type === '') {
        console.log('else');
        icontype = <FaFile />;
      }
    }
    return icontype;
}

export default filetypemethod;
