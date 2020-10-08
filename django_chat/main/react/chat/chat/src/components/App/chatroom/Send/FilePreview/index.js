import React, {useEffect} from 'react';
//import {word, image, excel, datafile} from './../../Common/fileTypes';
import filetypemethod from './filetypemethod';
// import {
//   FaFileWord,
//  FaFile,
//  FaFilePdf,
//  FaImage,
//  FaFileExcel,
//  FaFileCsv,
//} from 'react-icons/fa';
import {StyledFilePreview} from './styles';
const FilePreview = props => {
  useEffect(() => {
    var filePreview = document.querySelector('#file-preview');
    console.log(filePreview);
    var divHeight = '-' + filePreview.offsetHeight + 'px';
    filePreview.style.top = divHeight;
  });
  var files, icontype;
  if (props.fileSelected.length) {
    files = props.fileSelected[0] ? <p>{props.fileSelected[0].name}</p> : '';
    var file_type = props.fileSelected[0].type;
    console.log(file_type);
    icontype=filetypemethod(file_type)
    return (
      <StyledFilePreview id="file-preview">
        <div id="icon">{icontype}</div>
        <div id="left">
          <p>Sending Files</p>
          {files}
        </div>
        <div id="right">
          <a
            onClick={() => {
                props.onFileSend();
              }
            }>
           Send File
          </a>
           <a onClick={props.onFileSendCancel}>Cancel</a>
        </div>
      </StyledFilePreview>
    );
  }
};
export default FilePreview;
